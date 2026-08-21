import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Modal — Geist 官方 Modal 封装（基于 Radix Dialog 原语）。
 * 导出：Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle,
 *       ModalDescription, ModalFooter, ModalClose。
 * 材质对齐 Geist 实测（2026-08-15，vercel.com/geist/modal 实时 DOM/computed style）：
 * - scrim：官方为独立 geist-overlay-backdrop 元素（bg #f2f2f2 light / #000 dark @ 0.8），
 *   overlay 本身透明；本地简化为 overlay 自身 bg-[#f2f2f2]/80 dark:bg-black/80（视觉等价）
 * - content 定位：官方 position:static 由 overlay flex 居中；本地 fixed top-50% left-50%
 *   -translate-x/y-1/2 居中（视觉等价）
 * - content：w-[540px] max-w-full max-[540px]:max-w-[calc(100vw-20px)] flex flex-col
 *   rounded-[12px] bg-background-100 无 border，max-h-[min(800px,80vh)]（1440x900 下
 *   720px，sticky demo 全高即由此封顶），sm:overflow-hidden overflow-y-auto
 * - 阴影：shadow-[var(--ds-shadow-modal-elevated)]（双主题：light 边框层 #00000014 /
 *   dark #ffffff24，其余 3 层一致）
 * - 过渡：transition-[opacity,transform] 0.3s cubic-bezier(0.175,0.885,0.32,1.1)
 *   （官方 --ds-motion-overlay-duration/timing），无 animation
 * - 内容区：body（p-5 overflow-y-auto）承载 header/title/description/footer；
 *   sticky demo 通过 bodyClassName="pt-0" + className="sticky" 复刻
 *   [.sticky_&] 变体（dialog position:sticky、header/footer 粘性）
 * - content 强制 aria-modal="true"（官方实测有）
 * - 右上角 X 默认不渲染（官方 10 个 demo 均无 X，用 footer Cancel），
 *   需要时通过 ModalContent showCloseButton 开启
 * - 关闭后焦点归还打开前的 trigger（官方 BP）：若 Radix composedTriggerRef
 *   指向已卸载节点（内容内嵌套 Trigger 会覆盖它），回退到打开前焦点元素
 * - title：text-heading-20 text-foreground；description：text-copy-14 text-muted-foreground
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
      "fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-auto bg-[#f2f2f2]/80 dark:bg-black/80",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.1)] motion-reduce:animate-none",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 渲染右上角关闭按钮（官方默认无 X，用 footer Cancel） */
  showCloseButton?: boolean;
  /** 内容区（body）额外类名；官方 sticky 变体用 pt-0 消除顶部内边距 */
  bodyClassName?: string;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      bodyClassName,
      children,
      showCloseButton = false,
      onOpenAutoFocus,
      onCloseAutoFocus,
      style,
      ...props
    },
    ref,
  ) => {
    const { t } = useI18n();
    // 打开前的焦点元素：关闭后优先归还给它。
    // 修复：内容内嵌套 ModalTrigger（如 demo 的 Cancel 误用 Trigger）会覆盖 Radix
    // composedTriggerRef，关闭时默认归还指向已卸载节点 → 焦点掉到 <body>。
    const lastFocusedRef = React.useRef<HTMLElement | null>(null);

    return (
      <ModalPortal>
        <ModalOverlay>
          <DialogPrimitive.Content
            ref={ref}
            aria-modal="true"
            data-slot="modal-content"
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
            style={style}
            className={cn(
              "fixed top-[50%] left-[50%] z-[300] flex min-h-0 w-[540px] max-w-full min-w-0 flex-col overflow-hidden rounded-[12px] bg-background-100 text-foreground outline-none",
              "max-h-[min(800px,80vh)]",
              "max-[540px]:max-w-[calc(100vw-20px)]",
              "shadow-[var(--ds-shadow-modal-elevated)]",
              "-translate-x-1/2 -translate-y-1/2",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.1)]",
              "sm:overflow-hidden overflow-y-auto",
              className,
            )}
            {...props}
          >
            <div className={cn("overflow-y-auto p-5", bodyClassName)}>
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity outline-none hover:bg-gray-alpha-200 hover:text-foreground hover:opacity-100 focus-ring disabled:pointer-events-none">
                  <X className="size-4" aria-hidden />
                  <span className="sr-only">{t("Close")}</span>
                </DialogPrimitive.Close>
              )}
            </div>
          </DialogPrimitive.Content>
        </ModalOverlay>
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
