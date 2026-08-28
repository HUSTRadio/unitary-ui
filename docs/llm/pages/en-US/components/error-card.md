# Error Card

> Route: `/components/error-card`

A contained error state with recovery guidance.

[Back to Components](#/components)

# Error Card

Error Card

A contained error state with recovery guidance.

## When to use

-   When a bounded panel or card area fails to render due to an error, use Error Card to show the specific problem and suggested recovery actions.
-   When you need a self-contained error container with a clear title, description, and a recovery action rather than a bare error message.
-   When the error requires a specific recovery action (retry, contact support) instead of a generic Try again prompt.

## When not to use

-   Don't use for field-level form validation errors — use ErrorText or the Input error prop for inline messages.
-   Don't use for full-page system errors — a dedicated Error component or Empty State with error variant is better for page-level failures.
-   Avoid generic Try again messages — provide concrete recovery guidance that explains what failed and how to fix it.

## Examples

### Default error card

Displays the default Error Card structure with an error title, description, and a single recovery action button.

## Accessibility

-   Announce the error through aria-live="polite" when the error card appears so screen readers report the failure.
-   The recovery action button should have a descriptive aria-label naming the specific action (e.g., Retry deployment).
-   Error icons are decorative — use aria-hidden to prevent redundant narration by assistive technology.

## Controlled behavior

Not applicable: Error Card is a presentation component whose content and visibility are controlled entirely by props from the caller; it does not manage internal open/close or interaction state.

## Responsive behavior

-   Error Card adapts to its bounding container width, with inner elements wrapping vertically on narrow screens.
-   The recovery action button stretches to fill the container width on mobile, ensuring an adequately sized touch target.

## Theme behavior

-   Semantic red color palette for error states has paired dark/light mode tones ensuring legibility and visual consistency.
-   Card background and border colors follow theme variables, with CSS variable overrides for custom appearance.

## Live Demo

### No Credits Left

Add credits to continue deploying projects.

```tsx
import { Button } from "@/components/ui/button";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@/components/ui/error-card";
import { Trash2 } from "lucide-react";

<ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
  <ErrorCardTitle>No Credits Left</ErrorCardTitle>
  <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
  <ErrorCardAction>
    <Button>Add Credits</Button>
  </ErrorCardAction>
</ErrorCard>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction } from "@/components/ui/error-card"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Composable error content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Error Card when a bounded panel cannot render; use field errors for validation and Toast for transient action failures.
-   State what failed and provide a concrete recovery action rather than a generic Try again message.
