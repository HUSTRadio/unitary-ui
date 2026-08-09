import * as React from "react";
import { CircleAlert, CircleCheck, CircleX, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastKind = "message" | "success" | "warning" | "error";

interface ToastOptions {
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

function useToasts() {
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

interface ToastsProps extends React.ComponentProps<"ol"> {
  gap?: number;
}

/** Mount once near the application root; messages are emitted through `useToasts()`. */
function Toasts({ className, gap = 16, ...props }: ToastsProps) {
  const records = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const timers = React.useRef(new Map<number, number>());

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

  return (
    <ol
      data-slot="toasts"
      aria-live="polite"
      aria-relevant="additions text"
      className={cn(
        "pointer-events-none fixed right-[var(--toast-gap)] bottom-[var(--toast-gap)] z-[5000] flex max-h-[calc(100vh-2*var(--toast-gap))] w-[min(420px,calc(100vw-2*var(--toast-gap)))] flex-col gap-2 p-0 outline-none",
        className,
      )}
      style={{ "--toast-gap": `${gap}px` } as React.CSSProperties}
      {...props}
    >
      {records.map((toast) => {
        const Icon = toastIcons[toast.kind];
        const actionLabel = toast.onUndoAction ? "Undo" : toast.action;
        const action = toast.onUndoAction ?? toast.onAction;
        return (
          <li
            key={toast.id}
            role="status"
            data-kind={toast.kind}
            className="pointer-events-auto flex min-h-13 items-start gap-3 rounded-[12px] bg-background-100 p-4 text-copy-14 text-gray-1000 shadow-[var(--material-shadow-menu)] animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none"
          >
            {Icon ? (
              <Icon
                aria-hidden
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  toast.kind === "success" && "text-success",
                  toast.kind === "warning" && "text-warning",
                  toast.kind === "error" && "text-destructive",
                )}
              />
            ) : null}
            <div className="min-w-0 flex-1">{toast.text}</div>
            {actionLabel ? (
              <button
                type="button"
                className="shrink-0 rounded-[6px] px-2 py-0.5 text-label-14 font-medium outline-none hover:bg-gray-alpha-200 focus-ring"
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
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
              className="flex size-6 shrink-0 items-center justify-center rounded-[6px] text-gray-900 outline-none hover:bg-gray-alpha-200 focus-ring"
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
