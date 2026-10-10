# Back to Top

> Route: `/components/back-to-top`

Return to the top of a document or explicit scroll container.

[Back to Components](#/components)

# Back to Top

back-to-top

Return to the top of a document or explicit scroll container.

## When to use

- A return control driven by absolute scroll position, supporting documents and explicit containers.

## When not to use

- Do not use it to intercept global wheel or touch scrolling.

## Examples

### Basic usage

A return control driven by absolute scroll position, supporting documents and explicit containers.

## Accessibility

- Supply an accessible name. A focusable focusTarget restores reading position; reduced motion uses immediate scrolling, and onClick preventDefault cancels the default action.

## Controlled behavior

- Specify root/target to select a scroll owner; omission uses the document.

## Responsive behavior

- Does not change page layout or scrolling inertia; callers place sections and controls.

## Theme behavior

- Uses shared semantic colors and motion tokens with the same interaction contract in both themes.

## Live Demo

### Section start

Scroll down to reveal the return control.

```tsx
import { useRef, useState } from "react";
import { BackToTop } from "@/components/ui/back-to-top";

export default function BackToTopExample() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <div className="w-full">
      <div ref={setTarget} className="h-60 overflow-y-auto border border-gray-alpha-400 p-4">
        <h3 ref={heading} tabIndex={-1} className="text-heading-16">
          Section start
        </h3>
        <p className="min-h-[40rem] text-copy-14">Scroll down to reveal the return control.</p>
      </div>
      {target ? (
        <BackToTop target={target} focusTarget={heading.current} threshold={120}>
          Back to top
        </BackToTop>
      ) : null}
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { BackToTop } from "@/components/ui/back-to-top";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">target</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Scroll owner; omission uses the document.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">focusTarget</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional focus destination before scrolling. Give it tabIndex=-1 when needed.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Absolute distance after which the control appears, in px.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">640</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Provide localized visible text or an aria-label for an icon button.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
