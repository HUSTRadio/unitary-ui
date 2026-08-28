# Browser

> Route: `/components/browser`

Frames screenshots and demos inside a realistic browser window.

[Back to Components](#/components)

# Browser

Browser

Frames screenshots and demos inside a realistic browser window.

## When to use

-   Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.
-   Use it when a static screenshot needs the visual context of a running product without embedding live components.

## When not to use

-   Don't render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.
-   Don't wrap interactive, user-operated components in a Browser frame — render those components directly.

## Examples

### Composition

Places a screenshot or demo inside the browser window frame, showing the standard marketing composition.

## Accessibility

-   The browser chrome is decorative and should carry aria-hidden; meaning lives on the inner image or video.
-   Inner screenshots need alt text describing the product state, not restating the decorative frame.

## Controlled behavior

Not applicable: Browser is a purely presentational frame component and manages no interaction state.

## Responsive behavior

-   The frame scales proportionally with container width while inner media keeps its own aspect ratio.
-   On narrow viewports the chrome decorations shrink with the whole frame rather than wrapping separately.

## Theme behavior

-   Frame background and border colors follow theme variables; dark mode renders a dark window appearance.
-   Traffic-light dot decorations stay recognizable under both themes.

## Live Demo

https://vercel.com

Screenshot or demo content

```tsx
import { Browser } from "@/components/ui/browser";

<div className="w-full max-w-2xl">
  <Browser address="https://vercel.com">
    <div className="flex h-24 items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
      Screenshot or demo content
    </div>
  </Browser>
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Browser } from "@/components/ui/browser"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">url</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Address displayed by the decorative browser chrome.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.
-   Don't render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.
-   The browser chrome is decorative and should carry aria-hidden; meaning lives on the inner image or video.
