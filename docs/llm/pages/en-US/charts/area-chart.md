# Area Chart

> Route: `/charts/area-chart`

Show trends over time with filled areas, stacking, percentage mode, and custom tooltips.

[Back to Charts](#/charts)

# Area Chart

area-chart

Show trends over time with filled areas, stacking, percentage mode, and custom tooltips.

## When to use

- Showing one or more series over time where the fill reinforces magnitude.
- Communicating totals (stacked) or shares (percent) instead of single-series values.

## When not to use

- Clean trend comparison only — use LineChart.
- Comparing across categories — use BarChart.

## Examples

### Default area

Two gradient-filled series with a shared currency formatter.

### Stacked areas

type="stacked" shows channel composition of total visits.

### Custom tooltip

customTooltip aggregates both series into a total card.

### Chart card pattern

The card header carries the title and range filter while the chart renders a total card via customTooltip.

## Accessibility

- Values flow through the tooltip and valueFormatter, so color never carries meaning alone.
- The chart container keeps semantic class names and can be labeled with aria-label.

## Controlled behavior

Not applicable: Display-only component; internal state exists solely for interaction highlighting.

## Responsive behavior

- Width adapts to the parent via ResponsiveContainer; example containers need an explicit height (default h-80).

## Theme behavior

- Axes, grid, and tooltip card use semantic tokens for automatic light/dark adaptation; series colors come from the fixed 9-color palette.
- Tooltip movement uses --uni-motion-feedback (150ms by default) and --ease-snap, positioning immediately under reduced motion. Legend-button scrolling uses --uni-motion-state (250ms by default) and --ease-in-out, and user input can interrupt it.

## Live Demo

- sales

- successfulPayments

```tsx
import { AreaChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

export function AreaChartDefault37A8EEC1Example() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
    />
  );
}
```

## Stacked

- desktop

- mobile

- embedded

```tsx
import { AreaChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", desktop: 1243, mobile: 954, embedded: 312 },
  { month: "Feb", desktop: 1101, mobile: 1001, embedded: 367 },
  { month: "Mar", desktop: 1452, mobile: 1213, embedded: 420 },
  { month: "Apr", desktop: 1390, mobile: 1345, embedded: 452 },
  { month: "May", desktop: 1612, mobile: 1490, embedded: 511 },
  { month: "Jun", desktop: 1705, mobile: 1621, embedded: 598 },
];

export function AreaChartStacked5E4F2A9BExample() {
  return (
    <AreaChart
      className="h-72"
      data={chartData}
      index="month"
      categories={["desktop", "mobile", "embedded"]}
      type="stacked"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
```

## Custom Tooltip

- sales

- successfulPayments

```tsx
import { AreaChart, type AreaChartTooltipProps as TooltipProps } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, item) => sum + (item.value ?? 0), 0);
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground tabular-nums">
        Total:{" "}
        <span className="font-medium text-foreground">{Intl.NumberFormat("us").format(total)}</span>
      </p>
    </div>
  );
}

export function AreaChartCustomTooltip8C1D4E7FExample() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
      customTooltip={CustomTooltip}
    />
  );
}
```

## Chart card

### Sessions by device

Desktop and mobile sessions, last 6 months

- desktop

- mobile

```tsx
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
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { AreaChart } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one point per index value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for the x axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series field names rendered as stacked areas.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series palette order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "stacked" | "percent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series composition mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fill</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gradient" | "solid" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Area fill treatment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gradient"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats axis and tooltip values.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: AreaChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports dot / legend interactions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the built-in tooltip card.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use AreaChart for trend composition over time; switch to type="stacked" or "percent" when totals or shares matter more than individual series.
- Keep ResponsiveContainer height explicit (default h-80) so the chart never collapses to zero height.
- Provide valueFormatter for unit or currency rendering so axes and tooltips stay consistent.
