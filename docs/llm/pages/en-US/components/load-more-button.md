# Load More Button

> Route: `/components/load-more-button`

A full-width button that appends more items to a paginated list.

[Back to Components](#/components)

# Load More Button

Load More Button

A full-width button that appends more items to a paginated list.

## When to use

- When users need to manually trigger loading more content in an information feed or data list, giving them control over browsing pace compared to auto-loading.
- When list content loads in pages and a clear load-more entry point at the bottom keeps page structure readable and predictable.

## When not to use

- If infinite scroll (auto-loading on viewport intersection) is viable, prefer automatic loading over requiring manual button clicks each time.
- For fixed-size complete datasets, use a numbered pager that lets users jump to any page directly instead of only supporting backward append.

## Examples

### Default load more button

The most basic load-more button: spans full width with a standard loading state and default text, suitable for most pagination-load-data scenarios.

### Loading state

The button enters a loading state showing a spinner indicator and disabled appearance, preventing duplicate requests while signaling to users that new content is being processed.

### Custom text

Override the default loading text to match specific business context, such as Load History Messages or View More Comments, improving consistency in user experience.

## Accessibility

- The button uses a native <button> element, ensuring keyboard users can Tab to navigate and activate, and is automatically disabled during loading to prevent duplicate submissions.
- The loading state informs screen readers via aria-busy that new content is being fetched.

## Controlled behavior

- The loading prop controls the button's loading state; the caller manages the data-fetch lifecycle and resets the button state upon completion.
- An onClick callback allows interception of click events to handle the actual data loading logic; the button itself does not perform network requests.

## Responsive behavior

Not applicable: The Load More Button always occupies the container's full width. Its dimensional changes are determined by outer container padding and spacing, not by the component's own logic.

## Theme behavior

- Button background color, border, and text color are drawn from theme tokens, including automatic adaptation for dark mode and high-contrast mode handling.
- Loading-state gradient animation and disabled-state opacity follow the design system's interaction feedback guidelines.

## Live Demo

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

<LoadMoreButton>Load More</LoadMoreButton>;
```

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

<LoadMoreButton loading>Loading...</LoadMoreButton>;
```

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

<LoadMoreButton noGap>Load More</LoadMoreButton>;
```

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

<LoadMoreButton noBorderRadius>Load More</LoadMoreButton>;
```

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

<LoadMoreButton>Show More Results</LoadMoreButton>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows progress while more results load.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
