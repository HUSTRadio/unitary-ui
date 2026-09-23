import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * ExpandPanel — 基于 Radix Dialog 的参数化四向展开容器（HamburgerMenu 展开引擎）。
 * - side 决定展开来向与定位形态：
 *   top    → fixed inset-x-0 top-[var(--expand-anchor-bottom)] bottom-auto，
 *            只下圆角（rounded-b-overlay，HIG 浮层 6px）=「topbar 延伸落下」；anchorElement 存在时
 *            JS 测量 anchor.getBoundingClientRect().bottom 注入 CSS 变量
 *            --expand-anchor-bottom，面板宽度 = anchor 宽度。
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
  /** 面板最大高（CSS 长度）。默认 side=top → 100dvh */
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
  top: "-translate-y-full data-[state=open]:translate-y-0 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom: "translate-y-full data-[state=open]:translate-y-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  left: "-translate-x-full data-[state=open]:translate-x-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  right: "translate-x-full data-[state=open]:translate-x-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
};

function ExpandPanel({
  side,
  belowTopbar = false,
  open,
  onOpenChange,
  anchorElement,
  maxHeight,
  maxWidth,
  className,
  children,
  "aria-label": ariaLabel,
}: ExpandPanelProps) {
  const horizontal = side === "left" || side === "right";
  const resolvedMaxHeight = maxHeight ?? (side === "top" ? "100dvh" : undefined);
  const resolvedMaxWidth = maxWidth ?? (horizontal ? "80vw" : undefined);

  // side=top + anchorElement：测量 anchor 底边/几何并注入 --expand-anchor-* 变量。
  // belowTopbar（侧滑）复用同一测量源：面板顶边贴 anchor 底边 → topbar 不被遮蔽。
  const [anchorStyle, setAnchorStyle] = React.useState<Record<string, string>>({});
  React.useLayoutEffect(() => {
    if (!(side === "top" || (horizontal && belowTopbar)) || !anchorElement) return;
    const measure = () => {
      const rect = anchorElement.getBoundingClientRect();
      setAnchorStyle({
        "--expand-anchor-bottom": `${rect.bottom}px`,
        "--expand-anchor-width": `${rect.width}px`,
        "--expand-anchor-left": `${rect.left}px`,
        ...(side === "top"
          ? {
              top: `${rect.bottom}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              right: "auto",
            }
          : {}),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [side, horizontal, belowTopbar, anchorElement]);

  // belowTopbar 模式：Radix Dialog 会对应用根节点施加 pointer-events:none（防外点交互），
  // 但本模式要求 topbar 保持可交互——挂 body 标记类，由 CSS 恢复 navbar 子树指针事件。
  React.useEffect(() => {
    if (!belowTopbar) return;
    document.body.classList.toggle("expand-panel-below-topbar", open === true);
    return () => document.body.classList.remove("expand-panel-below-topbar");
  }, [belowTopbar, open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-below-topbar={belowTopbar || undefined}
          className={cn(
            "fixed z-[var(--uni-z-drawer)] bg-[var(--uni-overlay-scrim-color)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none! motion-reduce:transition-none",
            belowTopbar
              ? // 仅遮蔽正文区：遮罩顶边 = navbar 底边，topbar 保持可见可交互
                "inset-x-0 bottom-0 top-[var(--expand-anchor-bottom,64px)]"
              : "inset-0",
          )}
        />
        <DialogPrimitive.Content
          tabIndex={-1}
          data-slot="expand-panel"
          data-side={side}
          data-below-topbar={belowTopbar || undefined}
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
            "data-[state=open]:animate-in data-[state=closed]:animate-out duration-(--uni-duration-slower) ease-snap motion-reduce:animate-none! motion-reduce:!transition-none",
            SIDE_CLASSES[side],
            SIDE_TRANSFORM_CLASSES[side],
            className,
          )}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ExpandPanel, SIDES };
export type { ExpandPanelProps, Side };
