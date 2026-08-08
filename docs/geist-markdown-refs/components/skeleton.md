# Skeleton

Display a skeleton whilst another component is loading.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default with set width**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Default with box height**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Wrapping children**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Hidden by skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Not hidden by skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Wrapping children with fixed size**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Not hidden by Skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Pill**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Rounded**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Squared**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **No animation**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Button**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Loading..." · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Save" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>   "Cancel" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Default with set width**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Default with box height**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Wrapping children**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Hidden by skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Not hidden by skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Wrapping children with fixed size**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Not hidden by Skeleton" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Pill**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Rounded**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Squared**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **No animation**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Button**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Loading..." · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Save" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
>   "Cancel" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default with set width

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Skeleton width={160} />;
}
```

## Default with box height

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Skeleton boxHeight={42} width={160} />;
}
```

## Wrapping children

If you do not pass a fixed size, it will be calculated automatically.

```tsx
import { Button, Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton>
        <Button>Hidden by skeleton</Button>
      </Skeleton>

      <Skeleton show={false}>
        <Button>Not hidden by skeleton</Button>
      </Skeleton>
    </div>
  );
}
```

## Wrapping children with fixed size

The skeleton will hide when children are not null, but the size is retained.

```tsx
import { Button, Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton height={100} width="100%">
        {null}
      </Skeleton>

      <Skeleton height={100} width="100%">
        <Button>Not hidden by Skeleton</Button>
      </Skeleton>
    </div>
  );
}
```

## Pill

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Skeleton pill width={48} />;
}
```

## Rounded

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Skeleton boxHeight={48} height={48} rounded width={48} />;
}
```

## Squared

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Skeleton boxHeight={48} height={48} squared width={48} />;
}
```

## No animation

```tsx
import { Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Skeleton animated={false} height={100} width="100%">
      {null}
    </Skeleton>
  );
}
```

## Button

Without button prop (default):

With button prop (extends animation by 1px):

Multiple buttons loading:

```tsx
import { Button, Skeleton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Without button prop (default):</p>
        <Skeleton height={32} width={120}>
          <Button>Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">With button prop (extends animation by 1px):</p>
        <Skeleton button height={32} width={120}>
          <Button>Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Multiple buttons loading:</p>
        <div className="flex gap-3">
          <Skeleton button>
            <Button>Save</Button>
          </Skeleton>
          <Skeleton button>
            <Button variant="secondary">Cancel</Button>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

### When to use

- Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars.

- For a single in-flight action, use Spinner; for an indeterminate inline wait, use LoadingDots; for known progress, use Progress.

- Don’t use Skeleton as permanent decoration or as a placeholder for empty states. When there’s no data to load, render an EmptyState.

### Behavior

- Set width and height to match the final content so the layout doesn’t shift when data resolves. A 200×20 block becoming an 80×16 string reads as a glitch.

- Pick pill, rounded, or squared to mirror the eventual element’s shape (avatars pill, buttons and chips rounded, image tiles squared).

- When the skeleton wraps children, keep dimensions stable so the reveal swap doesn’t reflow surrounding content.

### Accessibility

- Wrap the loading region in aria-busy="true" and announce completion with aria-live="polite" on the destination container, not the skeleton itself.

- Disable the shimmer with the no animation variant on low-power surfaces and respect prefers-reduced-motion.

- Skeletons are decorative; avoid placing focusable controls inside them while loading.

Was this helpful?
