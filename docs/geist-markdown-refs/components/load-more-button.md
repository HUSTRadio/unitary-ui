# Load More Button

A full-width button used to append more items to a paginated list, with loading and styling variants.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Loading**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Loading...Loading..." · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#8f8f8f · bg:#f2f2f2 · r:6px
> - **No Gap**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **No Border Radius**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff
> - **Custom Text**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Show More Results" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Loading**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Loading...Loading..." · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#8f8f8f · bg:#1a1a1a · r:6px
> - **No Gap**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **No Border Radius**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Load More" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a
> - **Custom Text**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Show More Results" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { LoadMoreButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <LoadMoreButton>Load More</LoadMoreButton>;
}
```

## Loading

```tsx
import { LoadMoreButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <LoadMoreButton loading>Loading...</LoadMoreButton>;
}
```

## No Gap

```tsx
import { LoadMoreButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <LoadMoreButton noGap>Load More</LoadMoreButton>;
}
```

## No Border Radius

```tsx
import { LoadMoreButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <LoadMoreButton noBorderRadius>Load More</LoadMoreButton>;
}
```

## Custom Text

```tsx
import { LoadMoreButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <LoadMoreButton>Show More Results</LoadMoreButton>;
}
```

Was this helpful?
