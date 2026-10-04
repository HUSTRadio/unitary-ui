# Donut Chart

> Route: `/charts/donut-chart`

Show proportions as a donut or pie; the donut center can display a main metric.

[Back to Charts](#/charts)

# Donut Chart

donut-chart

Show proportions as a donut or pie; the donut center can display a main metric.

## When to use

- Share-of-total structures with five or fewer slices.
- A center metric readable without hovering.

## When not to use

- Precise value comparison — bars or a bar list read faster.
- Many slices — bucket into "Other" or switch to BarList.

## Examples

### Default donut

Four-city visitor share with a center total.

### Pie

variant="pie" removes the center hole.

## Accessibility

- Slices and legend are interactive; the tooltip provides exact values.

## Controlled behavior

Not applicable: Display-only component.

## Responsive behavior

- Fixed h-40 w-40 square container; mind spacing in horizontal layouts.

## Theme behavior

- Tooltip card and legend follow semantic tokens; slice colors come from the fixed palette.

## Live Demo

```tsx
import { DonutChart } from "@/components/ui/charts/donut-chart";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartDefault37A8EEC1Example() {
  return (
    <DonutChart
      data={cityData}
      category="name"
      value="value"
      colors={["blue", "cyan", "violet", "amber"]}
    >
      <p className="text-copy-14 font-medium text-foreground">222,707</p>
      <p className="text-copy-13 text-muted-foreground">Total Visitors</p>
    </DonutChart>
  );
}
```

## Pie

```tsx
import { DonutChart } from "@/components/ui/charts/donut-chart";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartPie7E3C1B6DExample() {
  return (
    <DonutChart
      variant="pie"
      data={cityData}
      category="name"
      value="value"
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
      colors={["blue", "cyan", "violet", "amber"]}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { DonutChart } from "@/components/ui/donut-chart";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">any[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data records; one slice per record.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">category</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for slice labels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field used for slice sizes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"donut" | "pie"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Ring or full pie rendering.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"donut"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats tooltip values.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: DonutChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports slice / legend interactions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Center metric (donut variant only).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the built-in tooltip card.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use DonutChart with five or fewer slices; move the rest into an "Other" bucket.
- Center children (value + label) communicate the primary metric without requiring a tooltip.
- Use variant="pie" only when the center metric is not needed.
