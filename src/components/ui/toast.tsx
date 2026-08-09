import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Toast — Geist 官方 Toast 规范（docs/geist-markdown-refs/components/toast.md 实测）。
 * 官方实测：容器 bg-background、1px border gray-alpha、r:8px、底部右侧悬浮；
 * title 用 text-label-14，description 用 text-copy-13，关闭按钮为右上角 ghost 图标钮。
 * 用法：<ToastProvider swipeDirection="right">
 *         <Toast>
 *           <ToastTitle />
 *           <ToastDescription />
 *           <ToastClose />
 *         </Toast>
 *         <ToastViewport />
 *       </ToastProvider>
 */

const ToastProvider = ToastPrimitive.Provider;

function Toast({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-[8px] border border-gray-alpha-400 bg-background p-4 pr-8 shadow-[var(--material-shadow-menu)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[swipe=end]:animate-out data-[swipe=cancel]:transition-transform",
        className,
      )}
      {...props}
    />
  );
}

function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-alpha-400 px-3 text-[length:14px] font-medium text-foreground transition-colors hover:bg-gray-alpha-200 focus-ring outline-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "absolute right-2 top-2 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-alpha-200 hover:text-foreground focus-ring outline-none",
        className,
      )}
      {...props}
    >
      <X className="size-4" aria-hidden />
    </ToastPrimitive.Close>
  );
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-label-14 text-foreground", className)}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-copy-13 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed right-4 bottom-4 z-[100] flex max-h-screen w-full max-w-[320px] flex-col gap-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
