// Tremor Raw · ProgressCircle [v0.0.3] —— 源码内置自 github.com/tremorlabs/tremor（Apache-2.0，© Tremor contributors）
// 本地适配：去除 tailwind-variants 依赖（改用静态变体映射）、cn 工具、动效时长 token 化
// （duration-300 → --uni-duration-base）、移除 tremor-id 标记；绘制逻辑保持上游一致。

import React from "react"

import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

const progressCircleVariants = {
  default: {
    background: "stroke-blue-200 dark:stroke-blue-500/30",
    circle: "stroke-blue-500 dark:stroke-blue-500",
  },
  neutral: {
    background: "stroke-gray-200 dark:stroke-gray-500/40",
    circle: "stroke-gray-500 dark:stroke-gray-500",
  },
  warning: {
    background: "stroke-yellow-200 dark:stroke-yellow-500/30",
    circle: "stroke-yellow-500 dark:stroke-yellow-500",
  },
  error: {
    background: "stroke-red-200 dark:stroke-red-500/30",
    circle: "stroke-red-500 dark:stroke-red-500",
  },
  success: {
    background: "stroke-emerald-200 dark:stroke-emerald-500/30",
    circle: "stroke-emerald-500 dark:stroke-emerald-500",
  },
} as const

export type ProgressCircleVariant = keyof typeof progressCircleVariants

export interface ProgressCircleProps
  extends Omit<React.SVGProps<SVGSVGElement>, "value"> {
  variant?: ProgressCircleVariant
  value?: number
  max?: number
  showAnimation?: boolean
  radius?: number
  strokeWidth?: number
  children?: React.ReactNode
}

const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  (
    {
      value = 0,
      max = 100,
      radius = 32,
      strokeWidth = 6,
      showAnimation = true,
      variant = "default",
      className,
      children,
      ...props
    }: ProgressCircleProps,
    forwardedRef,
  ) => {
    const { t } = useI18n()
    const safeValue = Math.min(max, Math.max(value, 0))
    const normalizedRadius = radius - strokeWidth / 2
    const circumference = normalizedRadius * 2 * Math.PI
    const offset = circumference - (safeValue / max) * circumference

    const { background, circle } = progressCircleVariants[variant]
    return (
      <div
        data-slot="progress-circle"
        className="relative"
        role="progressbar"
        aria-label={t("Progress circle")}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        data-max={max}
        data-value={safeValue ?? null}
      >
        <svg
          ref={forwardedRef}
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className={cn("-rotate-90", className)}
          {...props}
        >
          <circle
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke=""
            strokeLinecap="round"
            className={cn("transition-colors ease-snap", background)}
          />
          {safeValue >= 0 ? (
            <circle
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              fill="transparent"
              stroke=""
              strokeLinecap="round"
              className={cn(
                "transition-colors ease-snap",
                circle,
                showAnimation &&
                  "transform-gpu transition-all duration-(--uni-duration-base)",
              )}
            />
          ) : null}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  },
)

ProgressCircle.displayName = "ProgressCircle"

export { ProgressCircle }
