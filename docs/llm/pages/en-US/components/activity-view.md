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
- Every target and action is a native button with a visible name; destructive actions carry red semantics and ask for confirmation before running (the confirmation appears outside the panel and can be cancelled — the Block User flow in the example).

## Controlled behavior

- open and onOpenChange are fully controlled; picking a target or action runs the callback and closes the panel.
- The title is customizable; pass null to drop the title row entirely.

## Responsive behavior

- The target row scrolls horizontally so targets stay on a single line when they overflow; a fading edge indicates more targets and disappears at the end.
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
import { Modal, ModalContent } from "@/components/ui/modal";

/**
 * ActivityView —— 底部分享面板：分享目标网格 + 操作列表 + 取消行。
 * 选择任意项后执行回调并关闭面板（活动是一次性动作）。
 *
 * 破坏性操作按 HIG 走二次确认：操作行只负责红色语义，确认浮层出现在面板
 * 之外的独立位置，用户可确认或取消；取消时状态不变（HIG-AUD-037）。
 */
export function ActivityViewDefault9E4C2B57Example() {
  const [open, setOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
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
            id: "notes",
            icon: swatch("#f5a623"),
            title: "Notes",
            onSelect: () => setLog("Shared to Notes"),
          },
          {
            id: "airdrop",
            icon: swatch("#54b7ec"),
            title: "AirDrop",
            onSelect: () => setLog("Shared via AirDrop"),
          },
          {
            id: "reminders",
            icon: swatch("#e02d3c"),
            title: "Reminders",
            onSelect: () => setLog("Shared to Reminders"),
          },
          {
            id: "calendar",
            icon: swatch("#6266d0"),
            title: "Calendar",
            onSelect: () => setLog("Shared to Calendar"),
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
          // 破坏性操作只打开确认浮层（面板随之关闭——活动是一次性动作）
          {
            id: "block",
            title: "Block User",
            destructive: true,
            onSelect: () => setConfirming(true),
          },
        ]}
      />
      <p className="text-copy-13 text-gray-900">{log}</p>

      {/* 破坏性操作的二次确认：浮层位于面板之外的独立位置，需刻意关闭
          （确认或取消），取消时状态不变（HIG-AUD-037）。 */}
      <Modal open={confirming} onOpenChange={setConfirming}>
        <ModalContent bodyClassName="pb-0">
          <header className="mb-5">
            <h3 className="text-heading-20 text-foreground">Block this user?</h3>
            <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
              They will no longer be able to message you. You can unblock them later.
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
                setLog("Block User");
                setConfirming(false);
              }}
            >
              Block User
            </Button>
          </footer>
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
import { ActivityView } from "@/components/ui/activity-view";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled open state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives open state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">targets</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityTarget[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Share targets rendered as a horizontally scrolling grid.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">actions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Action rows rendered beneath the targets.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Panel title; pass null to omit the title row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders the trailing cancel row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sheetProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Partial&lt;BottomSheetProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Pass-through to the underlying BottomSheet; overrides the default detents, gestures, and indicator.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ActivityView for one-shot share or action flows; it closes itself after a target or action is picked.
- Keep target names short—they truncate to one line beneath a 48px icon tile. When targets overflow, fading edges reveal more items and update as the row scrolls.
- Put destructive actions at the bottom of the action list and keep their labels Verb + Noun.
- ActivityView wraps BottomSheet at a fixed 0.6 detent and keeps pull-down dismissal — reach for BottomSheet directly when you need draggable detents (or pass sheetProps to override).
