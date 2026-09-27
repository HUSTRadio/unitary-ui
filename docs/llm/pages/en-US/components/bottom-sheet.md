# Bottom Sheet

> Route: `/components/bottom-sheet`

Presents mobile actions or supporting content at draggable height detents.

[Back to Components](#/components)

# Bottom Sheet

bottom-sheet

Presents mobile actions or supporting content at draggable height detents.

## When to use

- For related mobile actions, filters, or supporting details that should preserve the current page context.
- When content needs to expand between a small set of meaningful height detents through direct dragging.

## When not to use

- Use Modal for a blocking confirmation or full desktop form; Bottom Sheet is a contextual mobile layer.
- Use Sheet for an edge panel that does not depend on vertical height detents.

## Examples

### Controlled multi-detent sheet

Owns the sheet through open, onOpenChange, and detents while keeping an explicit close action in the content.

## Accessibility

- The component uses Radix Dialog, whose primitives constrain focus while open and support Escape and backdrop dismissal.
- Begin the content with a clear visible heading and description, and never make dragging the only way to reach the primary action.
- The multi-detent indicator is a vertical slider: ArrowUp / ArrowRight increments, ArrowDown / ArrowLeft decrements, and Home / End moves to the first or last detent. Arrow keys clamp instead of wrapping; Enter / Space and click keep cycling.
- Height and entrance transitions are removed under prefers-reduced-motion: reduce.

## Controlled behavior

- Passing open makes the caller own visibility; omitting open uses internal state. Both modes report changes through onOpenChange.
- Drag release, click cycling, and keyboard adjustment report the target index through onDetentChange. A controlled detent must be fed back by the caller; uncontrolled usage updates the height immediately. Dragging below the lowest detent closes only when collapseDown permits it.

## Responsive behavior

- By default, Bottom Sheet docks to the mobile viewport bottom with detent × 100dvh height. With a positioned container, the sheet and backdrop stay inside it and detents use its height. Prefer Modal or Sheet for desktop-wide flows.
- Bottom padding includes safe-area-inset-bottom so actions remain clear of device safe areas.

## Theme behavior

- The panel uses background and border theme tokens while the overlay remains translucent black; no separate light or dark palette is required.

## Live Demo

```tsx
import * as React from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

export function BottomSheetDefault37A8EEC1Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <BottomSheet open={open} onOpenChange={setOpen} detents={[0.45, 0.8]}>
        <div className="space-y-4 p-6">
          <div>
            <h2 className="font-semibold">Deployment Actions</h2>
            <p className="text-sm text-muted-foreground">
              Choose what to do with the current deployment.
            </p>
          </div>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Close Actions
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { BottomSheet } from "@/components/ui/bottom-sheet";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional positioned container for the sheet and backdrop; detents use its height instead of viewport height.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detents</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Height detents as viewport-height fractions; sheets with fewer than two detents hide the grabber (HIG automatic).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">[0.5, 1]</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showIndicator</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic" | boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Grabber visibility strategy; automatic renders it only for multiple detents. The grabber is a vertical slider supporting Arrow keys and Home/End.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gestures</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Per-gesture toggles: drag-to-resize, expand past the top detent, collapse when dragged below the lowest detent.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">全开</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state (uncontrolled when omitted).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Open-state change callback.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detent</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled detent index into `detents` (uncontrolled when omitted).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDetentChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called with the target detent index after drag, click, or keyboard adjustment. In controlled mode the caller must feed the value back through detent.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible name for the panel when no visible heading exists.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-labelledby</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Names the panel from an external element, such as a heading rendered by the content layer.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Bottom Sheet for mobile actions or supporting content that should preserve the current page context.
- Choose a small set of meaningful detents and keep the initial detent large enough to reveal the sheet's purpose.
- Keep primary actions visible without requiring a drag, and let Escape, the backdrop, or a downward dismissal close the sheet.
- Use Modal for blocking desktop decisions and Sheet for edge panels that are not driven by vertical detents.
- For a share-target grid or a one-shot action list, use ActivityView — it is built on this component at a single 0.6 detent.
