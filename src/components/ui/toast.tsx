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
}

let nextToastId = 1;
let toastRecords: ToastRecord[] = [];
const toastListeners = new Set<() => void>();

function publish() {
  toastListeners.forEach((listener) => listener());
}

function dismiss(id: number) {
  toastRecords = toastRecords.filter((toast) => toast.id !== id);
  publish();
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
      if (toast.preserve || timers.current.has(toast.id)) return;
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
        "pointer-events-none fixed right-[var(--toast-gap)] bottom-[var(--toast-gap)] z-[5000] m-0 w-[min(420px,calc(100vw-2*var(--toast-gap)))] p-0 outline-none",
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
            className={cn(
              "pointer-events-auto absolute right-0 bottom-0 flex min-h-13 w-full items-start gap-3 rounded-xl bg-background-100 p-4 text-copy-14 text-gray-1000 shadow-[var(--material-shadow-menu)]",
              "transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.75,0.6,0.98)]",
              "animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none",
              "nth-last-[n+4]:opacity-0 nth-last-[n+4]:pointer-events-none",
              toast.kind === "success" && "bg-[#0072f5] text-white",
              toast.kind === "warning" && "bg-[#ff990a] text-[#0a0a0a]",
              toast.kind === "error" && "bg-[#e5484d] text-white",
            )}
            style={{
              transform: `translate3d(0, ${ty}px, ${tz}px) scale(${scale})`,
              zIndex: i + 1,
            }}
          >
            {Icon ? <Icon aria-hidden className="mt-0.5 size-4 shrink-0" /> : null}
            <div className="min-w-0 flex-1">{toast.text}</div>
            {actionLabel ? (
              <button
                type="button"
                className="shrink-0 rounded-lg px-2 py-0.5 text-label-14 font-medium outline-none hover:bg-gray-alpha-200 focus-ring"
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
                "flex size-6 shrink-0 items-center justify-center rounded-lg outline-none hover:bg-gray-alpha-200 focus-ring",
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
