# Browser

The Browser component lets you showcase website screenshots or any other content within a realistic browser-style frame.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Composition**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:24px · 500 16px/24px · fg:#171717 · r:4px
>
> **Dark 主题**
>
> - **Composition**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:24px · 500 16px/24px · fg:#ededed · r:4px

<!-- GEIST-RENDER-METRICS-END -->

## Composition

```tsx
import { Browser } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="max-w-4xl">
      <Browser address="https://www.vercel.com">
        <div className="p-6" />
      </Browser>
    </div>
  );
}
```

## Best Practices

### When to use

- Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.

- Don’t render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.

- Compose from the building blocks (Dots, Controls, address bar) when the canned Browser shape doesn’t fit the layout; don’t fork the chrome.

### Behavior

- Match the variant to the surrounding theme: light chrome on light backgrounds, dark chrome on dark, so the frame doesn’t fight the page.

- For long URLs, use Middle Truncate inside the address bar so the host and path tail both remain visible.

- Lock the inner image aspect ratio so the chrome doesn’t reflow when an image is missing or slow to load.

### Accessibility

- The browser chrome is decorative and should carry aria-hidden="true"; meaning lives on the inner image or video.

- Give the inner screenshot meaningful alt text describing what the user is seeing, not “browser screenshot”.

- Don’t add focusable dot controls or back/forward buttons; the chrome is a frame, and unreachable controls confuse keyboard users.

Was this helpful?
