# Slider

> Route: `/components/slider`

Drag a slider to choose a value within a numeric range.

[Back to Components](#/components)

# Slider

slider

Drag a slider to choose a value within a numeric range.

## When to use

- Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
- Pair the slider with a numeric Input for exact values like port numbers or memory limits, where keyboard users prefer typing.
- Snap to a sensible step (1, 5, 10%) so dragging never produces odd values like 47.83291; clamp min and max to real product limits.

## When not to use

- Where a specific discrete value needs exact selection, use Select, Input, or Combobox instead of a slider.
- For fewer than 4 mutually exclusive options, use a Radio Group for clarity rather than forcing a slider.
- Avoid using the slider as the sole input method on mobile—touch drag accuracy is limited; always provide a numeric fallback.

## Examples

### Default slider

Displays a default-styled Range Slider with its track and thumb.

### Step and maximum

Demonstrates a Range Slider with custom step sizes and bounds.

### With label

Demonstrates the label prop providing a visible and accessible name above the track.

## Accessibility

- Give the slider an accessible name through a sibling <label htmlFor> or aria-label; native arrow-key, Page Up/Down, Home/End behavior handles keyboard input.
- For exact values, explicitly enable showStartInput/showEndInput or render a caller-owned adjacent value with units.
- Disabled sliders still need a Tooltip naming the reason—a greyed slider with no explanation reads as a bug.

## Controlled behavior

- Slider accepts value/defaultValue: value is controlled, while onValueChange fires for drag, keyboard, and the optional numeric-input path and hands the new value back to the parent.
- onValueCommit fires once a track interaction settles (onValueCommitted is a compatibility alias); repeated calls within the same turn are collapsed, making it safe under StrictMode.
- A disabled thumb prevents all keyboard and mouse input, useful for temporarily locking settings.

## Responsive behavior

Not applicable: The track fills its container, but the component does not resize labels at breakpoints or guarantee a 44px touch target. Validate mobile layout and hit area in caller code.

## Theme behavior

- Track color, active-fill background, and thumb styles follow theme variables, with corresponding palettes in both dark and light modes.
- There is no dedicated color prop. Brand overrides belong in the surrounding style or token layer.

## Live Demo

```tsx
import { Slider } from "@/components/ui/slider";

export function SliderDefault37A8EEC1Example() {
  return <Slider defaultValue={[50]} aria-label="Value" />;
}
```

## Step max

```tsx
import { Slider } from "@/components/ui/slider";

export function SliderStepMax1112E58CExample() {
  return <Slider defaultValue={[20]} step={10} max={50} marks aria-label="Value in steps of 10" />;
}
```

## With label

Volume

```tsx
import { Slider } from "@/components/ui/slider";

export function SliderWithLabelBB9F6883Example() {
  return <Slider label="Volume" defaultValue={[40]} />;
}
```

## Range with inputs

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function SliderRangeWithInputs16EAD947Example() {
  const [value, setValue] = useState([50, 75]);

  return (
    <Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />
  );
}
```

## Disabled range with inputs

```tsx
import { Slider } from "@/components/ui/slider";

export function SliderDisabledRangeWithInputsFCA5E8B4Example() {
  return <Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />;
}
```

## Commit on release

Drag then release

Last committed: —

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function SliderCommitOnRelease97B1700EExample() {
  const [committed, setCommitted] = useState<number | null>(null);

  return (
    <>
      <Slider
        label="Drag then release"
        defaultValue={[50]}
        onValueCommit={(value) => setCommitted(value[0] ?? null)}
      />
      <p className="mt-2 text-copy-13 text-muted-foreground">
        Last committed: {committed === null ? "—" : committed}
      </p>
    </>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Slider } from "@/components/ui/slider";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called for every value change from dragging, keyboard input, or the numeric inputs.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marks</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | Array&lt;{ value: number; label?: string }&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Tick marks: `true` generates one per step (max 50), or an explicit array.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">markLabelFormat</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats labels for marks without an explicit label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Canonical callback after a committed change.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
- For exact values like a port number or memory limit, pair the slider with a numeric Input; keyboard users default to typing.
- Snap to a sensible step (1, 5, 10%) so dragging never produces values like 47.83291. Clamp min and max to real product limits.
- For exact values, enable showStartInput/showEndInput or render an adjacent caller-owned value with units. The label prop names the slider but does not display its value.
- Give the slider an accessible name through a sibling <label htmlFor> or aria-label, and let the native arrow-key, Page Up/Down, Home/End behavior do the keyboard work. Don't intercept those keys.
