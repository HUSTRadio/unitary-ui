# Show More

> Route: `/components/show-more`

Shows expanded or collapsed content with a progressive-disclosure trigger.

[Back to Components](#/components)

# Show More

Show More

Shows expanded or collapsed content with a progressive-disclosure trigger.

## When to use

- Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use Pagination; for optional sections, use Collapse.
- Show enough rows to convey the shape of the list before truncating (5–10 typical); this helps users understand the full scope of hidden content.
- Pair the trigger with the count of hidden items so the user knows the cost of expanding (e.g., "Show 12 More"), then swap to "Show Less" after expand. Title Case both labels.

## When not to use

- For sibling pages of the same data set, use Pagination rather than ShowMore; for optional sections, use Collapse instead.
- Do not use ShowMore when truncating only 2 rows—it feels performative. Always show at least 5 rows before truncating.
- Do not cycle Show More then Show Less mid-flow on the same data set; collapsing rows after expansion scrolls them away from where the user was reading.

## Examples

### Default state

Displays the default collapsed appearance with the trigger button.

### Expanded state

Shows the fully expanded effect after clicking; the trigger swaps to "Show Less".

### No border variant

Demonstrates the clean borderless style, suitable for seamlessly blending into page layouts.

## Accessibility

- The trigger must be a <button> with aria-expanded, paired with aria-controls pointing to the target list region.
- After expansion, move focus to the first newly revealed row so screen-reader and keyboard users land directly in the new content.
- Announce the content change with aria-live="polite" once expansion completes.

## Controlled behavior

- Supports programmatic control of open/collapsed state via controlled properties, allowing developers to decide when to auto-expand or collapse.
- Focus shifts to the first new row after the expand animation completes, ensuring keyboard navigation continuity.

## Responsive behavior

- ShowMore continues to display the truncation affordance even with few pre-rendered rows; on narrow screens each row adapts its width without overflowing.
- The trigger button maintains a fixed minimum tap target size across all screen widths for reliable touch interaction.

## Theme behavior

- Button colors, hover states, and highlights follow Geist theme variables, adapting automatically between dark and light modes.
- Border color and background can be customized via props to maintain consistency with the global theme.

## Live Demo

Unitary provides reusable tokens, primitives, and component patterns for building consis…

```tsx
import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function Component() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
```

```tsx
import { ShowMore } from "@/components/ui/show-more";

<ShowMore expanded />;
```

```tsx
import { ShowMore } from "@/components/ui/show-more";

<ShowMore noBorder />;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ShowMore } from "@/components/ui/show-more";
```

Native props: `ButtonHTMLAttributes<HTMLButtonElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">expanded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled expanded state reflected by the label and arrow.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noBorder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Removes the trigger border.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MouseEventHandler&lt;HTMLButtonElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Handles expansion requests.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use Pagination; for optional sections, use Collapse.
- Show enough rows to convey the shape of the list before truncating (5–10 typical). Truncating at 2 makes the affordance feel performative.
- Pair the trigger with the count of hidden items so the user knows the cost of expanding (Show 12 More, then Show Less after expand). Title Case both labels.
- Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.
- Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.
- The trigger is a <button> with aria-expanded and aria-controls pointing at the list. After expansion, move focus to the first newly revealed row so screen readers and keyboard users land in the new content.
