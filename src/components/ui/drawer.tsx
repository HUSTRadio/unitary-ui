import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Drawer — Geist 官方 Drawer（docs/geist-markdown-refs/components/drawer.md 官方语义）。
 * 官方实测（2026-08 vercel.com/geist/drawer 实时 DOM/computed style）：
 * - 受控 API：show / onDismiss / height / verticalScroll（无 Trigger 子组件）
 * - 全宽底部 sheet（w-full，桌面 1262px 视口即全宽），rounded-t-[10px]、
 *   border-t gray-alpha-400、bg-background、max-h-[90dvh]
 * - overlay bg-black/40（有暗化，实测 rgba(0,0,0,.4)）
 * - height 生效为 --drawer-frontmost-height（实测 200px）
 * - 下滑手势关闭（--drawer-swipe-movement-y 驱动 transform，data-swipe-direction="down"）
 * - 无右上 X 关闭按钮；Escape / 外点 / 下滑关闭；body scroll 锁定 + 焦点返还（Radix）
 * 说明：官方基于 Base UI 实现；本组件基于 Radix Dialog 复刻同款行为与外观。
 */

interface DrawerProps {
  /** 受控打开状态 */
  show?: boolean;
  /** 关闭回调（Escape / 外点 / 下滑触发） */
  onDismiss?: () => void;
  /** 面板高度（px）；不传则按内容自适应 */
  height?: number;
  /** 面板内部滚动（内容超出 max-h 时） */
  verticalScroll?: boolean;
  /** 面板 className */
  className?: string;
  children?: React.ReactNode;
}

function Drawer({ show, onDismiss, height, verticalScroll, className, children }: DrawerProps) {
  const [dragY, setDragY] = React.useState(0);
  const startY = React.useRef<number | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const wasShownRef = React.useRef(false);
  const dragging = dragY > 0;

  React.useEffect(() => {
    if (show && !wasShownRef.current) {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!show && wasShownRef.current) {
      const target = restoreFocusRef.current;
      window.requestAnimationFrame(() => {
        if (target?.isConnected) target.focus();
      });
    }
    wasShownRef.current = Boolean(show);
  }, [show]);

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
    <DialogPrimitive.Root
      open={show}
      onOpenChange={(next) => {
        if (!next) onDismiss?.();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-slot="drawer"
          data-swipe-direction="down"
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 w-full touch-pan-y rounded-t-[10px] border-t border-gray-alpha-400 bg-background outline-none",
            "max-h-[90dvh] overscroll-none",
            verticalScroll && "overflow-y-auto",
            dragging && "select-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            className,
          )}
          style={
            {
              height: height ?? undefined,
              "--drawer-frontmost-height": height ? `${height}px` : undefined,
              "--drawer-swipe-movement-y": `${dragY}px`,
              transform: `translateY(${dragY}px)`,
              transition: dragging ? "none" : undefined,
            } as React.CSSProperties
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export { Drawer, DrawerTitle, DrawerDescription };
