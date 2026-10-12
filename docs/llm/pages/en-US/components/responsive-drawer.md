# Responsive Drawer

> Route: `/components/responsive-drawer`

Use one drawer that opens from the bottom on phones and from the right on desktops, with bottom height detents.

[Back to Components](#/components)

# Responsive Drawer

responsive-drawer

Use one drawer that opens from the bottom on phones and from the right on desktops, with bottom height detents.

## When to use

- Use it when the same content needs a bottom action panel on phones and a right-side detail panel on desktops.
- Enable responsive to choose the panel direction by screen width, with an overlay, focus management, and dismissal controls.
- When the bottom form needs height steps (peek at a summary, then drag to full height for detail): express them with detents, which reuse BottomSheet's snap semantics.

## When not to use

- Use Drawer when you need its height behavior and show/onDismiss API; ResponsiveDrawer uses a different API.
- The side panel has no drag affordance by design; passing detents to right / left is a misuse and has no effect.
- When the content simply doesn't fit and you don't need an overlay or focus trap, use page layout or Scroller instead of hiding navigation inside a drawer.

## Examples

### Default right panel

Built-in header close button, an independently scrolling body, and a right-aligned footer; focus returns to the trigger on close.

### Responsive form-factor switch

With responsive enabled the panel slides in from the bottom below 640px and from the right above it — no app-level branching.

### Bottom detents with drag

placement="bottom" with detents=\[0.4, 0.8, 1\]: the indicator tracks your finger, snaps to the nearest step on release, and dismisses past the lowest step.

## Accessibility

- Built on Radix Dialog: focus moves into the panel on open, Tab is trapped inside, Escape and outside press dismiss, and focus returns to the trigger on close.
- ResponsiveDrawerTitle / ResponsiveDrawerDescription are wired to the panel through Radix's aria-labelledby / aria-describedby so screen readers announce the name and description.
- The header's built-in close button always has an accessible name (the localized Close when there is no visible label); its icon is aria-hidden and carries no meaning on its own.
- In the bottom form the drag indicator is a vertical role="slider" with aria-valuemin/valuemax/valuenow/orientation. ArrowUp / ArrowRight increments, ArrowDown / ArrowLeft decrements, and Home / End moves to either boundary without wrapping; Enter / Space and click keep cycling.

## Controlled behavior

- Supports controlled (open + onOpenChange) and uncontrolled (defaultOpen) usage, matching the other overlay components.
- onDetentChange reports the target index after drag snapping, click cycling, or keyboard adjustment so callers can remember the last height; it is not fired during finger tracking. If detents shrinks at runtime, the current index clamps to the new maximum.

## Responsive behavior

- With responsive enabled, widths below 640px use a bottom panel with rounded top corners, safe-area padding, and optional height detents. At 640px and above, a right-side panel has an 8px inset.
- With a fixed placement, side panels degrade to a three-quarter-width full-height panel on narrow viewports so they never become too cramped to use.
- The footer stacks in reverse order on mobile (primary action on top) and becomes a right-aligned row at 640px and above; the body always scrolls independently while header and footer stay pinned.

## Theme behavior

- The panel uses bg-background and border-border semantic tokens, matching the Drawer / Sheet family in both themes.
- Shadows come from the --material-shadow-menu token (the dark theme's inner light ring is overridden by the token), never from light-theme literals.
- Open/close motion uses --uni-motion-expansive (500ms) with ease-snap; finger tracking has no transition, and everything degrades under prefers-reduced-motion.

## Live Demo

```tsx
import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@hustradio/unitary-ui";

export function ResponsiveDrawerDefault9F2C7A41Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen}>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              The panel slides in from the right on desktop, keeps its own scrollable body, and
              returns focus to the trigger when closed.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" type="error" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## Responsive

```tsx
import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@hustradio/unitary-ui";

export function ResponsiveDrawerResponsive4B8E1D6CExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen} responsive>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              With responsive enabled the panel uses the bottom geometry below 640px and the side
              panel above it, so one drawer covers phone and desktop without branching in app code.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## Detents

```tsx
import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@hustradio/unitary-ui";

export function ResponsiveDrawerDetents7A3F5E92Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        detents={[0.4, 0.8, 1]}
      >
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              Drag the indicator or focus it and use Arrow keys to move between the 40%, 80%, and
              full-height detents; Home and End jump to either boundary. Dragging below the lowest
              detent dismisses the drawer. The snap uses the project ease-snap curve, and drag
              tracking itself has no transition so the panel stays under your finger.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  ResponsiveDrawer,
  ResponsiveDrawerTrigger,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerDescription,
  ResponsiveDrawerBody,
  ResponsiveDrawerFooter,
  ResponsiveDrawerClose,
} from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when the drawer opens or closes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">responsive</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bottom geometry below 640px and a right panel above it; takes precedence over placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom" | "right" | "left" | "top"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Fixed edge for the panel.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detents</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bottom height steps as viewport ratios; ignored by side placements. The slider indicator supports Arrow keys plus Home and End.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">[0.5, 1]</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showIndicator</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic" | boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Drag indicator policy; automatic renders it for multiple detents. The bottom grabber is a vertical slider supporting Arrow keys and Home/End.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gestures</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Toggles for the bottom drag gestures.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "md" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Side panel width step.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDetentChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called with the target index after drag, click, or keyboard adjustment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Reach for ResponsiveDrawer when the same information architecture has to work on phone and desktop; keep the mirrored Drawer / Sheet / BottomSheet for their fixed contracts.
- Turn on responsive instead of branching in app code: below 640px it uses the bottom geometry, above it docks to the right edge with 8px inset.
- Add detents (plus the automatic grabber) only for bottom geometry — a side panel has no drag affordance by design.
- Use the built-in Header for the title/description pair and the close button, and let Body own scrolling so the footer stays reachable.
