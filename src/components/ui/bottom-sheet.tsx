import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Grabber } from "@/components/ui/grabber";

/**
 * BottomSheet — 多档位（detent）底部弹层，基于 Radix Dialog 复刻
 * Geist Drawer 底部 sheet 外观（rounded-t / 四层 boxShadow / cubic-bezier(0.32,0.72,0,1)）。
 * - 面板高度 = detents[current] * 100dvh，由 CSS 变量 --sheet-h 驱动
 * - 面板顶缘跟手改高度 → 松手吸附最近档位（300ms cubic-bezier(0.32,0.72,0,1)）
 * - 低于最低档继续下拉且 collapseDown → onOpenChange(false)
 * - 背景点击 / Esc 关闭（Radix 自带）；motion-reduce 时 transition-none
 */

/**
 * 吸附纯函数：给定当前高度占视口比例与档位列表，返回最近档位的索引。
 */
function snapToDetent(offsetRatio: number, detents: number[]): number {
  let best = 0;
  for (let i = 1; i < detents.length; i++) {
    if (
      Math.abs(detents[i]! - offsetRatio) <
      Math.abs(detents[best]! - offsetRatio)
    ) {
      best = i;
    }
  }
  return best;
}

interface BottomSheetProps {
  /** 高度档位（占视口高度比例），默认 [0.5, 1] */
  detents?: number[];
  /**
   * 拖拽指示条渲染策略："automatic"（detents.length > 1 时渲染）/ true / false，
   * 默认 "automatic"。
   */
  showIndicator?: "automatic" | boolean;
  /** 手势开关，默认全开 */
  gestures?: {
    /** 是否允许拖拽调整高度 */
    resize?: boolean;
    /** 是否允许向上展开超过最高档的中间位移 */
    expandUp?: boolean;
    /** 低于最低档继续下拉时是否关闭 */
    collapseDown?: boolean;
  };
  /** 受控打开状态；不传则内部自管（受控双模） */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 吸附后档位变化回调 */
  onDetentChange?: (index: number) => void;
  className?: string;
  children?: React.ReactNode;
}

function BottomSheet({
  detents: detentsProp,
  showIndicator = "automatic",
  gestures,
  open: openProp,
  onOpenChange,
  onDetentChange,
  className,
  children,
}: BottomSheetProps) {
  const detents = React.useMemo(() => {
    const list = [...(detentsProp ?? [0.5, 1])].sort((a, b) => a - b);
    return list.length > 0 ? list : [0.5, 1];
  }, [detentsProp]);

  const isControlled = openProp !== undefined;
  const [openState, setOpenState] = React.useState(false);
  const open = isControlled ? openProp : openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const [current, setCurrent] = React.useState(0);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);
  // 拖拽中的实时比例（非受控瞬时态），null 表示未在拖拽
  const [dragRatio, setDragRatio] = React.useState<number | null>(null);
  const dragStart = React.useRef<{ y: number; ratio: number } | null>(null);

  const resizable = gestures?.resize !== false;
  const dragging = dragRatio !== null;
  const ratio = dragRatio ?? detents[current]!;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!resizable || event.button !== 0) return;
    dragStart.current = { y: event.clientY, ratio: detents[current]! };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || typeof window === "undefined") return;
    let next =
      dragStart.current.ratio +
      (event.clientY - dragStart.current.y) / window.innerHeight;
    if (gestures?.expandUp === false) next = Math.min(next, detents[detents.length - 1]!);
    setDragRatio(Math.max(0.05, next));
  };

  const endDrag = () => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const r = dragRatio;
    setDragRatio(null);
    if (r === null) return;
    if (r < detents[0]!) {
      // 低于最低档继续下拉 → 收起关闭
      if (gestures?.collapseDown !== false && r <= start.ratio) {
        setOpen(false);
        return;
      }
    }
    const idx = snapToDetent(r, detents);
    setCurrent(idx);
    onDetentChange?.(idx);
  };

  // showIndicator 渲染条件：!==false 且（automatic 时需多档位）
  const showGrabber =
    showIndicator === true ||
    (showIndicator === "automatic" && detents.length > 1);

  // P1：prefers-reduced-motion 下过渡归零（WCAG 2.3.3）
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--uni-z-drawer)] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none motion-reduce:transition-none" />
        <DialogPrimitive.Content
          tabIndex={-1}
          data-slot="bottom-sheet"
          data-resizable={resizable ? "true" : undefined}
          onOpenAutoFocus={() => {
            lastFocusedRef.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            const previous = lastFocusedRef.current;
            if (previous && previous.isConnected && previous !== document.body) {
              event.preventDefault();
              requestAnimationFrame(() => previous.focus());
            }
          }}
          className={cn(
            "fixed inset-x-0 bottom-0 z-[var(--uni-z-drawer)] w-full max-w-full touch-pan-y rounded-t-overlay border-t bg-background outline-none",
            "pb-[env(safe-area-inset-bottom)] overscroll-none",
            dragging && "select-none",
            // 弹出/收起动画（tw-animate-css）：animate-in/out 是触发器，
            // slide-in/out-from-bottom 设定位移变量；300ms 与拖拽吸附曲线一致。
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
            "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "motion-reduce:animate-none motion-reduce:transition-none",
            className,
          )}
          style={
            {
              "--sheet-h": `${ratio * 100}dvh`,
              height: "var(--sheet-h)",
              transition:
                dragging || reducedMotion
                  ? "none"
                  : "height 300ms cubic-bezier(0.32, 0.72, 0, 1)",
            } as React.CSSProperties
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {showGrabber && (
            <Grabber
              detentCount={detents.length}
              currentDetent={current}
              onCycleDetent={() => {
                const idx = (current + 1) % detents.length;
                setCurrent(idx);
                onDetentChange?.(idx);
              }}
            />
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { BottomSheet, snapToDetent };
export type { BottomSheetProps };
