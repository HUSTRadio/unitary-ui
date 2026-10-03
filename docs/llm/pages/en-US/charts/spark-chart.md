# Spark Chart

> Route: `/charts/spark-chart`

Show trends inside cards or tables with a small area, line, or bar chart.

[Back to Components](#/components)

# Spark Chart

spark-chart

Show trends inside cards or tables with a small area, line, or bar chart.

## When to use

- Conveying a single series' direction in compact space.
- Pairing with an explicit number (number for precision, spark for shape).

## When not to use

- Full chart contexts needing axes, legends, or tooltips.
- Multi-series comparison.

## Examples

### Three spark kinds

Area, line, and bar sparks side by side.

### KPI card pattern

Large metric, trend spark, and delta marker, with a donut micro-chart for share in the third card.

## Accessibility

- Sparks never carry exact values; pair them with text and optionally aria-label trend summaries.

## Controlled behavior

Not applicable: Display-only component.

## Responsive behavior

- Width adapts to the parent with a fixed compact height.

## Theme behavior

- Colors reuse the chart palette; containers carry no background dependency.

## Live Demo

Visitors

+15.3% vs last half

Revenue

$4,012 this month

Orders

1,705 orders

```tsx
import { SparkAreaChart, SparkBarChart, SparkLineChart } from "@/components/ui/charts/spark-chart";

const visitorsData = [
  { month: "Jan", visitors: 3911 },
  { month: "Feb", visitors: 4011 },
  { month: "Mar", visitors: 4120 },
  { month: "Apr", visitors: 3890 },
  { month: "May", visitors: 4321 },
  { month: "Jun", visitors: 4510 },
];

const revenueData = [
  { month: "Jan", revenue: 2900 },
  { month: "Feb", revenue: 2755 },
  { month: "Mar", revenue: 3322 },
  { month: "Apr", revenue: 3410 },
  { month: "May", revenue: 3870 },
  { month: "Jun", revenue: 4012 },
];

const ordersData = [
  { month: "Jan", orders: 1243 },
  { month: "Feb", orders: 1101 },
  { month: "Mar", orders: 1452 },
  { month: "Apr", orders: 1390 },
  { month: "May", orders: 1612 },
  { month: "Jun", orders: 1705 },
];

export function SparkChartDefault37A8EEC1Example() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Visitors</p>
        <SparkAreaChart
          data={visitorsData}
          index="month"
          categories={["visitors"]}
          colors={["blue"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">+15.3% vs last half</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Revenue</p>
        <SparkLineChart
          data={revenueData}
          index="month"
          categories={["revenue"]}
          colors={["emerald"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">$4,012 this month</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Orders</p>
        <SparkBarChart
          data={ordersData}
          index="month"
          categories={["orders"]}
          colors={["violet"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">1,705 orders</p>
      </div>
    </div>
  );
}
```

## Kpi card

Monthly recurring revenue

$48,120

+12.4%vs. last month

New signups

351

+9.1%vs. last month

Spend by service

- Compute62%
- Storage38%

```tsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { DonutChart } from "@/components/ui/charts/donut-chart";
import { SparkAreaChart, SparkBarChart } from "@/components/ui/charts/spark-chart";
import { cn } from "@/lib/utils";

/**
 * KPI 统计卡模式：指标值大字号 + 趋势微图 + 涨跌标注。
 * 只借鉴组合模式，容器与排版全部走本项目 token 与语义类。
 */

const REVENUE = [
  { week: "W1", revenue: 3980 },
  { week: "W2", revenue: 4210 },
  { week: "W3", revenue: 4090 },
  { week: "W4", revenue: 4460 },
  { week: "W5", revenue: 4720 },
  { week: "W6", revenue: 4812 },
];

const SIGNUPS = [
  { week: "W1", signups: 212 },
  { week: "W2", signups: 268 },
  { week: "W3", signups: 241 },
  { week: "W4", signups: 296 },
  { week: "W5", signups: 322 },
  { week: "W6", signups: 351 },
];

const STORAGE = [
  { name: "Compute", value: 62 },
  { name: "Storage", value: 38 },
];

function Trend({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <p
      className={cn(
        "mt-1 inline-flex items-center gap-1 text-copy-13 font-medium",
        positive ? "text-success" : "text-danger",
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-4" aria-hidden />
      ) : (
        <ArrowDownRight className="size-4" aria-hidden />
      )}
      <span className="tabular-nums">
        {positive ? "+" : "−"}
        {Math.abs(delta)}%
      </span>
      <span className="font-normal text-muted-foreground">vs. last month</span>
    </p>
  );
}

export function SparkChartKpiCardC3F1A8D4Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Monthly recurring revenue</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">$48,120</p>
        <Trend delta={12.4} />
        <div className="mt-3 h-12">
          <SparkAreaChart data={REVENUE} index="week" categories={["revenue"]} colors={["blue"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">New signups</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">351</p>
        <Trend delta={9.1} />
        <div className="mt-3 h-12">
          <SparkBarChart data={SIGNUPS} index="week" categories={["signups"]} colors={["violet"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Spend by service</p>
        <div className="mt-2 flex items-center gap-4">
          <DonutChart
            data={STORAGE}
            category="name"
            value="value"
            colors={["blue", "violet"]}
            showTooltip={false}
            className="h-20 w-20 shrink-0"
          />
          <ul className="min-w-0 space-y-1 text-copy-13">
            {STORAGE.map((slice, index) => (
              <li key={slice.name} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    index === 0 ? "bg-blue-500" : "bg-violet-500",
                  )}
                />
                <span className="truncate text-muted-foreground">{slice.name}</span>
                <span className="ml-auto tabular-nums text-foreground">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { SparkAreaChart, SparkLineChart, SparkBarChart } from "@/components/ui/spark-chart";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one point per index value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for the x axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Single-series field name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series color.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr></tbody></table>

## Best Practices

- Use SparkAreaChart / SparkLineChart / SparkBarChart inside cards and table cells, not as standalone charts.
- Keep exactly one category per spark chart; multiple series defeat the compact form.
- Pair the spark with an explicit numeric value so the shape never has to carry the exact number.
