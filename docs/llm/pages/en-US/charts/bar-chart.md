# Bar Chart

> Route: `/charts/bar-chart`

Compare values across categories with bars, stacking, percentage mode, and horizontal bars.

[Back to Charts](#/charts)

# Bar Chart

bar-chart

Compare values across categories with bars, stacking, percentage mode, and horizontal bars.

## When to use

- Comparing discrete values across categories.
- Showing share (percent) or composition (stacked).
- Using the vertical layout when category labels are long.

## When not to use

- Continuous time trends — use area or line charts.
- Two or three share segments in tight space — use CategoryBar.

## Examples

### Default bars

Grouped two-series chart with a currency formatter.

### Stacked bars

type="stacked" shows platform composition.

### Vertical layout

layout="vertical" fits long category labels.

## Accessibility

- Legend and tooltip carry the values; color only distinguishes series.
- Bars and legend items are keyboard accessible.

## Controlled behavior

Not applicable: Display-only component; onValueChange reports interaction selection only.

## Responsive behavior

- Width adapts to the container; reduce categories or enable startEndOnly when crowded.

## Theme behavior

- Grid, axes, and tooltip card use semantic tokens for both themes.
- Tooltip movement uses --uni-motion-feedback (150ms by default) and --ease-snap, positioning immediately under reduced motion. Legend-button scrolling uses --uni-motion-state (250ms by default) and --ease-in-out, and user input can interrupt it.

## Live Demo

- sales

- profit

```tsx
import { BarChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", sales: 4400, profit: 2605 },
  { month: "Feb", sales: 4305, profit: 2410 },
  { month: "Mar", sales: 5230, profit: 3215 },
  { month: "Apr", sales: 5490, profit: 3460 },
  { month: "May", sales: 6102, profit: 3922 },
  { month: "Jun", sales: 6204, profit: 4015 },
];

export function BarChartDefault37A8EEC1Example() {
  return (
    <BarChart
      data={chartData}
      index="month"
      categories={["sales", "profit"]}
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
import { BarChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", desktop: 1243, mobile: 954, embedded: 312 },
  { month: "Feb", desktop: 1101, mobile: 1001, embedded: 367 },
  { month: "Mar", desktop: 1452, mobile: 1213, embedded: 420 },
  { month: "Apr", desktop: 1390, mobile: 1345, embedded: 452 },
  { month: "May", desktop: 1612, mobile: 1490, embedded: 511 },
  { month: "Jun", desktop: 1705, mobile: 1621, embedded: 598 },
];

export function BarChartStacked6B2E8D3AExample() {
  return (
    <BarChart
      className="h-72"
      data={chartData}
      index="month"
      categories={["desktop", "mobile", "embedded"]}
      type="stacked"
    />
  );
}
```

## Vertical

- visits

```tsx
import { BarChart } from "@hustradio/unitary-ui";

const verticalData = [
  { browser: "Chrome", visits: 4245 },
  { browser: "Safari", visits: 2100 },
  { browser: "Firefox", visits: 1301 },
  { browser: "Edge", visits: 876 },
];

export function BarChartVertical9F0A3C5EExample() {
  return (
    <BarChart
      className="h-64"
      data={verticalData}
      index="browser"
      categories={["visits"]}
      layout="vertical"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { BarChart } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one point per index value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for the category axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series field names rendered as bars.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "stacked" | "percent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bar composition mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal" | "vertical"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bar orientation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series palette order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats axis and tooltip values.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: BarChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports bar / legend interactions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the built-in tooltip card.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use BarChart for comparisons across categories; use layout="vertical" when category labels are long.
- Limit the number of categories per series so bars remain readable on narrow containers.
- Use type="percent" to communicate share-of-total instead of absolute values.
