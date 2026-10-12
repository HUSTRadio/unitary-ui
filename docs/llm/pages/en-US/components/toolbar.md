# Toolbar

> Route: `/components/toolbar`

Arrange tools in groups and move collapsible groups into an overflow menu when space is limited.

[Back to Components](#/components)

# Toolbar

toolbar

Arrange tools in groups and move collapsible groups into an overflow menu when space is limited.

## When to use

- For window-level command groups (navigation, view switching, finishing actions) that should collapse when space runs out.
- When tool items need a semantic front, middle, and back split.

## When not to use

- For page-level navigation links and scroll behavior — use Navbar.
- For application-level command menus with shortcuts and submenus — use MenuBar.

## Examples

### Default toolbar

Three groups of tool items; narrow the container and the groups collapse into the trailing overflow menu.

## Accessibility

- Tool items are native buttons with an accessible name; in icon-only mode the label still becomes the aria-label.
- The selected state is exposed through aria-pressed rather than color alone.
- The overflow menu reuses DotsMenu and stays keyboard reachable; disabled and selected states carry over to its items (disabled is not actionable, aria-current marks the current option).

## Controlled behavior

- Collapse state is measured internally (turn it off with collapse=false) and is not a controlled prop.
- Activation runs the onSelect callback; the selected state comes from the caller's active prop.

## Responsive behavior

- Collapsible groups fold away as a unit and their ToolbarItems move into the overflow menu; groups holding non-ToolbarItem content such as a search field stay in place because that content has no overflow entry point.
- Reopening requires 24px of extra space to prevent repeated collapsing near the width threshold.

## Theme behavior

- The bar uses background and border tokens that switch automatically in dark mode.
- Hover, selected, and disabled states all use grayscale alpha tokens.

## Live Demo

No command yet.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";

/**
 * Toolbar —— 窗口级工具操作组：leading / center / trailing 三段分组。
 * 空间不足时可折叠组收起，组内 ToolbarItem 进入尾部溢出菜单（缩小容器即可看到）。
 */
export function ToolbarDefault4A8E7C22Example() {
  const [mode, setMode] = React.useState("preview");
  const [log, setLog] = React.useState("No command yet.");

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Toolbar className="max-w-[420px]">
        <ToolbarGroup slot="leading">
          <ToolbarItem
            icon={<Copy className="size-4" />}
            label="Duplicate"
            onSelect={() => setLog("Duplicate")}
          />
          <ToolbarItem label="Rename" onSelect={() => setLog("Rename")} />
        </ToolbarGroup>
        <ToolbarGroup slot="center">
          <ToolbarItem
            label="Preview"
            active={mode === "preview"}
            onSelect={() => setMode("preview")}
          />
          <ToolbarItem label="Code" active={mode === "code"} onSelect={() => setMode("code")} />
        </ToolbarGroup>
        <ToolbarGroup slot="trailing">
          <ToolbarItem label="Share" onSelect={() => setLog("Share")} />
          <ToolbarItem label="Publish" onSelect={() => setLog("Publish")} />
        </ToolbarGroup>
      </Toolbar>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Toolbar, ToolbarGroup, ToolbarItem } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapse</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Collapses collapsible groups into an overflow menu when space runs out.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slot</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ToolbarSlot</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Group placement: leading, center, or trailing.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"leading"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Whether the group collapses when space runs out. Defaults by content: only all-ToolbarItem groups collapse; groups holding a search field, MenuButton, or custom controls stay in place.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Item label, reused as the overflow menu item text and accessible name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Leading 16px icon of a tool item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconOnly</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Hides the label visually but keeps it as the accessible name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">active</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks the item as the current selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelect</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Runs when the item is activated.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Toolbar for window-level command groups; use Navbar for page-level navigation links.
- Put navigation in the leading group, the current view switch in the center group, and finishing commands in the trailing group.
- Only ToolbarItem enters the overflow menu—arbitrary controls stay in their group, so keep collapsible groups made of ToolbarItem.
- Prefer disabled items over hidden ones so a command never disappears without explanation.
