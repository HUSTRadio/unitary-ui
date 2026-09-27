# Description

> Route: `/components/description`

Displays key/value metadata pairs as a definition list.

[Back to Components](#/components)

# Description

description

Displays key/value metadata pairs as a definition list.

## When to use

- Present metadata as a definition list: a short Title Case key paired with a single value (e.g., 'Last Deployed', 'Region', 'Plan').
- Need the <dl>/<dt>/<dd> semantic HTML structure recognized by screen readers, reading each key/value pair as one definition unit.

## When not to use

- For inline help text below a form field, use the input's helper-text slot instead of the Description component.
- Do not wrap the Description component in extra paragraph tags, as this breaks the definition list semantics.

## Examples

### Default definition list

Displays a group of key/value definition lists with default left alignment, presenting clear metadata structure.

### Right-aligned text

Aligns description values to the right, suitable for numeric or alignment-sensitive metadata scenarios.

### Ellipsis truncation

Truncates overflow values with ellipsis display, paired with a tooltip to expand and view details while maintaining compact layout.

## Accessibility

- Unitary renders <dl>/<dt>/<dd> native HTML definition list structure, where screen readers read each key-value pair as a definition unit.
- Keys use Title Case noun format, values use sentence case unless they are literal identifiers, IDs, or timestamps that should be preserved verbatim.
- Do not place interactive controls in the key slot; buttons, menus, and links belong in the value slot or parent layout.

## Controlled behavior

Not applicable: Description is a purely presentational component for rendering definition key-value pairs, with no interactive state or controlled behavior.

## Responsive behavior

Not applicable: Description as a definition list component behaves consistently across all viewports without significant responsive behavior changes.

## Theme behavior

Not applicable: Description typography and colors are handled automatically by the Unitary design system theme tokens, requiring no additional theme customization.

## Live Demo

Section Title

Data about this section.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionDefault37A8EEC1Example() {
  return (
    <Description
      content="Data about this section."
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## Text right

Section Title

Data about this section.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionTextRightFE5B1527Example() {
  return (
    <Description
      content="Data about this section."
      right
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## Ellipsis

Section Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionEllipsisB014A021Example() {
  return (
    <Description
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem."
      ellipsis
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Description } from "@/components/ui/description";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Description term.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">content</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Description value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional explanation shown beside the term.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">right</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Right-aligns the term and value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ellipsis</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Truncates overflowing term and value text.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use <Description> for definition-list metadata: a short Title Case key paired with a single value (Last Deployed, Region, Plan). For inline help under a form field, use the input’s helper-text slot instead.
- Unitary renders <dl>/<dt>/<dd> so screen readers announce each key/value pair as a definition. Don’t wrap the component in extra paragraphs that break the list semantics.
- Key is a Title Case noun (Last Deployed, Build Duration); value is sentence case unless it’s a literal identifier, ID, or timestamp that should be preserved verbatim.
- Pass tooltip only when the key alone is ambiguous and a one-sentence definition resolves it. The tooltip text is sentence case and ends with a period.
- Don’t put interactive controls in the key slot. Buttons, menus, and links belong in the value or the parent layout, not the label.
