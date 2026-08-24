import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Gauge — Geist 官方 Gauge 规范（docs/geist-markdown-refs/components/gauge.md）。
 * 0–100 百分比圆环。
 *
 * 官方实测（vercel.com/geist/gauge + full-audit-20260809 G06）：
 * - 尺寸 4 档：tiny 20px / small 32px / medium 64px / large 128px
 * - stroke-width（px）：3 / 3.2 / 6.4 / 12.8（tiny 15 units @100-viewBox = 3px @20，其余 10 units）
 * - 默认（无 colors prop）按阈值色阶着色：<20 #da2f35 / <60 #ffb224 / >=60 #45a557
 * - colors：阈值色阶表 {"0": color, ...}（取 <= value 的最大阈值），或 {primary, secondary}
 * - 轨道为 PARTIAL arc（dasharray）：@50 时 track = 40% C（primary 50% + track 40% + ~10% gap）
 * - arcPriority="equal"：两弧各 45% C @50（45% + 45% + ~10% gap，secondary 紧随 primary 末端）
 * - showValue：中心只渲染数字；tiny (20px) 不渲染中心文本
 * - indeterminate：双灰弧 + 旋转动画，不设 aria-valuenow
 * - role="progressbar" + aria-valuemin/max/now（clamp 0–100）
 */

const GAUGE_SIZE = {
  tiny: 20,
  small: 32,
  medium: 64,
  large: 128,
} as const;

/** 官方实测 stroke-width（px）：tiny=3（15 units @20px），其余 10 units → 3.2/6.4/12.8 @32/64/128 */
const GAUGE_STROKE = {
  tiny: 3,
  small: 3.2,
  medium: 6.4,
  large: 12.8,
} as const;

/** 官方默认色阶（无 colors prop 时）：<20 red，<60 amber，>=60 green */
const DEFAULT_GAUGE_COLORS = {
  "0": "#da2f35",
  "20": "#ffb224",
  "60": "#45a557",
} as const;

/** 官方弧间缺口：总 ~10%（default @50: 50% + 40% + 10%；equal @50: 45% + 45% + 10%） */
const GAUGE_GAP = 0.1;

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
  /** 是否在中心渲染数字（默认关，官方实测默认不渲染；tiny 不渲染） */
  showValue?: boolean;
  /** 不确定状态：灰弧旋转动画，不设 aria-valuenow */
  indeterminate?: boolean;
  /** 阈值色阶表或 {primary, secondary} */
  colors?: GaugeColors;
  /** "equal"：primary/secondary 双弧各占 value-5% / 95-value% */
  arcPriority?: "equal";
}) {
  const sizeName = size;
  const px = GAUGE_SIZE[sizeName];
  const stroke = GAUGE_STROKE[sizeName];
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const p = clamped / 100;

  const pairColors = colors && isPairColors(colors) ? colors : undefined;
  const primaryColor =
    pairColors?.primary ?? resolveThresholdColor(clamped, colors ?? DEFAULT_GAUGE_COLORS);
  const secondaryColor = pairColors?.secondary;
  const equalPriority = arcPriority === "equal" && secondaryColor !== undefined;

  // 官方弧长（dasharray 首值 / C）与起点（dashoffset）：
  // - default：primary = p（起点 0，自顶部顺时针）；track = 0.9 - p（紧随 primary 末端，5% 间隙）
  // - equal：primary = p - 0.05（起点 2.5%）；secondary = 0.95 - p（两弧间各 5% 间隙，共 ~10%）
  const primaryDash = equalPriority
    ? Math.max(0, circumference * (p - GAUGE_GAP / 2))
    : circumference * p;
  const primaryOffset = equalPriority ? -circumference * (GAUGE_GAP / 4) : 0;
  const secondaryDash = Math.max(
    0,
    circumference * (equalPriority ? 1 - p - GAUGE_GAP / 2 : 1 - GAUGE_GAP - p),
  );
  const secondaryOffset = -circumference * (p + (equalPriority ? GAUGE_GAP / 4 : GAUGE_GAP / 2));

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
        {/* 轨道弧（PARTIAL arc；equal 模式不渲染，由 secondary 弧取代） */}
        {!equalPriority ? (
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            stroke={secondaryColor}
            strokeDasharray={indeterminate ? undefined : `${secondaryDash} ${circumference}`}
            strokeDashoffset={indeterminate ? undefined : secondaryOffset}
            className={cn(
              "fill-none",
              !secondaryColor &&
                (indeterminate ? "stroke-gray-alpha-400" : "stroke-gray-alpha-200"),
            )}
          />
        ) : null}
        {/* equal 优先级：secondary 弧紧随 primary 末端（45% @50，~10% 间隙） */}
        {equalPriority ? (
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${secondaryDash} ${circumference}`}
            strokeDashoffset={secondaryOffset}
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
          strokeDasharray={indeterminate ? circumference : `${primaryDash} ${circumference}`}
          strokeDashoffset={indeterminate ? circumference * 0.25 : primaryOffset}
          className={cn(
            "fill-none",
            !primaryColor && (indeterminate ? "stroke-gray-alpha-400" : "stroke-progress"),
            !indeterminate && "transition-[stroke-dasharray] duration-(--ds-duration-slower) ease-out",
          )}
        />
      </svg>
      {showValue && !indeterminate && sizeName !== "tiny" ? (
        <span className="absolute text-label-12 text-foreground">{Math.round(clamped)}</span>
      ) : null}
    </div>
  );
}

export { Gauge };
