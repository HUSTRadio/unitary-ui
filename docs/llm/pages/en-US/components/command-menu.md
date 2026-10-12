# Command Menu

> Route: `/components/command-menu`

Search resources, navigate to pages, or run commands from a panel with keyboard support.

[Back to Components](#/components)

# Command Menu

command-menu

Search resources, navigate to pages, or run commands from a panel with keyboard support.

## When to use

- Provide a global keyboard shortcut (⌘K on macOS, Ctrl+K elsewhere) triggered command palette to search resources, navigate pages, or execute actions across the application.
- When menu item count could exceed roughly 30 items that would span multiple categories or recent usage, group them into separate pages rather than presenting a single flat list.

## When not to use

- If the menu only serves contextual actions on a single visible trigger element, use Menu instead; for right-click row actions, use ContextMenu.
- Do not reuse the ⌘K/Ctrl+K binding for any in-page filter input—it is reserved as a global shortcut.

## Examples

### Basic command palette

Renders a searchable command palette whose visibility is controlled by the parent through open/setOpen; the app may bind a global shortcut separately.

### Command palette with dividers

Uses separators to distinguish different functional groups in the command palette, improving visual hierarchy and browsing efficiency.

### Command palette with suffix labels

Adds suffix labels to command items to show auxiliary information such as keyboard shortcuts or status indicators.

## Accessibility

- Keep focus inside the open panel. Escape closes it and returns focus to the trigger.
- Each command item should provide a clear Title Case verb phrase description (e.g., 'Deploy Project'), avoiding ambiguous phrasing.
- Show a recent or default item set when the input is empty so the menu is useful before typing.

## Controlled behavior

- CommandMenu requires the parent to provide open and setOpen; any global ⌘K / Ctrl+K listener is also implemented at the application layer.
- Activating a command runs the caller-provided action; the component does not expose the current command as a controlled value.

## Responsive behavior

Not applicable: CommandMenu is a modal overlay that maintains a similar appearance across different screen sizes, without significant responsive layout changes.

## Theme behavior

Not applicable: CommandMenu follows system theme mode (dark/light) and does not perform custom layout adjustments for specific theme states.

## Live Demo

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function CommandMenuDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem callback={() => {}}>Figma Import</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Commands">
            <CommandMenuItem callback={() => {}}>Import Extension</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Manage Extensions</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Collaboration">
            <CommandMenuItem callback={() => {}}>Flags Explorer</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## With divider

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function CommandMenuWithDivider5A6D5780Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuItem callback={() => {}}>Item 1</CommandMenuItem>
          <CommandMenuItem callback={() => {}}>Item 2</CommandMenuItem>
          <CommandMenuDivider />
          <CommandMenuItem callback={() => {}}>Item 3</CommandMenuItem>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}}>Grouped Item 1</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Grouped Item 2</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## With suffix

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@hustradio/unitary-ui";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export function CommandMenuWithSuffixED17650BExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}} suffix={<span>USA</span>}>
              United States of America
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>ESP</span>}>
              Spain
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>FRA</span>}>
              France
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Group 2">
            <CommandMenuItem callback={() => {}} suffix={<span>AUT</span>}>
              Austria
            </CommandMenuItem>
            <CommandMenuItem
              callback={() => {}}
              suffix={<CircleCheck className="size-4 text-gray-700" />}
            >
              Switzerland
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>GER</span>}>
              Germany
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuDivider,
} from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled dialog state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called for open and close requests.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">callback</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Runs the command's action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use CommandMenu for a global, keyboard-first command palette that finds resources and runs actions across the app. For a menu opened from a visible trigger on a single resource, use Menu; for right-click on a row, use ContextMenu.
- Group items into pages (Projects, Team Settings) when a single flat list would exceed roughly 30 items or span multiple resource types.
- Bind ⌘K on macOS and Ctrl+K elsewhere. Don't reuse the binding for any in-page filter input; it's a global shortcut.
- Trap focus inside the overlay while it is open, close on Escape, and release focus when the palette closes.
- Show a recent or default item set when the input is empty so the menu is useful before typing.
- Item children are Title Case verb phrases (Deploy Project, Invite Team Member). Commands act, not browse; avoid navigation phrasing like Go to project page.
- Group heading is Title Case, 1-2 words (Actions, Recent).
