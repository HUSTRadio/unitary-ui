# Banner

A prominent message that spans the full width of its container to announce important information.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Big News – New components finally availa" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
>   "Read more" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Big News – New components finally availa" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px
>   "Read more" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px

<!-- GEIST-RENDER-METRICS-END -->

## Default

Big News – New components finally available

```tsx
import { Banner } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Banner button={{ href: "#", content: "Read more" }} className="p-4">
      <b>Big News</b> – New components finally available
    </Banner>
  );
}
```

Was this helpful?
