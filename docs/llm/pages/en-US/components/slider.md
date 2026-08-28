# Slider

> Route: `/components/slider`

An input to select a value from a given range.

[Back to Components](#/components)

# Slider

Slider

An input to select a value from a given range.

## When to use

-   Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
-   Pair the slider with a numeric Input for exact values like port numbers or memory limits, where keyboard users prefer typing.
-   Snap to a sensible step (1, 5, 10%) so dragging never produces odd values like 47.83291; clamp min and max to real product limits.

## When not to use

-   Where a specific discrete value needs exact selection, use Select, Input, or Combobox instead of a slider.
-   For fewer than 4 mutually exclusive options, use a Radio Group for clarity rather than forcing a slider.
-   Avoid using the slider as the sole input method on mobile—touch drag accuracy is limited; always provide a numeric fallback.

## Examples

### Default slider

Displays a default-styled Range Slider with track, thumb, and current value indicator.

### Step and maximum

Demonstrates a Range Slider with custom step sizes and bounds.

### With label

Demonstrates a Range Slider that displays the live value next to the track alongside a unit label.

## Accessibility

-   Give the slider an accessible name through a sibling <label htmlFor> or aria-label; native arrow-key, Page Up/Down, Home/End behavior handles keyboard input.
-   Always render the live value next to the track with a label describing what the number represents (e.g., "Sample Rate · 44 kHz") so screen readers understand the context.
-   Disabled sliders still need a Tooltip naming the reason—a greyed slider with no explanation reads as a bug.

## Controlled behavior

-   Slider supports both controlled and uncontrolled modes; developers can listen to value changes via the onChange callback and update external state.
-   A disabled thumb prevents all keyboard and mouse input, useful for temporarily locking settings.

## Responsive behavior

-   The slider track scales proportionally across all screen widths, and the thumb hit area meets minimum touch-target requirements on every viewport.
-   On narrow screens label text auto-sizes down to prevent the value and unit from wrapping or overflowing.

## Theme behavior

-   Track color, active-fill background, and thumb styles follow theme variables, with corresponding palettes in both dark and light modes.
-   Custom colors can be passed via props to align with brand primary tones.

## Live Demo

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);

<Slider value={value} onValueChange={setValue} aria-label="Value" />
```

```tsx
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[20]} step={10} max={50} marks aria-label="Value in steps of 10" />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([40]);

<Slider label="Volume" value={value} onValueChange={setValue} />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50, 75]);

<Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />
```

```tsx
import { Slider } from "@/components/ui/slider";

<Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />
```

```tsx
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);
const [committed, setCommitted] = useState<number | null>(null);

<Slider
  label="Drag then release"
  value={value}
  onValueChange={setValue}
  onValueCommitted={(value) => setCommitted(value[0] ?? null)}
/>
<p className="mt-2 text-copy-13 text-gray-900">
  Last committed: {committed === null ? "—" : committed}
</p>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Slider } from "@/components/ui/slider"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marks</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | Array&lt;{ value: number; label?: string }&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Tick marks: `true` generates one per step (max 50), or an explicit array.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">markLabelFormat</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats labels for marks without an explicit label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Canonical callback after a committed change.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueCommitted</code><span class="ml-2 text-label-12 text-muted-foreground">Deprecated</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number[]) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Compatibility alias for onValueCommit.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
-   For exact values like a port number or memory limit, pair the slider with a numeric Input; keyboard users default to typing.
-   Snap to a sensible step (1, 5, 10%) so dragging never produces values like 47.83291. Clamp min and max to real product limits.
-   Always render the live value next to the track in tabular nums, and label what the number represents (Sample Rate · 44 kHz). The track alone is not self-describing.
-   Give the slider an accessible name through a sibling <label htmlFor> or aria-label, and let the native arrow-key, Page Up/Down, Home/End behavior do the keyboard work. Don't intercept those keys.
