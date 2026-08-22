import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton — 加载占位骨架（docs/geist-markdown-refs/components/skeleton.md 官方语义）。
 * 导出：Skeleton。
 *
 * 官方 API：
 * - width / height / boxHeight：尺寸（number 视为 px，或 CSS 字符串）。
 *   包裹 children 且未给尺寸时，按 children 自动计算；给固定尺寸时展开/收起不回流。
 * - pill / rounded / squared：胶囊 / 圆角 8px / 直角 形状变体（默认 rounded-md）。
 * - animated：是否播放 pulse 动画（默认 true），配合全局 prefers-reduced-motion。
 * - button：按钮形态，外加 1px 边框贴合按钮外框。
 * - show：是否显示骨架（默认 true）。true 时 children 以 visibility:hidden 隐藏
 *   （仍占位、不可聚焦）；false 时显示真实 children 并保留盒子尺寸。
 * 材质对齐 Geist 实测：animate-pulse + bg-gray-alpha-200（light rgba(0,0,0,0.08) /
 * dark rgba(255,255,255,0.09)）。
 */

type Size = number | string;

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /** 骨架宽度（number 视为 px） */
  width?: Size;
  /** 骨架高度（number 视为 px） */
  height?: Size;
  /** 包裹 children 时盒子高度（number 视为 px），与 height 等价 */
  boxHeight?: Size;
  /** 胶囊形状（圆角全满） */
  pill?: boolean;
  /** 圆角 8px */
  rounded?: boolean;
  /** 直角 */
  squared?: boolean;
  /** 是否播放 pulse 动画（默认 true） */
  animated?: boolean;
  /** 按钮形态：外加 1px 边框 */
  button?: boolean;
  /** 是否显示骨架（默认 true；false 时显示 children 并保留尺寸） */
  show?: boolean;
}

const toSize = (value: Size) => (typeof value === "number" ? `${value}px` : value);

function Skeleton({
  className,
  width,
  height,
  boxHeight,
  pill,
  rounded,
  squared,
  animated = true,
  button,
  show = true,
  children,
  style,
  ...props
}: SkeletonProps) {
  const boxStyle = React.useMemo<React.CSSProperties>(() => {
    const next: React.CSSProperties = {};
    if (width != null) next.width = toSize(width);
    const resolvedHeight = height ?? boxHeight;
    if (resolvedHeight != null) {
      next.height = toSize(resolvedHeight);
    } else if (children == null && width != null) {
      // 无 children 且只给宽度时，给一个文本行默认高度
      next.height = "16px";
    }
    return next;
  }, [width, height, boxHeight, children]);

  return (
    <div
      data-slot="skeleton"
      data-show={show || undefined}
      className={cn(
        "inline-flex flex-initial",
        show && [
          animated && "animate-pulse",
          "rounded-md bg-gray-alpha-200",
          pill && "rounded-full",
          rounded && "rounded-[8px]",
          squared && "rounded-none",
          button && "border border-gray-alpha-400",
        ],
        !show && !button && "rounded-md",
        className,
      )}
      style={{ ...boxStyle, ...style }}
      {...props}
    >
      {children != null && <div className={cn(show && "invisible")}>{children}</div>}
    </div>
  );
}

export { Skeleton };
