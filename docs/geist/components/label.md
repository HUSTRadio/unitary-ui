# Label

Accessible text label for form controls.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With Input**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Bypass Casing**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With Input**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Bypass Casing**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Label } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Label id="test-input" value="This is a label" />;
}
```

## With Input

```tsx
import { Input, Label } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <Label id="test-input" value="Email Address" withInput />
      <Input aria-labelledby="test-input" id="test-input" placeholder="Enter email address..." />
    </>
  );
}
```

## Bypass Casing

```tsx
import { Input, Label } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <Label bypassCasing id="test-input" value="Email address" withInput />
      <Input aria-labelledby="test-input" id="test-input" placeholder="Enter email address..." />
    </>
  );
}
```

Was this helpful?
