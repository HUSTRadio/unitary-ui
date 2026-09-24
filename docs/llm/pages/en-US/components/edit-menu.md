# Edit Menu

> Route: `/components/edit-menu`

A floating capsule toolbar of edit actions that appears over an active text selection.

[Back to Components](#/components)

# Edit Menu

Edit Menu

A floating capsule toolbar of edit actions that appears over an active text selection.

## When to use

- When you need cut, copy, paste, select all, look up, or share for the current text selection.
- When the toolbar should hug the selection and disappear as soon as the selection does.

## When not to use

- For actions on an object such as a row, file, or canvas element — that is ContextMenu.
- For an always-visible edit button group rather than a floating layer tied to a selection.

## Examples

### Default edit menu

Selecting text reveals the capsule with cut, copy, paste, select all, look up, and share.

## Accessibility

- The capsule uses role="toolbar" with an aria-label, and every action is a focusable native button.
- Escape closes the capsule; pressing the capsule never clears the current selection.
- On touch, both the container and the capsule suppress the native callout and context menu, so a long press never stacks a second edit menu on top of the capsule.

## Controlled behavior

- The component watches the selection itself; callers only supply handlers, and standard actions without a handler are not rendered.
- Cut copies the text for you and then hands it to onCut, which performs the deletion; handlers receive both the trimmed text and the raw selection, and deletion must use the raw text to avoid leftover whitespace.
- When the clipboard write fails, onCut and onCopy are not fired — the failure goes to onError so the caller can show visible feedback instead of deleting content that was never copied.

## Responsive behavior

- It flips below the selection when there is no room above, clamps horizontally inside the viewport, and clamps vertically too, so a selection near the bottom edge no longer pushes the capsule past it.
- It collapses on scroll and viewport resize so the capsule never drifts away from the selection.

## Theme behavior

- Capsule background, dividers, and text colors follow theme tokens and keep contrast in dark mode.
- The scale-and-fade entrance is disabled under prefers-reduced-motion.

## Live Demo

Select any words in this sentence to reveal the floating edit capsule above the selection.

Long-press or drag to select text, then use the capsule actions.

```tsx
import * as React from "react";

import { EditMenu } from "@/components/ui/edit-menu";

const INITIAL_TEXT =
  "Select any words in this sentence to reveal the floating edit capsule above the selection.";

export function EditMenuDefault3F2A9C71Example() {
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [text, setText] = React.useState(INITIAL_TEXT);
  const [log, setLog] = React.useState<string | null>(null);

  const selectAll = React.useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  return (
    <div className="w-full max-w-[420px] space-y-3">
      <EditMenu
        // 删除必须用选区原文（rawText）：用已 trim 的文本会残留首尾空白（HIG-AUD-021）
        onCut={(selected, rawText) => {
          setText((current) => current.replace(rawText, ""));
          setLog(`Cut ${selected.length} characters.`);
        }}
        onCopy={(selected) => setLog(`Copied ${selected.length} characters.`)}
        onPaste={() => {
          void navigator.clipboard
            .readText()
            .then((value) => setLog(value ? `Pasted: ${value}` : "Clipboard is empty."))
            .catch(() => setLog("Clipboard read is blocked."));
        }}
        onSelectAll={selectAll}
        onLookUp={(selected) => setLog(`Looking up “${selected}”.`)}
        onShare={(selected) => setLog(`Sharing “${selected}”.`)}
        // 剪贴板不可用时 onCut / onCopy 不会触发；这里给出可见反馈（HIG-AUD-021）
        onError={() => setLog("Clipboard write is blocked — the selection was left untouched.")}
      >
        <p ref={textRef} className="text-copy-14 leading-6 text-foreground">
          {text}
        </p>
      </EditMenu>
      <p className="text-copy-13 text-gray-900">
        {log ?? "Long-press or drag to select text, then use the capsule actions."}
      </p>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { EditMenu } from "@/components/ui/edit-menu";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Selectable content the menu watches for a text selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">standardActions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly EditMenuStandardAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Enabled standard actions and their order; defaults to cut, copy, paste, selectAll, lookUp, share.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">actions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly EditMenuAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Custom actions appended after the standard actions behind a divider.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCut</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives the trimmed and the raw selection after it is copied; perform the deletion yourself with the raw text. Not called when the clipboard write fails.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives the trimmed and the raw selection after the component copies it. Not called when the clipboard write fails.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPaste</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Paste handler; the component does not read the clipboard for you.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectAll</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Selects all content in the container.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLookUp</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Look up handler for the current selection (trimmed and raw).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onShare</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string, rawText: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Share handler for the current selection (trimmed and raw).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Clipboard write failures. Cut and copy callbacks are not fired; render the visible feedback yourself.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">offset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Gap in pixels between the capsule and the selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">8</td></tr></tbody></table>

## Best Practices

- Use EditMenu for actions on the current text selection; use ContextMenu for actions on an object revealed by right-click or long-press.
- Only pass callbacks for the actions you implement—EditMenu omits standard actions without a handler instead of showing an inert item.
- Treat Cut as copy plus a caller-side deletion: the component copies the selection and then hands the text to onCut.
- Let Paste stay in the caller's hands: read the clipboard yourself instead of granting the component read permission.
