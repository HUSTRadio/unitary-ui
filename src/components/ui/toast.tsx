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

interface ToastRecord extends ToastOptions {
  id: number;
  kind: ToastKind;
  /** 退场中：保留节点播放退场过渡，过渡结束后才从记录中移除 */
  exiting?: boolean;
}

let nextToastId = 1;
let toastRecords: ToastRecord[] = [];
const toastListeners = new Set<() => void>();

/** 退场驻留时长：与条目 class 的 transition-all duration-(--uni-duration-slow)（350ms）一致 */
const TOAST_EXIT_MS = 350;
/** 退场位移：与入场 slide-in-from-bottom-2（8px）镜像 */
const TOAST_EXIT_SLIDE = 8;

function removeToast(id: number) {
  const next = toastRecords.filter((toast) => toast.id !== id);
  if (next.length === toastRecords.length) return;
  toastRecords = next;
  publish();
}

function publish() {
  toastListeners.forEach((listener) => listener());
}

/**
 * 关闭：先标记退场并保留节点一个过渡时长（Apple 对称过渡——有入必有出），
 * 过渡结束后再真正移除。直接 filter 会让条目瞬间消失，退场动画无从播放。
 */
function dismiss(id: number) {
  const target = toastRecords.find((toast) => toast.id === id);
  if (!target || target.exiting) return;
  if (typeof window === "undefined") {
    removeToast(id);
    return;
  }
  toastRecords = toastRecords.map((toast) =>
    toast.id === id ? { ...toast, exiting: true } : toast,
  );
  publish();
  window.setTimeout(() => removeToast(id), TOAST_EXIT_MS);
}

function addToast(kind: ToastKind, options: ToastOptions | React.ReactNode) {
  const normalized: ToastOptions =
    !React.isValidElement(options) &&
    typeof options === "object" &&
    options !== null &&
    "text" in options
      ? (options as ToastOptions)
      : { text: options };
  const id = nextToastId++;
  toastRecords = [...toastRecords, { ...normalized, id, kind }];
  publish();
  return id;
}

function subscribe(listener: () => void) {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
}

function getSnapshot() {
  return toastRecords;
}

export interface UseToastsReturn {
  message: (options: ToastOptions) => number;
  success: (text: React.ReactNode) => number;
  warning: (text: React.ReactNode) => number;
  error: (text: React.ReactNode) => number;
  dismiss: (id: number) => void;
}

function useToasts(): UseToastsReturn {
  return React.useMemo(
    () => ({
      message: (options: ToastOptions) => addToast("message", options),
      success: (text: React.ReactNode) => addToast("success", text),
      warning: (text: React.ReactNode) => addToast("warning", text),
      error: (text: React.ReactNode) => addToast("error", text),
      dismiss,
    }),
    [],
  );
}

const toastIcons: Partial<Record<ToastKind, React.ComponentType<{ className?: string }>>> = {
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
};

export interface ToastsProps extends React.ComponentProps<"ol"> {
  gap?: number;
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

function Toasts({ className, gap = 16, ...props }: ToastsProps) {
  const { t } = useI18n();
  const records = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const timers = React.useRef(new Map<number, number>());
  const [expanded, setExpanded] = React.useState(false);
  const itemRefs = React.useRef(new Map<number, HTMLLIElement>());
  const [heights, setHeights] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    records.forEach((toast) => {
      if (toast.preserve || toast.exiting || timers.current.has(toast.id)) return;
      const duration = toast.duration ?? (toast.onUndoAction ? 7000 : 3500);
      timers.current.set(
        toast.id,
        window.setTimeout(() => {
          timers.current.delete(toast.id);
          dismiss(toast.id);
        }, duration),
      );
    });
    for (const [id, timer] of timers.current) {
      if (!records.some((toast) => toast.id === id)) {
        window.clearTimeout(timer);
        timers.current.delete(id);
      }
    }
  }, [records]);

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

export { Toasts, useToasts };
