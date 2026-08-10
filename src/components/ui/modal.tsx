import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Modal — Geist 官方 Modal 封装（基于 Radix Dialog 原语）。
 * 导出：Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle,
 *       ModalDescription, ModalFooter, ModalClose。
 * 材质对齐 Geist 实测（2026-08）：
 * - overlay：light #f2f2f2 / dark #000、opacity 0.8、无模糊、z-[300]（G07-MODAL-01）
 * - content：bg-background rounded-[12px] border border-gray-alpha-400
 *   shadow-[var(--material-shadow-modal)] p-5（官方 540px 宽 / 20px 内边距）
 * - content 强制 aria-modal="true"（官方实测有）
 * - 右上角 X 默认不渲染（官方 10 个 demo 均无 X，用 footer Cancel），
 *   需要时通过 ModalContent showCloseButton 开启
 * - 关闭后焦点归还打开前的 trigger（官方 BP）：若 Radix composedTriggerRef
 *   指向已卸载节点（内容内嵌套 Trigger 会覆盖它），回退到打开前焦点元素
 * - title：text-heading-20 text-foreground
 * - description：text-copy-14 text-muted-foreground
 * 动画：data-[state=open]:animate-in / data-[state=closed]:animate-out
 */

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[300] bg-[#f2f2f2]/80 dark:bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 渲染右上角关闭按钮（官方默认无 X，用 footer Cancel） */
  showCloseButton?: boolean;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    { className, children, showCloseButton = false, onOpenAutoFocus, onCloseAutoFocus, ...props },
    ref,
  ) => {
    // 打开前的焦点元素：关闭后优先归还给它。
    // 修复：内容内嵌套 ModalTrigger（如 demo 的 Cancel 误用 Trigger）会覆盖 Radix
    // composedTriggerRef，关闭时默认归还指向已卸载节点 → 焦点掉到 <body>。
    const lastFocusedRef = React.useRef<HTMLElement | null>(null);

    return (
      <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
          ref={ref}
          aria-modal="true"
          onOpenAutoFocus={(event) => {
            lastFocusedRef.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
            onOpenAutoFocus?.(event);
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;
            const previous = lastFocusedRef.current;
            if (previous && previous.isConnected && previous !== document.body) {
              event.preventDefault();
              // 内容已卸载，下一帧再聚焦
              requestAnimationFrame(() => previous.focus());
            }
          }}
          className={cn(
            "fixed top-[50%] left-[50%] z-[300] grid w-full max-w-[540px] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[12px] border border-gray-alpha-400 bg-background p-5 shadow-[var(--material-shadow-modal)] outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity outline-none hover:bg-gray-alpha-200 hover:text-foreground hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
              <X className="size-4" aria-hidden />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  },
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />
  ),
);
ModalHeader.displayName = "ModalHeader";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  ),
);
ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  type ModalContentProps,
};
