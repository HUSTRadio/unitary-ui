# Pagination

> Route: `/components/pagination`

Navigates through numbered pages of a data set.

[Back to Components](#/components)

# Pagination

pagination

Navigates through numbered pages of a data set.

## When to use

- For sequential navigation between sibling pages (docs articles, blog posts, onboarding steps) where the user reads one page at a time.
- As a previous/next document rail when users need to advance or retreat through a series of pages.

## When not to use

- To reveal more rows of the same data set, use Show More or a numbered pager instead of Pagination.
- When users must jump to numbered pages, use a data-table-specific numeric pager.

## Examples

### Default pagination

The basic pagination rail renders adjacent pages through previous and next; callers may supply custom navigation in the centered children area.

## Accessibility

- The component renders a labelled navigation region; Previous and Next links include accessible names with their destination titles.
- When callers add page links through children, they are responsible for native link semantics and aria-current on the current item.

## Controlled behavior

Not applicable: Pagination does not manage an active page or total count; the caller derives previous, next, and optional children from routing state.

## Responsive behavior

- The centered children navigation area is hidden below xl, while the Previous and Next rail links remain available.
- At the start or end of a sequence, omit the corresponding previous or next prop; the component preserves the rail layout without rendering a disabled link.

## Theme behavior

- Previous and Next links, direction icons, and supporting text use theme colors.
- The component does not render a current-page highlight. Callers style any page links supplied through children.

## Live Demo

```tsx
import { Pagination } from "@/components/ui/pagination";

export function PaginationDefault21B111CBExample() {
  return (
    <Pagination
      previous={{ title: "Avatar", href: "#/components/avatar" }}
      next={{ title: "Device", href: "#/components/device" }}
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Pagination } from "@/components/ui/pagination";
```

Native props: `ComponentProps<"nav">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previous</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Previous-page title and destination.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">next</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Next-page title and destination.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional centered pagination content on wide screens.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use Show More or a numbered pager.
- Use Pagination as a previous/next document rail; use a data-table-specific pager when users must jump to numbered pages.
- When children contain page links, mark the current one with aria-current="page" and style it in caller code; Pagination has no isActive prop.
- Hide the Previous / Next slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.
- Keep page labels short — numbers or 1–2 words. Don’t restate ordinal positions like Page 3 of 10 inside a link.
