# Relative Time Card

Popover to show a given date in local time.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Hover Me" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Hover Me" · .outline-none · h:36px · pad:0px 10px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Button, RelativeTimeCard } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  const date = new Date();
  return (
    <>
      <RelativeTimeCard date={date.getTime()} side="top">
        <Button>Hover Me</Button>
      </RelativeTimeCard>
    </>
  );
}
```

## Best Practices

- Use <RelativeTimeCard> anywhere a recent timestamp appears in scannable surfaces: Table cells, Entity rows, deploy lists, activity feeds. For a static date in body prose past 7 days, render Mar 14, 2026 directly.

- Pass date as a number (Unix ms or epoch). Don’t pre-format the value, and don’t replace children with a formatted string. The component’s short formatter is the canonical form (2m, 5h, Yesterday).

- Don’t append ago after the component. The formatter already produces 2m ago / 5h ago, so <RelativeTimeCard /> ago reads as 2m ago ago.

- Use children only for non-time labels (Just now, Pending, Queued) where the formatter can’t describe the state.

- Pair with a leading label when the row is ambiguous on its own: Last deploy <RelativeTimeCard date={ts} />. The hover card already shows absolute UTC and local time, so don’t duplicate that copy elsewhere on the row.

Was this helpful?
