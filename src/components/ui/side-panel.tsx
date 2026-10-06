import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const LayerDialogPrimitiveContent = withLayerBridge(DialogPrimitive.Content);
const LayerDialogPrimitiveOverlay = withLayerBridge(DialogPrimitive.Overlay);

/**
 * SidePanel — 桌面侧板（DD-001b，设计决策 §7：pointer 态独立组件，不塞进 drawer.tsx）。
 *
 * 与 Drawer 的边界：Drawer 是触控底部抽屉（touch 形态 + 下滑手势）；
 * SidePanel 是鼠标/触控板场景的右侧/左侧悬浮模态面板。消费者按意图选组件，
 * 组件内不做 modality 分支；docs Drawer demo 通过 useInputModality() 引导卡互指。
 *
 * 视觉契约（全部 token 化，provenance = unitary_owned，参考
 * tremor_floating_inset + internal_material_contract，不承诺与任一上游一致）：
 * - 面板：fixed inset-y-4 z-[var(--uni-z-drawer)]；side=right → right-4 / left → left-4；
 * - 宽度：w-[var(--uni-drawer-width)]（--uni-drawer-width: min(420px, 90vw)，
 *   禁止组件内写死 px）；
 * - 表面：material-medium（12px radius + --material-shadow-medium + bg-surface，
 *   直接消费 @utility material-medium）；
 * - 动画：data-[state=open]:slide-in-from-right-5（left 对称镜像）+ fade-in-0；
 *   closed slide-out-to-*-10 + fade-out-0；duration-(--uni-duration-base)；
 *   motion-reduce:animate-none!（WCAG 2.3.3）；
 * - Overlay：bg-[var(--uni-overlay-backdrop-color)] @
 *   opacity-[var(--uni-overlay-backdrop-opacity)]（对齐 sheet 的 backdrop 族 token；
 *   与 drawer 的暗化族 --uni-overlay-scrim-color 是**两族**，勿混用——HIG-AUD-010）；
 *   noOverlay=true 跳过渲染 Overlay，并同步以
 *   modal={false} 运行（Radix 非模态：不锁 body 滚动、不 hideOthers 遮蔽外部内容、
 *   无焦点陷阱，页面保持可操作；外点仍触发 onDismiss，是否关闭由消费者决定）
 *   ——HIG-AUD-007；
 * - 关闭：Esc / overlay 点击走 Radix 默认；SidePanelClose = DialogPrimitive.Close；
 * - 焦点：受控 API 无 Trigger，Radix 默认归还依赖 triggerRef（无 Trigger 时焦点
 *   落 body），故与 modal/bottom-sheet 同款自实现归还：打开瞬间（Radix 移动焦点
 *   之前）记录 activeElement，关闭时 setTimeout 归还（不用 rAF——后台标签页会挂
 *   起，drawer 先例）——HIG-AUD-006；无拖拽手势代码——不捕获指针、不跟踪拖拽
 *   位移，关闭只走 Esc / overlay 点击 / 显式关闭按钮。
 */

export interface SidePanelProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "dir"> {
  /** 受控打开状态（与 Drawer 一致的受控命名） */
  show?: boolean;
  /** 关闭回调（Escape / overlay 点击触发） */
  onDismiss?: () => void;
  /** 悬浮方向；默认 right */
  side?: "right" | "left";
  /** 不渲染遮罩层并降为非模态（modal=false：不锁滚动、不遮蔽外部内容、无焦点陷阱；外点仍触发 onDismiss） */
  noOverlay?: boolean;
  /** 面板 className */
  className?: string;
  children: React.ReactNode;
}

type SidePanelTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
type SidePanelDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;
type SidePanelCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/** side 定位 + 镜像滑入/滑出动画（slide-in 5% / slide-out 10%，对齐 sheet 语言）。 */
const SIDE_STYLES: Record<"right" | "left", string> = {
  right:
    "right-4 data-[state=open]:slide-in-from-right-5 data-[state=closed]:slide-out-to-right-10",
  left: "left-4 data-[state=open]:slide-in-from-left-5 data-[state=closed]:slide-out-to-left-10",
};

const SidePanelOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <LayerDialogPrimitiveOverlay
    data-material="mask-backdrop"
    ref={ref}
    data-slot="side-panel-overlay"
    className={cn(
      "fixed inset-0 z-[var(--uni-z-drawer)] bg-[var(--uni-overlay-backdrop-color)] opacity-[var(--uni-overlay-backdrop-opacity)]",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none! motion-reduce:transition-none",
      className,
    )}
    {...props}
  />
));
SidePanelOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SidePanelContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "right" | "left" }
>(({ className, children, side = "right", ...props }, ref) => {
  // HIG-AUD-006：受控 API 无 Trigger，Radix 关闭时的默认归还依赖 triggerRef，
  // 无 Trigger 时焦点落到 <body>。与 modal.tsx 同款自实现：onOpenAutoFocus 在
  // Radix 把焦点移入面板之前派发，此刻记录的 activeElement 即触发元素。
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);

  return (
    <LayerDialogPrimitiveContent
      data-material="floating"
      ref={ref}
      data-slot="side-panel-content"
      className={cn(
        "material-medium fixed inset-y-4 z-[var(--uni-z-drawer)] w-[var(--uni-drawer-width)] overflow-y-auto outline-none",
        "shadow-[var(--_uni-material-shadow,var(--material-shadow-medium))]",
        "data-[state=open]:animate-in data-[state=open]:duration-(--uni-duration-base) data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:duration-(--uni-duration-base) data-[state=closed]:fade-out-0",
        "motion-reduce:animate-none! motion-reduce:transition-none",
        SIDE_STYLES[side],
        className,
      )}
      {...props}
      onOpenAutoFocus={() => {
        lastFocusedRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }}
      onCloseAutoFocus={(event) => {
        const previous = lastFocusedRef.current;
        if (previous && previous.isConnected && previous !== document.body) {
          event.preventDefault();
          // setTimeout 而非 rAF：后台标签页 rAF 会被挂起（drawer 先例）。
          window.setTimeout(() => previous.focus(), 0);
        }
      }}
    >
      {children}
    </LayerDialogPrimitiveContent>
  );
});
SidePanelContent.displayName = DialogPrimitive.Content.displayName;

function SidePanel({
  show,
  onDismiss,
  side = "right",
  noOverlay = false,
  className,
  children,
  ...rootProps
}: SidePanelProps) {
  return (
    <DialogPrimitive.Root
      open={show}
      // HIG-AUD-007：noOverlay 时降为非模态（Radix modal=false：不锁 body 滚动、
      // 不 hideOthers 遮蔽外部内容、无焦点陷阱），兑现「页面保持可操作」契约；
      // 外点仍触发 onDismiss，是否真的关闭由消费者决定。{...rootProps} 在后，
      // 消费者显式传 modal 时仍可覆盖。
      modal={!noOverlay}
      onOpenChange={(next) => {
        if (!next) onDismiss?.();
      }}
      {...rootProps}
    >
      <DialogPrimitive.Portal>
        {noOverlay ? null : <SidePanelOverlay />}
        <SidePanelContent side={side} className={className}>
          {children}
        </SidePanelContent>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const SidePanelTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  SidePanelTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
SidePanelTitle.displayName = "SidePanelTitle";

const SidePanelDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  SidePanelDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
SidePanelDescription.displayName = "SidePanelDescription";

const SidePanelClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  SidePanelCloseProps
>((props, ref) => <DialogPrimitive.Close ref={ref} {...props} />);
SidePanelClose.displayName = "SidePanelClose";

export { SidePanel, SidePanelTitle, SidePanelDescription, SidePanelClose };
export type { SidePanelTitleProps, SidePanelDescriptionProps, SidePanelCloseProps };
