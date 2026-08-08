# Clearable Input

Text input with a clear button that resets the value on Escape.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **With Label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **With Cmdk**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2
>   "Esc" · .pointer-coarse:hidden · h:36px · pad:0px 10px · 400 16px/24px · fg:#8f8f8f · r:0px 6px 6px 0px
> - **With Clear Callback**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **With Label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **With Cmdk**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a
>   "Esc" · .pointer-coarse:hidden · h:36px · pad:0px 10px · 400 16px/24px · fg:#8f8f8f · r:0px 6px 6px 0px
> - **With Clear Callback**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 0px 0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { ClearableInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <ClearableInput
      aria-label="Demo clearable input"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## With Label

```tsx
import { ClearableInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <ClearableInput
      label="Email"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter your email..."
      value={value}
    />
  );
}
```

## With Cmdk

```tsx
import { ClearableInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <ClearableInput
      aria-label="Search with cmdk"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Search..."
      value={value}
    />
  );
}
```

## Disabled

```tsx
import { ClearableInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("Some text");
  return (
    <ClearableInput
      aria-label="Disabled clearable input"
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

## With Clear Callback

Cleared 0 times

```tsx
import { ClearableInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  const [clearCount, setClearCount] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      <ClearableInput
        aria-label="Clearable input with callback"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClear={() => {
          setClearCount((prev) => prev + 1);
        }}
        placeholder="Enter some text and clear..."
        value={value}
      />
      <p className="text-copy-14 text-gray-900">Cleared {clearCount} times</p>
    </div>
  );
}
```

Was this helpful?
