# Pagination

Navigate to the previous or next page.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "PreviousHome" · .group · h:56px · pad:4px 8px 4px 28px · 400 16px/24px · fg:#171717 · r:6px
>   "NextIntroduction" · .group · h:56px · pad:4px 28px 4px 8px · 400 16px/24px · fg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "PreviousHome" · .group · h:56px · pad:4px 8px 4px 28px · 400 16px/24px · fg:#ededed · r:6px
>   "NextIntroduction" · .group · h:56px · pad:4px 28px 4px 8px · 400 16px/24px · fg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Pagination } from "@vercel/geistcn/components";
import type { JSX } from "react";

const prev = {
  title: "Home",
  href: "#",
};

const next = {
  title: "Introduction",
  href: "#",
};

export function Component(): JSX.Element {
  return <Pagination next={next} previous={prev} />;
}
```

## Best Practices

- Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use Show More or a numbered pager.

- previous.title and next.title are the destination page names (Deploy Hooks, Environment Variables). Geist already renders the Previous / Next label, the chevron, and the Go to {direction} page: {title} aria label; don’t prepend arrows or Go to.

- Hide the slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.

- Keep titles Title Case and short enough to fit the rail without wrapping; long destination names truncate, so put the distinctive word first.

- Don’t restate ordinal positions like Page 3 of 10 inside previous.title or next.title. Pagination is sibling-link, not a numbered pager.

Was this helpful?
