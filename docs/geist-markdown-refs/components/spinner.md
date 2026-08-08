# Spinner

Indicate an action running in the background. Unlike the loading dots, this should generally be used to indicate loading feedback in response to a user action, like for buttons, pagination, etc.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default size**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Colors**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default size**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Colors**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default size

```tsx
import { Spinner } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Spinner />;
}
```

## Sizes

```tsx
import { Spinner } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-end gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
      <Spinner size="2xl" />
      <Spinner size="3xl" />
      <Spinner size="4xl" />
    </div>
  );
}
```

## Colors

```tsx
import { Spinner } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24">Default:</span>
        <Spinner />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24">Red:</span>
        <Spinner className="text-red-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24">Green:</span>
        <Spinner className="text-green-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24">Blue:</span>
        <Spinner className="text-blue-700" />
      </div>
    </div>
  );
}
```

## Best Practices

### When to use

- Use a Spinner for indeterminate, single-action waits of roughly one to three seconds: submit buttons, inline icon refresh, row-level retries.

- For submit buttons, set the loading prop on Button so the spinner, sizing, and busy state stay aligned; don’t hand-roll a Spinner inside a button.

- Pick Skeleton when async data fills a known layout, LoadingDots for inline copy, and Progress when total work is known.

### Behavior

- Mount the Spinner only after the action starts. Pre-rendering and toggling visibility leaves a partial rotation visible at idle and reads as jank.

- Pair any wait longer than ~1s with copy that names the work (Verifying…, Deploying…) so the user knows what’s blocking.

- Match the Spinner size to the surrounding type or icon size, not the parent container.

### Accessibility

- Set aria-busy="true" on the element wrapping the in-flight action so screen readers announce the state change.

- Keep the trigger focusable while loading; swapping it for a separate spinner element loses keyboard focus.

- Honor prefers-reduced-motion and skip stacking extra animation around the Spinner.

Was this helpful?
