# Side Panel

> Route: `/components/side-panel`

A controlled desktop side panel with optional non-modal behavior.

[Back to Components](#/components)

# Side Panel

Unitary Side Panel

A controlled desktop side panel with optional non-modal behavior.

## When to use

- Use it for a dismissible desktop side detail or action surface.

## When not to use

- Use Drawer for mobile bottom actions, or ResponsiveDrawer for a shared cross-device flow.

## Examples

### Right-side details

Open and close a controlled panel with focus restored to its trigger.

## Accessibility

- Name the dialog with SidePanelTitle; Escape and the close button return focus to the original trigger.

## Controlled behavior

- Manage show with onDismiss; noOverlay switches to non-modal mode while outside presses still call onDismiss.

## Responsive behavior

- Width follows --uni-drawer-width; mobile bottom-sheet behavior is outside this component's scope.

## Theme behavior

- The panel and backdrop use shared material, surface, and stacking tokens.

## Live Demo

```tsx
import { useState } from "react";
import {
  SidePanel,
  SidePanelClose,
  SidePanelDescription,
  SidePanelTitle,
} from "@/components/ui/side-panel";

export default function SidePanelExample() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        type="button"
        className="rounded-md border border-border px-4 py-2"
        onClick={() => setShow(true)}
      >
        Open details
      </button>
      <SidePanel show={show} onDismiss={() => setShow(false)}>
        <div className="flex items-center justify-between gap-4">
          <SidePanelTitle>Project details</SidePanelTitle>
          <SidePanelClose aria-label="Close details">Close</SidePanelClose>
        </div>
        <SidePanelDescription className="mt-3">
          Review project information without leaving the current page.
        </SidePanelDescription>
      </SidePanel>
    </>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  SidePanel,
  SidePanelTitle,
  SidePanelDescription,
  SidePanelClose,
} from "@/components/ui/side-panel";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">show</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after Escape, outside press, or a close action; caller updates show.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Panel docking edge.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noOverlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Omits the backdrop and switches to non-modal behavior.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Panel content, including a title and an explicit close control.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use SidePanel for a desktop detail or action surface; use Drawer for mobile bottom actions and ResponsiveDrawer for a shared responsive flow.
- Pair show with onDismiss and provide a SidePanelTitle so the dialog has an accessible name.
- Set noOverlay only when the page behind the panel must remain interactive; it also disables modal focus trapping and scroll locking.
