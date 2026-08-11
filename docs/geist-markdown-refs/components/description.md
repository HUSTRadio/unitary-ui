# Description

Displays a brief heading and subheading to communicate any additional information or context a user needs to continue.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> 下列“容器”值属于官方文档 demo 外层，不属于 `Description` 自身。组件 `dl` 实测为 border 0、radius 0、padding 0、透明背景；`dt` 为 14px/14px/400，`dd` 为 14px/16px/500。
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Text right**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Ellipsis**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Text right**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Ellipsis**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Description } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Description
      content="Data about this section."
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## Text right

```tsx
import { Description } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Description
      content="Data about this section."
      right
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## Ellipsis

```tsx
import { Description } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Description
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem."
      ellipsis
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## Best Practices

- Use <Description> for definition-list metadata: a short Title Case key paired with a single value (Last Deployed, Region, Plan). For inline help under a form field, use the input’s helper-text slot instead.

- Geist renders <dl>/<dt>/<dd> so screen readers announce each key/value pair as a definition. Don’t wrap the component in extra paragraphs that break the list semantics.

- Title slot is Title Case noun (Last Deployed, Build Duration); content is sentence case unless the value is a literal identifier, ID, or timestamp that should be preserved verbatim.

- Pass tooltip only when the title alone is ambiguous and a one-sentence definition resolves it. The tooltip text is sentence case and ends with a period.

- Don’t put interactive controls in the title slot. Buttons, menus, and links belong in the content (<dd>) or in the parent layout, not the label (<dt>).

Was this helpful?
