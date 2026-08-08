# Video

Embed a video with built-in playback controls and lazy loading support.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .bg-transparent · h:40px · 400 16px/24px · fg:#171717
> - **No Loop**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .bg-transparent · h:40px · 400 16px/24px · fg:#171717
> - **No Controls**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .bg-transparent · h:40px · 400 16px/24px · fg:#ededed
> - **No Loop**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .bg-transparent · h:40px · 400 16px/24px · fg:#ededed
> - **No Controls**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Video } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Video
      height={582}
      lazy={false}
      src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4"
      width={600}
    />
  );
}
```

## No Loop

```tsx
import { Video } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Video
      height={582}
      lazy={false}
      loop={false}
      src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4"
      width={600}
    />
  );
}
```

## No Controls

```tsx
import { Video } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Video
      controls={false}
      height={582}
      lazy={false}
      src="https://k2mkucxia43oc7fa.public.blob.vercel-storage.com/front/geist-font-page/videos/dark/geist.mp4"
      width={600}
    />
  );
}
```

Was this helpful?
