# Show more

Styling component to show expanded or collapsed content.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
> - **Expanded**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Show Less" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
> - **No border**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px
> - **Expanded**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Show Less" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px
> - **No border**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { ShowMore } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
```

## Expanded

```tsx
import { ShowMore } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <ShowMore expanded />;
}
```

## No border

```tsx
import { ShowMore } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <ShowMore noBorder />;
}
```

## Best Practices

- Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use Pagination; for optional sections, use Collapse.

- Show enough rows to convey the shape of the list before truncating (5–10 typical). Truncating at 2 makes the affordance feel performative.

- Pair the trigger with the count of hidden items so the user knows the cost of expanding (Show 12 More, then Show Less after expand). Title Case both labels.

- Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.

- Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.

- The trigger is a <button> with aria-expanded and aria-controls pointing at the list. After expansion, move focus to the first newly revealed row so screen readers and keyboard users land in the new content.

Was this helpful?
