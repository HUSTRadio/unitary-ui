# Lazy Load

> Route: `/components/lazy-load`

Mounts content once it approaches a viewport or a local scroll container.

[Back to Components](#/components)

# Lazy Load

lazy-load

Mounts content once it approaches a viewport or a local scroll container.

## When to use

- Mount long-list content, offscreen charts or media as they approach the viewport.

## When not to use

- Render critical initial content eagerly; prefer native loading="lazy" for simple images.

## Examples

### Images in a local scroll container

Skeletons preserve image aspect ratios; scrolling increases the mounted count and content stays mounted after leaving view.

## Accessibility

- Provide alt text on revealed images and reserve placeholder dimensions. LazyLoad does not announce every mount by default.

## Controlled behavior

- Mounts once after the rootMargin and threshold conditions are met; content and internal state then remain mounted.
- onLoad reports mounting, not network completion. disabled or missing IntersectionObserver renders eagerly.
- Deferred children are absent from server HTML; use disabled when eager server rendering is required.

## Responsive behavior

- root can be a local scroll container; null means the browser viewport and rootMargin defaults to 200px.
- Reserve dimensions with width/height, min-height or aspect-ratio to avoid a zero-height observer target and layout shifts.

## Theme behavior

- The component adds no visual theme; the demo uses Skeleton and background tokens.

## Live Demo

1 / 6 images mounted; scroll down to load more.

![Landscape illustration 1](/gallery-coast.svg)

```tsx
import { useState } from "react";
import { LazyLoad } from "@/components/ui/lazy-load";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";

export default function LazyLoadExample() {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(0);
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  return (
    <div className="w-full space-y-3">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {zh
          ? `已挂载 ${loaded} / 6 张图片；向下滚动加载更多。`
          : `${loaded} / 6 images mounted; scroll down to load more.`}
      </p>
      <div
        ref={setViewport}
        data-slot="lazy-demo-viewport"
        tabIndex={0}
        aria-label={zh ? "延迟加载图片列表" : "Lazy image list"}
        className="h-80 overflow-y-auto rounded-lg border border-border p-3 focus-ring"
      >
        <div className="space-y-4">
          {["coast", "desert", "forest", "coast", "desert", "forest"].map((name, position) => (
            <LazyLoad
              key={position}
              root={viewport}
              rootMargin="80px"
              className="aspect-[16/9] w-full overflow-hidden rounded-md"
              placeholder={<Skeleton className="h-full w-full" />}
              onLoad={() => setLoaded((count) => count + 1)}
            >
              <img
                src={`/gallery-${name}.svg`}
                alt={zh ? `风景插画 ${position + 1}` : `Landscape illustration ${position + 1}`}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </LazyLoad>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { LazyLoad } from "@/components/ui/lazy-load";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

All APIs in this table are Unitary extensions.

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content shown before the first reveal.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | Document | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">IntersectionObserver scroll root; null uses the viewport.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rootMargin</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Observer margin for loading before content is visible.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"200px"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Required intersection ratio.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLoad</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called once when deferred content mounts; not an image download callback.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders content eagerly.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Subtree mounted once, then retained.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Reserve content dimensions with a placeholder to prevent layout shifts.
- Use native image loading="lazy" for simple images; use LazyLoad to defer an entire subtree.
