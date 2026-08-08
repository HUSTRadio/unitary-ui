# Breadcrumbs

Navigation aid that shows the user's location within a site's hierarchy, with text and menu variants.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Home" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#4d4d4d · bg:#fafafa · r:4px · b:1px solid rgba(0, 0, 0, 0.08)
>   "Dashboard" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#4d4d4d · bg:#fafafa · r:4px · b:1px solid rgba(0, 0, 0, 0.08)
>   "Overview" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#4d4d4d · bg:#fafafa · r:4px · b:1px solid rgba(0, 0, 0, 0.08)
> - **Active**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Home" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#a1a1a1 · bg:#000000 · r:4px · b:1px solid rgba(255, 255, 255, 0.14)
>   "Dashboard" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#a1a1a1 · bg:#000000 · r:4px · b:1px solid rgba(255, 255, 255, 0.14)
>   "Overview" · .py-0.5 · h:22px · pad:2px 6px · 400 12px/16px · fg:#a1a1a1 · bg:#000000 · r:4px · b:1px solid rgba(255, 255, 255, 0.14)
> - **Active**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Breadcrumb, BreadcrumbItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Overview</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Overview</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
```

## Active

```tsx
import { Breadcrumb, BreadcrumbItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem active>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## Disabled

```tsx
import { Breadcrumb, BreadcrumbItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

Was this helpful?
