# Empty State

> Route: `/components/empty-state`

Fills spaces when no content has been added yet or a view is empty.

[Back to Components](#/components)

# Empty State

Empty State

Fills spaces when no content has been added yet or a view is empty.

## When to use

- When a filtered list returns zero results or a resource has not been created, pass scenario-specific copy, iconography, and actions.
- When a user lands on a route they cannot view, the page layout can render EmptyState full-page with navigation guidance.
- For cleared states after completed work or finished downloads.

## When not to use

- Don't put critical persistent warnings in Empty States — they vanish when the list populates; persistent warnings belong in a Note or the page header.
- Normal loaded views with data should not show Empty State — asynchronously failed loads should use the Error component instead.
- Three CTAs make an empty state bloated — cap at one primary plus one secondary action.

## Examples

### Empty state design framework

Compose title, description, icon, and actions for the user's need; these scenario names are not a built-in variant API.

### Blank slate

Initial empty state when no resources have been created, paired with a primary CTA to guide creation.

### Informational empty state

Uses the generic props and children to add context that helps users understand the current state rather than waiting blindly.

## Accessibility

- Wrap the region in aria-live="polite" after an async filter change so screen readers announce the new state.
- Title is Title Case; description is sentence case and adds new information instead of restating the title.
- Decorative icons use aria-hidden; meaningful accessible names live in the text content.

## Controlled behavior

Not applicable: Empty State is a presentation-only component driven by whether the data source has content. It does not manage an open/close toggle — content is passed as props from the parent, and there is no interactive state to control.

## Responsive behavior

- CTA buttons stack vertically on narrow screens and can sit horizontally aligned on wider viewports.
- Illustration size and spacing scale down automatically to maintain readability at smaller breakpoints.

## Theme behavior

- Color mapping follows semantic states — green for success, amber for warning, red for error.
- Dark-mode illustration and text color combinations are specifically tuned for legibility.

## Live Demo

Title

A message conveying the state of the product.

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

export function EmptyStateEmptyStateDesignFrameworkFF959773Example() {
  return (
    <EmptyState
      description="A message conveying the state of the product."
      icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
      title="Title"
    />
  );
}
```

## blank-slate

Title

A message conveying the state of the product.

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

export function EmptyStateBlankSlateE6F82752Example() {
  return (
    <EmptyState
      description="A message conveying the state of the product."
      icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
      title="Title"
    />
  );
}
```

## informational

Title

This should detail the actions you can take on this screen, as well as why it’s valuable.

[Learn more](/)

```tsx
import { Button } from "@/components/ui/button";
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ArrowRight, ChartColumn } from "lucide-react";

export function EmptyStateInformationalBE8ED055Example() {
  return (
    <EmptyState
      description="This should detail the actions you can take on this screen, as well as why it’s valuable."
      icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
      title="Title"
    >
      <Button type="default" typeName="button">
        Primary Action
      </Button>
      <a
        href="/"
        className="inline-flex cursor-pointer items-center gap-0.5 text-label-14 text-muted-foreground no-underline"
      >
        Learn more
        <ArrowRight className="size-4" aria-hidden />
      </a>
    </EmptyState>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Explains the current absence.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Compose the generic title, description, icon, and children for the scenario: zero search results, a blank slate, informational context, completed work, or a failed load.
- Use the page layout to render permission and tier-denial empty states full-page when the user lands on a route they can’t view.
- Don’t put critical persistent warnings here. Empty states vanish when the list populates; persistent warnings belong in a Note or the page header.
- title is Title Case; description is sentence case and adds new information instead of restating the title.
- Cap at one primary CTA, plus one secondary. Three CTAs is a smell.
- After an async filter change, wrap the region in aria-live="polite" so screen readers announce the new state.
