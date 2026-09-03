# Progress

> Route: `/components/progress`

Shows progress relative to a limit or a task.

[Back to Components](#/components)

# Progress

Progress

Shows progress relative to a limit or a task.

## When to use

- Use Progress for deterministic work whose total is knowable, such as file uploads, multi-step setup, build steps, or batch deletions.
- Pair the bar with descriptive text naming the work and units (e.g., "Uploading 12 of 30 files") so the bar communicates more than an abstract number.
- Pass max as the real ceiling (max={files.length}) rather than hardcoding 100; the component computes the percentage from value / max.

## When not to use

- For short indeterminate waits (~1–3 seconds), use Spinner instead of Progress since there is no known progress to display.
- For inline copy waiting indicators (like "Saving…"), use Loading Dots rather than a progress bar.
- Do not use Progress for a vague concept with no defined upper bound—if there is no real total, consider using a Gauge.

## Examples

### Custom max

Demonstrates computing the percentage proportionally with different max values.

### Dynamic colors

Showcases a progress bar that automatically switches color based on the current progress value.

### With stops

Demonstrates marking specific milestone nodes on the progress bar, suitable for multi-stage tasks.

## Accessibility

- The Progress component sets role="progressbar" along with aria-valuemin, aria-valuemax, and aria-valuenow so screen readers announce the current progress value.
- Always pair the bar with descriptive text—a bare progress bar is not self-describing for assistive technology.
- Do not override the built-in ARIA roles and values; these are critical for WCAG compliance.

## Controlled behavior

- Progress accepts controlled value and max props; developers can drive progress changes externally and respond via onChange callbacks.
- Animated transitions are smooth and fluid—the bar interpolates between old and new values via CSS transition, avoiding jump cuts.

## Responsive behavior

- The progress bar uses a full-width layout that fills the available width of its parent container at every viewport size.
- Numeric labels remain legible at all sizes, possibly shrinking font on narrow viewports to fit within space.

## Theme behavior

- Progress bar colors and styles are entirely governed by theme variables with good contrast ratios in both dark and light modes.
- ThroughStop child positioning and styling follow theme adaptation to remain consistent across all variants.

## Live Demo

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressCustomMax6AE46D08Example() {
  return <Progress value={30} max={40} aria-label="Progress 30 of 40" />;
}
```

## Dynamic colors

0%

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ProgressDynamicColors88E87705Example() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={`${value}%`}
        labelPosition="right"
        aria-label="Dynamic colors progress"
        colors={{
          0: "var(--color-gray-1000)",
          25: "var(--color-destructive)",
          50: "var(--color-warning)",
          75: "#ff0080",
          100: "var(--color-progress)",
        }}
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Increase
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Decrease
        </Button>
      </div>
    </div>
  );
}
```

## Themed

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressThemed489AC184Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress type="success" value={100} aria-label="Success progress" />
      <Progress type="error" value={10} aria-label="Error progress" />
      <Progress type="warning" value={40} aria-label="Warning progress" />
      <Progress type="secondary" value={70} aria-label="Secondary progress" />
    </div>
  );
}
```

## With Stops

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressWithStops45480676Example() {
  return (
    <Progress
      value={30}
      type="success"
      aria-label="Progress with stops"
      stops={[
        { value: 10, tooltip: "10%", ariaLabel: "Build complete" },
        { value: 20, tooltip: "20%", ariaLabel: "Lint complete" },
        { value: 30, tooltip: "30%", ariaLabel: "Unit tests complete" },
        { value: 40, tooltip: "40%", ariaLabel: "Integration tests complete" },
        { value: 50, tooltip: "50%", ariaLabel: "Deploy ready" },
      ]}
    />
  );
}
```

## Widths

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressWidthsB33DD987Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress value={60} width={100} aria-label="Progress width 100" />
      <Progress value={60} width={200} aria-label="Progress width 200" />
      <Progress value={60} width={300} aria-label="Progress width 300" />
      <Progress value={60} width="50%" aria-label="Progress width 50%" />
      <Progress value={60} width="100%" aria-label="Progress full width" />
    </div>
  );
}
```

## Heights

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressHeights9E0B6320Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress value={60} height={4} aria-label="Progress height 4" />
      <Progress value={60} height={10} aria-label="Progress height 10" />
      <Progress value={60} height={50} aria-label="Progress height 50" />
      <Progress value={60} height={200} aria-label="Progress height 200" />
    </div>
  );
}
```

## Label Positions

left

right

top-left

top-center

top-right

bottom-left

bottom-center

bottom-right

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressLabelPositionsF2E2D4C4Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Progress value={45} label="left" labelPosition="left" aria-label="Label left" />
      <Progress value={45} label="right" labelPosition="right" aria-label="Label right" />
      <Progress value={45} label="top-left" labelPosition="top-left" aria-label="Label top left" />
      <Progress
        value={45}
        label="top-center"
        labelPosition="top-center"
        aria-label="Label top center"
      />
      <Progress
        value={45}
        label="top-right"
        labelPosition="top-right"
        aria-label="Label top right"
      />
      <Progress
        value={45}
        label="bottom-left"
        labelPosition="bottom-left"
        aria-label="Label bottom left"
      />
      <Progress
        value={45}
        label="bottom-center"
        labelPosition="bottom-center"
        aria-label="Label bottom center"
      />
      <Progress
        value={45}
        label="bottom-right"
        labelPosition="bottom-right"
        aria-label="Label bottom right"
      />
    </div>
  );
}
```

## Dynamic

40%

Animated transition

```tsx
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function ProgressDynamicB6EE7B3EExample() {
  const [value, setValue] = useState(40);

  const [animated, setAnimated] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <Progress
        value={value}
        label={`${value}%`}
        labelPosition="right"
        animated={animated}
        aria-label="Dynamic progress"
      />
      <div className="flex gap-2">
        <Button type="default" size="small" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          Increase
        </Button>
        <Button type="secondary" size="small" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          Decrease
        </Button>
      </div>
      <label className="flex items-center gap-2">
        <Toggle
          checked={animated}
          onChange={() => setAnimated((v) => !v)}
          size="small"
          aria-label="Animated transition"
        />
        <span className="text-label-13 text-muted-foreground">Animated transition</span>
      </label>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Progress } from "@/components/ui/progress";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Known progress value; null or omission renders indeterminate progress.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Determinate work whose total is knowable, like file uploads, multi-step setup, build steps, or batch deletions.
- For short indeterminate waits (~1–3s), use Spinner; for inline copy like Saving, use Loading Dots.
- Use max for the real ceiling (max={files.length}), not a hardcoded 100. The component computes the percentage from value / max.
- Pair the bar with text naming the work and units: Uploading 12 of 30 files. The bar alone doesn’t say what’s progressing.
