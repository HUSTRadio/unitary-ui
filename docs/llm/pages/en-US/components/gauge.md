# Gauge

> Route: `/components/gauge`

A circular visual for conveying a percentage.

[Back to Components](#/components)

# Gauge

gauge

A circular visual for conveying a percentage.

## When to use

- In a 0–100 ratio against a fixed maximum where the comparison is the point, like quota usage, build cache hit rate, uptime, or billing-period consumption.
- When you need a compact visual indicator to replace raw numbers for quick page scanning.
- When the metric represents proportion of total capacity rather than task completion progress.

## When not to use

- For determinate task progress with a known total (uploads, multi-step setup), use Progress instead, as it conveys a clear completion semantics.
- For binary or enumerated state, use Status Dot for deployments or Badge for other metadata.

## Examples

### Labelled gauge

The simplest usage: pass a percentage value with a descriptive label so both sighted users and screen readers understand what the number represents.

### Custom color range

Define threshold segments to customize the arc's color distribution, useful when you need semantic coloring such as shifting hue when quota enters a warning zone.

### Arc priority

Render primary and secondary progress segments on the same ring; with a secondary color, arcPriority="equal" distributes the two segments equally.

### Indeterminate state

When data is loading and the specific percentage is not yet available, use a spinning animation instead of a static arc to communicate that the system is still processing.

## Accessibility

- The component sets role="progressbar" with aria-valuemin, aria-valuemax, and aria-valuenow so screen readers announce the current progress correctly.
- Always pair the gauge with an adjacent label or Tooltip naming what the number represents; the gauge alone is not self-describing.

## Controlled behavior

Not applicable: Gauge is a purely presentational component that renders only the given percentage value and color configuration. It has no internal interactive state concept; the parent controls appearance by passing value and other props directly.

## Responsive behavior

Not applicable: Gauge uses four fixed sizes—tiny, small, medium, and large—and does not scale from the viewport or parent container.

## Theme behavior

- The track follows theme tokens; default progress segments use fixed red, amber, and green thresholds.
- colors accepts a threshold map or primary/secondary pair and can use ordinary CSS colors such as variables, but it does not parse gradients.

## Live Demo

80

100

80

100

80

100

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeLabel0E66373FExample() {
  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
      <Gauge showValue size="tiny" value={80} />
      <Gauge showValue size="small" value={80} />
      <Gauge showValue size="small" value={100} />
      <Gauge showValue size="medium" value={80} />
      <Gauge showValue size="medium" value={100} />
      <Gauge showValue size="large" value={80} />
      <Gauge showValue size="large" value={100} />
    </div>
  );
}
```

## Default color scale

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeDefaultColorScale4B7E0E9CExample() {
  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
      <Gauge size="small" value={14} />
      <Gauge size="small" value={34} />
      <Gauge size="small" value={68} />
    </div>
  );
}
```

## Custom color range

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeCustomColorRange88183E94Example() {
  const PINK_SCALE = {
    "0": "var(--pink-100)",
    "10": "var(--pink-200)",
    "20": "var(--pink-300)",
    "30": "var(--pink-400)",
    "50": "var(--pink-500)",
    "60": "var(--pink-600)",
    "70": "var(--pink-700)",
    "80": "var(--pink-800)",
    "90": "var(--pink-900)",
    "100": "var(--pink-1000)",
  };

  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
        <Gauge key={value} colors={PINK_SCALE} size="small" value={value} />
      ))}
    </div>
  );
}
```

## Custom secondary color

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeCustomSecondaryColor34BA2682Example() {
  return (
    <div className="flex justify-start">
      <Gauge
        colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
        size="medium"
        value={50}
      />
    </div>
  );
}
```

## Arc priority

50

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeArcPriorityAB3EBA95Example() {
  return (
    <div className="flex justify-start">
      <Gauge
        arcPriority="equal"
        colors={{ primary: "var(--blue-700)", secondary: "var(--red-700)" }}
        showValue
        size="medium"
        value={50}
      />
    </div>
  );
}
```

## Indeterminate

```tsx
import { Gauge } from "@/components/ui/gauge";

export function GaugeIndeterminateD5DB1EBAExample() {
  return (
    <div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
      <Gauge indeterminate size="tiny" value={25} />
      <Gauge indeterminate size="small" value={25} />
      <Gauge indeterminate size="medium" value={25} />
      <Gauge indeterminate size="large" value={25} />
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Gauge } from "@/components/ui/gauge";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"tiny" | "small" | "medium" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Fixed gauge size preset.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the numeric value in the center.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indeterminate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows a rotating indeterminate gauge.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GaugeColors</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Threshold colors or a primary/secondary pair.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">arcPriority</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"equal"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses equal-priority primary and secondary arcs.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- A 0–100 ratio against a fixed maximum where the comparison is the point, like quota usage, build cache hit rate, uptime, or billing-period consumption.
- For determinate task progress with a known total (uploads, multi-step setup), use Progress.
- For binary or enumerated state, use Status Dot for deployments or Badge for everything else.
- Always pair the gauge with an adjacent label or Tooltip naming what the number represents (Build Cache Hit Rate). The gauge alone is not self-describing.
- Keep units in an adjacent label or Tooltip (Uptime · 99.97%); Gauge renders its own ring and optional numeric center value.
- The component sets role="progressbar" with aria-valuemin, aria-valuemax, and aria-valuenow. Don't override those.
