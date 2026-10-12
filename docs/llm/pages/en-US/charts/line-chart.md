# Line Chart

> Route: `/charts/line-chart`

Compare continuous trends with lines, axis labels, and custom tooltips.

[Back to Charts](#/charts)

# Line Chart

line-chart

Compare continuous trends with lines, axis labels, and custom tooltips.

## When to use

- Continuous trends where area fills would add visual noise.
- Annotating axis semantics via xAxisLabel / yAxisLabel.

## When not to use

- Emphasizing composition or totals — use the area chart.
- Category comparison — use the bar chart.

## Examples

### Default lines

Two-metric trend with axis titles.

### Custom tooltip

customTooltip renders a custom value card.

## Accessibility

- Values flow through the tooltip and formatter; color never carries meaning alone.

## Controlled behavior

Not applicable: Display-only component.

## Responsive behavior

- Width adapts to the parent; the container needs an explicit height.

## Theme behavior

- Axes, grid, and tooltip card use semantic tokens.
- Tooltip movement uses --uni-motion-feedback (150ms by default) and --ease-snap, positioning immediately under reduced motion. Legend-button scrolling uses --uni-motion-state (250ms by default) and --ease-in-out, and user input can interrupt it.

## Live Demo

- temperature

- precipitation

```tsx
import { LineChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

export function LineChartDefault37A8EEC1Example() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      valueFormatter={(value) => `${value.toFixed(1)} units`}
      xAxisLabel="Month"
      yAxisLabel="Measurement"
    />
  );
}
```

## Custom Tooltip

- temperature

- precipitation

```tsx
import { LineChart, type LineChartTooltipProps as TooltipProps } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.category} className="mt-1 flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-xs bg-blue-500" aria-hidden="true" />
          {item.category}:{" "}
          <span className="font-medium text-foreground tabular-nums">{item.value?.toFixed(1)}</span>
        </p>
      ))}
    </div>
  );
}

export function LineChartCustomTooltip4D7B2E8AExample() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      customTooltip={CustomTooltip}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { LineChart } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one point per index value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for the x axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Series field names rendered as lines.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">connectNulls</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bridges missing values in a series.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">xAxisLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional x axis title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">yAxisLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional y axis title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats axis and tooltip values.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: LineChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports dot / legend interactions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the built-in tooltip card.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use LineChart for continuous trends where the area fill of AreaChart would add visual noise.
- Add xAxisLabel / yAxisLabel when the data dimensions are not self-evident from the index values.
- Prefer 2-4 series; beyond that, consider small multiples or a table instead.
