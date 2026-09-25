# Menu Bar

> Route: `/components/menu-bar`

A horizontal bar of application menus with keyboard shortcuts, submenus, and checkable items.

[Back to Components](#/components)

# Menu Bar

Menu Bar

A horizontal bar of application menus with keyboard shortcuts, submenus, and checkable items.

## When to use

- For application-level command sets (File / Edit / View) that expose keyboard shortcuts.
- For multi-level submenus or checkable view toggles.

## When not to use

- For page-level navigation links and scroll behavior — use Navbar.
- For a single command's overflow actions — use DotsMenu or Menu.

## Examples

### Default menu bar

File, Edit, and View menus with shortcuts, a submenu, a checkbox item, and a disabled item; includes an interactive menu inside a modal.

## Accessibility

- Radix Menubar supplies role=menubar and the full keyboard model: arrow keys move between top-level menus and items, Escape closes one level at a time.
- Shortcut text is aria-hidden so screen readers announce the command name, not the key hint.
- Disabled items stay visible with aria-disabled so the command remains discoverable.

## Controlled behavior

- Menu open state is managed by Radix; checkbox items are controlled through checked and onCheckedChange.
- The component registers no global key handlers — you wire up the real shortcuts yourself.

## Responsive behavior

- Top-level menus sit in a row; the bar scrolls horizontally with fading edges to signal hidden commands.
- Menu surfaces stack above modals and drawers; submenus shift inward on narrow screens to stay within the viewport, and scroll once they hit the max height.

## Theme behavior

- The bar and its surfaces use surface and border tokens that switch automatically in dark mode.
- The surface's scale entrance is disabled under prefers-reduced-motion.

## Live Demo

No command yet.

```tsx
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTitle } from "@/components/ui/modal";

import {
  MenuBar,
  MenuBarCheckboxItem,
  MenuBarContent,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubContent,
  MenuBarSubTrigger,
  MenuBarTrigger,
} from "@/components/ui/menu-bar";

/**
 * MenuBar —— 水平应用菜单栏：顶级菜单横向排列，菜单项支持右对齐快捷键、
 * 分隔线、勾选态与子菜单。键盘导航（左右切顶级菜单、Esc 逐级关闭）由 Radix 提供。
 */
export function MenuBarDefault1D7F3C05Example() {
  const [showHidden, setShowHidden] = React.useState(false);
  const [log, setLog] = React.useState("No command yet.");
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <MenuBar>
        <MenuBarMenu>
          <MenuBarTrigger>File</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem shortcut="⌘N" onSelect={() => setLog("New Window")}>
              New Window
            </MenuBarItem>
            <MenuBarItem shortcut="⌘O" onSelect={() => setLog("Open…")}>
              Open…
            </MenuBarItem>
            <MenuBarSeparator />
            <MenuBarSub>
              <MenuBarSubTrigger>Export</MenuBarSubTrigger>
              <MenuBarSubContent>
                <MenuBarItem onSelect={() => setLog("Export PDF")}>PDF</MenuBarItem>
                <MenuBarItem onSelect={() => setLog("Export PNG")}>PNG</MenuBarItem>
              </MenuBarSubContent>
            </MenuBarSub>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>Edit</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem shortcut="⌘Z" onSelect={() => setLog("Undo")}>
              Undo
            </MenuBarItem>
            <MenuBarItem shortcut="⌘⇧Z" onSelect={() => setLog("Redo")}>
              Redo
            </MenuBarItem>
            <MenuBarSeparator />
            <MenuBarItem shortcut="⌘C" onSelect={() => setLog("Copy")}>
              Copy
            </MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>View</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarCheckboxItem
              shortcut="⌘⇧."
              checked={showHidden}
              onCheckedChange={setShowHidden}
            >
              Show Hidden Files
            </MenuBarCheckboxItem>
            <MenuBarItem disabled>Enter Full Screen</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
      </MenuBar>
      <p className="text-copy-13 text-gray-900">{log}</p>
      <Button typeName="button" size="small" onClick={() => setModalOpen(true)}>
        Open menu in modal
      </Button>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent showCloseButton>
          <ModalTitle>Document commands</ModalTitle>
          <div className="mt-4 flex flex-col gap-3">
            <MenuBar>
              <MenuBarMenu>
                <MenuBarTrigger>File</MenuBarTrigger>
                <MenuBarContent>
                  <MenuBarItem onSelect={() => setLog("Saved in modal")}>Save</MenuBarItem>
                  <MenuBarSub>
                    <MenuBarSubTrigger>Export</MenuBarSubTrigger>
                    <MenuBarSubContent>
                      <MenuBarItem onSelect={() => setLog("Exported PDF in modal")}>
                        PDF
                      </MenuBarItem>
                    </MenuBarSubContent>
                  </MenuBarSub>
                </MenuBarContent>
              </MenuBarMenu>
            </MenuBar>
            <p className="text-copy-13 text-gray-900">{log}</p>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
} from "@/components/ui/menu-bar";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shortcut</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Right-aligned shortcut hint; display only, no key binding.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">inset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Indents a MenuBarItem to align with checkbox items.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Checked state of a MenuBarCheckboxItem.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCheckedChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(checked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives checkbox item state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Keeps a command visible but inert.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use MenuBar for application-level commands; use Navbar for page-level navigation links.
- Every destructive command belongs in a menu item with a verb phrase, never as a bare top-level menu.
- Shortcut text is display only—bind the keys yourself so the shortcut and the command can never drift apart.
- Let items go disabled instead of hiding them, so the command stays discoverable in its menu.
