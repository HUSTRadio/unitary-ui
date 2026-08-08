# Phone

The Phone component lets you showcase website screenshots or other content within a realistic phone-style frame.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Composition**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Composition**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Composition

```tsx
import { Phone } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="w-full max-w-xs mx-auto">
      <Phone address="https://vercel.com" />
    </div>
  );
}
```

## Best Practices

### When to use

- Use Phone as marketing chrome around mobile screenshots, recordings, and demo images on landing pages and docs.

- Don’t render live mobile product UI inside the frame; the chrome implies a captured screen, not an interactive surface.

- Pair with Browser when showing parallel desktop and mobile views; keep both variants on the same theme.

### Behavior

- Match the variant to the surrounding theme so the chrome doesn’t outshine the screenshot it’s framing.

- Lock the inner image aspect ratio to a real device ratio (typically 19.5:9 for modern phones) so the bezel doesn’t crop content.

- Avoid stacking shadows on the parent container; the Phone chrome already has its own elevation and additional shadow stacks read as a halo.

### Accessibility

- Treat the chrome as decorative (aria-hidden="true"); accessible naming belongs on the inner screenshot.

- Give the inner image alt text describing the screen content (Vercel dashboard on iPhone), not the device.

- For autoplay video inside the frame, respect prefers-reduced-motion and provide a paused poster fallback.

Was this helpful?
