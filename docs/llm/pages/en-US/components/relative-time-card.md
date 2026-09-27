# Relative Time Card

> Route: `/components/relative-time-card`

Shows a relative timestamp with temporal context.

[Back to Components](#/components)

# Relative Time Card

relative-time-card

Shows a relative timestamp with temporal context.

## When to use

- Use relative time formats (like "5 min ago", "2 hours ago") for recent activity displays so users quickly grasp event freshness.
- Use in table cells to show recently performed action timestamps, enabling quick comparison alongside other rows.
- Expose the exact timestamp on hover or focus so users who need the precise date still have access to complete information.

## When not to use

- Once events are too far past for relative wording to help users compare (past a week), switch to absolute date format.
- Do not use Relative Time Card for important date credentials or legal timelines—it is unsuitable for scenarios requiring strict time precision.
- Do not mix multiple time formats showing the same data source on one interface—either use all relative time or convert everything to absolute time.

## Examples

### Default card

Displays the default relative time card appearance, automatically computing and formatting the time difference.

### Hover timestamp

Demonstrates the floating tooltip interaction that switches from relative expression to an exact timestamp on hover.

## Accessibility

- The default trigger shows only relative time, while exact UTC and local timestamps live in the HoverCard; critical time information must not rely on hover alone.
- The default trigger is Tab-focusable and opens the HoverCard; when supplying custom children, callers must still provide a focusable trigger.
- The component does not refresh itself or create a live region; the parent updates date and re-renders as time advances.

## Controlled behavior

Not applicable: Relative Time Card formats the supplied date at render time and has no internal timer or controlled state; the parent re-renders when an update is needed.

## Responsive behavior

- Relative time expressions maintain consistent compact typography across all viewports and do not truncate on narrow screens due to space constraints.
- The floating tooltip showing the exact timestamp on hover is unaffected by viewport size.

## Theme behavior

- Time text color and background follow theme variables, ensuring sufficient readable contrast in both dark and light modes.
- Floating tooltip backgrounds match the theme and apply appropriate shadows to distinguish from underlying content.

## Live Demo

5m ago

```tsx
import { RelativeTimeCard } from "@/components/ui/relative-time-card";

export function RelativeTimeCardDefault21B111CBExample() {
  return <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />;
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">date</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Unix timestamp in milliseconds to format relative to now.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "right" | "bottom" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Preferred hover-card side.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">locale</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">BCP 47 locale for relative and absolute time.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use relative time for recent activity and expose the exact timestamp when users hover or focus.
- Switch to an absolute date once relative wording stops helping users compare events.
