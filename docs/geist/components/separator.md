# Separator

A visual divider that separates content into distinct sections, with support for horizontal and vertical orientations.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Horizontal**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Vertical**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Orientation Variants**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Horizontal**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Vertical**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Orientation Variants**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Horizontal

### Section 1

This is the first section of content.

### Section 2

This is the second section of content.

```tsx
import { Separator } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-label-16">Section 1</h3>
        <p className="text-copy-14 text-gray-900">This is the first section of content.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-label-16">Section 2</h3>
        <p className="text-copy-14 text-gray-900">This is the second section of content.</p>
      </div>
    </div>
  );
}
```

## Vertical

Home

About

Services

Contact

```tsx
import { Separator } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex h-8 items-center space-x-4">
      <p className="text-copy-14 text-gray-1000">Home</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">About</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Services</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Contact</p>
    </div>
  );
}
```

## Orientation Variants

#### Horizontal Separators

Content above separator

Content below separator

#### Vertical Separators

```tsx
import { Separator } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-2 text-label-14">Horizontal Separators</h4>
        <div className="space-y-2">
          <p className="text-copy-14">Content above separator</p>
          <Separator orientation="horizontal" />
          <p className="text-copy-14">Content below separator</p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-label-14">Vertical Separators</h4>
        <div className="flex h-6 items-center space-x-2">
          <span className="text-copy-14">Left</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Center</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Right</span>
        </div>
      </div>
    </div>
  );
}
```

Was this helpful?
