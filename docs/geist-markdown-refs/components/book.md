# Book

A responsive book component.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Variants**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom color**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom icon**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom illustration**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Responsive**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Width**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Textured**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Variants**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom color**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom icon**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom illustration**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Responsive**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Width**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Textured**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Book title="The user experience of the Frontend Cloud" />;
}
```

## Variants

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" variant="simple" width={196} />
      <Book title="The user experience of the Frontend Cloud" variant="stripe" width={196} />
    </div>
  );
}
```

## Custom color

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book color="#9D2127" title="How Vercel improves your website's search engine ranking" />
      <Book
        color="#7DC1C1"
        textColor="white"
        title="Design Engineering at Vercel"
        variant="simple"
      />
      <Book color="#FED954" title="The user experience of the Frontend Cloud" />
    </div>
  );
}
```

## Custom icon

```tsx
import { Book } from "@vercel/geistcn/components";
import { LogoIconVercel, LogoIconNext, LogoIconReact } from "@vercel/geistcn-assets/logos";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book icon={<LogoIconVercel />} title="Vercel Platform Guide" />
      <Book icon={<LogoIconNext />} title="Next.js Documentation" />
      <Book icon={<LogoIconReact />} title="React Essentials" />
    </div>
  );
}
```

## Custom illustration

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";
import Lines from "./lines";
import Icon from "./icon";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Book illustration={<Lines />} title="The user experience of the Frontend Cloud" />
      <Book
        illustration={<Icon />}
        title="The user experience of the Frontend Cloud"
        variant="simple"
      />
    </div>
  );
}
```

## Responsive

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Book title="The user experience of the Frontend Cloud" width={{ sm: 150, md: 196 }} />;
}
```

## Width

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" width={300} />
      <Book title="The user experience of the Frontend Cloud" width={200} />
      <Book title="The user experience of the Frontend Cloud" width={150} />
    </div>
  );
}
```

## Textured

```tsx
import { Book } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book color="#7DC1C1" textured title="Design Engineering at Vercel" />
        <Book color="#9D2127" textured title="Design Engineering at Vercel" />
        <Book color="#FED954" textured title="Design Engineering at Vercel" />
      </div>
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book
          color="#7DC1C1"
          textColor="white"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#9D2127"
          textColor="#ece4db"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
        <Book
          color="#FED954"
          textColor="#9d3b05"
          textured
          title="Design Engineering at Vercel"
          variant="simple"
        />
      </div>
    </div>
  );
}
```

## Best Practices

### When to use

- Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.

- For in-product cards and dashboard tiles, use Card; Book is too decorative for repeated UI rows.

- Pick simple when the title alone carries the design and stripe when an icon or color stripe adds hierarchy or category cues.

### Behavior

- Set the color prop from design tokens (var(--ds-blue-700), var(--ds-amber-600)) instead of raw hex so the cover follows light/dark theme tokens.

- Reserve the textured variant for hero shots; on a row of multiple Books the texture competes with the labels.

- Use the responsive width prop to keep covers proportional across breakpoints; squashing aspect ratio breaks the metaphor.

### Accessibility

- Treat the cover as decorative chrome and surface the title via the underlying heading element so screen readers don’t double-announce.

- Inner illustrations need alt text only when they communicate something the title doesn’t; otherwise mark them aria-hidden.

- When the Book wraps a link, put the focus ring on the link itself, not the cover, so keyboard users see the actual hit target.

Was this helpful?
