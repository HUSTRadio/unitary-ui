import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Grid — 组件版网格布局容器（对应官方 Grid，docs/geist-markdown-refs/components/grid.md）。
 * 官方 GridSystem 引导线系统过重，组件版仅提供列数 + 间距两个维度：
 * - columns: 1 | 2 | 3 | 4 | 6 | 12 → grid-cols-N；
 *   或官方响应式对象 { sm, md, lg }（三个断点各自列数，sm 为移动端基准）
 * - gap: sm → gap-2 / md → gap-4 / lg → gap-6
 * - GridItem span: 1 | 2 | 3 | 4 | 6 | 12 → col-span-N（可选）
 * 官方 bestPractices：
 * - 普通 n 列响应式内容（卡片、列表）直接消费 Tailwind grid-cols-* 工具类即可，
 *   Grid 用于二维 cell-and-guide 布局；本组件版是轻量封装，同样适用。
 * - 不要嵌套 Grid 超过一层，引导线重叠会变成视觉噪音并破坏 cell 数学。
 * - 官方 Responsive grid：columns={{ sm: 1, md: 2, lg: 3 }} 三断点重排。
 */

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
export type GridGap = "sm" | "md" | "lg";
export type GridResponsiveCols = { sm?: GridCols; md?: GridCols; lg?: GridCols };

const GRID_COLS: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const GRID_SPANS: Record<GridCols, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  6: "col-span-6",
  12: "col-span-12",
};

const GRID_GAPS: Record<GridGap, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

function Grid({
  className,
  columns,
  gap = "md",
  ...props
}: React.ComponentProps<"div"> & {
  /** 列数或官方响应式对象 { sm, md, lg }（sm 为移动端基准） */
  columns?: GridCols | GridResponsiveCols;
  gap?: GridGap;
}) {
  const columnsValue = columns ?? 2;
  const columnsClass =
    typeof columnsValue === "number"
      ? GRID_COLS[columnsValue]
      : cn(
          GRID_COLS[columnsValue.sm ?? columnsValue.md ?? columnsValue.lg ?? 2],
          columnsValue.md && `md:${GRID_COLS[columnsValue.md]}`,
          columnsValue.lg && `lg:${GRID_COLS[columnsValue.lg]}`,
        );

  return (
    <div
      data-slot="grid"
      className={cn("grid", columnsClass, GRID_GAPS[gap], className)}
      {...props}
    />
  );
}

function GridItem({
  className,
  span,
  ...props
}: React.ComponentProps<"div"> & {
  span?: GridCols;
}) {
  return (
    <div data-slot="grid-item" className={cn(span && GRID_SPANS[span], className)} {...props} />
  );
}

export { Grid, GridItem };
