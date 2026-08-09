import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Sheet — Geist 官方 Sheet 封装（基于 Radix Dialog 原语）。
 * 导出：Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
 *       SheetDescription, SheetFooter, SheetClose。
 * 侧边滑出面板：默认从右侧滑入，可通过 side 切换 top / right / bottom / left。
 * 材质对齐 Geist 实测（2026-08）：
 * - overlay：bg-black/50
 * - content：bg-background w-full max-w-sm h-full p-6，
 *   border-l border-gray-alpha-400 shadow-[var(--material-shadow-modal)]
 * - title：text-heading-20 text-foreground
 * - description：text-copy-14 text-muted-foreground
 * - close：右上角 ghost icon button
 * 官方语义（docs/geist-markdown-refs/components/sheet.md）：
 * - SheetContent 支持 noOverlay prop（true 时不渲染遮罩，内容仍为 modal）
 * - modal 语义由 Radix modal prop 透传（本组件默认 true，保持遮罩/焦点陷阱/
 *   滚动锁定；官方默认 modal=false，需要时可显式传 <Sheet modal={false}>）
 * - 官方 BP：点击外部不自动关闭（本组件默认阻止 outside-click 关闭），
 *   始终提供显式关闭按钮并响应 Escape
 * 动画：data-[state=open]:animate-in / data-[state=closed]:animate-out
 */

type SheetSide = "top" | "right" | "bottom" | "left";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SIDE_STYLES: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 w-full border-b",
  right: "inset-y-0 right-0 h-full w-full max-w-sm border-l",
  bottom: "inset-x-0 bottom-0 w-full border-t",
  left: "inset-y-0 left-0 h-full w-full max-w-sm border-r",
};

const SIDE_ANIM: Record<SheetSide, string> = {
  top: "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  right: "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  bottom: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  left: "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
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
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-[var(--material-shadow-modal)] outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        SIDE_STYLES[side],
        SIDE_ANIM[side],
        className,
      )}
      onPointerDownOutside={(event) => event.preventDefault()}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity outline-none hover:bg-gray-alpha-200 hover:text-foreground hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
        <X className="size-4" aria-hidden />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
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
