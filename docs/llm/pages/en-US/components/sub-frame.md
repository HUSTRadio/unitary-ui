# Sub Frame

> Route: `/components/sub-frame`

Scopes overlays to one region of a page so sheets and panels stay inside it.

[Back to Components](#/components)

# Sub Frame

sub-frame

Scopes overlays to one region of a page so sheets and panels stay inside it.

## When to use

- Use it inside app shells, device previews, or docs demo cards that need their own BottomSheet or HamburgerMenu.
- Use it when one page must demo several overlays that should not interfere with each other.

## When not to use

- Skip it when an overlay should cover the whole viewport — render BottomSheet directly.
- Reach for a plain overflow container when you only need to scroll or clip content.

## Examples

### Local overlay

Open a bottom sheet inside the frame; the overlay never leaves it.

## Accessibility

- SubFrame renders a plain div and adds no semantics; nested overlays keep their own focus trap, Escape handling, and focus return.

## Controlled behavior

Not applicable: SubFrame has no internal state; it only shares its own element with nested overlays.

## Responsive behavior

- The caller owns the frame size; detent ratios and drag distances are computed from the frame's client size.

## Theme behavior

- SubFrame sets no visual styles; nested components keep using semantic color and material tokens.

## Live Demo

This frame owns the overlay: the sheet opens inside it instead of covering the whole page.

```tsx
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SubFrame } from "@/components/ui/sub-frame";

export default function SubFrameExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <SubFrame className="flex h-80 flex-col justify-end gap-3 rounded-xl border border-border bg-background p-5">
        <span className="text-sm text-muted-foreground">
          This frame owns the overlay: the sheet opens inside it instead of covering the whole page.
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-fit rounded-md border border-border px-3 py-2 text-sm text-foreground"
        >
          Open the sheet inside the frame
        </button>
        <BottomSheet open={open} onOpenChange={setOpen} detents={[0.6]}>
          <div className="flex flex-col gap-2 px-6 pt-2 pb-8">
            <h4 className="text-label-16 font-medium text-foreground">Inside the frame</h4>
            <p className="text-copy-14 text-muted-foreground">
              Drag or dismiss it; it never leaves the frame.
            </p>
          </div>
        </BottomSheet>
      </SubFrame>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { SubFrame } from "@/components/ui/sub-frame";
```

Native props: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content rendered inside the frame; nested overlays attach to it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">clip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Clips overlays that would otherwise escape the frame. Turn it off when an overlay must overflow.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr></tbody></table>

## Best Practices

- Wrap an app shell, a device preview, or a docs demo card in Sub Frame when its overlays should stay inside that region.
- Let nested Bottom Sheet, Expand Panel, and Hamburger Menu inherit the frame instead of wiring a container ref by hand.
- Pass container={null} to the rare overlay that genuinely belongs in the document body.
- Sub Frame exists to scope overlays; when you only need scrolling or clipping, a plain overflow container is enough.
