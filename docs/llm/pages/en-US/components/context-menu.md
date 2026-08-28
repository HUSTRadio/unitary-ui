# Context Menu

> Route: `/components/context-menu`

A menu for contextual actions, revealed on right click or long press.

[Back to Components](#/components)

# Context Menu

Context Menu

A menu for contextual actions, revealed on right click or long press.

## When to use

-   Provide right-click or long-press contextual shortcut action menus on rows, files, or canvas objects.
-   Mirror every menu action in both the right-click menu and a visible Menu trigger or row button, ensuring parity between mouse-only and keyboard-only users.

## When not to use

-   ContextMenu must never be the only entry point for an action—always mirror items in a visible Menu trigger or row button so keyboard users have equivalent access.
-   Suppress the native browser menu only on the trigger area, not the entire page.

## Examples

### Basic context menu

Displays a standard contextual action menu on right-click in the trigger area with basic Title Case options.

### Disabled menu items

Demonstrates disabling certain options in the context menu, shown in grayed-out text for inoperative commands.

### Link menu items

Includes link-type options in the menu that navigate to a target page instead of executing a local action on click.

### Prefix and suffix menu items

Adds prefix icons and suffix labels to menu items, showing status indicators or auxiliary information to enhance operability.

## Accessibility

-   Set semantic aria-labels on each menu item to ensure screen readers correctly announce the action content.
-   Bind to right-click on desktop and long-press on touch; Shift+F10 on Windows/Linux opens the same menu without right-click.
-   Follow the same Title Case Verb + Noun format for menu items as Menu (e.g., 'Open in New Tab', 'Copy URL', 'Delete Deployment').

## Controlled behavior

Not applicable: ContextMenu manages its own open/closed state internally and does not expose an external value-controlled API; activating any item closes the menu.

## Responsive behavior

Not applicable: ContextMenu as a popup overlay behaves consistently across all viewport sizes without significant responsive differences.

## Theme behavior

Not applicable: ContextMenu follows system theme switching without performing custom theme-related style adjustments.

## Live Demo

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem>Item one</ContextMenuItem>
    <ContextMenuItem>Item Two</ContextMenuItem>
    <ContextMenuItem>Item Three</ContextMenuItem>
    <ContextMenuItem>Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem>Item one</ContextMenuItem>
    <ContextMenuItem disabled>Item Two</ContextMenuItem>
    <ContextMenuItem disabled>Item Three</ContextMenuItem>
    <ContextMenuItem>Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger asChild>
    <span>
      <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
        Right click here
      </div>
    </span>
  </ContextMenuTrigger>
  <ContextMenuContent className="w-[160px]">
    <ContextMenuItem href="/">Item one</ContextMenuItem>
    <ContextMenuItem href="/">Item Two</ContextMenuItem>
    <ContextMenuItem href="/">Item Three</ContextMenuItem>
    <ContextMenuItem href="/">Item Four</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

Right click here

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Triangle } from "lucide-react";

const icon = <Triangle className="size-4" aria-hidden />;

<div className="flex flex-col items-stretch justify-start gap-6 md:flex-row">
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <span>
        <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
          Right click here
        </div>
      </span>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-[160px]">
      <ContextMenuItem href="/" prefix={icon}>Item one</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Two</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Three</ContextMenuItem>
      <ContextMenuItem href="/" prefix={icon}>Item Four</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <span>
        <div className="w-[300px] rounded-[4px] border border-dashed border-[rgba(0,0,0,0.34)] py-[45px] text-center text-copy-14 text-gray-1000">
          Right click here
        </div>
      </span>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-[160px]">
      <ContextMenuItem href="/" suffix={icon}>Item one</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Two</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Three</ContextMenuItem>
      <ContextMenuItem href="/" suffix={icon}>Item Four</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled menu state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives menu state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use ContextMenu for power-user shortcuts on right-click or long-press over a row, file, or canvas object.
-   ContextMenu must never be the only entry point for an action. Mirror every item in a visible Menu trigger or row button so mouse-only and keyboard-only users have parity.
-   Bind to right-click on desktop and long-press on touch. Suppress the native browser menu only on the trigger area, not the whole page.
-   Close on activation, Escape, and outside-click. Don't close on hover-out.
-   Items follow the same rules as Menu: Title Case Verb + Noun (Open in New Tab, Copy URL, Delete Deployment). Bare verbs are wrong.
-   Group destructive items at the bottom with a divider and keep the destructive label Verb + Noun.
-   The keyboard menu key (Shift+F10 on Windows/Linux) opens the same menu without right-click.
