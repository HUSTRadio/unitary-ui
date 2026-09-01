# Banner

> Route: `/components/banner`

A prominent message that spans the full width of its container to announce important information.

[Back to Components](#/components)

# Banner

Banner

A prominent message that spans the full width of its container to announce important information.

## When to use

- Display global announcements, maintenance notices, or critical alerts at the top of a page or section start where user attention is needed.
- Use Banner's button configuration when an announcement needs one explicit linked call to action.
- When a message requires full content width and contextual framing (such as deployment status changes).

## When not to use

- Avoid using Banner for frequently changing dynamic info—consider Toast notifications instead, as they are lighter and persistible.
- Do not stack more than two banners on one page; beyond that, switch to a collapse panel or info list.
- Do not use Banner for form-level field validation errors—use ErrorText or the Input error prop instead.

## Examples

### Default banner

Displays the default Banner message with an optional linked call to action.

## Accessibility

- Banner renders a plain div by default; callers add an appropriate semantic role only when the message truly needs immediate announcement.
- Message text should remain understandable without relying on placement or color alone.
- The linked CTA content should clearly describe its destination or action.

## Controlled behavior

Not applicable: Banner has no open, collapsed, or dismissal state; its parent decides when to render or remove it.

## Responsive behavior

- Banner takes the available parent width up to 1080 px and uses flex-wrap when the message and CTA no longer fit on one line.
- It has no breakpoint-specific font or height changes; narrow layouts follow content width and the parent container.

## Theme behavior

- The Banner shell is transparent by default, while text and CTA colors use theme tokens for light and dark modes.
- There are no built-in success, warning, or error variants; callers compose semantic color and roles when needed.

## Live Demo

**Big News** – New components finally available

[Read more](#/components)

```tsx
import { Banner } from "@/components/ui/banner";

<Banner button={{ href: "#/components", content: "Read more" }}>
  <b>Big News</b> – New components finally available
</Banner>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Banner } from "@/components/ui/banner";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">button</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BannerButton</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional linked call to action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
