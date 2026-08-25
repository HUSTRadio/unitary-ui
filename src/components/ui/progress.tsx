import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * Progress — Geist 官方 Progress 规范（docs/geist-markdown-refs/components/progress.md + 官方页面实测）。
 * 原生 <progress> + appearance-none + 伪元素定制（结构对齐官方，非 Radix div）。
 *
 * 官方实测（vercel.com/geist/progress）：
 * - 原生 <progress>，默认高 10px、圆角 6px、轨道 bg-gray-200
 * - 填充色由 --fg CSS 变量控制：默认 gray-1000（前景色）、
 *   type="success" → blue-700 / "error" → red-700 / "warning" → amber-700 / "secondary" → gray-700
 * - colors 阈值色阶：取 <= value 的最大阈值颜色
 * - width / height 透传；value=null 时原生 indeterminate（无 value 属性）
 * - stops：多阶段刻度标记（官方 With Stops demo）。每个 stop 在 value/max 比例处渲染
 *   双 1px 竖线（gray-alpha-600 + background-100）+ 可聚焦 tooltip 热区；有 stops 时填充去圆角。
 */

export type ProgressType = "success" | "error" | "warning" | "secondary";

/** 标签位置：8 方位。left/right 与进度条垂直居中对齐（flex items-center） */
export type ProgressLabelPosition =
  | "left"
  | "right"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ProgressStop {
  value: number;
  tooltip?: string;
  /**
   * 无障碍名称，渲染到可聚焦触发 span 的 aria-label。
   * 官方 Best Practices：每个 stop 都应命名（如 Build complete、Tests complete），
   * 使进度条在不依赖视觉的情况下可导航。
   */
  ariaLabel?: string;
}

/** 官方 type 映射（--fg 值，实测）：success=blue-700、error=red-700、warning=amber-700、secondary=gray-700 */
const TYPE_FG: Record<ProgressType, string> = {
  success: "var(--color-progress)",
  error: "var(--color-destructive)",
  warning: "var(--color-warning)",
  secondary: "var(--color-gray-700)",
};

/** 阈值色阶：取 <= value 的最大阈值颜色，无匹配回退最小阈值 */
function resolveThresholdColor(value: number, colors: Record<string, string>): string | undefined {
  const entries = Object.entries(colors)
    .map(([threshold, color]) => [Number(threshold), color] as const)
    .filter(([threshold]) => Number.isFinite(threshold))
    .sort((a, b) => a[0] - b[0]);
  let matched: string | undefined;
  for (const [threshold, color] of entries) {
    if (threshold <= value) matched = color;
  }
  return matched ?? entries[0]?.[1];
}

export interface ProgressProps extends Omit<React.ComponentProps<"progress">, "max" | "value"> {
  value?: number | null;
  max?: number;
  type?: ProgressType;
  colors?: Record<string, string>;
  width?: number | string;
  height?: number;
  stops?: ProgressStop[];
  /** 标签内容；配合 labelPosition 决定位置。label 缺省时无标签层，行为与原实现一致 */
  label?: React.ReactNode;
  /** 标签位置（默认 bottom-left，即「文字在进度条下左」）。left/right 与进度条垂直居中 */
  labelPosition?: ProgressLabelPosition;
  /**
   * value 变化时填充宽度是否平滑过渡（300ms ease-out）。默认 true（连续进度更自然）；
   * 传 false 为瞬时跳变。prefers-reduced-motion 下自动降级为无动画。
   */
  animated?: boolean;
}

function Progress({
  className,
  value,
  max = 100,
  type,
  colors,
  width,
  height,
  stops,
  label,
  labelPosition = "bottom-left",
  animated = true,
  ...props
}: ProgressProps) {
  const fg =
    type !== undefined
      ? TYPE_FG[type]
      : colors && value != null
        ? resolveThresholdColor(value, colors)
        : "var(--color-gray-1000)";

  const resolvedHeight = height ?? 10;
  const hasStops = stops !== undefined && stops.length > 0;
  /** left/right 位置时标签与进度条同行，进度条占剩余宽度（flex-1） */
  const inlineLabel =
    label !== undefined && (labelPosition === "left" || labelPosition === "right");

  const bar = (
    <progress
      data-slot="progress"
      value={value ?? undefined}
      max={max}
      className={cn(
        "block w-full appearance-none overflow-hidden rounded-[6px] border-0 bg-gray-200",
        "[&::-webkit-progress-bar]:rounded-[6px] [&::-webkit-progress-bar]:bg-gray-200",
        "[&::-webkit-progress-value]:rounded-[6px] [&::-webkit-progress-value]:bg-[var(--fg)]",
        "[&::-moz-progress-bar]:rounded-[6px] [&::-moz-progress-bar]:bg-[var(--fg)]",
        hasStops &&
          "[&::-webkit-progress-value]:!rounded-none [&::-moz-progress-bar]:!rounded-none",
        animated &&
          "[&::-webkit-progress-value]:transition-[width,background-color] [&::-webkit-progress-value]:duration-(--uni-duration-slow) [&::-webkit-progress-value]:ease-out [&::-webkit-progress-value]:motion-reduce:transition-none [&::-moz-progress-bar]:transition-[width,background-color] [&::-moz-progress-bar]:duration-(--uni-duration-slow) [&::-moz-progress-bar]:ease-out [&::-moz-progress-bar]:motion-reduce:transition-none",
        inlineLabel && "min-w-0 flex-1",
        className,
      )}
      style={{
        width: inlineLabel ? undefined : width,
        height: resolvedHeight,
        ["--fg" as string]: fg,
      }}
      {...props}
    />
  );

  const core = hasStops ? (
    <div
      className={cn("relative", inlineLabel && "min-w-0 flex-1")}
      style={inlineLabel ? { height: resolvedHeight } : { width, height: resolvedHeight }}
    >
      {bar}
      {stops.map((stop, index) => {
        const hasTooltip = Boolean(stop.tooltip);
        const left = `calc(${(stop.value / max) * 100}% - 7px)`;
        return (
          <div
            key={index}
            className="absolute top-0 bottom-0 z-10 flex items-center justify-center"
            style={{ left, width: 14 }}
          >
            {hasTooltip ? (
              <Tooltip text={stop.tooltip} position="top" tip={false}>
                <span
                  tabIndex={0}
                  aria-label={stop.ariaLabel}
                  className="absolute inset-0 outline-none focus-ring"
                />
              </Tooltip>
            ) : null}
            <div className="pointer-events-none flex h-full items-stretch justify-center">
              <div className="w-px bg-gray-alpha-600" />
              <div className="w-px bg-background-100" />
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    bar
  );

  if (label === undefined) return core;

  const labelNode = (
    <span className="shrink-0 text-copy-13 text-muted-foreground whitespace-nowrap">{label}</span>
  );

  // left / right：与进度条同行，items-center 保证垂直居中对齐
  if (inlineLabel) {
    return (
      <div
        className="flex w-full items-center gap-2"
        style={width !== undefined ? { width } : undefined}
      >
        {labelPosition === "left" ? labelNode : core}
        {labelPosition === "left" ? core : labelNode}
      </div>
    );
  }

  // top-* / bottom-*：列布局，gap 1.5（6px），水平对齐按 *-left / *-center / *-right
  const align = labelPosition.endsWith("-left")
    ? "items-start"
    : labelPosition.endsWith("-center")
      ? "items-center"
      : "items-end";
  const isTop = labelPosition.startsWith("top");

  return (
    <div
      className={cn("flex w-full flex-col gap-1.5", align)}
      style={width !== undefined ? { width } : undefined}
    >
      {isTop ? labelNode : core}
      {isTop ? core : labelNode}
    </div>
  );
}

export { Progress };
