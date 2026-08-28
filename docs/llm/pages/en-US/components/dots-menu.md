# Dots Menu

> Route: `/components/dots-menu`

An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown.

[Back to Components](#/components)

# Dots Menu

Dots Menu

An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown.

## When to use

- Where space is limited on rows, cards, or resource items and you need to surface additional related actions.
- As a complement to Context Menu: Dots Menu handles visible triggers with keyboard/mouse parity, while right-click shortcuts are handled by Context Menu.

## When not to use

- When there are more than 10 actions — consider using Split Button + Menu with grouping or navigate to a dedicated settings page.
- The single most common action should not be buried in a Dots Menu — place it prominently.
- Right-click contextual actions belong in Context Menu, not solely behind a Dots Menu trigger.

## Examples

### Default dots menu

Basic usage showing the default three-dot icon triggering a dropdown menu.

### Sizes

Different dot-menu sizes to fit various density layouts and contexts.

### Disabled dots menu

Disabling the dots menu when the resource has no available actions, providing visual feedback.

### Disabled menu item

Some menu items are disabled due to permissions or conditions, while others remain active.

## Accessibility

- The three-dot icon button requires a clear aria-label so screen readers announce the menu purpose.
- Escape closes the menu and returns focus to the trigger.
- Arrow keys move focus through items; Enter or Space activates the selected item.

## Controlled behavior

- Menu open state is controlled by the parent via the open prop for show and hide.
- Items close automatically on activation and execute the corresponding action, returning focus to the trigger.
- In controlled mode the menu can be opened or closed programmatically.

## Responsive behavior

- Position strategy auto-flips based on window bounds to avoid clipping on narrow viewports.
- Touch targets expand in large-spacing environments for better tap accuracy.

## Theme behavior

- Background, border, and highlight colors follow the application theme system.
- Disabled-state tones are sourced from CSS variables ensuring consistency across light and dark modes.

## Live Demo

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>;
```

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<div className="flex items-start gap-6">
  <DotsMenu iconSize={10}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
  <DotsMenu iconSize={12}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
  <DotsMenu iconSize={18}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
</div>;
```

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu disabled>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>;
```

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem disabled>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { DotsMenu, DotsMenuItem, DotsMenuSeparator } from "@/components/ui/dots-menu";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"start" | "center" | "end"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Menu alignment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
