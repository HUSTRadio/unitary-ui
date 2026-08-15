import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Sheet — Geist 官方 Sheet 封装（基于 Radix Dialog 原语）。
 * 导出：Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
 *       SheetDescription, SheetFooter, SheetClose。
 * 侧边滑出面板：通过 side 切换 top / right / bottom / left。
 *
 * 组件默认值对齐官方实测（2026-08-15，vercel.com/geist/sheet，live DOM + computed）：
 * - modal 默认 false（官方 Best Practices「Sheet defaults to modal=false」；
 *   页面保持可交互、不锁滚动、outside-click 不关闭）
 * - overlay：bg-[var(--ds-overlay-backdrop-color)] @ opacity-0.8（light #f2f2f2 / dark #000）
 * - content 公共：gap-4 bg-background-100 p-6，fixed z-[var(--ds-z-drawer)]，
 *   shadow-[var(--ds-shadow-modal-elevated)]，transition ease-in-out
 * - side 默认几何（组件默认值，非 demo 覆盖）：
 *   top/bottom：inset-x-0 全宽，无圆角无 margin
 *   right/left：inset-y-0 w-3/4 sm:max-w-sm h-full，无圆角无 margin
 * - 官方不内置关闭按钮；消费者用 <SheetClose asChild> 显式提供
 * - 动画：data-[state=open]:slide-in-from-<side>-5 / closed:slide-out-to-<side>-10
 */
type SheetSide = "top" | "right" | "bottom" | "left";

/** Sheet Root：官方默认 modal=false（Best Practices），可显式 <Sheet modal> 覆盖。 */
const Sheet = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>(({ modal = false, ...props }, ref) => (
  <DialogPrimitive.Root ref={ref} modal={modal} {...props} />
));
Sheet.displayName = "Sheet";

const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-[var(--ds-z-drawer)] bg-[var(--ds-overlay-backdrop-color)] opacity-[var(--ds-overlay-backdrop-opacity)]",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

/** 官方 side 默认定位 + 动画（slide-in 5% / slide-out 10%）。 */
const SIDE_STYLES: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 data-[state=open]:slide-in-from-top-5 data-[state=closed]:slide-out-to-top-10",
  right:
    "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm data-[state=open]:slide-in-from-right-5 data-[state=closed]:slide-out-to-right-10",
  bottom:
    "inset-x-0 bottom-0 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:slide-out-to-bottom-10",
  left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm data-[state=open]:slide-in-from-left-5 data-[state=closed]:slide-out-to-left-10",
};

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide;
  /** 不渲染遮罩层（官方 noOverlay prop） */
  noOverlay?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = "right", noOverlay = false, ...props }, ref) => (
  <SheetPortal>
    {!noOverlay && <SheetOverlay />}
    <DialogPrimitive.Content
      ref={ref}
      data-slot="sheet-content"
      className={cn(
        "fixed z-[var(--ds-z-drawer)] gap-4 bg-background-100 p-6 shadow-[var(--ds-shadow-modal-elevated)] transition ease-in-out focus:outline-none",
        "data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=closed]:fade-out-0",
        SIDE_STYLES[side],
        className,
      )}
      onPointerDownOutside={(event) => event.preventDefault()}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />
  ),
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  ),
);
SheetFooter.displayName = "SheetFooter";

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
};
