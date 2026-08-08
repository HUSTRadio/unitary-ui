# Context Menu

A menu for contextual actions, revealed on right click or long press.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Disabled items**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Link items**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Prefix and suffix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Disabled items**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Link items**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Prefix and suffix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="text-copy-14"
          style={{
            width: 300,
            padding: "45px 0",
            border: "1px var(--ds-gray-alpha-600) dashed",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item one
        </ContextMenuItem>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item Two
        </ContextMenuItem>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item Three
        </ContextMenuItem>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item Four
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Disabled items

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="text-copy-14"
          style={{
            width: 300,
            padding: "45px 0",
            border: "1px var(--ds-gray-alpha-600) dashed",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item one
        </ContextMenuItem>
        <ContextMenuItem disabled onClick={(): void => console.log("value")} value="hello">
          Item Two
        </ContextMenuItem>
        <ContextMenuItem disabled onClick={(): void => console.log("value")} value="hello">
          Item Three
        </ContextMenuItem>
        <ContextMenuItem onClick={(): void => console.log("value")} value="hello">
          Item Four
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Link items

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="text-copy-14"
          style={{
            width: 300,
            padding: "45px 0",
            border: "1px var(--ds-gray-alpha-600) dashed",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem href="/" value="hello">
          Item one
        </ContextMenuItem>
        <ContextMenuItem href="/" value="hello">
          Item Two
        </ContextMenuItem>
        <ContextMenuItem href="/" value="hello">
          Item Three
        </ContextMenuItem>
        <ContextMenuItem href="/" value="hello">
          Item Four
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Prefix and suffix

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@vercel/geistcn/components";
import type { JSX } from "react";
import { LogoIconVercelCircleSvg } from "@vercel/geistcn-assets/logos";

export function Component(): JSX.Element {
  return (
    <div
      className="flex flex-col md:flex-row items-stretch justify-start flex-initial"
      style={{ gap: 24 }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="text-copy-14"
            style={{
              width: 300,
              padding: "45px 0",
              border: "1px var(--ds-gray-alpha-600) dashed",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem href="/" prefix={<LogoIconVercelCircleSvg />} value="hello">
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={<LogoIconVercelCircleSvg />} value="hello">
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={<LogoIconVercelCircleSvg />} value="hello">
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={<LogoIconVercelCircleSvg />} value="hello">
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="text-copy-14"
            style={{
              width: 300,
              padding: "45px 0",
              border: "1px var(--ds-gray-alpha-600) dashed",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem href="/" suffix={<LogoIconVercelCircleSvg />} value="hello">
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={<LogoIconVercelCircleSvg />} value="hello">
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={<LogoIconVercelCircleSvg />} value="hello">
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={<LogoIconVercelCircleSvg />} value="hello">
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
```

## Best Practices

### When to use

- Use ContextMenu for power-user shortcuts on right-click or long-press over a row, file, or canvas object.

- ContextMenu must never be the only entry point for an action. Mirror every item in a visible Menu trigger or row button so mouse-only and keyboard-only users have parity.

- For a global command palette, use CommandMenu; for a dropdown opened from a visible trigger, use Menu.

### Behavior

- Bind to right-click on desktop and long-press on touch. Suppress the native browser menu only on the trigger area, not the whole page.

- Position the menu at the pointer; if it would overflow the viewport, flip horizontally then vertically before clipping.

- Close on activation, Escape, and outside-click. Don’t close on hover-out.

### Content

- Items follow the same rules as Menu: Title Case Verb + Noun (Open in New Tab, Copy URL, Delete Deployment). Bare verbs are wrong.

- End with … only when activating opens a follow-up dialog (Rename…, Move to Folder…).

- Group destructive items at the bottom with a divider and keep the destructive label Verb + Noun. Delete alone never ships.

### Accessibility

- Trigger the keyboard menu key (Shift+F10 on Windows/Linux, the menu key, or platform equivalent) to open the same menu without right-click.

- Up/Down arrows move focus, Enter/Space activates, Escape closes and returns focus to the row.

- Don’t bury destructive items behind nested submenus. One level deep keeps keyboard navigation predictable.

Was this helpful?
