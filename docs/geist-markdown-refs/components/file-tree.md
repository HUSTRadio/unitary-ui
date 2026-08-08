# File Tree

Display a hierarchical directory structure with expandable folders and files, useful for illustrating project layouts.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   ".vercel" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#111111 · r:4px
>   "output" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#111111 · r:4px
>   "functions" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#111111 · r:4px
>   "edge.func" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#111111 · r:4px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   ".vercel" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#fafafa · r:4px
>   "output" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#fafafa · r:4px
>   "functions" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#fafafa · r:4px
>   "edge.func" · .grow-1 · h:28px · pad:4px 8px · 400 13px/28px · fg:#fafafa · r:4px

<!-- GEIST-RENDER-METRICS-END -->

## Default

- output functions edge.func .vc-config.json index.js

```tsx
import { Tree, Folder, File } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Tree>
      <Folder name=".vercel" defaultOpen>
        <Folder name="output" defaultOpen>
          <Folder name="functions" defaultOpen>
            <Folder name="edge.func" defaultOpen>
              <File name=".vc-config.json" href="/" />
              <File name="index.js" />
            </Folder>
          </Folder>
        </Folder>
      </Folder>
      <Folder name="app">
        <File name="main.tsx" type="edge-function" />
        <File name="dashboard.tsx" type="lambda" />
        <File name="dashboard.tsx" type="middleware" />
      </Folder>
    </Tree>
  );
}
```

Was this helpful?
