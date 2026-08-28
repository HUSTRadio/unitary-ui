# Middle Truncate

> Route: `/components/middle-truncate`

Preserves the beginning and end of long identifiers.

[Back to Components](#/components)

# Middle Truncate

Middle Truncate

Preserves the beginning and end of long identifiers.

## When to use

-   When displaying long text such as file paths, URLs, hashes, and identifiers where both prefix and suffix carry identifying meaning.
-   When users need to quickly recognize a rough sense of the identifier's origin/target while preventing excessively long text from breaking layout neatness.

## When not to use

-   When the entire string needs to be visible to the user (for precise copy-paste), don't truncate—provide the full value with a copy button or expand mechanism.
-   For plain text content where prefix and suffix are irrelevant, full display is friendlier than truncation.

## Examples

### Truncation examples

Demonstrates typical Middle Truncate usage: truncating /home/user/documents/project/index.tsx to /home/user/doc…index.tsx, preserving start and end information while controlling width.

### Full value restore

Expose the pre-truncated original full value through the title attribute or an adjacent copy button, ensuring truncation does not completely destroy access to the source value.

## Accessibility

-   The truncated text exposes the complete original value via the title attribute or an adjacent copy affordance, ensuring screen reader users can access what was truncated.
-   Ellipsis characters are rendered using dedicated Unicode characters or CSS styles so they are correctly skipped by screen readers without causing extra reading interference.

## Controlled behavior

Not applicable: Middle Truncate is a purely presentational component that applies ellipsis logic to a given string. It has no internal state management, user interaction, or event handling capability; all truncation behavior is determined by maxLen and optional prefix/suffix configuration.

## Responsive behavior

Not applicable: The Middle Truncate component's truncation logic is based on the maxLen parameter, not viewport dimensions. Its responsive behavior is determined by the width constraints of the outer container, and the component itself does not participate in layout adaptation.

## Theme behavior

Not applicable: The visual presentation of Middle Truncate fully inherits from the parent element's text styles—color, font size, and font family all come from context. The component itself provides no independent theming capabilities.

## Live Demo

https://example…loyments/latesthttps://example.com/teams/hustradio/projects/unitary-ui/deployments/latest

```tsx
import { MiddleTruncate } from "@/components/ui/middle-truncate";

<div className="w-64 font-mono text-copy-13 text-foreground">
  <MiddleTruncate value="https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest" />
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { MiddleTruncate } from "@/components/ui/middle-truncate"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">text</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text shortened through its middle.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Middle Truncate for paths, URLs, hashes, and identifiers where both prefix and suffix carry meaning.
-   Expose the full value through title or adjacent copy affordance; truncation must not destroy access to the source value.
