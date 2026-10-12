# Scroll Reveal

> Route: `/components/scroll-reveal`

Progressive section reveal with native scrolling and reduced-motion fallback.

[Back to Components](#/components)

# Scroll Reveal

scroll-reveal

Progressive section reveal with native scrolling and reduced-motion fallback.

## When to use

- Section reveal preserving native scrolling; content remains visible without an observer or with reduced motion.

## When not to use

- Do not use it to intercept global wheel or touch scrolling.

## Examples

### Basic usage

Section reveal preserving native scrolling; content remains visible without an observer or with reduced motion.

## Accessibility

- Content is visible on the server and without observers. Reduced motion and keyboard focus reveal content directly.

## Controlled behavior

- Specify root/target to select a scroll owner; omission uses the document.

## Responsive behavior

- Does not change page layout or scrolling inertia; callers place sections and controls.

## Theme behavior

- Uses shared semantic colors and motion tokens with the same interaction contract in both themes.

## Live Demo

Scroll this container to reveal the next section.

Revealed content stays visible.

```tsx
import { useState } from "react";
import { ScrollReveal } from "@hustradio/unitary-ui";

export default function ScrollRevealExample() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setRoot} className="h-60 w-full overflow-y-auto border border-gray-alpha-400 p-4">
      <p className="min-h-64 text-copy-14">Scroll this container to reveal the next section.</p>
      {root ? (
        <ScrollReveal root={root}>
          <p className="rounded-md bg-gray-alpha-100 p-8">Revealed content stays visible.</p>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { ScrollReveal } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Intersection viewport; null observes the document viewport. Remaining props are native div attributes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr></tbody></table>
