import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * ExpandPanel — 基于 Radix Dialog 的参数化四向展开容器（HamburgerMenu 展开引擎）。
 * - side 决定展开来向与定位形态：
 *   top    → fixed inset-x-0 top-[var(--expand-anchor-bottom)] bottom-auto，
 *            只下圆角（rounded-b-lg）=「topbar 延伸落下」；anchorElement 存在时
 *            JS 测量 anchor.getBoundingClientRect().bottom 注入 CSS 变量
 *            --expand-anchor-bottom，面板宽度 = anchor 宽度。
 *   left   → fixed left-0 inset-y-0 rounded-r-lg，初始 -translate-x-full
 *   right  → 镜像（right-0 rounded-l-lg translate-x-full）
 *   bottom → 等价 Drawer 形态（inset-x-0 bottom-0 rounded-t-lg）
 * - 动画统一 500ms cubic-bezier(0.32,0.72,0,1)，motion-reduce:!transition-none。
 * - focus trap / Esc / 外点关闭由 Radix Dialog 自带。
 */

type Side = "top" | "bottom" | "left" | "right";

interface ExpandPanelProps {
  /** 展开来向 */
  side: Side;
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
  top: "fixed inset-x-0 top-[var(--expand-anchor-bottom,64px)] bottom-auto w-full rounded-b-lg border-b",
  left: "fixed left-0 inset-y-0 h-full w-[var(--expand-panel-width,auto)] min-w-64 rounded-r-lg border-r",
  right: "fixed right-0 inset-y-0 h-full rounded-l-lg border-l",
  bottom: "fixed inset-x-0 bottom-0 rounded-t-lg border-t",
};

/** 初始收起方向 transform ↔ 展开 translate-0 */
const SIDE_TRANSFORM_CLASSES: Record<Side, string> = {
  top: "-translate-y-full data-[state=open]:translate-y-0",
  bottom: "translate-y-full data-[state=open]:translate-y-0",
  left: "-translate-x-full data-[state=open]:translate-x-0",
  right: "translate-x-full data-[state=open]:translate-x-0",
};

function ExpandPanel({
  side,
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
  const [anchorStyle, setAnchorStyle] = React.useState<Record<string, string>>({});
  React.useLayoutEffect(() => {
    if (side !== "top" || !anchorElement) return;
    const measure = () => {
      const rect = anchorElement.getBoundingClientRect();
      setAnchorStyle({
        "--expand-anchor-bottom": `${rect.bottom}px`,
        "--expand-anchor-width": `${rect.width}px`,
        "--expand-anchor-left": `${rect.left}px`,
        top: `${rect.bottom}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        right: "auto",
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [side, anchorElement]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--ds-z-drawer)] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none motion-reduce:transition-none" />
        <DialogPrimitive.Content
          tabIndex={-1}
          data-slot="expand-panel"
          data-side={side}
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
            "z-[var(--ds-z-drawer)] overflow-y-auto overscroll-contain bg-background shadow-lg outline-none",
            "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:!transition-none",
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
