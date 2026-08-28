# Text With Copy Button

> Route: `/components/text-with-copy-button`

Displays text alongside a button that copies it to the clipboard.

[Back to Components](#/components)

# Text With Copy Button

Text With Copy Button

Displays text alongside a button that copies it to the clipboard.

## When to use

- Present short strings for users to copy verbatim, such as tokens, commands, IDs, or configuration values.
- Provide an inline copy affordance next to code snippets, terminal commands, or environment variable values for easy retrieval.

## When not to use

- Do not copy multi-line blocks with this component—for longer code segments, prefer CodeBlock or Snippet which ship with built-in copy affordances.
- Do not add a copy button to purely presentational contexts where users have no need to duplicate the content.

## Examples

### Default text copy

Shows the default text-plus-copy-button layout with the copy icon positioned immediately to the right of the text.

### Compact and tertiary

Demonstrates the combined small size and tertiary variant, suitable for dense inline rows.

## Accessibility

- Icon-only copy buttons should carry an aria-label (e.g. 'Copy deployment URL') so screen readers accurately describe the action target.
- After a successful copy, show a checkmark feedback indicator for about 1.5 seconds so sighted users clearly perceive the result.
- Prefer navigator.clipboard.writeText with a hidden-textarea execCommand fallback so copying works even where clipboard permissions are restricted.

## Controlled behavior

Not applicable: TextWithCopyButton is a passive display component; copy behavior is handled internally by reading text and writing to the clipboard, requiring no external state control.

## Responsive behavior

- The text area uses flexible width and adapts to narrow screens by truncating with ellipsis while keeping the copy button visible at the end.
- On touch devices, the copy button maintains a minimum 44px hit area to ensure operability for mobile users.

## Theme behavior

- Text color and the copy button icon follow theme variables, maintaining good contrast and legibility in both dark and light modes.
- The visual feedback for a successful copy (checkmark icon) adapts its color appropriately across different themes.

## Live Demo

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied to clipboard"
  textLabel="Copy"
  textToCopy="lipsum"
/>;
```

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied hashed digest to clipboard"
  textLabel="Copy config digest"
  textToCopy="edgeConfigData.digest"
/>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textToCopy</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text displayed and copied.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textLabel</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible text label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after copy succeeds.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when copying fails.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
