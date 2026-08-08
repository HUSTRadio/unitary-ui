# Menu

Dropdown menu opened via button. Supports typeahead and keyboard navigation.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **With chevron**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Actions" · .outline-none · h:36px · pad:0px 40px 0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Disabled items**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Locked items**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Link items**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Links" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Custom trigger**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .[&>span]:px-0! · h:30px · 400 16px/24px · fg:#171717
> - **Prefix and suffix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Menu position**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Left Start" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **With section**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **With chevron**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Actions" · .outline-none · h:36px · pad:0px 40px 0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Disabled items**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Locked items**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Link items**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Links" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Custom trigger**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .[&>span]:px-0! · h:30px · 400 16px/24px · fg:#ededed
> - **Prefix and suffix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Menu position**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Left Start" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **With section**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Actions" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

Menu extends the Button component.

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>One</MenuItem>
        <MenuItem onClick={() => undefined}>Two</MenuItem>
        <MenuItem onClick={() => undefined}>Three</MenuItem>
        <MenuItem href="https://vercel.com">Test for Link</MenuItem>
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
import { Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <MenuContainer>
        <MenuButton showChevron variant="secondary">
          Actions
        </MenuButton>
        <Menu width={200}>
          <MenuItem onClick={() => undefined}>One</MenuItem>
          <MenuItem onClick={() => undefined}>Two</MenuItem>
          <MenuItem onClick={() => undefined}>Three</MenuItem>
          <MenuItem href="https://vercel.com">Test for Link</MenuItem>
          <MenuItem onClick={() => undefined} type="error">
            Delete
          </MenuItem>
        </Menu>
      </MenuContainer>
    </>
  );
}
```

## Disabled items

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

Use MenuItemLocked to indicate an action that requires additional permissions. The item is rendered as disabled with a lock icon suffix.

```tsx
import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
  MenuItemLocked,
  Tooltip,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
import { Menu, MenuButton, MenuContainer, MenuLink } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

The trigger is still wrapped by an unstyled button.

```tsx
import { Avatar, Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <MenuContainer>
      <MenuButton type="unstyled">
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

The trigger is still wrapped by an unstyled button.

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconAccessibility, IconMoreHorizontal } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-6 flex-initial">
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <IconMoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem prefix={<IconAccessibility />}>Left</MenuItem>
          <MenuItem prefix={<IconAccessibility />}>Center</MenuItem>
          <MenuItem prefix={<IconAccessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
      <MenuContainer>
        <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
          <IconMoreHorizontal />
        </MenuButton>
        <Menu>
          <MenuItem suffix={<IconAccessibility />}>Left</MenuItem>
          <MenuItem suffix={<IconAccessibility />}>Center</MenuItem>
          <MenuItem suffix={<IconAccessibility />}>Right</MenuItem>
        </Menu>
      </MenuContainer>
    </div>
  );
}
```

## Menu position

The position will automatically adapt based on the window bounds.

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

## Best Practices

### When to use

- Use Menu for a discoverable trigger that opens a list of actions on a single resource (a dots menu on a row, a dropdown on a primary entity).

- For right-click or long-press on a row, use ContextMenu. For global commands behind ⌘K, use CommandMenu. For two related primary actions, use a split button rather than burying the secondary action.

- Cap a Menu around 10 items. Past that, group with MenuSection or move secondary actions to a settings page.

### Behavior

- Open on click, not hover; hover-open menus collide with screen readers and trackpad scrolls.

- Position auto-flips based on window bounds; don’t hardcode a side that clips on narrow viewports.

- Close on item activation, Escape, and outside-click. Don’t auto-close on a hover-out.

- Use MenuItemLocked for permission-gated actions so the lock icon and disabled state explain why the row is inert.

### Content

- Item children are Title Case Verb + Noun (Rename Project, Duplicate Deployment). Bare verbs like Rename or Edit are wrong outside obvious single-object context.

- End an item with … only when activating it opens a follow-up dialog (Rename…, Transfer to Team…).

- Group destructive items at the bottom, separated by a divider, and keep the destructive copy as Verb + Noun (Delete Project, never bare Delete).

- Section headers (MenuSection title) are Title Case, 1–2 words (Workspace, Recent Projects).

### Accessibility

- Up/Down arrows move focus through items, Home/End jump to first/last, Enter or Space activates.

- Typeahead jumps to the next item whose label starts with the typed character; keep the visible label first so typeahead matches what the user sees.

- Return focus to the trigger on close so keyboard users keep their place in the row.

Was this helpful?
