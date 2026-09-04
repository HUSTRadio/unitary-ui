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
- The component label is fixed to "Show More" / "Show Less". If hidden-item count matters, render that count in adjacent caller-owned content.

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
- The component provides a native button and aria-expanded; callers should connect it to the revealed region with aria-controls.
- The component does not move focus or create a live region. Add announcement behavior to the content region only when the product flow requires it.

## Controlled behavior

- expanded controls the label, arrow direction, and aria-expanded; the caller updates external state through the native onClick handler.
- ShowMore renders only the trigger and does not manage the target content, expansion animation, or focus position.

## Responsive behavior

Not applicable: ShowMore renders only a fixed 32px-high trigger. It does not manage target-row layout or breakpoint behavior; callers own the responsive content layout.

## Theme behavior

- Button colors, hover states, and highlights follow Geist theme variables, adapting automatically between dark and light modes.
- noBorder only removes the default border. There are no dedicated border-color or background props; use className for additional styling.

## Live Demo

```tsx
import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function ShowMoreDefault21B111CBExample() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
```

## Expanded

```tsx
import { ShowMore } from "@/components/ui/show-more";

export function ShowMoreExpandedE72D5D8DExample() {
  return <ShowMore expanded />;
}
```

## No border

```tsx
import { ShowMore } from "@/components/ui/show-more";

export function ShowMoreNoBorder5DEDD0A8Example() {
  return <ShowMore noBorder />;
}
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
- ShowMore uses fixed "Show More" / "Show Less" labels. Put any hidden-item count in adjacent caller-owned content.
- Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.
- Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.
- The trigger is a <button> with aria-expanded; pass aria-controls to point at the revealed region. ShowMore does not manage that content, move focus, or create a live region.
