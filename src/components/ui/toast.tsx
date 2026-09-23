import * as React from "react";
import { CircleAlert, CircleCheck, CircleX, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type ToastKind = "message" | "success" | "warning" | "error";

export interface ToastOptions {
  text: React.ReactNode;
  preserve?: boolean;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
  duration?: number;
}

/** 快照条目（HIG-AUD-018 起由 store 闭包持有，不再是模块级单例）。 */
export interface ToastRecord extends ToastOptions {
  id: number;
  kind: ToastKind;
  /** 退场中：保留节点播放退场过渡，过渡结束后才从记录中移除 */
  exiting?: boolean;
}

/** 退场驻留时长：与条目 class 的 transition-all duration-(--uni-duration-slow)（350ms）一致 */
const TOAST_EXIT_MS = 350;
/** 退场位移：与入场 slide-in-from-bottom-2（8px）镜像 */
const TOAST_EXIT_SLIDE = 8;

export interface UseToastsReturn {
  message: (options: ToastOptions) => number;
  success: (text: React.ReactNode) => number;
  warning: (text: React.ReactNode) => number;
  error: (text: React.ReactNode) => number;
  dismiss: (id: number) => void;
}

/**
 * HIG-AUD-018：可注入的 toast store —— 视口与 API 绑定同一实例，状态可完全由外部驱动。
 */
export interface ToastStore extends UseToastsReturn {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => ToastRecord[];
}

/**
 * 创建独立 store（HIG-AUD-018）。
 *
 * 此前状态是**模块级单例**，调用方无法拥有自己的 toast 队列：多视图/多场景共享同一栈，
 * 测试之间也会互相污染（`drainToasts` 依赖全局）。现在把状态收进闭包——`<Toasts store={s}/>`
 * 与 `useToasts(s)` 绑定同一个 `s`；**不传时用下面的默认全局 store，既有行为完全不变**。
 */
function createToastStore(): ToastStore {
  let nextId = 1;
  let records: ToastRecord[] = [];
  const listeners = new Set<() => void>();

  const publish = () => listeners.forEach((listener) => listener());

  const removeToast = (id: number) => {
    const next = records.filter((toast) => toast.id !== id);
    if (next.length === records.length) return;
    records = next;
    publish();
  };

  /**
   * 关闭：先标记退场并保留节点一个过渡时长（Apple 对称过渡——有入必有出），
   * 过渡结束后再真正移除。直接 filter 会让条目瞬间消失，退场动画无从播放。
   */
  const dismiss = (id: number) => {
    const target = records.find((toast) => toast.id === id);
    if (!target || target.exiting) return;
    if (typeof window === "undefined") {
      removeToast(id);
      return;
    }
    records = records.map((toast) =>
      toast.id === id ? { ...toast, exiting: true } : toast,
    );
    publish();
    window.setTimeout(() => removeToast(id), TOAST_EXIT_MS);
  };

  const addToast = (kind: ToastKind, options: ToastOptions | React.ReactNode) => {
    const normalized: ToastOptions =
      !React.isValidElement(options) &&
      typeof options === "object" &&
      options !== null &&
      "text" in options
        ? (options as ToastOptions)
        : { text: options };
    const id = nextId++;
    records = [...records, { ...normalized, id, kind }];
    publish();
    return id;
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => records,
    message: (options: ToastOptions) => addToast("message", options),
    success: (text: React.ReactNode) => addToast("success", text),
    warning: (text: React.ReactNode) => addToast("warning", text),
    error: (text: React.ReactNode) => addToast("error", text),
    dismiss,
  };
}

/** 默认全局 store：`useToasts()` / `<Toasts/>` 不传 `store` 时使用（保持既有行为）。 */
const defaultToastStore = createToastStore();

function useToasts(store: ToastStore = defaultToastStore): UseToastsReturn {
  return React.useMemo(
    () => ({
      message: store.message,
      success: store.success,
      warning: store.warning,
      error: store.error,
      dismiss: store.dismiss,
    }),
    [store],
  );
}

const toastIcons: Partial<Record<ToastKind, React.ComponentType<{ className?: string }>>> = {
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
};

export interface ToastsProps extends React.ComponentProps<"ol"> {
  gap?: number;
  /** HIG-AUD-018：绑定到指定 store（不传则用默认全局 store）。 */
  store?: ToastStore;
}

/**
 * Toast 堆叠视口（官方 vercel.com/geist/toast 实测）。
 *
 * 官方堆叠机制：所有 toast 绝对定位在右下角同一点（bottom-0 right-0），
 * 通过 translate3d + scale + translateZ 分层堆叠——最新的 toast 完整可见，
 * 旧的按距离 d 缩放 1-0.05d、上移 -(13+20d)px、Z 轴后退 -d px，只露出顶部一小条。
 * hover 视口时展开：scale 归 1、translateY 恢复为累计高度偏移（完整垂直排列）。
 * 过渡 350ms cubic-bezier(0.25,0.75,0.6,0.98)；第 5 个及更旧（nth-last）隐藏。
 */
const STACK_GAP = 20; // 展开态 toast 间距（官方实测 20px）
const MAX_STACK = 4; // 最多堆叠层数（更旧的隐藏）

function Toasts({ className, gap = 16, store = defaultToastStore, ...props }: ToastsProps) {
  const { t } = useI18n();
  const records = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  // 三个关闭入口（自动关闭 / 动作后关闭 / 关闭按钮）统一走注入 store 的 dismiss
  const dismiss = store.dismiss;
  const timers = React.useRef(new Map<number, number>());
  const [expanded, setExpanded] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  // HIG-AUD-014：hover 展开或焦点停留在 toast 上时**暂停**自动关闭计时（WCAG 2.2.1 计时可调），
  // 离开后按剩余时间续跑：`deadline` 记到期时刻，`remaining` 记暂停时的剩余量。
  const paused = expanded || focusWithin;
  const deadline = React.useRef(new Map<number, number>());
  const remaining = React.useRef(new Map<number, number>());
  const itemRefs = React.useRef(new Map<number, HTMLLIElement>());
  const [heights, setHeights] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    if (paused) {
      // 暂停：结算每个在跑的计时器剩余量并停表
      const now = Date.now();
      for (const [id, timer] of timers.current) {
        window.clearTimeout(timer);
        remaining.current.set(id, Math.max(0, (deadline.current.get(id) ?? now) - now));
        deadline.current.delete(id);
      }
      timers.current.clear();
      return;
    }
    records.forEach((toast) => {
      if (toast.preserve || toast.exiting || timers.current.has(toast.id)) return;
      const total = toast.duration ?? (toast.onUndoAction ? 7000 : 3500);
      const left = remaining.current.get(toast.id) ?? total;
      remaining.current.delete(toast.id);
      deadline.current.set(toast.id, Date.now() + left);
      timers.current.set(
        toast.id,
        window.setTimeout(() => {
          timers.current.delete(toast.id);
          deadline.current.delete(toast.id);
          dismiss(toast.id);
        }, left),
      );
    });
    for (const [id, timer] of timers.current) {
      if (!records.some((toast) => toast.id === id)) {
        window.clearTimeout(timer);
        timers.current.delete(id);
        deadline.current.delete(id);
        remaining.current.delete(id);
      }
    }
  }, [records, paused, dismiss]);

  React.useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  // 测量每个 toast 的完整高度（展开态累计偏移用；transform 不影响 offsetHeight）
  React.useLayoutEffect(() => {
    const next: Record<number, number> = {};
    records.forEach((toast) => {
      const el = itemRefs.current.get(toast.id);
      if (el) next[toast.id] = el.offsetHeight;
    });
    setHeights(next);
  }, [records]);

  const count = records.length;

  return (
    <ol
      data-slot="toasts"
      aria-live="polite"
      aria-relevant="additions text"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        // 焦点仍在视口内（子项之间移动）时不算离开
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      className={cn(
        "pointer-events-none fixed right-[var(--toast-gap)] bottom-[var(--toast-gap)] z-[var(--uni-z-toast)] m-0 w-[min(420px,calc(100vw-2*var(--toast-gap)))] p-0 outline-none",
        className,
      )}
      style={{ "--toast-gap": `${gap}px` } as React.CSSProperties}
      {...props}
    >
      {records.map((toast, i) => {
        const d = count - 1 - i; // 0 = 最新（完全可见）
        const cappedD = Math.min(d, MAX_STACK);
        // HIG-AUD-014：与 CSS 的 `nth-last-[n+4]` 对齐——d >= MAX_STACK 的项视觉上被隐藏，
        // 因此必须同时移出 Tab 序列与无障碍树（见下方 aria-hidden / inert）。
        const hidden = d >= MAX_STACK;
        // 展开态：向上累计（更旧的 toast 排到更上面）
        let expandY = 0;
        for (let j = i + 1; j < count; j++) {
          expandY += (heights[records[j].id] ?? 56) + STACK_GAP;
        }
        const scale = expanded ? 1 : 1 - 0.05 * cappedD;
        const ty = expanded ? -expandY : cappedD === 0 ? 0 : -(13 + 20 * cappedD);
        const tz = -cappedD;
        const Icon = toastIcons[toast.kind];
        const actionLabel = toast.onUndoAction ? t("Undo") : toast.action;
        const action = toast.onUndoAction ?? toast.onAction;
        return (
          <li
            key={toast.id}
            ref={(el) => {
              if (el) itemRefs.current.set(toast.id, el);
              else itemRefs.current.delete(toast.id);
            }}
            role="status"
            data-kind={toast.kind}
            data-exiting={toast.exiting ? "" : undefined}
            // HIG-AUD-014：被 CSS 隐藏的第 5 个及更旧项此前仍留在 Tab 序列与无障碍树里
            // （`nth-last-[n+4]` 只改视觉）。`inert` 同时移出 Tab 序列与 AT，`aria-hidden` 兜底。
            aria-hidden={hidden || undefined}
            inert={hidden || undefined}
            className={cn(
              "pointer-events-auto absolute right-0 bottom-0 flex min-h-13 w-full items-start gap-3 rounded-xl bg-background-100 p-4 text-copy-14 text-gray-1000 shadow-[var(--material-shadow-menu)]",
              "transition-all duration-(--uni-duration-slow) ease-toast",
              "animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none!",
              "nth-last-[n+4]:opacity-0 nth-last-[n+4]:pointer-events-none",
              toast.exiting && "pointer-events-none opacity-0",
              toast.kind === "success" && "bg-link text-white",
              toast.kind === "warning" && "bg-button-warning text-button-warning-foreground",
              toast.kind === "error" && "bg-danger text-danger-foreground",
            )}
            style={{
              transform: `translate3d(0, ${toast.exiting ? ty + TOAST_EXIT_SLIDE : ty}px, ${tz}px) scale(${scale})`,
              zIndex: i + 1,
            }}
          >
            {Icon ? <Icon aria-hidden className="mt-0.5 size-4 shrink-0" /> : null}
            <div className="min-w-0 flex-1">{toast.text}</div>
            {actionLabel ? (
              <button
                type="button"
                data-slot="toast-action"
                // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 32px 视觉
                className="inline-flex h-8 items-center justify-center px-2.5 py-0 text-label-14 leading-5 font-medium shrink-0 rounded-lg outline-none hover:bg-gray-alpha-200 focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11"
                onClick={() => {
                  action?.();
                  dismiss(toast.id);
                }}
              >
                {actionLabel}
              </button>
            ) : null}
            <button
              type="button"
              data-slot="toast-close"
              aria-label={t("Dismiss notification")}
              onClick={() => dismiss(toast.id)}
              className={cn(
                // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 24px 视觉
                "flex size-6 shrink-0 items-center justify-center rounded-lg outline-none hover:bg-gray-alpha-200 focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11",
                toast.kind === "message" && "text-gray-1000",
              )}
            >
              <X aria-hidden className="size-4" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export { Toasts, useToasts, createToastStore };
