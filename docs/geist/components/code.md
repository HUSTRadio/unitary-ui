# Code

Display a snippet of code with syntax highlighting.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "import { Snippet } from '@vercel/geistcn" · .border · h:194px · pad:24px · 400 16px/24px · fg:#171717 · r:5px · b:1px solid rgb(234, 234, 234)
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "import { Snippet } from '@vercel/geistcn" · .border · h:194px · pad:24px · 400 16px/24px · fg:#ededed · r:5px · b:1px solid rgb(51, 51, 51)

<!-- GEIST-RENDER-METRICS-END -->

## Default

```
import { Snippet } from '@vercel/geistcn/components';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

```tsx
import { Code } from "@vercel/geistcn/components";
import type { JSX } from "react";

const codeExampleTsx = `import { Snippet } from '@vercel/geistcn/components';
import type { JSX } from 'react';

export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}`;

export function Component(): JSX.Element {
  return <Code syntax="javascript">{codeExampleTsx}</Code>;
}
```

Was this helpful?
