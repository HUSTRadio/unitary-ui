# Combo Chart

> Route: `/charts/combo-chart`

Combines bar and line series in one chart, optionally on two axes.

[Back to Components](#/components)

# Combo Chart

combo-chart

Combines bar and line series in one chart, optionally on two axes.

## When to use

- Two related metrics sharing a category axis (e.g. revenue and margin).
- Enabling enableBiaxial when the series ranges are incomparable.

## When not to use

- More than two main metrics — split into multiple charts or chart cards.
- A single shape suffices — use BarChart / LineChart directly.

## Examples

### Default combo

Bars (revenue) plus a line (costs) on a shared axis.

### Biaxial

enableBiaxial puts currency and percent side by side.

## Accessibility

- Legend shapes distinguish bars from lines; values flow through the tooltip.

## Controlled behavior

Not applicable: Display-only component.

## Responsive behavior

- Width adapts; with biaxial mode the right axis reserves space on narrow screens.

## Theme behavior

- Grid, axes, and tooltip card use semantic tokens.

## Live Demo

- revenue

- operatingCosts

```tsx
import { ComboChart } from "@/components/ui/charts/combo-chart";

const chartData = [
  { month: "Jan", revenue: 4400, operatingCosts: 2205 },
  { month: "Feb", revenue: 4305, operatingCosts: 2310 },
  { month: "Mar", revenue: 5230, operatingCosts: 2144 },
  { month: "Apr", revenue: 5490, operatingCosts: 2360 },
  { month: "May", revenue: 6102, operatingCosts: 2278 },
  { month: "Jun", revenue: 6204, operatingCosts: 2465 },
];

export function ComboChartDefault37A8EEC1Example() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["operatingCosts"],
        colors: ["amber"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
    />
  );
}
```

## Biaxial

- revenue

- margin

```tsx
import { ComboChart } from "@/components/ui/charts/combo-chart";

const chartData = [
  { month: "Jan", revenue: 4400, margin: 0.18 },
  { month: "Feb", revenue: 4305, margin: 0.16 },
  { month: "Mar", revenue: 5230, margin: 0.21 },
  { month: "Apr", revenue: 5490, margin: 0.24 },
  { month: "May", revenue: 6102, margin: 0.26 },
  { month: "Jun", revenue: 6204, margin: 0.25 },
];

export function ComboChartBiaxial2A9F5C3EExample() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      enableBiaxial
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["margin"],
        colors: ["emerald"],
        valueFormatter: (value) => `${(value * 100).toFixed(0)}%`,
      }}
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ComboChart } from "@/components/ui/combo-chart";
```

Native props: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one point per index value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for the category axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">barSeries</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChartSeries &amp; { type?: "default" | "stacked" }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bar series config (categories, colors, valueFormatter, axis).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">lineSeries</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChartSeries &amp; { connectNulls?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Line series config.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">enableBiaxial</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders the line series on a second y axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: ComboChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports bar / dot / legend interactions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the built-in tooltip card.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ComboChart when two related metrics (e.g. revenue and margin) share the same category axis.
- Enable enableBiaxial when the two series have incompatible value ranges.
- Give both series explicit colors so the legend and tooltip stay distinguishable.
