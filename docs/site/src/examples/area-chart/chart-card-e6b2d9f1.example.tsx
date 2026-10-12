import * as React from "react";

import { AreaChart, type AreaChartTooltipProps as TooltipProps } from "@hustradio/unitary-ui";
import { getColorClassName } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { cn } from "@hustradio/unitary-ui";

/**
 * 图表卡模式：卡片头部承载标题与区间筛选，图表用 customTooltip 输出合计卡片。
 * 数据与筛选逻辑都在示例内，组件本身保持展示型契约。
 */

const SERIES = [
  { month: "Jan", desktop: 1860, mobile: 1240 },
  { month: "Feb", desktop: 2010, mobile: 1390 },
  { month: "Mar", desktop: 2240, mobile: 1610 },
  { month: "Apr", desktop: 2120, mobile: 1740 },
  { month: "May", desktop: 2480, mobile: 1980 },
  { month: "Jun", desktop: 2690, mobile: 2210 },
  { month: "Jul", desktop: 2810, mobile: 2350 },
  { month: "Aug", desktop: 3040, mobile: 2520 },
];

const RANGES = [
  { id: "3m", label: "3 months", months: 3 },
  { id: "6m", label: "6 months", months: 6 },
  { id: "all", label: "All time", months: SERIES.length },
] as const;

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

/** 合计提示卡：把两条系列汇总成一个总量 + 明细行。 */
function TotalTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-13 shadow-[var(--material-shadow-menu)]">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground">
        Sessions <span className="ml-2 font-medium tabular-nums text-foreground">{total}</span>
      </p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((item) => (
          <li key={item.category} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", getColorClassName(item.color, "bg"))}
            />
            <span className="text-muted-foreground">{item.category}</span>
            <span className="ml-auto tabular-nums text-foreground">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AreaChartChartCardE6B2D9F1Example() {
  const [rangeId, setRangeId] = React.useState<(typeof RANGES)[number]["id"]>("6m");
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[1];
  const data = SERIES.slice(-range.months);

  return (
    <article className="rounded-lg border border-border bg-background-100">
      <header className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-label-16 font-medium text-foreground">Sessions by device</h3>
          <p className="mt-0.5 text-copy-13 text-muted-foreground">
            Desktop and mobile sessions, last {range.months} months
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((item) => (
            <Button
              key={item.id}
              typeName="button"
              size="small"
              type={item.id === rangeId ? "secondary" : "tertiary"}
              aria-pressed={item.id === rangeId}
              onClick={() => setRangeId(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </header>
      <div className="p-4">
        <AreaChart
          key={range.id}
          data={data}
          index="month"
          categories={["desktop", "mobile"]}
          colors={["blue", "violet"]}
          valueFormatter={(value) => compact.format(value)}
          customTooltip={TotalTooltip}
          className="h-72"
        />
      </div>
    </article>
  );
}
