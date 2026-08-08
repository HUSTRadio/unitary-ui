# Copy Button

A button that copies a given string to the clipboard and provides feedback when copied.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:36px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:36px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { CopyButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <CopyButton textToCopy="lipsum" label="copy text" />;
}
```

Was this helpful?
