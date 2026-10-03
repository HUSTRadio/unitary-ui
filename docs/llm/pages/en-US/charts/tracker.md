# Tracker

> Route: `/charts/tracker`

Show event history, such as uptime or build results, as a sequence of status blocks.

[Back to Components](#/components)

# Tracker

tracker

Show event history, such as uptime or build results, as a sequence of status blocks.

## When to use

- Discrete event histories (uptime, build outcomes).
- A compact timeline status overview.

## When not to use

- Continuous metrics — use area or line charts.
- Exact value labels — use a table.

## Examples

### Default tracker

A 29-day sequence of status blocks.

## Accessibility

- Every block color must be paired with tooltip text; color never carries meaning alone.

## Controlled behavior

Not applicable: Static display component.

## Responsive behavior

- Block count should match container width; long histories scroll horizontally.

## Theme behavior

- Status colors reuse functional tokens; empty slots use low-contrast tones.

## Live Demo

```tsx
import { Tracker } from "@/components/ui/charts/tracker";

function createRandomData(days: number) {
  const colors = ["emerald", "amber", "rose"] as const;
  return Array.from({ length: days }, (_, index) => ({
    color: colors[index % 7 === 6 ? (index % 11 === 6 ? 1 : 0) : index % 13 === 5 ? 2 : 0],
    tooltip: `Day ${index + 1}`,
  }));
}

export function TrackerDefault37A8EEC1Example() {
  return <Tracker data={createRandomData(29)} />;
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Tracker } from "@/components/ui/tracker";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TrackerBlockProps[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Status blocks rendered left to right.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional overlay content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Tracker for discrete event history (uptime, CI runs), not continuous metrics.
- Pair each block color with a tooltip so color never carries meaning alone.
- Keep the block count reasonable for the container width; long histories scroll horizontally.
