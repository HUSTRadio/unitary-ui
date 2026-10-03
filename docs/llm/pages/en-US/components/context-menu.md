# Context Menu

> Route: `/components/context-menu`

Right-click or long-press an item to open its action menu.

[Back to Components](#/components)

# Context Menu

context-menu

Right-click or long-press an item to open its action menu.

## When to use

- Provide right-click or long-press contextual shortcut action menus on rows, files, or canvas objects.
- Mirror every menu action in both the right-click menu and a visible Menu trigger or row button, ensuring parity between mouse-only and keyboard-only users.

## When not to use

- ContextMenu must never be the only entry point for an action—always mirror items in a visible Menu trigger or row button so keyboard users have equivalent access.
- Suppress the native browser menu only on the trigger area, not the entire page.

## Examples

### Basic context menu

Right-click the trigger area to open its action list.

### Disabled menu items

Demonstrates disabling certain options in the context menu, shown in grayed-out text for inoperative commands.

### Link menu items

Includes link-type options in the menu that navigate to a target page instead of executing a local action on click.

### Prefix and suffix menu items

Adds prefix icons and suffix labels to menu items, showing status indicators or auxiliary information to enhance operability.

### Quick Actions

A fixed-width vertical Quick Actions list on long-press (or right-click): large icons with subtitles over a blurred backdrop, with the destructive system item separated at the bottom and its confirmation opened before it runs.

## Accessibility

- Set semantic aria-labels on each menu item to ensure screen readers correctly announce the action content.
- Bind to right-click on desktop and long-press on touch; Shift+F10 on Windows/Linux opens the same menu without right-click.
- Follow the same Title Case Verb + Noun format for menu items as Menu (e.g., 'Open in New Tab', 'Copy URL', 'Delete Deployment').
- Destructive system items carry red semantics and ask for confirmation before running: the confirmation appears outside the menu and can be cancelled (the Remove App flow in the example) — HIG requires the red text and the confirmation as a pair.

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

export function ContextMenuDefault37A8EEC1Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem>Item Two</ContextMenuItem>
        <ContextMenuItem>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Disabled items

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDisabledItems62FB7C5EExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem disabled>Item Two</ContextMenuItem>
        <ContextMenuItem disabled>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Link items

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuLinkItems2FF9F194Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem href="/">Item one</ContextMenuItem>
        <ContextMenuItem href="/">Item Two</ContextMenuItem>
        <ContextMenuItem href="/">Item Three</ContextMenuItem>
        <ContextMenuItem href="/">Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Prefix and suffix

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

export function ContextMenuPrefixAndSuffix99076368Example() {
  const icon = <Triangle className="size-4" aria-hidden />;

  return (
    <div className="flex flex-col items-stretch justify-start gap-6 md:flex-row">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            tabIndex={0}
            aria-label="Context menu target"
            className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" prefix={icon}>
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            tabIndex={0}
            aria-label="Context menu target"
            className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" suffix={icon}>
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
```

## quick-actions

Long-press the card to reveal quick actions.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Modal, ModalContent } from "@/components/ui/modal";

/**
 * Quick Actions —— context-menu 的触屏长按变体：定宽竖排、大图标 + 副标题、背景模糊遮罩。
 * 触屏长按（或桌面右键）卡片即可唤起；底部系统项用 Separator 隔开并标记 destructive。
 *
 * 破坏性项按 HIG（pull-down-buttons）走「红字 + 二次确认」成对：菜单只负责红色语义，
 * 确认浮层出现在菜单**之外**的独立位置，用户可确认或取消；取消时状态不变（HIG-AUD-037）。
 */
export function ContextMenuQuickActions8D41B0E7Example() {
  const [log, setLog] = React.useState("Long-press the card to reveal quick actions.");
  const [confirming, setConfirming] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            className="flex size-20 flex-col items-center justify-center gap-1.5 rounded-[18px] bg-gray-100 text-label-13 text-gray-1000 outline-none"
          >
            <span aria-hidden="true" className="size-8 rounded-[10px] bg-gray-alpha-400" />
            Notes
          </button>
        </ContextMenuTrigger>
        <ContextMenuQuickActionsContent>
          <ContextMenuQuickActionsItem
            icon={<Copy className="size-5" />}
            title="New note"
            subtitle="Create a blank note"
            onSelect={() => setLog("New note")}
          />
          <ContextMenuQuickActionsItem
            title="Scan document"
            subtitle="Use the camera"
            onSelect={() => setLog("Scan document")}
          />
          <ContextMenuSeparator />
          <ContextMenuQuickActionsItem
            title="Remove App"
            destructive
            onSelect={() => setConfirming(true)}
          />
        </ContextMenuQuickActionsContent>
      </ContextMenu>
      <p className="text-copy-13 text-gray-900">{log}</p>

      {/* 破坏性操作的二次确认：浮层位于菜单之外的独立位置，需要刻意关闭
          （确认或取消），避免误触直接执行（HIG-AUD-037）。 */}
      <Modal open={confirming} onOpenChange={setConfirming}>
        <ModalContent bodyClassName="pb-0">
          <header className="mb-5">
            <h3 className="text-heading-20 text-foreground">Remove App?</h3>
            <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
              This removes Notes from the home screen. You can add it back from the App Library.
            </div>
          </header>
          <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
            <Button
              size="small"
              typeName="button"
              type="secondary"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              typeName="button"
              type="error"
              onClick={() => {
                setLog("Remove App");
                setConfirming(false);
              }}
            >
              Remove App
            </Button>
          </footer>
        </ModalContent>
      </Modal>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
} from "@/components/ui/context-menu";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled menu state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives menu state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">inset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Indents a ContextMenuItem.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional item value exposed as data-value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a ContextMenuItem as a link.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Leading item content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Trailing item content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Width in pixels of the Quick Actions list.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">224</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">backdropBlur</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Whether the Quick Actions list renders a blurred backdrop.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Leading 20px icon of a Quick Actions item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Primary label of a Quick Actions item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">subtitle</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Secondary muted line of a Quick Actions item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">destructive</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks a system item such as Remove App in red.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ContextMenu for power-user shortcuts on right-click or long-press over a row, file, or canvas object.
- ContextMenu must never be the only entry point for an action. Mirror every item in a visible Menu trigger or row button so mouse-only and keyboard-only users have parity.
- Bind to right-click on desktop and long-press on touch. Suppress the native browser menu only on the trigger area, not the whole page.
- Close on activation, Escape, and outside-click. Don't close on hover-out.
- Items follow the same rules as Menu: Title Case Verb + Noun (Open in New Tab, Copy URL, Delete Deployment). Bare verbs are wrong.
- Group destructive items at the bottom with a divider and keep the destructive label Verb + Noun.
- The keyboard menu key (Shift+F10 on Windows/Linux) opens the same menu without right-click.
- The Quick Actions scrim is one of only two blurred overlays in the library. Blur expresses a foreground layer — the primary screen, an AI suggestion, or a temporary front surface — and must come from the shared overlay blur token (--uni-overlay-backdrop-blur), never a per-component blur step. Adding a blurred overlay elsewhere is a design decision, not a local styling choice.
