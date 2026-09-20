# Activity View

> Route: `/components/activity-view`

A bottom share sheet with a grid of share targets and a list of actions.

[Back to Components](#/components)

# Activity View

Activity View

A bottom share sheet with a grid of share targets and a list of actions.

## When to use

- When the current content can be shared to several targets such as apps or services.
- When copy, print, or save actions belong in the same bottom panel as the share targets.

## When not to use

- For a draggable multi-detent bottom layer — use BottomSheet directly.
- For always-available toolbar actions — use a toolbar instead of a one-shot panel.

## Examples

### Default activity view

A share button opens the bottom panel with a target grid, an action list, and a cancel row.

## Accessibility

- The panel reuses the Radix dialog: focus moves into the panel, Escape and outside clicks close it, and focus returns to the trigger.
- Every target and action is a native button with a visible name; destructive actions differ by color and wording, not color alone.

## Controlled behavior

- open and onOpenChange are fully controlled; picking a target or action runs the callback and closes the panel.
- The title is customizable; pass null to drop the title row entirely.

## Responsive behavior

- The target row scrolls horizontally so targets stay on a single line when they overflow.
- The panel takes 60% of the viewport height and reserves bottom safe-area padding.

## Theme behavior

- Panel background, icon tile color, and text colors follow theme tokens.
- Destructive actions use the error color token and keep contrast in dark mode.

## Live Demo

Nothing shared yet.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { ActivityView } from "@/components/ui/activity-view";
import { Button } from "@/components/ui/button";

/**
 * ActivityView —— 底部分享面板：分享目标网格 + 操作列表 + 取消行。
 * 选择任意项后执行回调并关闭面板（活动是一次性动作）。
 */
export function ActivityViewDefault9E4C2B57Example() {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState("Nothing shared yet.");

  const swatch = (color: string) => (
    <span
      aria-hidden="true"
      className="flex size-5 items-center justify-center rounded-[6px] text-[10px] font-medium text-white"
      style={{ background: color }}
    >
      U
    </span>
  );

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Button type="secondary" onClick={() => setOpen(true)}>
        Share
      </Button>
      <ActivityView
        open={open}
        onOpenChange={setOpen}
        targets={[
          {
            id: "copy",
            icon: <Copy className="size-5" />,
            title: "Copy",
            onSelect: () => setLog("Copied link"),
          },
          {
            id: "messages",
            icon: swatch("#28c840"),
            title: "Messages",
            onSelect: () => setLog("Shared via Messages"),
          },
          {
            id: "mail",
            icon: swatch("#0070f3"),
            title: "Mail",
            onSelect: () => setLog("Shared via Mail"),
          },
          {
            id: "more",
            icon: swatch("#8f8f8f"),
            title: "More",
            onSelect: () => setLog("Opened more targets"),
          },
        ]}
        actions={[
          { id: "print", title: "Print", onSelect: () => setLog("Print") },
          { id: "save", title: "Save to Files", onSelect: () => setLog("Save to Files") },
          {
            id: "block",
            title: "Block User",
            destructive: true,
            onSelect: () => setLog("Block User"),
          },
        ]}
      />
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ActivityView } from "@/components/ui/activity-view";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives open state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">targets</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityTarget[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Share targets rendered as a horizontally scrolling grid.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">actions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Action rows rendered beneath the targets.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Panel title; pass null to omit the title row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders the trailing cancel row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sheetProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Partial&lt;BottomSheetProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Pass-through to the underlying BottomSheet; overrides the default detents, gestures, and indicator.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ActivityView for one-shot share or action flows; it closes itself after a target or action is picked.
- Keep target names short—they truncate to one line beneath a 48px icon tile.
- Put destructive actions at the bottom of the action list and keep their labels Verb + Noun.
- ActivityView wraps BottomSheet at a fixed 0.6 detent and keeps pull-down dismissal — reach for BottomSheet directly when you need draggable detents (or pass sheetProps to override).
