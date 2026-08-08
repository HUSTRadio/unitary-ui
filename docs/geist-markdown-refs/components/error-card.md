# Error Card

A card used to communicate an error state with a title and message.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

### No credits left

```tsx
import { ErrorCard } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <ErrorCard
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
      title="No credits left"
    />
  );
}
```

Was this helpful?
