# Pagination

> Route: `/components/pagination`

Navigates through numbered pages of a data set.

[Back to Components](#/components)

# Pagination

pagination

Navigates through numbered pages of a data set.

## When to use

- Use Pagination to advance or retreat between adjacent documents, articles or onboarding steps.
- Use NumberedPagination to jump to a specific page of search results, products or a data set.

## When not to use

- Use ShowMore to reveal additional content in one list.
- Use LoadMoreButton or LazyLoad for continuous loading with an unknown total instead of numbered pages.

## Examples

### Adjacent document navigation

Pagination previous/next props provide adjacent page titles and destinations.

### Numbered pages

Show the first page, current neighbors, last page and ellipses with controlled page state.

## Accessibility

- Pagination is a labelled navigation region and link names include destination article titles.
- NumberedPagination automatically marks the current page with aria-current="page"; boundary arrows are disabled and ellipses are not interactive.
- getPageHref renders real links and preserves opening in a new tab; otherwise controls are buttons.

## Controlled behavior

- Pagination derives previous/next from routing.
- NumberedPagination supports controlled page or uncontrolled defaultPage, with one-based pages. onPageChange reports selection and displayed pages are clamped when totalPages shrinks.

## Responsive behavior

- Pagination hides centered children below xl while adjacent document links remain visible.
- NumberedPagination retains first/last pages and current neighbors, uses ellipses for larger gaps, and wraps controls on narrow screens.

## Theme behavior

- Links, direction icons, page numbers and the current page state use theme tokens.
- Callers style custom children links in Pagination; NumberedPagination includes current-page styling.

## Live Demo

Search results: page 6 of 24

```tsx
import { useState } from "react";
import { NumberedPagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n";

export default function NumberedExample() {
  const [page, setPage] = useState(6);
  const { locale } = useI18n();
  return (
    <div className="w-full space-y-4">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {locale === "zh-CN"
          ? `搜索结果：第 ${page} 页，共 24 页`
          : `Search results: page ${page} of 24`}
      </p>
      <NumberedPagination totalPages={24} page={page} onPageChange={setPage} />
    </div>
  );
}
```

## Default

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
import { Pagination, NumberedPagination } from "@/components/ui/pagination";
```

Native props: `ComponentProps<"nav">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.totalPages</code><span class="ml-1 text-destructive">*</span><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Total page count (required).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.page</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled one-based current page.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.defaultPage</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled page.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.onPageChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports page selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.siblingCount</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Number of neighboring pages on each side (0–10).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.getPageHref</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders real page links; otherwise uses buttons.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.disabled</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables every page control.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previous</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Previous-page title and destination.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">next</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Next-page title and destination.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional centered pagination content on wide screens.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For more rows in one list use ShowMore; for numbered results pages use NumberedPagination.
- Use Pagination as a previous/next document rail; use NumberedPagination when users must jump to numbered pages.
- When children contain page links, mark the current one with aria-current="page" and style it in caller code; Pagination has no isActive prop.
- Hide the Previous / Next slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.
- Keep page labels short — numbers or 1–2 words. Don’t restate ordinal positions like Page 3 of 10 inside a link.
