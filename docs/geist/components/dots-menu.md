# Dots Menu

An overflow menu triggered by a three-dot icon that reveals additional actions in a dropdown.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#f2f2f2 · r:6px
> - **Disabled Menu Item**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#1a1a1a · r:6px
> - **Disabled Menu Item**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { DotsMenu, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <DotsMenu>
      <MenuItem>View Build Logs</MenuItem>
      <MenuItem>View Projects</MenuItem>
      <MenuItem>View Analytics</MenuItem>
    </DotsMenu>
  );
}
```

## Sizes

```tsx
import { DotsMenu, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-start gap-6">
      <DotsMenu iconSize={10}>
        <MenuItem>View Build Logs</MenuItem>
        <MenuItem>View Projects</MenuItem>
        <MenuItem>View Analytics</MenuItem>
      </DotsMenu>
      <DotsMenu iconSize={12}>
        <MenuItem>View Build Logs</MenuItem>
        <MenuItem>View Projects</MenuItem>
        <MenuItem>View Analytics</MenuItem>
      </DotsMenu>
      <DotsMenu iconSize={18}>
        <MenuItem>View Build Logs</MenuItem>
        <MenuItem>View Projects</MenuItem>
        <MenuItem>View Analytics</MenuItem>
      </DotsMenu>
    </div>
  );
}
```

## Disabled

```tsx
import { DotsMenu, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <DotsMenu disabled>
      <MenuItem>View Build Logs</MenuItem>
      <MenuItem>View Projects</MenuItem>
      <MenuItem>View Analytics</MenuItem>
    </DotsMenu>
  );
}
```

## Disabled Menu Item

```tsx
import { DotsMenu, MenuItem } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <DotsMenu>
      <MenuItem>View Build Logs</MenuItem>
      <MenuItem disabled>View Projects</MenuItem>
      <MenuItem>View Analytics</MenuItem>
    </DotsMenu>
  );
}
```

Was this helpful?
