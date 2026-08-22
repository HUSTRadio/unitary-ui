import type { CSSProperties } from "react";

/**
 * ControlLayout — 输入家族（Input / Textarea / Select / Combobox / MultiSelect /
 * SearchInput / ClearableInput）统一的尺寸 API。
 *
 * - 数字按 px 处理；字符串原样透传（%、rem、fit-content、clamp() 等合法 CSS 值）。
 * - 宽度属性与 flex 作用于**字段根容器**；
 * - 高度属性作用于**实际控件表面**（wrapper / 触发器）。
 */
export interface ControlLayout {
  width?: CSSProperties["width"];
  minWidth?: CSSProperties["minWidth"];
  maxWidth?: CSSProperties["maxWidth"];
  height?: CSSProperties["height"];
  minHeight?: CSSProperties["minHeight"];
  maxHeight?: CSSProperties["maxHeight"];
  flex?: CSSProperties["flex"];
}

/** 数字 → `${n}px`；字符串原样返回（调用方保证为合法 CSS 值）。 */
export function resolveLayoutValue(value: NonNullable<CSSProperties["width"]>): string {
  return typeof value === "number" ? `${value}px` : value;
}

/** 字段根容器样式：宽度三件套 + flex。无有效值时返回 undefined（不渲染多余 style）。 */
export function layoutRootStyle(layout?: ControlLayout): CSSProperties | undefined {
  if (!layout) return undefined;
  const style: CSSProperties = {};
  if (layout.width !== undefined) style.width = resolveLayoutValue(layout.width);
  if (layout.minWidth !== undefined) style.minWidth = resolveLayoutValue(layout.minWidth);
  if (layout.maxWidth !== undefined) style.maxWidth = resolveLayoutValue(layout.maxWidth);
  if (layout.flex !== undefined) style.flex = layout.flex;
  return Object.keys(style).length > 0 ? style : undefined;
}

/** 控件表面样式：高度三件套。无有效值时返回 undefined。 */
export function layoutSurfaceStyle(layout?: ControlLayout): CSSProperties | undefined {
  if (!layout) return undefined;
  const style: CSSProperties = {};
  if (layout.height !== undefined) style.height = resolveLayoutValue(layout.height);
  if (layout.minHeight !== undefined) style.minHeight = resolveLayoutValue(layout.minHeight);
  if (layout.maxHeight !== undefined) style.maxHeight = resolveLayoutValue(layout.maxHeight);
  return Object.keys(style).length > 0 ? style : undefined;
}
