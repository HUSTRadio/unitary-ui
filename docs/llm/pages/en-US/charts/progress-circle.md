# Progress Circle

> Route: `/charts/progress-circle`

Show completion or capacity as a ring, with a value and description in the center.

[Back to Components](#/components)

# Progress Circle

progress-circle

Show completion or capacity as a ring, with a value and description in the center.

## When to use

- A prominent single-ratio metric.
- Center value plus sub-label compositions.

## When not to use

- Dial-style gauge readings — use Gauge.
- Multi-segment shares — use the category bar or donut chart.

## Examples

### Default progress circle

Show bandwidth usage with a percentage in the center.

## Accessibility

- The concrete value renders as text children, so reading never depends on color.

## Controlled behavior

Not applicable: Static display component; progress derives from value/max props.

## Responsive behavior

- Sizing comes from radius and strokeWidth; pair with layout containers.

## Theme behavior

- The track uses low-contrast tokens; the progress color comes from the palette.

## Live Demo

75%

Bandwidth used

375 GB of 500 GB

```tsx
import { ProgressCircle } from "@/components/ui/charts/progress-circle";

export function ProgressCircleDefault37A8EEC1Example() {
  return (
    <div className="flex items-center gap-3">
      <ProgressCircle value={75} max={100} radius={40} strokeWidth={6} color="blue">
        <p className="text-copy-14 font-medium text-foreground">75%</p>
      </ProgressCircle>
      <div className="flex flex-col">
        <p className="text-copy-14 font-medium text-foreground">Bandwidth used</p>
        <p className="text-copy-13 text-muted-foreground">375 GB of 500 GB</p>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { ProgressCircle } from "@/components/ui/progress-circle";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current progress value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">max</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Value that means 100%.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">100</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">radius</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Circle radius in pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">strokeWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Ring stroke thickness.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">6</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Ring color.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"blue"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Center content (value, label).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ProgressCircle for a single ratio (completion, capacity); use Gauge for dial-style metrics.
- Put the concrete value as children so the number is readable without color cues.
- The track uses muted tokens; avoid recoloring it away from the design system palette.
