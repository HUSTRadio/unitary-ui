# Search Input

Pre-configured search input with a magnifying glass icon and clear button.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **With Cmdk**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2
> - **Loading**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
>   "Esc" · .pointer-coarse:hidden · h:36px · pad:0px 10px · 400 16px/24px · fg:#8f8f8f · r:0px 6px 6px 0px
> - **Custom Prefix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **With Cmdk**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a
> - **Loading**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
>   "Esc" · .pointer-coarse:hidden · h:36px · pad:0px 10px · 400 16px/24px · fg:#8f8f8f · r:0px 6px 6px 0px
> - **Custom Prefix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## With Cmdk

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      aria-label="Search"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Disabled

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      aria-label="Search"
      cmdk
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Loading

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("Project A");
  return (
    <SearchInput
      aria-label="Search"
      loading
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Custom Prefix

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import { IconSparkles } from "@vercel/geistcn-assets/icons";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      prefix={<IconSparkles />}
      value={value}
    />
  );
}
```

Was this helpful?
