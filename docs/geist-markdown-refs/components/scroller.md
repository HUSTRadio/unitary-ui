# Scroller

Display an overflowing list of items.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Vertical**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Horizontal**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Free**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Vertical with buttons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
> - **Horizontal with buttons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
>
> **Dark 主题**
>
> - **Vertical**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Horizontal**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Free**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Vertical with buttons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px
> - **Horizontal with buttons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px

<!-- GEIST-RENDER-METRICS-END -->

## Vertical

```tsx
import { Scroller } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Scroller height={220} overflow="y" width="100%">
      <div
        className="flex flex-col items-stretch justify-start gap-4 flex-initial"
        style={{ width: 400 }}
      >
        <div className="bg-gray-1000 h-64 w-64" />
        <div className="bg-gray-1000 h-64 w-64" />
      </div>
    </Scroller>
  );
}
```

## Horizontal

```tsx
import { Scroller } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Scroller height="100%" overflow="x" width="100%">
      <div
        className="flex flex-row items-stretch justify-start gap-4 flex-initial"
        style={{ minWidth: "120%" }}
      >
        <div className="bg-gray-1000 h-64 w-64" />
        <div className="bg-gray-1000 h-64 w-64" />
        <div className="bg-gray-1000 h-64 w-64" />
        <div className="bg-gray-1000 h-64 w-64" />
      </div>
    </Scroller>
  );
}
```

## Free

```tsx
import { Scroller } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Scroller height={220} overflow="both" width="100%">
      <div className="grid grid-flow-col grid-rows-2 gap-4">
        {...Array.from({ length: 6 }, (_, i) => <div className="bg-gray-1000 h-96 w-96" key={i} />)}
      </div>
    </Scroller>
  );
}
```

## Vertical with buttons

Buttons will automatically scroll to a given direct child.

```tsx
import { Scroller } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex max-w-max flex-col gap-4">
      <Scroller childrenContainerClassName="gap-4" height={220} overflow="y" withButtons>
        {...Array.from({ length: 4 }, (_, i) => <div className="bg-gray-1000 h-60 w-96" key={i} />)}
      </Scroller>
    </div>
  );
}
```

## Horizontal with buttons

Buttons will automatically scroll to a given direct child.

```tsx
import { Scroller } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Scroller
        childrenContainerClassName="gap-4"
        height="100%"
        overflow="x"
        width="100%"
        withButtons
      >
        {...Array.from({ length: 4 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Ignored using `--suppress`
          <div className="bg-gray-1000 h-64 w-96 shrink-0" key={i} />
        ))}
      </Scroller>
    </div>
  );
}
```

## Best Practices

### When to use

- Use Scroller for an overflowing list of peer items along a single axis: chip rows, log streams, code snippets, command palettes.

- Pick vertical for stacked feeds, horizontal for chip and tile rails, free only when content genuinely scrolls in both directions (logs with very long lines).

- For paginated or virtualized data sets larger than a few hundred items, render with a virtualization library inside the Scroller rather than dumping every node into the DOM.

### Behavior

- Auto-scroll buttons target direct children only. If items are wrapped in extra layout nodes the buttons won’t find their target.

- Show edge fade or shadow affordances on the clipped axis so users see there’s more content past the viewport.

- Keep item widths and gaps consistent in horizontal scrollers; ragged edges break the snap rhythm and make the rail feel broken.

### Accessibility

- Tab order follows DOM order, so place items in reading order regardless of visual scroll direction.

- Scroller buttons need aria-labels that name the direction and content (Scroll customer logos left), not bare Previous/Next.

- Make sure focusing an off-screen item scrolls it into view; the default browser behavior covers this, but custom focus traps can break it.

Was this helpful?
