# Text With Copy Button

Display text alongside a button that copies the text to the clipboard.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Copy" · .cursor-pointer · h:24px · 400 16px/24px · fg:#333333
> - **With Small and Tertiary**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Copy config digest" · .cursor-pointer · h:24px · 400 16px/24px · fg:#333333
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Copy" · .cursor-pointer · h:24px · 400 16px/24px · fg:#eaeaea
> - **With Small and Tertiary**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Copy config digest" · .cursor-pointer · h:24px · 400 16px/24px · fg:#eaeaea

<!-- GEIST-RENDER-METRICS-END -->

## Default

Copy

```tsx
import { TextWithCopyButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TextWithCopyButton
      ellipsis
      successMessage="Copied to clipboard"
      textLabel="Copy"
      textToCopy="lipsum"
    />
  );
}
```

## With Small and Tertiary

Copy config digest

```tsx
import { TextWithCopyButton } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TextWithCopyButton
      ellipsis
      successMessage="Copied hashed digest to clipboard"
      textLabel="Copy config digest"
      textToCopy="edgeConfigData.digest"
    />
  );
}
```

Was this helpful?
