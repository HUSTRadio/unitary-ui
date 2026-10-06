import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const LayerDialogPrimitiveContent = withLayerBridge(DialogPrimitive.Content);
const LayerDialogPrimitiveOverlay = withLayerBridge(DialogPrimitive.Overlay);

/**
 * Modal — Geist 官方 Modal 封装（基于 Radix Dialog 原语）。
 * 导出：Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle,
 *       ModalDescription, ModalFooter, ModalClose。
 * 材质对齐 Geist 实测（2026-08-15，vercel.com/geist/modal 实时 DOM/computed style）：
 * - scrim：官方为独立 geist-overlay-backdrop 元素（bg #f2f2f2 light / #000 dark @ 0.8），
 *   overlay 本身透明；本地简化为 overlay 自身消费 backdrop 族的**合成色**
 *   bg-[var(--uni-overlay-backdrop)]（= color × opacity，与上述官方值逐值等价）。
 *   本 Overlay 带着 Content 子节点，故不能用元素 opacity-*（会把内容一起降透明）
 *   ——HIG-AUD-010 已由字面量迁移为 token
 * - content 定位：官方 position:static 由 overlay flex 居中；本地 fixed top-50% left-50%
 *   -translate-x/y-1/2 居中（视觉等价）
 * - placement：`center`（默认，居中 + 中心缩放淡入，官方基线）|
 *   `top`（吸顶形态：贴视口顶边、上圆角归零，**自顶部下落入场**——macOS sheet 语义；
 *   入场/出场用位移淡入，配合 sticky header/footer 的长内容表单）
 * - content：w-[540px] max-w-full max-modal:max-w-[calc(100vw-20px)] flex flex-col
 *   rounded-[12px]（现 rounded-xl token）bg-background-100 无 border，max-h-[min(800px,80dvh)]（vh 回退；1440x900 下
 *   720px，sticky demo 全高即由此封顶），sm:overflow-hidden overflow-y-auto
 * - 阴影：shadow-[var(--uni-shadow-modal-elevated)]（双主题：light 边框层 #00000014 /
 *   dark #ffffff24，其余 3 层一致）
 * - 过渡：transition-[opacity,transform] 0.3s cubic-bezier(0.175,0.885,0.32,1.1)
 *   （官方 --uni-motion-overlay-duration/timing），无 animation
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

export type ModalProps = React.ComponentProps<typeof DialogPrimitive.Root>;
export type ModalTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
export type ModalPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
export type ModalCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
export type ModalOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <LayerDialogPrimitiveOverlay
    data-material="mask-backdrop"
    ref={ref}
    className={cn(
      // 用合成色而非元素 opacity-*：本 Overlay 带着 Content 子节点，元素透明度会把
      // 内容一起降透明（sheet/side-panel 的 Overlay 无子节点才可用 color + opacity 两值式）
      "fixed inset-0 z-[var(--uni-z-modal)] flex flex-col items-center justify-center overflow-auto bg-[var(--uni-overlay-backdrop)]",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-(--uni-duration-slow) ease-pop motion-reduce:animate-none!",
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type ModalContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** 渲染右上角关闭按钮（官方默认无 X，用 footer Cancel） */
  showCloseButton?: boolean;
  /** 内容区（body）额外类名；官方 sticky 变体用 pt-0 消除顶部内边距 */
  bodyClassName?: string;
  /**
   * 形态与入场方向（默认 "center"）：
   * - `center`：几何居中，中心缩放淡入（官方 Geist 基线）。
   * - `top`：**吸顶**——贴视口顶边、上圆角归零，自顶部下落入场（macOS sheet 语义），
   *   与内容区 sticky header/footer 搭配用于长表单。
   */
  placement?: ModalPlacement;
};

export type ModalPlacement = "center" | "top";

/**
 * 形态类（定位 + 圆角 + 入场/出场动画）：
 * - center：`-translate-x/y-1/2` 居中，zoom 缩放淡入（官方基线，保持既有观感）。
 * - top：`top-0` 吸顶 + `-translate-x-1/2` 水平居中，`slide-in-from-top-*` 位移淡入，
 *   读作"从顶部滑落"；上圆角归零贴合视口顶边（下圆角保留）。
 * 两个形态的 `translate` 用 Tailwind 4 的 translate 属性（独立于 keyframe 的 transform），
 * 因此与 tw-animate-css 的缩放/位移互不覆盖。
 */
const PLACEMENT_CLASS: Record<ModalPlacement, string> = {
  center: cn(
    "top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-xl",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  ),
  top: cn(
    "top-0 left-1/2 -translate-x-1/2 rounded-t-none rounded-b-xl",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-8 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-8",
  ),
};

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      bodyClassName,
      placement = "center",
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
          <LayerDialogPrimitiveContent
            data-material="floating"
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
              "fixed z-[var(--uni-z-modal)] flex min-h-0 w-[540px] max-w-full min-w-0 flex-col overflow-hidden bg-background-100 text-foreground outline-none",
              "max-h-[min(800px,80vh)] supports-[height:100dvh]:max-h-[min(800px,80dvh)]",
              "max-modal:max-w-[calc(100vw-20px)]",
              "shadow-[var(--uni-shadow-modal-elevated)]",
              PLACEMENT_CLASS[placement],
              "transition-[opacity,transform] duration-(--uni-duration-slow) ease-pop motion-reduce:animate-none! motion-reduce:transition-none",
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
          </LayerDialogPrimitiveContent>
        </ModalOverlay>
      </ModalPortal>
    );
  },
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

export type ModalHeaderProps = React.ComponentPropsWithoutRef<"div">;

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />
  ),
);
ModalHeader.displayName = "ModalHeader";

export type ModalTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export type ModalFooterProps = React.ComponentPropsWithoutRef<"div">;

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
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
};
