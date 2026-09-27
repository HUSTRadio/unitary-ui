# Pill

> Route: `/components/pill`

Clickable filter chip for toggling a query or selection.

[Back to Components](#/components)

# Pill

pill

Clickable filter chip for toggling a query or selection.

## When to use

- Use Pill for clickable filter chips that toggle a query, as opposed to a static Badge.
- Highlight the currently selected filter with variant="active" so sighted users see the active state without relying on color alone.
- Wire onClick only when the pill can actually filter; ensure the interaction is meaningful.

## When not to use

- Do not use Pill for purely presentational status labels—if no click interaction is needed, use Badge instead.
- Do not bind onClick to elements that have no actual filtering capability; promote to a Badge if the element is display-only.
- Do not stack more than four Pills in the same container—beyond that, consider switching to a select dropdown or combobox.

## Examples

### Default pill

Displays the default Pill appearance with basic text labels and optional variants.

### Active state

Demonstrates using variant="active" to highlight the currently selected filter, distinguishing active from inactive filters.

## Accessibility

- When rendered as an interactive button, Pill should have a visible focus indicator so keyboard users can navigate via Tab and activate via Enter.
- variant="active" is visual only; the caller must also pass aria-pressed or an equivalent attribute for screen-reader selection state.
- Icon-only Pills (no visible text) must have an aria-label set, otherwise screen readers cannot determine their purpose.

## Controlled behavior

Not applicable: Pill itself has no controlled properties for internal state management; selection state is managed externally via onClick callbacks without an independent state machine.

## Responsive behavior

- Pill padding and font size maintain a consistent compact ratio across all viewports, never overflowing the parent container on narrow screens.
- Pill only renders one button; implement horizontal scrolling or wrapping on the caller-owned row container.

## Theme behavior

- Each Pill variant (active vs default) has its own dark/light mode color pair that updates automatically with theme changes.
- Background and border colors use semantic values from the theme palette, ensuring brand consistency.

## Live Demo

```tsx
import { Pill } from "@/components/ui/pill";
import { useState } from "react";

export function PillDefault21B111CBExample() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      {(["all", "ready", "error"] as const).map((value) => (
        <Pill
          key={value}
          variant={active === value ? "active" : "default"}
          aria-pressed={active === value}
          onClick={() => setActive(value)}
        >
          {value}
        </Pill>
      ))}
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Pill } from "@/components/ui/pill";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Pill label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Pill for clickable filter chips that toggle a query; for a static status label use Badge instead.
- Pass variant="active" to highlight the currently selected filter so sighted users see the active state without color alone.
- Wire onClick only when the pill can actually filter; otherwise promote to a Badge.
