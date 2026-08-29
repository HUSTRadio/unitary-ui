# Pagination

> Route: `/components/pagination`

Navigates through numbered pages of a data set.

[Back to Components](#/components)

# Pagination

Pagination

Navigates through numbered pages of a data set.

## When to use

- For sequential navigation between sibling pages (docs articles, blog posts, onboarding steps) where the user reads one page at a time.
- As a previous/next document rail when users need to advance or retreat through a series of pages.

## When not to use

- To reveal more rows of the same data set, use Show More or a numbered pager instead of Pagination.
- When users must jump to numbered pages, use a data-table-specific numeric pager.

## Examples

### Default pagination

The most basic pagination usage: renders a set of page number links with a previous/next rail, highlights the currently active page, and keeps other pages as plain anchor links.

## Accessibility

- Current page is rendered with the isActive property and carries aria-current="page" so screen readers announce the current page number.
- All page numbers are anchor button elements supporting keyboard navigation and Enter activation, ensuring accessibility for all users.

## Controlled behavior

- Controls the currently active page through the activePage prop; the parent can listen to page change callbacks to update routing or trigger data requests.
- Total page count is passed via the total prop, and the component auto-renders the corresponding set of page buttons.

## Responsive behavior

- On small viewports automatically hides middle page buttons, keeping only the first, last, and pages near the current one for a compact layout.
- Previous / Next buttons hide themselves at sequence start or end rather than being visually disabled; an empty rail reads cleaner than a dimmed link.

## Theme behavior

- The current page highlight background and text color follow theme tokens, remaining clear and discernible in dark mode.
- Divider and alignment styles are drawn from theme tokens, staying consistent with the overall design system.

## Live Demo

```tsx
import { Pagination } from "@/components/ui/pagination";

<Pagination
  previous={{ title: "Avatar", href: "#/components/avatar" }}
  next={{ title: "Phone", href: "#/components/phone" }}
/>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Pagination } from "@/components/ui/pagination";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">page</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current page.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPageChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives navigation requests.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use Show More or a numbered pager.
- Use Pagination as a previous/next document rail; use a data-table-specific pager when users must jump to numbered pages.
- Mark the current page with isActive so it renders with aria-current="page" and the selected highlight; keep other links as plain anchors.
- Hide the Previous / Next slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.
- Keep page labels short — numbers or 1–2 words. Don’t restate ordinal positions like Page 3 of 10 inside a link.
