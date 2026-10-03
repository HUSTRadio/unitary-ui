# Load More Button

> Route: `/components/load-more-button`

Append the next batch of data to a list with a full-width button.

[Back to Components](#/components)

# Load More Button

load-more-button

Append the next batch of data to a list with a full-width button.

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

### Custom idle label

children customizes the idle button label. When loading=true, the component always shows the localized Loading... label.

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

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonDefault21B111CBExample() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton onClick={() => setCount((value) => value + 3)}>Load More</LoadMoreButton>
    </div>
  );
}
```

## Loading

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonLoadingDC380888Example() {
  return <LoadMoreButton loading>Loading...</LoadMoreButton>;
}
```

## No Gap

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoGap7BF8EBE8Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton noGap onClick={() => setCount((value) => value + 3)}>
        Load More
      </LoadMoreButton>
    </div>
  );
}
```

## No Border Radius

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonNoBorderRadius7DFF5DD3Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton noBorderRadius onClick={() => setCount((value) => value + 3)}>
        Load More
      </LoadMoreButton>
    </div>
  );
}
```

## Custom Text

3 results loaded

```tsx
import { useState } from "react";
import { LoadMoreButton } from "@/components/ui/load-more-button";

export function LoadMoreButtonCustomTextCFD55183Example() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex w-full flex-col gap-3">
      <p role="status" className="text-copy-13 text-muted-foreground">
        {count} results loaded
      </p>
      <LoadMoreButton onClick={() => setCount((value) => value + 3)}>
        Show More Results
      </LoadMoreButton>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { LoadMoreButton } from "@/components/ui/load-more-button";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows progress while more results load.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
