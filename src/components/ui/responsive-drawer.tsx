import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Grabber } from "@/components/ui/grabber";
import { snapToDetent } from "@/components/ui/bottom-sheet";

/**
 * ResponsiveDrawer — 统一响应式抽屉家族（本地扩展，与官方镜像 Drawer / Sheet / BottomSheet 并存）。
 *
 * 边界：官方 Drawer 只做「底部固定高度」、BottomSheet 只做「底部多档位」，两者都不能
 * 表达「移动端底部 + 桌面端侧栏」的同一条信息架构。本组件补齐这一层，不改动既有三者。
 *
 * - placement：bottom / right / left / top 固定方位（默认 right）
 * - responsive：开启后 <sm 用 bottom、≥sm 用 right（与 placement 互斥，响应式优先）
 * - detents / showIndicator / gestures：沿用 BottomSheet 语义，仅 bottom 形态生效
 *   （吸附纯函数复用 BottomSheet 的 snapToDetent，拖拽手势只从 Grabber 启动）
 * - Header 内置关闭按钮；Body 独立滚动；Footer 移动端纵向倒序、桌面端右对齐横排
 * - 动效：大面积位移走 --uni-motion-expansive（500ms）+ ease-snap；拖拽跟手阶段零过渡
 */

type ResponsiveDrawerPlacement = "bottom" | "right" | "left" | "top";
type ResponsiveDrawerSize = "sm" | "md" | "lg";

interface ResponsiveDrawerGestureOptions {
  /** 是否允许拖拽调整高度 */
  resize?: boolean;
  /** 是否允许向上展开超过最高档的中间位移 */
  expandUp?: boolean;
  /** 低于最低档继续下拉时是否关闭 */
  collapseDown?: boolean;
}

interface ResponsiveDrawerProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "children"> {
  /** 响应式方位：<sm 底部、≥sm 右侧；开启后忽略 placement */
  responsive?: boolean;
  /** 固定方位，默认 "right" */
  placement?: ResponsiveDrawerPlacement;
  /** 底部形态的高度档位（占视口比例），默认 [0.5, 1] */
  detents?: number[];
  /** 拖拽指示条策略，默认 "automatic"（多档位时渲染） */
  showIndicator?: "automatic" | boolean;
  /** 手势开关，默认全开 */
  gestures?: ResponsiveDrawerGestureOptions;
  /** right / left 面板在 ≥sm 的宽度档位 */
  size?: ResponsiveDrawerSize;
  /** 吸附后档位变化回调 */
  onDetentChange?: (index: number) => void;
  /** 面板 className */
  className?: string;
  children?: React.ReactNode;
}

const DESKTOP_QUERY = "(min-width: 640px)";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches),
  );

  React.useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

const PLACEMENT_STYLES: Record<ResponsiveDrawerPlacement, string> = {
  bottom:
    "inset-x-0 bottom-0 w-full max-w-full max-h-[90dvh] rounded-t-overlay border-t pb-[env(safe-area-inset-bottom)] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  top: "inset-x-0 top-0 w-full max-w-full max-h-[90dvh] rounded-b-overlay border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  right:
    "inset-y-0 right-0 left-auto h-full w-3/4 max-w-full rounded-l-xl border-l sm:inset-y-2 sm:right-2 sm:h-auto sm:w-full sm:rounded-xl sm:border data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left: "inset-y-0 left-0 right-auto h-full w-3/4 max-w-full rounded-r-xl border-r sm:inset-y-2 sm:left-2 sm:h-auto sm:w-full sm:rounded-xl sm:border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
};

const SIZE_STYLES: Record<ResponsiveDrawerSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

interface ResponsiveDrawerContextValue {
  placement: ResponsiveDrawerPlacement;
  detents: number[];
  current: number;
  setCurrent: (index: number) => void;
  onDetentChange?: (index: number) => void;
  showIndicator: "automatic" | boolean;
  gestures?: ResponsiveDrawerGestureOptions;
  size: ResponsiveDrawerSize;
  panelClassName?: string;
}

const ResponsiveDrawerContext = React.createContext<ResponsiveDrawerContextValue>({
  placement: "right",
  detents: [0.5, 1],
  current: 0,
  setCurrent: () => {},
  showIndicator: "automatic",
  size: "md",
});

function ResponsiveDrawer({
  responsive = false,
  placement = "right",
  detents: detentsProp,
  showIndicator = "automatic",
  gestures,
  size = "md",
  onDetentChange,
  className,
  children,
  ...props
}: ResponsiveDrawerProps) {
  const detents = React.useMemo(() => {
    const list = [...(detentsProp ?? [0.5, 1])].sort((a, b) => a - b);
    return list.length > 0 ? list : [0.5, 1];
  }, [detentsProp]);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const resolvedPlacement: ResponsiveDrawerPlacement = responsive
    ? isDesktop
      ? "right"
      : "bottom"
    : placement;

  const [current, setCurrentState] = React.useState(0);
  const setCurrent = React.useCallback(
    (index: number) => {
      setCurrentState(index);
      onDetentChange?.(index);
    },
    [onDetentChange],
  );

  const contextValue = React.useMemo<ResponsiveDrawerContextValue>(
    () => ({
      placement: resolvedPlacement,
      detents,
      current,
      setCurrent,
      onDetentChange,
      showIndicator,
      gestures,
      size,
      panelClassName: className,
    }),
    [
      resolvedPlacement,
      detents,
      current,
      setCurrent,
      onDetentChange,
      showIndicator,
      gestures,
      size,
      className,
    ],
  );

  return (
    <ResponsiveDrawerContext.Provider value={contextValue}>
      <DialogPrimitive.Root data-slot="responsive-drawer" {...props}>
        {children}
      </DialogPrimitive.Root>
    </ResponsiveDrawerContext.Provider>
  );
}

const ResponsiveDrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="responsive-drawer-trigger"
    className={cn("cursor-pointer focus-ring", className)}
    {...props}
  />
));
ResponsiveDrawerTrigger.displayName = "ResponsiveDrawerTrigger";

function ResponsiveDrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const {
    placement,
    detents,
    current,
    setCurrent,
    showIndicator,
    gestures,
    size,
    panelClassName,
  } = React.useContext(ResponsiveDrawerContext);

  const isBottom = placement === "bottom";
  const resizable = gestures?.resize !== false;
  // 拖拽只从 Grabber 启动，故渲染条件即拖拽启用条件（与 BottomSheet 一致）
  const showGrabber =
    isBottom && resizable && (showIndicator === true || (showIndicator === "automatic" && detents.length > 1));

  const [dragRatio, setDragRatio] = React.useState<number | null>(null);
  const dragStart = React.useRef<{ y: number; ratio: number } | null>(null);
  const dragMoved = React.useRef(false);
  const closeAnchorRef = React.useRef<HTMLButtonElement | null>(null);
  const dragging = dragRatio !== null;
  const ratio = dragRatio ?? detents[current] ?? 1;

  const handleGrabberPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!showGrabber || event.button !== 0) return;
    dragStart.current = { y: event.clientY, ratio: detents[current] ?? 1 };
    dragMoved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGrabberPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current || typeof window === "undefined") return;
    // 面板贴底、高度向上生长：向上拖 → ratio 增大；向下拖 → ratio 减小
    const delta = event.clientY - dragStart.current.y;
    if (Math.abs(delta) > 4) dragMoved.current = true;
    let next = dragStart.current.ratio - delta / window.innerHeight;
    if (gestures?.expandUp === false) next = Math.min(next, detents[detents.length - 1] ?? 1);
    setDragRatio(Math.max(0.05, next));
  };

  const endDrag = () => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const released = dragRatio;
    setDragRatio(null);
    if (released === null) return;
    if (released < (detents[0] ?? 0) && gestures?.collapseDown !== false && released <= start.ratio) {
      // 低于最低档继续下拉 → 收起关闭；走 Radix Close 语义，onOpenChange 与焦点返还保持一致
      closeAnchorRef.current?.click();
      return;
    }
    setCurrent(snapToDetent(released, detents));
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="responsive-drawer-overlay"
        className="fixed inset-0 z-[var(--uni-z-drawer)] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none motion-reduce:transition-none"
      />
      <DialogPrimitive.Content
        tabIndex={-1}
        data-slot="responsive-drawer-content"
        data-placement={placement}
        className={cn(
          "fixed z-[var(--uni-z-drawer)] flex flex-col touch-pan-y overflow-hidden border-border bg-background shadow-[var(--material-shadow-menu)] outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-(--uni-motion-expansive) ease-snap",
          "motion-reduce:animate-none motion-reduce:transition-none",
          PLACEMENT_STYLES[placement],
          (placement === "right" || placement === "left") && SIZE_STYLES[size],
          dragging && "select-none",
          panelClassName,
          className,
        )}
        style={
          showGrabber
            ? ({
                height: `${ratio * 100}dvh`,
                transition:
                  dragging ? "none" : "height var(--uni-motion-overlay) var(--ease-snap)",
              } as React.CSSProperties)
            : undefined
        }
        {...props}
      >
        {/* 拖拽越界收起的隐藏锚点：仅承载 Radix Close 语义，不进入可访问树 */}
        <DialogPrimitive.Close ref={closeAnchorRef} hidden aria-hidden tabIndex={-1} type="button" />
        {showGrabber && (
          <Grabber
            detentCount={detents.length}
            currentDetent={current}
            onPointerDown={handleGrabberPointerDown}
            onPointerMove={handleGrabberPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onCycleDetent={() => {
              if (dragMoved.current) {
                dragMoved.current = false;
                return;
              }
              setCurrent((current + 1) % detents.length);
            }}
          />
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function ResponsiveDrawerHeader({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<"div"> & { showClose?: boolean }) {
  return (
    <div
      data-slot="responsive-drawer-header"
      className={cn(
        "flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
      {showClose && <ResponsiveDrawerClose className="-mt-1 -mr-2" />}
    </div>
  );
}

const ResponsiveDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="responsive-drawer-title"
    className={cn("text-heading-20 text-foreground", className)}
    {...props}
  />
));
ResponsiveDrawerTitle.displayName = "ResponsiveDrawerTitle";

const ResponsiveDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="responsive-drawer-description"
    className={cn("text-copy-14 text-muted-foreground", className)}
    {...props}
  />
));
ResponsiveDrawerDescription.displayName = "ResponsiveDrawerDescription";

function ResponsiveDrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-drawer-body"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4", className)}
      {...props}
    />
  );
}

function ResponsiveDrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

const ResponsiveDrawerClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, ref) => {
  const { t } = useI18n();
  return (
    <DialogPrimitive.Close
      ref={ref}
      data-slot="responsive-drawer-close"
      aria-label={children ? undefined : t("Close")}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--uni-motion-feedback) hover:bg-gray-alpha-200 hover:text-foreground focus-ring",
        className,
      )}
      {...props}
    >
      {children ?? <X className="size-4" aria-hidden />}
    </DialogPrimitive.Close>
  );
});
ResponsiveDrawerClose.displayName = "ResponsiveDrawerClose";

export {
  ResponsiveDrawer,
  ResponsiveDrawerTrigger,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerDescription,
  ResponsiveDrawerBody,
  ResponsiveDrawerFooter,
  ResponsiveDrawerClose,
};
export type {
  ResponsiveDrawerProps,
  ResponsiveDrawerPlacement,
  ResponsiveDrawerSize,
  ResponsiveDrawerGestureOptions,
};
