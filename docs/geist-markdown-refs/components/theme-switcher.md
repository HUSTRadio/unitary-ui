# Theme Switcher

Component that allows users to switch between light and dark themes.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .appearance-none · h:0px · 400 16px/24px · fg:#171717
> - **Small**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .appearance-none · h:0px · 400 16px/24px · fg:#171717
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .appearance-none · h:0px · 400 16px/24px · fg:#171717
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .appearance-none · h:0px · 400 16px/24px · fg:#ededed
> - **Small**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .appearance-none · h:0px · 400 16px/24px · fg:#ededed
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .appearance-none · h:0px · 400 16px/24px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { ThemeSwitcher } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <ThemeSwitcher />;
}
```

## Small

```tsx
import { ThemeSwitcher } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <ThemeSwitcher small />;
}
```

## Disabled

```tsx
import { ThemeSwitcher } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <ThemeSwitcher disabled />;
}
```

## Best Practices

- Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.

- Pass small for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.

- Theme Switcher reads from and writes to next-themes, so wrap the app in GeistProvider once at the root and don’t mirror its state into local React state.

- The control auto-disables when forcedTheme is set on the provider; setting disabled manually is for read-only previews of the control itself.

- Don’t rebuild a theme picker with Switch or three icon buttons. Theme Switcher already handles the icons, the aria-label per option, and System detection.

- The component composes its own labels from the theme keys (light, system, dark); leave them alone so they stay translatable through next-themes.

Was this helpful?
