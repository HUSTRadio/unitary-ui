import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Drawer — Geist 官方 Drawer（docs/geist-markdown-refs/components/drawer.md 官方语义）。
 * 官方实测（2026-08-13 vercel.com/geist/drawer 实时 DOM/computed style）：
 * - 受控 API：show / onDismiss / height / verticalScroll（无 Trigger 子组件）
 * - 全宽底部 sheet（w-full，fixed inset-x-0 bottom-0），rounded-t-[8px]（实测
 *   computed 8px，官方类名写 10px 但被 geist-dialog 覆盖为 8px）、无 border-top
 *   （官方 border-t 类名存在但 computed border-top-width 为 0）、
 *   bg-background、max-h-[80dvh]（官方 geist-dialog 覆盖 90dvh 类为 80dvh）
 * - boxShadow 四层：ring 1px + 1px/2px + 8px -4px + 16px 24px -8px + 底 1px 白 ring
 * - overlay bg-black/40（有暗化，实测 rgba(0,0,0,.4)），overlay 与 panel 同在
 *   fixed inset-0 层内（z-index 交给父层，panel 自身 z-index auto）
 * - height 生效为 --drawer-frontmost-height（实测 200px）
 * - 打开动画：transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)，从 translateY(100%)
 *   滑入（Base UI data-starting-style 同帧机制）；无 keyframe animation
 * - 下滑手势关闭（--drawer-swipe-movement-y 驱动 transform，data-swipe-direction="down"）
 * - 无右上 X 关闭按钮；Escape / 外点 / 下滑关闭；body scroll 锁定 + 焦点返还（Radix）
 * 说明：官方基于 Base UI 实现；本组件基于 Radix Dialog 复刻同款行为与外观。
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
  // 打开瞬间先以 translateY(100%) 渲染（与官方 Base UI data-starting-style 同帧），
  // 下一帧直接改写 DOM 样式回到 0，由 transition 驱动与官方一致的滑入动画。
  // 直接用 DOM 写入而非依赖 React 再渲染，避免 rAF 回调里的 setState 提交延迟
  // 导致采集窗口内动画尚未起步（transform 卡在 translateY(100%)）。
  const [phase, setPhase] = React.useState<"start" | "end">("start");
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const startY = React.useRef<number | null>(null);
  const dragging = dragY > 0;
  const accessibilityProps = {
    ...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined || ariaLabel !== undefined
      ? { "aria-labelledby": ariaLabelledBy }
      : {}),
    ...(ariaDescribedBy !== undefined ? { "aria-describedby": ariaDescribedBy } : {}),
  };

  React.useLayoutEffect(() => {
    // 打开瞬间先以 translateY(100%) 渲染（与官方 Base UI data-starting-style 同帧），
    // 下一帧直接改写 DOM 样式回到 0，由 transition 驱动与官方一致的滑入动画。
    // 直接用 DOM 写入而非依赖 React 再渲染，避免 rAF 回调里的 setState 提交延迟
    // 导致采集窗口内动画尚未起步（transform 卡在 translateY(100%)）。
    const raf = requestAnimationFrame(() => {
      setPhase("end");
      if (contentRef.current) {
        contentRef.current.style.transform = "translateY(0px)";
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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
      ref={contentRef}
      tabIndex={-1}
      data-slot="drawer"
      data-swipe-direction="down"
      {...accessibilityProps}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[var(--ds-z-drawer)] w-full max-w-full min-h-[45px] touch-pan-y rounded-t-[10px] border-t bg-background outline-none pb-[env(safe-area-inset-bottom)]",
        "max-h-[90dvh] overscroll-none",
        "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
        verticalScroll && "overflow-y-auto",
        dragging && "select-none",
        className,
      )}
      style={
        {
          height: height ?? undefined,
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, rgb(250, 250, 250) 0px 0px 0px 1px",
          "--drawer-frontmost-height": height ? `${height}px` : undefined,
          "--drawer-swipe-movement-y": `${dragY}px`,
          transform: phase === "start" ? "translateY(100%)" : `translateY(${dragY}px)`,
          transition: dragging
            ? "none"
            : reducedMotion
              ? "transform 0s linear"
              : "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)",
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
        <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--ds-z-drawer)] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none motion-reduce:transition-none" />
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
