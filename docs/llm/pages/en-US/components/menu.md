# Menu

> Route: `/components/menu`

Open a list of related actions from a trigger button.

[Back to Components](#/components)

# Menu

menu

Open a list of related actions from a trigger button.

## When to use

- When a discoverable trigger opens a list of actions on a single resource, such as a dots menu on a row or a dropdown on a primary entity.
- When a user needs to perform multiple related operations (rename, duplicate, delete) on a resource (project, deployment, user) sharing the same context.
- Use MenuSection to group actions by category, organizing related moves together for improved discoverability.

## When not to use

- For right-click or long-press, use ContextMenu. For global commands behind ⌘K, use CommandMenu. For two related primary actions, use a split button rather than burying the secondary action in a deep menu.
- Cap the menu around 10 items. Past that, group with MenuSection or move secondary actions to a settings page to avoid an overly long popup.

## Examples

### Default menu

The simplest menu usage: a trigger opens a set of action items, each in Title Case Verb+Noun format such as Rename Project or Duplicate Deployment.

### Trigger with chevron

Show a downward chevron on MenuButton to indicate that the trigger opens the current menu; nested submenu primitives are not provided.

### Disabled items

Some menu items become greyed-out and non-clickable when unavailable in the current context, helping users understand which operations are restricted in the current state.

### Locked items

Use MenuItemLocked to display a lock icon and disabled state for permission-gated actions, clearly explaining why the row is inert and what permission is needed to unlock it.

## Accessibility

- Up/Down arrows move focus through items, Home/End jump to the first and last items, and Enter or Space activates the selected item.
- Typeahead jumps to the next item whose label starts with the typed character; the visible label comes first so typeahead matches what the user sees.
- Return focus to the trigger on close so keyboard users keep their place in the row.

## Controlled behavior

- Control menu open/close state via the open prop; the caller manages triggering conditions (other than hover) and closes the menu at appropriate times.
- The menu closes automatically on item activation, Escape, and outside-click; it can also be closed programmatically.

## Responsive behavior

- Menu position auto-flips based on window bounds (upward or downward pop-up) so it doesn't clip on narrow viewports due to hardcoded sides.
- Radix shifts the menu to avoid collisions, but the component does not set a small-screen maximum width; callers own width and wrapping for long content.
- Menu item height follows --uni-popover-row-height, defaulting to 36px; touch pointers retain a minimum height of 44px.

## Theme behavior

- Menu background color, borders, and divider colors are drawn from theme tokens, ensuring proper contrast in both light and dark modes.
- Hover, focus, and disabled states follow the design system's color guidelines, including special handling for high-contrast modes.

## Live Demo

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";

export function MenuDefault21B111CBExample() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>One</MenuItem>
        <MenuItem onClick={() => undefined}>Two</MenuItem>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItem href="https://example.com">Test for Link</MenuItem>
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## With chevron

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";

export function MenuWithChevron2CC766B6Example() {
  return (
    <MenuContainer>
      <MenuButton showChevron variant="secondary">
        Actions
      </MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>One</MenuItem>
        <MenuItem onClick={() => undefined}>Two</MenuItem>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItem href="https://example.com">Test for Link</MenuItem>
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## Disabled items

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";

export function MenuDisabledItems1BA9CD5EExample() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>One</MenuItem>
        <MenuItem onClick={() => undefined}>Two</MenuItem>
        <MenuItem disabled onClick={() => undefined}>
          Three
        </MenuItem>
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## Locked items

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem, MenuItemLocked } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";

export function MenuLockedItemsE410D1DAExample() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>View Details</MenuItem>
        <MenuItem onClick={() => undefined}>Edit</MenuItem>
        <Tooltip className="w-full flex" text="You do not have the permissions to delete.">
          <MenuItemLocked onClick={() => undefined}>Delete</MenuItemLocked>
        </Tooltip>
      </Menu>
    </MenuContainer>
  );
}
```

## Link items

```tsx
import { Menu, MenuButton, MenuContainer, MenuLink } from "@hustradio/unitary-ui";

export function MenuLinkItems24C68D22Example() {
  return (
    <MenuContainer>
      <MenuButton>Links</MenuButton>
      <Menu width={200}>
        <MenuLink href="/design/menu#custom-trigger">One</MenuLink>
        <MenuLink href="#">Two</MenuLink>
        <MenuLink href="#">Three</MenuLink>
      </Menu>
    </MenuContainer>
  );
}
```

## Custom trigger

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";
import { Avatar } from "@hustradio/unitary-ui";

export function MenuCustomTrigger74C52681Example() {
  return (
    <MenuContainer>
      <MenuButton variant="unstyled">
        <Avatar size={30} username="evilrabbit" />
      </MenuButton>
      <Menu width={200}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## Prefix and suffix

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";
import { Accessibility, MoreHorizontal } from "lucide-react";

export function MenuPrefixAndSuffix60E081F0Example() {
  return (
    <div className="flex flex-row items-stretch justify-start gap-6 flex-initial">
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <MoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem prefix={<Accessibility />}>Left</MenuItem>
          <MenuItem prefix={<Accessibility />}>Center</MenuItem>
          <MenuItem prefix={<Accessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <MoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem suffix={<Accessibility />}>Left</MenuItem>
          <MenuItem suffix={<Accessibility />}>Center</MenuItem>
          <MenuItem suffix={<Accessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
    </div>
  );
}
```

## Menu position

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@hustradio/unitary-ui";

export function MenuMenuPosition55A3EF38Example() {
  return (
    <MenuContainer position="left-start">
      <MenuButton>Left Start</MenuButton>
      <Menu width={200}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## With section

```tsx
import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuDivider,
  MenuItem,
  MenuItemLocked,
  MenuSection,
} from "@hustradio/unitary-ui";

export function MenuWithSection5563D2A4Example() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuSection title="Section">
          <MenuItem onClick={() => undefined}>One</MenuItem>
          <MenuItem onClick={() => undefined}>Two</MenuItem>
        </MenuSection>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItemLocked onClick={() => undefined}>Locked</MenuItemLocked>
        <MenuDivider />
        <MenuItem onClick={() => undefined} type="error">
          Delete
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  MenuContainer,
  MenuButton,
  Menu,
  MenuItem,
  MenuItemLocked,
  MenuLink,
  MenuDivider,
  MenuSection,
} from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled menu state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives menu state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelect</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Runs an item action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Menu for a discoverable trigger that opens a list of actions on a single resource (a dots menu on a row, a dropdown on a primary entity).
- For right-click or long-press on a row, use ContextMenu. For global commands behind ⌘K, use CommandMenu. For two related primary actions, use a split button rather than burying the secondary action.
- Cap a Menu around 10 items. Past that, group with MenuSection or move secondary actions to a settings page.
- Open on click, not hover; hover-open menus collide with screen readers and trackpad scrolls.
- Position auto-flips based on window bounds; don’t hardcode a side that clips on narrow viewports.
- Close on item activation, Escape, and outside-click. Don’t auto-close on a hover-out.
- Use MenuItemLocked for permission-gated actions so the lock icon and disabled state explain why the row is inert.
- Item children are Title Case Verb + Noun (Rename Project, Duplicate Deployment). Bare verbs like Rename or Edit are wrong outside obvious single-object context.
- End an item with … only when activating it opens a follow-up dialog (Rename…, Transfer to Team…).
- Group destructive items at the bottom, separated by a divider, and keep the destructive copy as Verb + Noun (Delete Project, never bare Delete).
- Section headers (MenuSection title) are Title Case, 1–2 words (Workspace, Recent Projects).
- Up/Down arrows move focus through items, Home/End jump to first/last, Enter or Space activates.
- Typeahead jumps to the next item whose label starts with the typed character; keep the visible label first so typeahead matches what the user sees.
- Return focus to the trigger on close so keyboard users keep their place in the row.
