import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 布局原语 —— Apple HIG「Layout & Organization」的 Geist 化落地。
 *
 * 两个原语都是**纯容器**：不含交互、状态与 ARIA 角色，只输出安全区内边距与间距方向。
 * 与 Grid（栅格组件）、Scroller（滚动容器）等"有语义的容器"保持边界——
 * 这里的价值是**统一档位**，避免每个调用方自己写随机的 padding / gap 值。
 *
 * - `SafeArea`：安全区边距容器。内边距取「间距档」与设备安全区（`env(safe-area-inset-*)`）
 *   的较大值，内容因此不会被圆角、刘海或系统栏遮挡。
 * - `Stack`：方向 + 间距堆叠。语义化的 flex 预设（direction / gap / align / justify / wrap）。
 */

export type LayoutSpacing = "xs" | "sm" | "md" | "lg" | "xl";

export type SafeAreaEdge = "top" | "right" | "bottom" | "left" | "all";

/** 间距档 → 具体长度（便于与安全区 env() 取最大值）。 */
const SPACING_VALUE: Record<LayoutSpacing, string> = {
  xs: "calc(var(--spacing) * 1)",
  sm: "calc(var(--spacing) * 2)",
  md: "calc(var(--spacing) * 4)",
  lg: "calc(var(--spacing) * 6)",
  xl: "calc(var(--spacing) * 8)",
};

const STACK_GAP_CLASS: Record<LayoutSpacing, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export interface SafeAreaProps extends React.ComponentProps<"div"> {
  /** 应用安全区边距的边；"all" 或未传表示四边 */
  edges?: SafeAreaEdge | readonly SafeAreaEdge[];
  /** 间距档（与安全区取较大值），默认 "md" */
  padding?: LayoutSpacing;
}

function SafeArea({ edges = "all", padding = "md", className, style, ...props }: SafeAreaProps) {
  const list = Array.isArray(edges) ? edges : [edges];
  const has = (edge: SafeAreaEdge) => list.includes("all") || list.includes(edge);
  const spacing = SPACING_VALUE[padding];

  return (
    <div
      data-slot="safe-area"
      data-edges={Array.isArray(edges) ? edges.join(" ") : edges}
      style={{
        paddingTop: has("top") ? `max(${spacing}, env(safe-area-inset-top))` : undefined,
        paddingRight: has("right") ? `max(${spacing}, env(safe-area-inset-right))` : undefined,
        paddingBottom: has("bottom") ? `max(${spacing}, env(safe-area-inset-bottom))` : undefined,
        paddingLeft: has("left") ? `max(${spacing}, env(safe-area-inset-left))` : undefined,
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

export interface StackProps extends React.ComponentProps<"div"> {
  /** 堆叠方向，默认 "column" */
  direction?: "row" | "column";
  /** 间距档，默认 "md" */
  gap?: LayoutSpacing;
  /** 交叉轴对齐 */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** 主轴分布 */
  justify?: "start" | "center" | "end" | "between";
  /** 允许换行 */
  wrap?: boolean;
}

const STACK_ALIGN_CLASS: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const STACK_JUSTIFY_CLASS: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

function Stack({
  direction = "column",
  gap = "md",
  align,
  justify,
  wrap,
  className,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      data-direction={direction}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        STACK_GAP_CLASS[gap],
        align && STACK_ALIGN_CLASS[align],
        justify && STACK_JUSTIFY_CLASS[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

export { SafeArea, Stack };
