import * as React from "react";

import { cn } from "@/lib/utils";

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
 */

type ProgressType = "success" | "error" | "warning" | "secondary";

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

function Progress({
  className,
  value,
  max = 100,
  type,
  colors,
  width,
  height,
  ...props
}: Omit<React.ComponentProps<"progress">, "max" | "value"> & {
  value?: number | null;
  max?: number;
  type?: ProgressType;
  colors?: Record<string, string>;
  width?: number | string;
  height?: number;
}) {
  const fg =
    type !== undefined
      ? TYPE_FG[type]
      : colors && value != null
        ? resolveThresholdColor(value, colors)
        : "var(--color-gray-1000)";

  return (
    <progress
      data-slot="progress"
      value={value ?? undefined}
      max={max}
      className={cn(
        "block w-full appearance-none overflow-hidden rounded-[6px] border-0 bg-gray-200",
        "[&::-webkit-progress-bar]:rounded-[6px] [&::-webkit-progress-bar]:bg-gray-200",
        "[&::-webkit-progress-value]:rounded-[6px] [&::-webkit-progress-value]:bg-[var(--fg)]",
        "[&::-moz-progress-bar]:rounded-[6px] [&::-moz-progress-bar]:bg-[var(--fg)]",
        className,
      )}
      style={{ width, height: height ?? 10, ["--fg" as string]: fg }}
      {...props}
    />
  );
}

export { Progress };
