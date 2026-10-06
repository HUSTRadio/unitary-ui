import { withLayerBridge } from "@/lib/layer-bridge";
// Tremor Raw · CategoryBar [v0.0.3] —— 源码内置自 github.com/tremorlabs/tremor（Apache-2.0，© Tremor contributors）
// 本地适配：cn 工具、语义 token（text-muted-foreground、ring-background）、排版类（text-copy-13）、
// marker 提示改用 HoverCard（与本项目 Tracker 一致，替代上游内部 Tooltip 依赖）、动效时长 token 化
// （duration-300 → --uni-duration-base）、移除 tremor-id 标记；分段与 marker 定位逻辑保持上游一致。

import React from "react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

import {
  AvailableChartColors,
  type AvailableChartColorsKeys,
  getColorClassName,
} from "./chart-colors"

const LayerHoverCardPrimitiveContent = withLayerBridge(HoverCardPrimitive.Content);

const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: AvailableChartColorsKeys[],
): string => {
  if (marker === undefined) return ""

  if (marker === 0) {
    for (let index = 0; index < values.length; index++) {
      if (values[index] > 0) {
        return getColorClassName(colors[index], "bg")
      }
    }
  }

  let prefixSum = 0
  for (let index = 0; index < values.length; index++) {
    prefixSum += values[index]
    if (prefixSum >= marker) {
      return getColorClassName(colors[index], "bg")
    }
  }

  return getColorClassName(colors[values.length - 1], "bg")
}

const getPositionLeft = (
  value: number | undefined,
  maxValue: number,
): number => (value ? (value / maxValue) * 100 : 0)

const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0)

const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString()
  }
  return num.toFixed(1)
}

const BarLabels = ({ values }: { values: number[] }) => {
  const sumValues = React.useMemo(() => sumNumericArray(values), [values])
  let prefixSum = 0
  let sumConsecutiveHiddenLabels = 0

  return (
    <div
      className={cn(
        // base
        "relative mb-2 flex h-5 w-full text-copy-13 font-medium",
        // text color
        "text-muted-foreground",
      )}
    >
      <div className="absolute bottom-0 left-0 flex items-center">0</div>
      {values.map((widthPercentage, index) => {
        prefixSum += widthPercentage

        const showLabel =
          (widthPercentage >= 0.1 * sumValues ||
            sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
          sumValues - prefixSum >= 0.1 * sumValues &&
          prefixSum >= 0.1 * sumValues &&
          prefixSum < 0.9 * sumValues

        sumConsecutiveHiddenLabels = showLabel
          ? 0
          : (sumConsecutiveHiddenLabels += widthPercentage)

        const widthPositionLeft = getPositionLeft(widthPercentage, sumValues)

        return (
          <div
            key={`item-${index}`}
            className="flex items-center justify-end pr-0.5"
            style={{ width: `${widthPositionLeft}%` }}
          >
            {showLabel ? (
              <span
                className={cn("block translate-x-1/2 text-copy-13 tabular-nums")}
              >
                {formatNumber(prefixSum)}
              </span>
            ) : null}
          </div>
        )
      })}
      <div className="absolute bottom-0 right-0 flex items-center">
        {formatNumber(sumValues)}
      </div>
    </div>
  )
}

export interface CategoryBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  values: number[]
  colors?: AvailableChartColorsKeys[]
  marker?: { value: number; tooltip?: string; showAnimation?: boolean }
  showLabels?: boolean
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      values = [],
      colors = AvailableChartColors,
      marker,
      showLabels = true,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const { t } = useI18n()
    const markerBgColor = React.useMemo(
      () => getMarkerBgColor(marker?.value, values, colors),
      [marker, values, colors],
    )

    const maxValue = React.useMemo(() => sumNumericArray(values), [values])

    const adjustedMarkerValue = React.useMemo(() => {
      if (marker === undefined) return undefined
      if (marker.value < 0) return 0
      if (marker.value > maxValue) return maxValue
      return marker.value
    }, [marker, maxValue])

    const markerPositionLeft: number = React.useMemo(
      () => getPositionLeft(adjustedMarkerValue, maxValue),
      [adjustedMarkerValue, maxValue],
    )

    const markerBar = (tooltip: boolean) => (
      <div
        aria-hidden="true"
        className={cn(
          tooltip ? "relative mx-auto h-4 w-1 rounded-full ring-2" : "mx-auto h-4 w-1 rounded-full ring-2",
          "ring-background",
          markerBgColor,
        )}
      >
        {tooltip ? (
          <div className="absolute size-7 -translate-x-[45%] -translate-y-[15%]" />
        ) : null}
      </div>
    )

    return (
      <div
        ref={forwardedRef}
        data-slot="category-bar"
        className={cn(className)}
        aria-label={t("Category bar")}
        aria-valuenow={marker?.value}
        {...props}
      >
        {showLabels ? <BarLabels values={values} /> : null}
        <div className="relative flex h-2 w-full items-center">
          <div className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-full">
            {values.map((value, index) => {
              const barColor = colors[index] ?? "gray"
              const percentage = (value / maxValue) * 100
              return (
                <div
                  key={`item-${index}`}
                  className={cn(
                    "h-full",
                    getColorClassName(
                      barColor as AvailableChartColorsKeys,
                      "bg",
                    ),
                    percentage === 0 && "hidden",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              )
            })}
          </div>

          {marker !== undefined ? (
            <div
              className={cn(
                "absolute w-2 -translate-x-1/2",
                marker.showAnimation &&
                  "transform-gpu transition-all duration-(--uni-duration-base) ease-in-out",
              )}
              style={{
                left: `${markerPositionLeft}%`,
              }}
            >
              {marker.tooltip ? (
                <HoverCardPrimitive.Root openDelay={0} closeDelay={0}>
                  <HoverCardPrimitive.Trigger asChild>
                    {markerBar(true)}
                  </HoverCardPrimitive.Trigger>
                  <HoverCardPrimitive.Portal>
                    <LayerHoverCardPrimitiveContent
                      data-material="floating"
                      data-material-surface="inverted"
                      sideOffset={10}
                      side="top"
                      align="center"
                      avoidCollisions
                      className={cn(
                        "z-[var(--uni-z-tooltip)] w-auto rounded-overlay px-2 py-1 text-copy-13",
                        "shadow-(--material-shadow-base)",
                        "text-background",
                        "bg-foreground",
                      )}
                    >
                      {marker.tooltip}
                    </LayerHoverCardPrimitiveContent>
                  </HoverCardPrimitive.Portal>
                </HoverCardPrimitive.Root>
              ) : (
                markerBar(false)
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
  },
)

CategoryBar.displayName = "CategoryBar"

export { CategoryBar }
