import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Drawer — Geist 官方 Drawer（docs/geist-markdown-refs/components/drawer.md 官方语义）。
 * 官方实测（2026-08-13 vercel.com/geist/drawer 实时 DOM/computed style）：
 * - 受控 API：show / onDismiss / height / verticalScroll（无 Trigger 子组件）
 * - 全宽底部 sheet（w-full，fixed inset-x-0 bottom-0），rounded-t-xl（12px，Apple HIG
 *   大容器口径；官方实测 computed 8px，2026-08-24 起归一到 token）、无 border-top
 *   （官方 border-t 类名存在但 computed border-top-width 为 0）、
 *   bg-background、max-h-[80dvh]（官方 geist-dialog 覆盖 90dvh 类为 80dvh）
 * - 阴影（box-shadow）：消费 --material-shadow-menu（与 Menu / ContextMenu / Toast 同族材质：
 *   黑 8% 1px 环 + 1px/2px + 8px -4px + 16px 24px -8px + 内层环）。上方的官方实测
 *   阴影是 light 口径，而该 token 在 :root/.dark 双主题定义：dark 下内层近白环被
 *   覆盖为 rgba(255,255,255,0.145) + rgb(0,0,0)。因此阴影必须走 token，内联 light
 *   字面量会绕过 .dark 覆盖，让暗色面板残留亮白 1px 描边。
 * - overlay bg-black/40（有暗化，实测 rgba(0,0,0,.4)），overlay 与 panel 同在
 *   fixed inset-0 层内（z-index 交给父层，panel 自身 z-index auto）
 * - height 生效为 --drawer-frontmost-height（实测 200px）
 * - 出入场：slide-in-from-bottom / slide-out-to-bottom，500ms + ease-snap（官方
 *   0.5s cubic-bezier(0.32,0.72,0,1) 同值）。官方在 Base UI 上走 transition 机制；
 *   本项目基于 Radix，Presence 只监听 animationend（不等待 transition），transition
 *   方案退出会被瞬时卸载，故改用等价的 tw-animate-css keyframe（与 Sheet /
 *   ResponsiveDrawer 同族）。
 * - 下滑手势关闭（--drawer-swipe-movement-y 驱动 transform，data-swipe-direction="down"）
 * - 无右上 X 关闭按钮；Escape / 外点 / 下滑关闭；body scroll 锁定 + 焦点返还（Radix）
 * 说明：官方基于 Base UI 实现；本组件基于 Radix Dialog 复刻同款行为与外观。
 * 边界：本组件是官方 Drawer 的镜像，API 由官方文档固定（固定/自适应高度 + 仅受控
 * show/onDismiss）。官方没有的「多档位拖拽吸附」由本地扩展 BottomSheet 承担；两者
 * 外壳同族（同一 overlay 写法与 --uni-z-drawer），但保持为两个组件——合并会让这里
 * 的 API 偏离官方契约。
 */

interface DrawerProps {
  /** 受控打开状态 */
  show?: boolean;
  /** 关闭回调（Escape / 外点 / 下滑触发） */
  onDismiss?: () => void;
  /**
   * 关闭后焦点返还目标（通常为打开按钮的 ref）。
   * 缺省时回退为「打开瞬间的 activeElement」——但 Radix onOpenAutoFocus 会把焦点
   * 移入面板（子 effect 先于父 effect 执行），导致回退捕获到面板内元素、关闭时
   * 该元素已卸载而返还失败；显式传入打开按钮可彻底规避该竞态。
   */
  restoreFocusTo?: React.RefObject<HTMLElement | null>;
  /** 面板高度（px）；不传则按内容自适应 */
  height?: number;
  /** 面板内部滚动（内容超出 max-h 时） */
  verticalScroll?: boolean;
  /** 面板 className */
  className?: string;
  children?: React.ReactNode;
  /** 无可见 DrawerTitle 时提供面板的可访问名称。 */
  "aria-label"?: string;
  /** 覆盖由 DrawerTitle 自动提供的关联。 */
  "aria-labelledby"?: string;
  /** 覆盖由 DrawerDescription 自动提供的关联。 */
  "aria-describedby"?: string;
}

type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

function DrawerPanel({
  onDismiss,
  height,
  verticalScroll,
  className,
  children,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  onDismiss?: () => void;
  height?: number;
  verticalScroll?: boolean;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}) {
  const [dragY, setDragY] = React.useState(0);
  // P1-5：prefers-reduced-motion 下过渡归零（WCAG 2.3.3 Animation from Interactions）
  const [reducedMotion, setReducedMotion] = React.useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  // 出入场由 tw-animate-css keyframe（slide-in-from-bottom / slide-out-to-bottom）驱动：
  // Radix Presence 只监听 animationend，用 transition 做退出会被瞬时卸载，故对齐
  // Sheet / ResponsiveDrawer 的 keyframe 方案。内联 transform 仅承载拖拽位移——
  // keyframe 生效期间动画优先级高于内联样式，动画结束（fill-mode: none）后内联接管。
  const startY = React.useRef<number | null>(null);
  const dragging = dragY > 0;
  const accessibilityProps = {
    ...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined || ariaLabel !== undefined
      ? { "aria-labelledby": ariaLabelledBy }
      : {}),
    ...(ariaDescribedBy !== undefined ? { "aria-describedby": ariaDescribedBy } : {}),
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    // 面板内部已滚动时优先滚动内容，不触发下滑关闭
    if (event.currentTarget.scrollTop > 0) return;
    startY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    setDragY(Math.max(0, event.clientY - startY.current));
  };

  const endDrag = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (dragY > 100) onDismiss?.();
    setDragY(0);
  };

  return (
    <DialogPrimitive.Content
      tabIndex={-1}
      data-slot="drawer"
      data-swipe-direction="down"
      {...accessibilityProps}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[var(--uni-z-drawer)] w-full max-w-full min-h-[45px] touch-pan-y rounded-t-xl border-t bg-background shadow-[var(--material-shadow-menu)] outline-none pb-[env(safe-area-inset-bottom)]",
        "max-h-[80dvh] overscroll-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
        "duration-(--uni-motion-expansive) ease-snap motion-reduce:animate-none",
        verticalScroll && "overflow-y-auto",
        dragging && "select-none",
        className,
      )}
      style={
        {
          height: height ?? undefined,
          "--drawer-frontmost-height": height ? `${height}px` : undefined,
          "--drawer-swipe-movement-y": `${dragY}px`,
          transform: `translateY(${dragY}px)`,
          transition: dragging
            ? "none"
            : reducedMotion
              ? "transform 0s linear"
              : "transform var(--uni-motion-expansive) var(--ease-snap)",
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onOpenAutoFocus={(event) => {
        // P0-3：打开时焦点显式移入面板首个可聚焦元素（搜索行/首链接）。
        // 走 Radix 同步 onOpenAutoFocus（而非 rAF），后台标签页 rAF 被节流时也可靠。
        event.preventDefault();
        const panel = event.currentTarget as HTMLElement;
        const firstFocusable = panel.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (firstFocusable ?? panel).focus();
      }}
    >
      {children}
    </DialogPrimitive.Content>
  );
}

function Drawer({
  show,
  onDismiss,
  restoreFocusTo,
  height,
  verticalScroll,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: DrawerProps) {
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const wasShownRef = React.useRef(false);

  React.useEffect(() => {
    if (show && !wasShownRef.current) {
      restoreFocusRef.current =
        restoreFocusTo?.current instanceof HTMLElement
          ? restoreFocusTo.current
          : document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
    } else if (!show && wasShownRef.current) {
      const target = restoreFocusRef.current;
      // setTimeout 而非 rAF：后台标签页 rAF 会被挂起，setTimeout 仍会触发。
      window.setTimeout(() => {
        if (target?.isConnected) target.focus();
      }, 0);
    }
    wasShownRef.current = Boolean(show);
  }, [show, restoreFocusTo]);

  return (
    <DialogPrimitive.Root
      open={show}
      onOpenChange={(next) => {
        if (!next) onDismiss?.();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--uni-z-drawer)] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none motion-reduce:transition-none" />
        <DrawerPanel
          onDismiss={onDismiss}
          height={height}
          verticalScroll={verticalScroll}
          className={className}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
        >
          {children}
        </DrawerPanel>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export { Drawer, DrawerTitle, DrawerDescription };
export type { DrawerProps, DrawerTitleProps, DrawerDescriptionProps };
