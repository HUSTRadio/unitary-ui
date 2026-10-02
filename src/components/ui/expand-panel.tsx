import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { useSubFrame } from "@/components/ui/sub-frame";

/**
 * ExpandPanel — 基于 Radix Dialog 的参数化四向展开容器（HamburgerMenu 展开引擎）。
 * - side 决定展开来向与定位形态：
 *   top    → fixed inset-x-0 top-[var(--expand-anchor-bottom)] bottom-auto，
 *            只下圆角（rounded-b-overlay，HIG 浮层 6px）=「topbar 延伸落下」；anchorElement 存在时
 *            JS 测量 anchor.getBoundingClientRect().bottom 注入 CSS 变量
 *            --expand-anchor-bottom，面板宽度 = anchor 宽度。此形态下面板顶边即锚点
 *            底边，浮层（遮罩顶边 + 进出场）整体以该边为界：顶边固定、由 clip-path
 *            向下展开，不再整体上移掠过锚点（否则面板会从容器/文档顶部掉下来遮住
 *            topbar），向上也不绘制阴影（见 index.css 的锚点 clip-path 规则）。
 *   left   → fixed left-0 inset-y-0 rounded-r-overlay，初始 -translate-x-full；
 *            belowTopbar 时顶/底/左三边贴合（anchor 底边、视口底、视口左缘），
 *            故该分支降为 rounded-none（贴合边的圆角只会留下缺口）
 *   right  → 镜像（right-0 rounded-l-overlay translate-x-full）
 *   bottom → 等价 Drawer 形态（inset-x-0 bottom-0 rounded-t-overlay）
 * - 动画统一 500ms cubic-bezier(0.32,0.72,0,1)，motion-reduce:!transition-none。
 * - focus trap / Esc / 外点关闭由 Radix Dialog 自带。
 */

type Side = "top" | "bottom" | "left" | "right";

interface ExpandPanelProps {
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  /** 展开来向 */
  side: Side;
  /**
   * 面板顶边下移到 anchor 底边（--expand-anchor-bottom，默认 64px），
   * 只遮蔽正文区、不遮蔽 topbar。需配合 anchorElement（side=top 同源测量）或
   * 依赖 64px 默认值使用；仅 side=left/right 有意义。
   */
  belowTopbar?: boolean;
  /** 受控打开状态（不传则非受控，配合 onOpenChange 使用） */
  open?: boolean;
  /** 开关回调（Esc / 外点关闭也会触发） */
  onOpenChange?: (open: boolean) => void;
  /**
   * side=top 时的定位锚元素：面板顶边对齐其 getBoundingClientRect().bottom，
   * 宽度与其一致（「navbar 延伸落下」关键）。
   */
  anchorElement?: HTMLElement | null;
  /**
   * 可选的局部浮层容器；省略时继承最近的 SubFrame（没有则相对视口定位），
   * 显式传 null 可强制回到视口定位。
   */
  container?: HTMLElement | null;
  /** 面板最大高（CSS 长度）。默认 side=top → 100dvh；局部容器内则限制到剩余高度。 */
  maxHeight?: string;
  /** 面板最大宽（CSS 长度）。默认横向（left/right）→ 80vw */
  maxWidth?: string;
  className?: string;
  children?: React.ReactNode;
  /** 无可见 Title 时提供面板可访问名称 */
  "aria-label"?: string;
}

const SIDES: readonly Side[] = ["top", "bottom", "left", "right"];

/** 定位矩阵：各方向的面板定位/圆角/初始 transform 类 */
const SIDE_CLASSES: Record<Side, string> = {
  // 只下圆角 = navbar 视觉延伸；顶部无圆角、贴住锚底边
  top: "fixed inset-x-0 top-[var(--expand-anchor-bottom,64px)] bottom-auto w-full rounded-b-overlay border-b",
  // belowTopbar：顶边贴 anchor 底边、底边贴视口底、左边贴视口左缘——三边贴合，
  // 圆角只会在接缝处留下缺口，故降为全直角（用户实测：tr/br 各 6px 时与 topbar
  // 底边、屏幕底边形成割裂）
  left: "fixed left-0 inset-y-0 h-full w-[var(--expand-panel-width,auto)] min-w-64 rounded-r-overlay border-r data-[below-topbar]:inset-y-auto data-[below-topbar]:bottom-0 data-[below-topbar]:h-auto data-[below-topbar]:top-[var(--expand-anchor-bottom,64px)] data-[below-topbar]:rounded-none",
  right: "fixed right-0 inset-y-0 h-full rounded-l-overlay border-l",
  bottom: "fixed inset-x-0 bottom-0 rounded-t-overlay border-t",
};

/** 初始收起方向 transform ↔ 展开 translate-0 */
const SIDE_TRANSFORM_CLASSES: Record<Side, string> = {
  top: "-translate-y-full data-[motion-state=open]:translate-y-0",
  bottom: "translate-y-full data-[motion-state=open]:translate-y-0",
  left: "-translate-x-full data-[motion-state=open]:translate-x-0",
  right: "translate-x-full data-[motion-state=open]:translate-x-0",
};

function ExpandPanel({
  side,
  belowTopbar = false,
  open,
  onOpenChange,
  anchorElement,
  container: containerProp,
  maxHeight,
  maxWidth,
  className,
  children,
  "aria-label": ariaLabel,
  triggerRef,
}: ExpandPanelProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [present, setPresent] = React.useState(Boolean(open));
  const [motionOpen, setMotionOpen] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;

  // 保留退出中的节点，让 CSS 从当前进度反转；重新打开会取消旧的卸载计时器。
  // Retain the exiting node so transitions reverse from their current position.
  React.useLayoutEffect(() => {
    if (open) {
      setPresent(true);
      // Flush the initial closed style before the first opening transition.
      contentRef.current?.getBoundingClientRect();
      const frame = requestAnimationFrame(() => setMotionOpen(true));
      return () => cancelAnimationFrame(frame);
    }
    setMotionOpen(false);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const durations = contentRef.current
      ? getComputedStyle(contentRef.current)
          .transitionDuration.split(",")
          .map((value) => parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000))
      : [];
    const duration = reduced ? 0 : Math.max(0, ...durations.filter(Number.isFinite)) || 500;
    const timer = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timer);
  }, [open]);
  // 未显式传 container 时继承最近的 SubFrame；显式传 null 表示回到视口定位
  const frameContainer = useSubFrame();
  const container = containerProp === undefined ? frameContainer : containerProp;

  const horizontal = side === "left" || side === "right";
  // side=top 且提供锚点：面板顶边 = 锚点（topbar）底边，浮层整体以该边为界——
  // 遮罩不压暗 topbar、面板也不整体上移掠过它（否则会像从文档顶部掉下来）。
  const anchoredDrop = side === "top" && !!anchorElement;
  const boundedByTopbar = belowTopbar || anchoredDrop;
  const resolvedMaxHeight = maxHeight ?? (side === "top" && !container ? "100dvh" : undefined);
  const resolvedMaxWidth = maxWidth ?? (horizontal ? "80vw" : undefined);

  // side=top + anchorElement：测量 anchor 底边/几何并注入 --expand-anchor-* 变量。
  // belowTopbar（侧滑）复用同一测量源：面板顶边贴 anchor 底边 → topbar 不被遮蔽。
  const [anchorStyle, setAnchorStyle] = React.useState<Record<string, string>>({});
  // 同一次测量的纯变量投影：遮罩是面板的兄弟节点，拿不到 Content 上的内联变量，
  // 需独立挂载，否则 belowTopbar/锚点顶边只能回落到 64px 默认值。
  const [anchorVars, setAnchorVars] = React.useState<Record<string, string>>({});
  React.useLayoutEffect(() => {
    if (!(side === "top" || (horizontal && belowTopbar)) || !anchorElement) return;
    const measure = () => {
      const rect = anchorElement.getBoundingClientRect();
      const frame = container?.getBoundingClientRect();
      const top = rect.bottom - (frame?.top ?? 0) - (container?.clientTop ?? 0);
      const left = rect.left - (frame?.left ?? 0) - (container?.clientLeft ?? 0);
      const vars = {
        "--expand-anchor-bottom": `${top}px`,
        "--expand-anchor-width": `${rect.width}px`,
        "--expand-anchor-left": `${left}px`,
      };
      setAnchorVars(vars);
      setAnchorStyle({
        ...vars,
        ...(side === "top"
          ? {
              top: `${top}px`,
              left: `${left}px`,
              width: `${rect.width}px`,
              right: "auto",
              ...(container ? { maxHeight: `${Math.max(0, container.clientHeight - top)}px` } : {}),
            }
          : {}),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    if (container) window.addEventListener("scroll", measure, true);
    const observer =
      container && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (container) observer?.observe(container);
    return () => {
      window.removeEventListener("resize", measure);
      if (container) window.removeEventListener("scroll", measure, true);
      observer?.disconnect();
    };
  }, [side, horizontal, belowTopbar, anchorElement, container]);

  // 浮层以 topbar 底边为界时（belowTopbar 侧滑、或 side=top 的锚点落下），
  // Radix Dialog 会对应用根节点施加 pointer-events:none（防外点交互），
  // 但本模式要求 topbar 保持可交互——挂 body 标记类，由 CSS 恢复 navbar 子树指针事件。
  React.useEffect(() => {
    if (!boundedByTopbar) return;
    document.body.classList.toggle("expand-panel-below-topbar", present || open === true);
    return () => document.body.classList.remove("expand-panel-below-topbar");
  }, [boundedByTopbar, open, present]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {(open || present) && (
        <DialogPrimitive.Portal container={container} forceMount>
          <DialogPrimitive.Overlay
            forceMount
            data-motion-state={motionOpen ? "open" : "closed"}
            data-below-topbar={belowTopbar || undefined}
            style={anchorVars as React.CSSProperties}
            className={cn(
              "z-[var(--uni-z-drawer)] bg-[var(--uni-overlay-scrim-color)] opacity-0 data-[motion-state=open]:opacity-100 transition-opacity duration-(--uni-duration-slower) ease-snap motion-reduce:transition-none",
              container ? "absolute" : "fixed",
              boundedByTopbar
                ? // 仅遮蔽正文区：遮罩顶边 = 锚点底边，topbar 保持可见可交互、不被压暗
                  "inset-x-0 bottom-0 top-[var(--expand-anchor-bottom,64px)]"
                : "inset-0",
            )}
          />
          <DialogPrimitive.Content
            forceMount
            ref={contentRef}
            tabIndex={-1}
            data-slot="expand-panel"
            data-motion-state={motionOpen ? "open" : "closed"}
            inert={!open || undefined}
            aria-hidden={!open || undefined}
            aria-describedby={undefined}
            onInteractOutside={(event) => {
              // Trigger pointerdown belongs to its click, not outside dismissal.
              if (triggerRef?.current?.contains(event.target as Node)) event.preventDefault();
            }}
            onCloseAutoFocus={(event) => {
              if (!triggerRef) return;
              event.preventDefault();
              if (!openRef.current) triggerRef.current?.focus();
            }}
            onTransitionEnd={(event) => {
              if (event.target === event.currentTarget && !openRef.current) setPresent(false);
            }}
            data-side={side}
            data-below-topbar={belowTopbar || undefined}
            data-drop-from-anchor={anchoredDrop || undefined}
            aria-label={ariaLabel}
            style={
              {
                maxHeight: resolvedMaxHeight,
                maxWidth: resolvedMaxWidth,
                // side=left/right 时把 maxWidth 同时作为目标宽度（侧滑面板应为固定宽卡片，
                // 而非由内容撑开的窄条）；auto 值不注入，保持内容自适应
                ...(horizontal && resolvedMaxWidth && resolvedMaxWidth !== "auto"
                  ? { width: resolvedMaxWidth }
                  : {}),
                ...anchorStyle,
              } as React.CSSProperties
            }
            className={cn(
              // 触摸滚动跟随手指：touch-action: pan-y 明确声明仅垂直平移，避免
              // 浏览器把横向/组合手势交给 body 导致内容反向。不设 overscroll-contain
              // （它在部分 WebView 上会反转拖拽方向，手指上拖内容反向下移）。
              "z-[var(--uni-z-drawer)] touch-pan-y overflow-y-auto bg-background shadow-lg outline-none",
              "transition-[translate,clip-path] duration-(--uni-duration-slower) ease-snap motion-reduce:!transition-none",
              SIDE_CLASSES[side],
              container && "absolute",
              // 锚点落下：顶边固定在锚点底边、由 clip-path 向下展开（见 index.css
              // 锚点 clip-path 规则）。不走 translate 位移——整体上移会让面板从
              // 容器顶部掠过 topbar 掉下来（用户实测）。
              anchoredDrop ? undefined : SIDE_TRANSFORM_CLASSES[side],
              className,
            )}
          >
            <DialogPrimitive.Title className="sr-only">
              {ariaLabel ?? "Panel"}
            </DialogPrimitive.Title>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}

export { ExpandPanel, SIDES };
export type { ExpandPanelProps, Side };
