# Middle Truncate

> Route: `/components/middle-truncate`

Shorten long text with an ellipsis while keeping both ends of a path, URL, or identifier.

[Back to Components](#/components)

# Middle Truncate

middle-truncate

Shorten long text with an ellipsis while keeping both ends of a path, URL, or identifier.

## When to use

- When displaying long text such as file paths, URLs, hashes, and identifiers where both prefix and suffix carry identifying meaning.
- When users need to quickly recognize a rough sense of the identifier's origin/target while preventing excessively long text from breaking layout neatness.

## When not to use

- When the entire string needs to be visible to the user (for precise copy-paste), don't truncate—provide the full value with a copy button or expand mechanism.
- For plain text content where prefix and suffix are irrelevant, full display is friendlier than truncation.

## Examples

### Truncation examples

Demonstrates typical Middle Truncate usage: truncating /home/user/documents/project/index.tsx to /home/user/doc…index.tsx, preserving start and end information while controlling width.

### Full value restore

Expose the pre-truncated original full value through the title attribute or an adjacent copy button, ensuring truncation does not completely destroy access to the source value.

## Accessibility

- The truncated text exposes the complete original value via the title attribute or an adjacent copy affordance, ensuring screen reader users can access what was truncated.
- Ellipsis characters are rendered using dedicated Unicode characters or CSS styles so they are correctly skipped by screen readers without causing extra reading interference.

## Controlled behavior

Not applicable: Middle Truncate takes a single value string and exposes no controlled value or event callbacks; the split is computed from the outer container's available width, so callers cannot prescribe a truncation length. When value becomes empty, the rendered head and tail fragments clear with it.

## Responsive behavior

Not applicable: Middle Truncate relies on no viewport breakpoints: it observes its direct parent container and re-measures and re-truncates whenever that width changes. The component has no breakpoint rules of its own; width constraints come entirely from the surrounding layout.

## Theme behavior

Not applicable: The visual presentation of Middle Truncate fully inherits from the parent element's text styles—color, font size, and font family all come from context. The component itself provides no independent theming capabilities.

## Live Demo

https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest

```tsx
import { MiddleTruncate } from "@hustradio/unitary-ui";

export function MiddleTruncateExamplesE68EE04DExample() {
  return (
    <div className="w-64 font-mono text-copy-13 text-foreground">
      <MiddleTruncate value="https://example.com/teams/hustradio/projects/unitary-ui/deployments/latest" />
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { MiddleTruncate } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text shortened through its middle.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Middle Truncate for paths, URLs, hashes, and identifiers where both prefix and suffix carry meaning.
- Expose the full value through title or adjacent copy affordance; truncation must not destroy access to the source value.
