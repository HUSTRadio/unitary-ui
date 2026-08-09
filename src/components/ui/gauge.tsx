import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Gauge — Geist 官方 Gauge 规范（docs/geist-markdown-refs/components/gauge.md）。
 * 0–100 百分比圆环：轨道 gray-alpha-200，进度 arc 默认 stroke-progress。
 *
 * 官方实测（vercel.com/geist/gauge）：
 * - 尺寸 4 档：tiny 20px / small 32px / medium 64px / large 128px
 * - showValue 默认关闭；开启时中心只渲染数字（官方 BP：永不注入 % 或单位字符串）
 * - colors：阈值色阶表 {"0": color, "10": ...}（取 <= value 的最大阈值），
 *   或 {primary, secondary}（primary = 进度弧，secondary = 轨道弧）
 * - arcPriority="equal"：配合 primary+secondary 使用，secondary 弧精确占据剩余
 *   部分，50% 时两弧等长（官方 Arc priority 演示）
 * - indeterminate：双灰弧 + 旋转动画，不设 aria-valuenow（官方 Indeterminate 实测）
 * - role="progressbar" + aria-valuemin/max/now；aria-labelledby 透传（官方 BP）
 */

const GAUGE_SIZE = {
  tiny: 20,
  small: 32,
  medium: 64,
  large: 128,
} as const;

const GAUGE_STROKE = {
  tiny: 3,
  small: 3,
  medium: 6,
  large: 13,
} as const;

type GaugeSizeName = keyof typeof GAUGE_SIZE;
type GaugeColors = Record<string, string> | { primary?: string; secondary?: string };

function isPairColors(colors: GaugeColors): colors is {
  primary?: string;
  secondary?: string;
} {
  return "primary" in colors || "secondary" in colors;
}

/** 阈值色阶：取 <= value 的最大阈值颜色，无匹配时回退最小阈值 */
function resolveThresholdColor(value: number, colors?: GaugeColors): string | undefined {
  if (!colors || isPairColors(colors)) return undefined;
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

function Gauge({
  className,
  value,
  size = "medium",
  showValue = false,
  indeterminate = false,
  colors,
  arcPriority,
  ...props
}: React.ComponentProps<"div"> & {
  /** 百分比 0–100，越界自动 clamp */
  value: number;
  /** 官方 4 档尺寸 */
  size?: GaugeSizeName;
  /** 是否在中心渲染数字（默认关，官方实测默认不渲染） */
  showValue?: boolean;
  /** 不确定状态：灰弧旋转动画，不设 aria-valuenow */
  indeterminate?: boolean;
  /** 阈值色阶表或 {primary, secondary} */
  colors?: GaugeColors;
  /** "equal"：primary/secondary 双弧精确各占 value / 100-value */
  arcPriority?: "equal";
}) {
  const sizeName = size;
  const px = GAUGE_SIZE[sizeName];
  const stroke = GAUGE_STROKE[sizeName];
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  const pairColors = colors && isPairColors(colors) ? colors : undefined;
  const primaryColor = pairColors?.primary ?? resolveThresholdColor(clamped, colors);
  const secondaryColor = pairColors?.secondary;
  const equalPriority = arcPriority === "equal" && secondaryColor !== undefined;

  return (
    <div
      data-slot="gauge"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px, height: px }}
      {...props}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        className={cn("-rotate-90", indeterminate && "animate-spin")}
        aria-hidden
      >
        {/* 轨道弧 */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={secondaryColor}
          className={cn(
            "fill-none",
            !secondaryColor && (indeterminate ? "stroke-gray-alpha-400" : "stroke-gray-alpha-200"),
          )}
        />
        {/* equal 优先级：secondary 弧精确占据剩余部分（起始于 primary 弧末端） */}
        {equalPriority ? (
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * (1 - clamped / 100)} ${circumference}`}
            strokeDashoffset={-circumference * (clamped / 100)}
          />
        ) : null}
        {/* 进度弧 */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.25 : dashOffset}
          className={cn(
            "fill-none",
            !primaryColor && (indeterminate ? "stroke-gray-alpha-400" : "stroke-progress"),
            !indeterminate && "transition-[stroke-dashoffset] duration-500 ease-out",
          )}
        />
      </svg>
      {showValue && !indeterminate ? (
        <span className="absolute text-label-12 text-foreground">{Math.round(clamped)}</span>
      ) : null}
    </div>
  );
}

export { Gauge };
