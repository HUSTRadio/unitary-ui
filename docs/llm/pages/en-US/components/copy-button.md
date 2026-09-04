# Copy Button

> Route: `/components/copy-button`

Copies a given string to the clipboard and provides feedback when copied.

[Back to Components](#/components)

# Copy Button

Copy Button

Copies a given string to the clipboard and provides feedback when copied.

## When to use

- Copy a short string verbatim to the clipboard, such as a token, a command-line instruction, or a unique identifier ID.
- Display a checkmark confirmation for about 1.2 seconds after copying succeeds, so the user clearly perceives the copy action is done.

## When not to use

- For longer code blocks or multiline text, use a full Snippet component with its built-in copy affordance instead of a standalone CopyButton.
- Never omit aria-label on an icon-only button—screen readers cannot infer functionality from the icon alone.

## Examples

### Basic copy button

Clicking copies specified text to the clipboard and shows a success feedback icon.

## Accessibility

- Set the aria-label attribute on icon-only buttons so screen readers announce the specific action meaning (e.g., 'Copy deployment URL') rather than just the icon itself.
- Prefer navigator.clipboard.writeText API with a hidden-textarea execCommand fallback so copying still works where clipboard permissions are missing.
- Retain the checkmark feedback for about 1.2 seconds after a successful copy, then reset to the original state for the next click.

## Controlled behavior

Not applicable: CopyButton manages its own brief visual feedback state after copying; it does not expose an external value-controlled onChange API.

## Responsive behavior

Not applicable: CopyButton is a small icon button that maintains consistent size and behavior across all viewports.

## Theme behavior

Not applicable: CopyButton colors and styles automatically adapt to the current color scheme following the Geist design system theme tokens.

## Live Demo

Click to copy “lipsum”

```tsx
import { CopyButton } from "@/components/ui/copy-button";

export function CopyButtonDefault21B111CBExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton textToCopy="lipsum" />
      <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { CopyButton } from "@/components/ui/copy-button";
```

Native props: `ButtonHTMLAttributes<HTMLButtonElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textToCopy</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text written to the clipboard.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after a successful copy.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when copying fails.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use CopyButton for a single short string the user copies verbatim — a token, a command, an ID. For longer blocks, pair a full Snippet with its own copy affordance.
- Show the checkmark feedback for about 1.2s after a successful copy so the action reads as done; reset it before the next click.
- Set aria-label on the icon-only button so screen readers announce the action (Copy deployment URL), not just the icon.
- Prefer navigator.clipboard.writeText with a hidden-textarea execCommand fallback so copying still works where clipboard permissions are missing.
