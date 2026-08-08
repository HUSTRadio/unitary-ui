# Keyboard Input

Display keyboard input that triggers an action.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Modifiers**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Combination**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Small**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Modifiers**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Combination**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Small**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Modifiers

```tsx
import { Kbd } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <>
      <Kbd meta />
      <Kbd shift />
      <Kbd alt />
      <Kbd ctrl />
    </>
  );
}
```

## Combination

```tsx
import { Kbd } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Kbd meta shift />;
}
```

## Small

```tsx
import { Kbd } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Kbd small>/</Kbd>;
}
```

## Best Practices

- Use <Kbd> for shortcut hints inside prose, menu items, and button suffixes. In long-form docs that narrate a shortcut, write the ⌘ K shortcut directly so the page renders the same when copied to plain text.

- Pass modifiers via boolean props (meta, shift, alt, ctrl). The component swaps ⌘ for Ctrl on Windows and Linux, so hard-coding <Kbd>Cmd+K</Kbd> ships the wrong glyph to half your users.

- children is one key, digit, or named key (K, 7, Enter, Esc). Don’t lowercase it, don’t spell out modifiers inside, and don’t pack a sentence into the element.

- Use small inside dense surfaces like menu rows, command-bar items, or table cells where the default size crowds adjacent text.

- Punctuation lives outside the element: Press <Kbd meta>K</Kbd> to open the command menu. Period, comma, and or separators stay in surrounding prose so screen readers don’t announce them as keys.

Was this helpful?
