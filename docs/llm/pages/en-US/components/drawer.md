# Drawer

> Route: `/components/drawer`

Displays content in a separate bottom view from the existing context.

[Back to Components](#/components)

# Drawer

Drawer

Displays content in a separate bottom view from the existing context.

## When to use

- On small viewports for short focused actions: a single form, a filter sheet, or a primary CTA paired with Cancel.
- When you need to present auxiliary content while keeping the browsing context intact without requiring a desktop-side-panel–level persistent surface.

## When not to use

- Don't use Drawer to confirm destructive actions — the lack of a fully blocking dim weakens the severity signal delete and revoke flows need.
- Use Sheet on desktop for persistent associated context instead of a Drawer.
- Long multi-step forms should route to a dedicated page rather than squeezed into a Drawer.

## Examples

### Default drawer

A drawer that slides up from the bottom covering most of the viewport, used for short forms or info panels.

### Custom height

Controlling the drawer's viewport proportion via the custom height prop to match different content volumes.

## Accessibility

- Focus is trapped inside the drawer while open and returned to the trigger element on close.
- Escape closes the drawer, ensuring a complete keyboard exit path.
- DrawerTitle should be a Title Case noun phrase naming the displayed resource entity.

## Controlled behavior

- The open state is fully controlled by the parent — internals do not manage open/close independently.
- Close callbacks notify the parent to synchronize external state.
- Body scroll is locked while open and restored on close.

## Responsive behavior

- Designed for mobile — use only on small viewports; replace with Sheet on desktop.
- Swipe-down gesture dismissal is supported natively for natural touchscreen interaction.
- Custom height prop allows flexible adaptation to different content needs.

## Theme behavior

- Backdrop shadow and divider colors follow the application theme.
- Body scroll lock maintains proper contrast in both dark and light themes.

## Live Demo

```tsx
import { Button } from "@/components/ui/button";
import { Drawer, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";

export function DrawerDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="secondary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
        <div className="flex flex-col items-stretch justify-start gap-2 p-12">
          <DrawerTitle className="text-center">A drawer title</DrawerTitle>
          <DrawerDescription className="text-center">Drawer body</DrawerDescription>
        </div>
      </Drawer>
    </>
  );
}
```

## Custom height

```tsx
import { Button } from "@/components/ui/button";
import { Drawer, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";

export function DrawerCustomHeight986065F9Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer height={200} show={open} onDismiss={() => setOpen(false)} verticalScroll>
        <div className="flex flex-col items-stretch justify-start gap-2 p-12">
          <DrawerTitle className="text-center">A drawer title</DrawerTitle>
          <DrawerDescription className="text-center">Drawer body</DrawerDescription>
        </div>
      </Drawer>
    </>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Drawer, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">show</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled drawer state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after Escape, outside press, or a dismissal gesture.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional panel height in pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Only use Drawer on small viewports. For a desktop side panel that keeps the page interactive, use Sheet; for a blocking decision, use Modal.
- Don’t use Drawer to confirm destructive actions. The lack of a fully blocking dim weakens the severity signal that delete and revoke flows need; route to Modal.
- A Drawer is good for short focused mobile actions: a single form, a filter sheet, a primary CTA paired with Cancel.
- Tap-outside and swipe-down dismiss by default; preserve both unless the form has dirty input.
- DrawerTitle is a Title Case statement that names the entity (Deployment Details, Filter Logs). Body is sentence case prose with one primary Verb + Noun button and a literal Cancel.
- Trap focus inside the drawer while open and return focus to the trigger on close. Escape closes the drawer.
- Lock body scroll on open and restore it on close so iOS rubber-band scroll doesn’t leak through.
