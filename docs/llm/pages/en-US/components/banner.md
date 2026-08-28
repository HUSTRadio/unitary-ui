# Banner

> Route: `/components/banner`

A prominent message that spans the full width of its container to announce important information.

[Back to Components](#/components)

# Banner

Banner

A prominent message that spans the full width of its container to announce important information.

## When to use

-   Display global announcements, maintenance notices, or critical alerts at the top of a page or section start where user attention is needed.
-   Use Banner as a section-level error indicator when conveying semantic states with color and icons (success, warning, error).
-   When a message requires full content width and contextual framing (such as deployment status changes).

## When not to use

-   Avoid using Banner for frequently changing dynamic info—consider Toast notifications instead, as they are lighter and persistible.
-   Do not stack more than two banners on one page; beyond that, switch to a collapse panel or info list.
-   Do not use Banner for form-level field validation errors—use ErrorText or the Input error prop instead.

## Examples

### Default banner

Displays the default Banner appearance with title and description text.

## Accessibility

-   Banner carries alert or status semantics so screen readers correctly recognize and announce its content.
-   Banner titles use a higher heading level (Heading 2 or 3), with description text following to maintain reading hierarchy.
-   Dismissable Banner buttons should have an explicit aria-label describing the close action.

## Controlled behavior

-   Banner supports programmatic control of open/collapsed state, allowing developers to decide when to auto-dismiss or manually intervene.
-   Focus returns to the trigger button after the close animation completes, maintaining keyboard user navigation continuity.

## Responsive behavior

-   Banner fills horizontally within its full-width container and adjusts padding and font scaling automatically on smaller screens.
-   On mobile devices, Banner height is reduced with content arranged in a stacked layout instead of inline.

## Theme behavior

-   Different semantic Banner types (success, warning, error) have corresponding color palettes in both dark and light modes.
-   Banner background and border colors are managed through theme variables, supporting global customization.

## Live Demo

**Big News** – New components finally available

[Read more](#/components)

```tsx
import { Banner } from "@/components/ui/banner";

<Banner button={{ href: "#/components", content: "Read more" }}>
  <b>Big News</b> – New components finally available
</Banner>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Banner } from "@/components/ui/banner"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">button</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BannerButton</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional linked call to action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
