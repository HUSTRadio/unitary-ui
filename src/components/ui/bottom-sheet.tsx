import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Grabber } from "@/components/ui/grabber";
import { useSubFrame } from "@/components/ui/sub-frame";

/**
 * BottomSheet — 多档位（detent）底部弹层，本地扩展组件（官方 Geist 无对应页面）。
 *
 * 与 Drawer 的边界（有意保持两个组件，不合并）：Drawer 是官方 Drawer 的镜像，契约由
 * 官方文档固定（固定/自适应高度 + 仅受控 show/onDismiss）；本组件只承载官方没有的
 * 能力——多档位拖拽吸附，因此需要 detents/showIndicator/gestures 这组官方不存在的 API。
 * 两者外壳同族，通过共享 token 对齐，而不是合并实现：
 * - overlay：bg-[var(--uni-overlay-scrim-color)] + z-[var(--uni-z-drawer)]
 *   （暗化族 token，与 Drawer 逐字相同；HIG-AUD-010）；
 * - 面板圆角：rounded-t-overlay（与 CommandMenu 移动端 sheet 同族；Drawer 用 rounded-t-xl）。
 * 与 Drawer 的差异（勿"对齐"成一致）：本组件面板不叠 --material-shadow-*（面板贴视口
 * 底边、高度由档位驱动，浮层阴影属 Drawer 的固定高度语义），动画走 --uni-motion-overlay
 * 档、与拖拽吸附曲线一致（Drawer 官方实测为 500ms 滑入）。
 *
 * - 面板高度 = detents[current] * 100dvh，由 CSS 变量 --sheet-h 驱动
 * - 面板顶缘跟手改高度：**向上拖展开更高档，向下拖收起**（松手吸附最近档位，
 *   overlay 档时长（var(--uni-motion-overlay)）cubic-bezier(0.32,0.72,0,1)）；
 *   拖拽只从 Grabber 指示条启动，
 *   面板内容区不受 pointer capture 劫持（内部按钮的 click 正常派发）
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
  /**
   * 受控当前档位（`detents` 数组下标）；不传则内部自管（受控双模，HIG-AUD-018）。
   * 受控时拖拽吸附与点击切档**只上报** `onDetentChange`，组件不自行改档。
   */
  detent?: number;
  /** 吸附后档位变化回调（受控双模下也是唯一的状态上报通道） */
  onDetentChange?: (index: number) => void;
  /** 无可见标题时提供面板的可访问名称（HIG-AUD-040：Dialog 内容必须有名称）。 */
  "aria-label"?: string;
  /** 关联外部元素命名面板——如内容层渲染的标题所带的 id（ActivityView 即此用法）。 */
  "aria-labelledby"?: string;
  /**
   * 可选的局部浮层容器；档位比例和拖拽距离以容器高度为准。
   * 省略时继承最近的 SubFrame，显式传 null 则回到 document.body。
   */
  container?: HTMLElement | null;
  className?: string;
  children?: React.ReactNode;
}

function BottomSheet({
  detents: detentsProp,
  showIndicator = "automatic",
  gestures,
  open: openProp,
  onOpenChange,
  detent: detentProp,
  onDetentChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  container: containerProp,
  className,
  children,
}: BottomSheetProps) {
  // 未显式传 container 时继承最近的 SubFrame；显式传 container={null} 表示回到 document.body
  const frameContainer = useSubFrame();
  const container = containerProp === undefined ? frameContainer : containerProp;

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

  // 档位：与上面的 open 同款受控双模（HIG-AUD-018）
  const isDetentControlled = detentProp !== undefined;
  const [detentState, setDetentState] = React.useState(0);
  const detent = isDetentControlled ? detentProp : detentState;
  // 受控传值越界 / 非整数时钳到合法档位：否则 detents[out-of-range] 为 undefined，
  // ratio 变 NaN → 面板高度直接崩。上报侧（onDetentChange）仍给吸附后的真实下标。
  const detentIndex = Math.min(Math.max(Math.trunc(detent), 0), detents.length - 1);
  const setDetent = React.useCallback(
    (next: number) => {
      if (!isDetentControlled) setDetentState(next);
      onDetentChange?.(next);
    },
    [isDetentControlled, onDetentChange],
  );
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);
  // 拖拽中的实时比例（非受控瞬时态），null 表示未在拖拽
  const [dragRatio, setDragRatio] = React.useState<number | null>(null);
  const dragStart = React.useRef<{ y: number; ratio: number } | null>(null);
  // 拖拽发生过位移（>4px）时，松手后的合成 click 不是"点击切档"，需跳过
  const dragMoved = React.useRef(false);

  const resizable = gestures?.resize !== false;
  const dragging = dragRatio !== null;
  const ratio = dragRatio ?? detents[detentIndex]!;

  // 拖拽手势只挂在 Grabber 上（见渲染处）：若挂在面板 Content 上并 setPointerCapture，
  // pointerup 会被重定向到面板，浏览器不再给内部按钮派发 click——demo 的关闭按钮
  // 曾因此"点了没反应"。
  const handleGrabberPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizable || event.button !== 0) return;
    dragStart.current = { y: event.clientY, ratio: detents[detentIndex]! };
    dragMoved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGrabberPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current || typeof window === "undefined") return;
    // 面板贴底、高度向上生长：手指**向上**拖 → 高度增大（展开更高档）；
    // 手指**向下**拖 → 高度减小（顶缘跟随手指下移），低于最低档继续下拉 → 松手关闭。
    // 因此位移取负号——下拉（clientY 增大）必须让 ratio 变小。
    const delta = event.clientY - dragStart.current.y;
    if (Math.abs(delta) > 4) dragMoved.current = true;
    let next = dragStart.current.ratio - delta / (container?.clientHeight || window.innerHeight);
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
    // 受控双模：setDetent 内部决定是否写内部 state，并统一上报 onDetentChange
    setDetent(idx);
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
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay className={cn("inset-0 z-[var(--uni-z-drawer)] bg-[var(--uni-overlay-scrim-color)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none! motion-reduce:transition-none", container ? "absolute" : "fixed")} />
        <DialogPrimitive.Content
          tabIndex={-1}
          data-slot="bottom-sheet"
          data-resizable={resizable && showGrabber ? "true" : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
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
            "inset-x-0 bottom-0 z-[var(--uni-z-drawer)] w-full max-w-full touch-pan-y rounded-t-overlay border-t bg-background outline-none",
            container ? "absolute" : "fixed",
            "pb-[env(safe-area-inset-bottom)] overscroll-none",
            dragging && "select-none",
            // 弹出/收起动画（tw-animate-css）：animate-in/out 是触发器，
            // slide-in/out-from-bottom 设定位移变量；时长走 overlay 档、与拖拽吸附曲线一致。
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
            "duration-(--uni-motion-overlay) ease-snap",
            "motion-reduce:animate-none! motion-reduce:transition-none",
            className,
          )}
          style={
            {
              "--sheet-h": container ? `${ratio * 100}%` : `${ratio * 100}dvh`,
              height: "var(--sheet-h)",
              transition:
                dragging || reducedMotion
                  ? "none"
                  : "height var(--uni-motion-overlay) var(--ease-snap)",
            } as React.CSSProperties
            }
            >
          {showGrabber && (
            <Grabber
              detentCount={detents.length}
              currentDetent={detentIndex}
              onDetentChange={setDetent}
              onPointerDown={handleGrabberPointerDown}
              onPointerMove={handleGrabberPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onCycleDetent={() => {
                // 拖拽松手后的合成 click 不是"点击切档"
                if (dragMoved.current) {
                  dragMoved.current = false;
                  return;
                }
                const idx = (detentIndex + 1) % detents.length;
                setDetent(idx);
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
