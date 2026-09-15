# Scroller

> Route: `/components/scroller`

Displays an overflowing list of items.

[Back to Components](#/components)

# Scroller

Scroller

Displays an overflowing list of items.

## When to use

- When you need to present an overflowing list of peer items in a single direction, such as chip rows, log streams, or tile grids.
- When the container is smaller than the total content and users should discover clipped items through directional scrolling.

## When not to use

- When items require free-form two-dimensional layout; a grid component serves that purpose better.
- When the goal is purely visual separation rather than scrollable overflow; use a separator or spacing instead.

## Examples

### Vertical scrolling container

A basic vertically scrolling example where a fixed-height container reveals longer inner content with a vertical scrollbar.

### Horizontal chip rail

Horizontally arranged tag cards suitable for filter chips rows or tile-style showcases.

## Accessibility

- Each child item within the scroll area has independent semantics and an accessible name.
- Tab order follows DOM order, so place items in reading order regardless of the scroll direction.

## Controlled behavior

Not applicable: The scroller is primarily passive in nature; its scroll position is handled natively by the browser and is typically not exposed for parent-controlled manipulation.

## Responsive behavior

- Can adapt the scroll axis based on viewport width: horizontal scrolling for wider screens, falling back to vertical or no scrolling on narrower viewports.

## Theme behavior

- Supports custom border radius, shadows, and dark-mode adaptation on the scroll area; edge-fade masks can also be tweaked via styles.

## Live Demo

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerVertical727CD3A6Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="y" width="100%">
        <div className="flex flex-col items-stretch justify-start gap-4" style={{ width: 400 }}>
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
        </div>
      </Scroller>
    </div>
  );
}
```

## Horizontal

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontal0ABBA441Example() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height="100%" overflow="x" width="100%">
        <div
          className="flex flex-row items-stretch justify-start gap-4"
          style={{ minWidth: "120%" }}
        >
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
          <div className="h-64 w-64 bg-primary" />
        </div>
      </Scroller>
    </div>
  );
}
```

## Free

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerFreeF411A1FBExample() {
  return (
    <div className="w-full max-w-2xl">
      <Scroller height={220} overflow="both" width="100%">
        <div className="grid grid-flow-col grid-rows-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-96 w-96 bg-primary" />
          ))}
        </div>
      </Scroller>
    </div>
  );
}
```

## Vertical with buttons

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerVerticalWithButtonsEB1E78D8Example() {
  return (
    <div className="flex max-w-full flex-col gap-4">
      <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-60 w-96 shrink-0 bg-primary" />
        ))}
      </Scroller>
    </div>
  );
}
```

## Horizontal with buttons

```tsx
import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontalWithButtons29D25875Example() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Scroller
        childrenContainerClassName="gap-4"
        height="100%"
        overflow="x"
        width="100%"
        withButtons
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-64 w-96 shrink-0 bg-primary" />
        ))}
      </Scroller>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Scroller } from "@/components/ui/scroller";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overflow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"x" | "y" | "both"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Scrollable axes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"x"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Scroller height.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"100%"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Scroller width.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"100%"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">withButtons</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows direct-child navigation buttons.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">childrenContainerClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Class name for the scrolling children container.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Scroller for an overflowing list of peer items along a single axis: chip rows, log streams, code snippets, command palettes.
- Pick vertical for stacked feeds, horizontal for chip and tile rails, free only when content genuinely scrolls in both directions.
- Show edge fade or shadow affordances on the clipped axis so users see there's more content past the viewport.
- Keep item widths and gaps consistent in horizontal scrollers; ragged edges break the snap rhythm and make the rail feel broken.
- Tab order follows DOM order, so place items in reading order regardless of visual scroll direction.
