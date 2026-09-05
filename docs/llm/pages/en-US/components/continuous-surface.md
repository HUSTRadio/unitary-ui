# Continuous Surface

> Route: `/components/continuous-surface`

Clips a measured surface with independently derived continuous corners and a circular fallback.

[Back to Components](#/components)

# Continuous Surface

Continuous Surface

Clips a measured surface with independently derived continuous corners and a circular fallback.

## When to use

- Use it for isolated cards, tiles, or near-square brand-neutral surfaces when shape is an intentional design-system semantic.
- Use continuousCornerPath with straight sides for rectangular cards; reserve a full superellipse for near-square icons or avatars.
- Use it when a responsive surface must preserve one visual radius and curve family after resizing.

## When not to use

- Do not apply it mechanically to every container; ordinary border-radius is lighter and more stable.
- Do not use a full superellipse on a high-aspect-ratio surface because the long sides can look barrel-shaped.
- Do not copy exact paths from platform resources or use platform-brand names for the curve.

## Examples

### Curve comparison

Compares the exact circular p=2 baseline, default p=3 continuous curve, and emphasized p=5 curve.

## Accessibility

- The component preserves native div attributes; add a landmark, heading, or accessible name when the content requires one.
- Shape is only a visual grouping cue and must not be the sole carrier of state or interactive meaning.

## Controlled behavior

Not applicable: ContinuousSurface has no controlled state.

## Responsive behavior

- ResizeObserver watches the local border-box, independent of ancestor transforms; the radius is capped at half the shorter side.
- SSR and browsers without path() support use border-radius; enhancement resets that radius to avoid clipping the painted background twice.

## Theme behavior

- The component owns clipping; callers provide color. CSS borders do not trace the path, and finite line-segment sampling is not strictly continuous curvature.
- Place shadows on a parent wrapper because clip-path clips the surface's own box-shadow.

## Live Demo

**Circular · p=2**Straight sides, measured corners

**Continuous · p=3**Straight sides, measured corners

**Emphasized · p=5**Straight sides, measured corners

**Superellipse · n=5**Full curve, near-square surfaces

```tsx
import { useId } from "react";

import { ContinuousSurface } from "@/components/ui/continuous-surface";
import { superellipsePath } from "@/lib/continuous-corner";

const curves = [
  { label: "Circular · p=2", exponent: 2 },
  { label: "Continuous · p=3", exponent: 3 },
  { label: "Emphasized · p=5", exponent: 5 },
] as const;

export function ContinuousSurfaceDefault37A8EEC1Example() {
  const clipId = useId();
  return (
    <div className="grid gap-6 sm:grid-cols-4">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={superellipsePath(1, 1, { exponent: 5 })} />
          </clipPath>
        </defs>
      </svg>
      {curves.map((curve) => (
        <div key={curve.exponent} className="rounded-3xl shadow-lg">
          <ContinuousSurface
            data-curve={curve.exponent}
            radius={24}
            exponent={curve.exponent}
            className="flex aspect-[4/3] flex-col justify-end bg-gradient-to-br from-blue-600 to-purple-700 p-5 text-white"
          >
            <strong>{curve.label}</strong>
            <span className="mt-1 text-sm text-white/80">Straight sides, measured corners</span>
          </ContinuousSurface>
        </div>
      ))}
      <div className="rounded-3xl shadow-lg">
        <div
          data-curve="superellipse"
          aria-label="Superellipse tile"
          className="flex aspect-[4/3] flex-col justify-end bg-gradient-to-br from-teal-600 to-blue-700 p-5 text-white"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <strong>Superellipse · n=5</strong>
          <span className="mt-1 text-sm text-white/80">Full curve, near-square surfaces</span>
        </div>
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ContinuousSurface } from "@/components/ui/continuous-surface";
```

Native props: `HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">radius</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visual corner radius in CSS pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">12</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">exponent</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Curve exponent; 2 is circular.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">3</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">samples</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Line segments sampled per non-circular corner.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">24</td></tr></tbody></table>

## Best Practices

- Use ContinuousSurface for isolated cards or tiles where continuous curvature is a deliberate shape-system choice.
- Keep the default exponent unless a documented shape token calls for another value; exponent 2 is the circular baseline.
- Place shadows on a parent wrapper because clip-path clips the surface's own shadow.
- Prefer continuous corners with straight sides for rectangular cards; reserve a full superellipse for near-square icon or avatar surfaces.
- Keep border-radius as the fallback and avoid brand-specific curve names or copied platform paths.
