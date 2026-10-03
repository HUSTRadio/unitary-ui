# Full Page Scroller

> Route: `/components/full-page-scroller`

Changes one viewport-sized section after a wheel or touch gesture crosses its threshold.

[Back to Components](#/components)

# Full Page Scroller

full-page-scroller

Changes one viewport-sized section after a wheel or touch gesture crosses its threshold.

## When to use

- Presentations, section-based storytelling and pages that show one section at a time.

## When not to use

- Use native scrolling or Scroller for long documents, tables and ordinary page content.

## Examples

### Full page scrolling and fullscreen

Accumulate 80px of wheel input or swipe 50px to change sections; enter browser fullscreen and exit with Escape.

## Accessibility

- Focus the region to use arrows, PageUp/PageDown, Home and End. Each section has an ordinal label.
- Inactive sections are inert and aria-hidden. Nested controls retain their keyboard behavior; reduced motion disables transitions.

## Controlled behavior

- index is zero-based; defaultIndex initializes uncontrolled state. onIndexChange reports the requested section.
- One wheel gesture and its momentum advance one section; a new gesture waits for the transition and a 160ms quiet gap. Multi-touch and zoom gestures do not page.

## Responsive behavior

- Default height is 100dvh; previews can override it with a fixed height. orientation accepts vertical/horizontal.
- Overflowing section content scrolls internally first. At the first and last boundaries, page scrolling continues.

## Theme behavior

- The region imposes no background; demos use shared tokens and transitions use the slower duration and ease-snap.

## Live Demo

Section 1 / 3

![](/gallery-coast.svg)

### Section 1

Scroll or swipe past the threshold to change sections, or use the arrow keys.

![](/gallery-desert.svg)

### Section 2

Scroll or swipe past the threshold to change sections, or use the arrow keys.

![](/gallery-forest.svg)

### Section 3

Scroll or swipe past the threshold to change sections, or use the arrow keys.

```tsx
import { useRef, useState } from "react";
import { FullPageScroller } from "@/components/ui/full-page-scroller";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function FullPageExample() {
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-copy-14 text-muted-foreground">
          {zh ? `第 ${index + 1} 屏 / 3` : `Section ${index + 1} / 3`}
        </p>
        <Button
          typeName="button"
          type="secondary"
          onClick={() => frame.current?.requestFullscreen?.()}
        >
          {zh ? "全屏体验" : "Open fullscreen"}
        </Button>
      </div>
      <div
        ref={frame}
        className="h-80 w-full overflow-hidden rounded-lg border border-border bg-background [&:fullscreen]:h-dvh [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      >
        <FullPageScroller
          className="h-full"
          index={index}
          onIndexChange={setIndex}
          wheelThreshold={80}
          touchThreshold={50}
        >
          {["coast", "desert", "forest"].map((name, position) => (
            <div key={name} className="relative flex h-full w-full items-center justify-center">
              <img
                src={`/gallery-${name}.svg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative mx-6 rounded-lg bg-background-100/90 p-5 text-center text-foreground">
                <h3 className="text-heading-24">
                  {zh ? `第 ${position + 1} 屏` : `Section ${position + 1}`}
                </h3>
                <p className="mt-2 text-copy-14">
                  {zh
                    ? "滚动或滑动达到阈值后切换整屏，也可以使用方向键。"
                    : "Scroll or swipe past the threshold to change sections, or use the arrow keys."}
                </p>
              </div>
            </div>
          ))}
        </FullPageScroller>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { FullPageScroller } from "@/components/ui/full-page-scroller";
```

Also accepts props defined by: `Omit<ComponentProps<"div">, "onChange">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">orientation</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"vertical" | "horizontal"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Paging axis.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"vertical"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled zero-based section index.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultIndex</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled index.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onIndexChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports a requested section change.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">wheelThreshold</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accumulated wheel distance in pixels; line and page inputs are normalized.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">80</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">touchThreshold</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Minimum completed swipe distance in pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">50</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables gesture and keyboard paging.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Each direct child occupies one full section.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Keep sections related and provide a visible progress indicator.
- Reserve full page gestures for presentations; let long content scroll within its own section.
