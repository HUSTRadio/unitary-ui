# Slider

Input to select a value from a given range.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   h:14px · 400 16px/24px · fg:#171717
> - **With label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   h:14px · 400 16px/24px · fg:#171717
> - **Range with inputs**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
>   h:14px · 400 16px/24px · fg:#171717
> - **Disabled range with inputs**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2
>   h:14px · 400 16px/24px · fg:#171717
> - **Commit on release**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   h:14px · 400 16px/24px · fg:#171717
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   h:14px · 400 16px/24px · fg:#ededed
> - **With label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   h:14px · 400 16px/24px · fg:#ededed
> - **Range with inputs**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
>   h:14px · 400 16px/24px · fg:#ededed
> - **Disabled range with inputs**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a
>   h:14px · 400 16px/24px · fg:#ededed
> - **Commit on release**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   h:14px · 400 16px/24px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Slider } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([50]);
  return (
    <form>
      <Slider onValueChange={(value) => setValue(value as number[])} value={value} />
    </form>
  );
}
```

## With label

```tsx
import { Slider } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([40]);
  return (
    <form>
      <Slider label="Volume" onValueChange={(value) => setValue(value as number[])} value={value} />
    </form>
  );
}
```

## Range with inputs

```tsx
import { Slider } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([50, 75]);
  return (
    <form>
      <Slider
        onValueChange={(value) => setValue(value as number[])}
        showEndInput
        showStartInput
        value={value}
      />
    </form>
  );
}
```

## Disabled range with inputs

```tsx
import { Slider } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([50, 75]);
  return (
    <form>
      <Slider
        disabled
        onValueChange={(value) => setValue(value as number[])}
        showEndInput
        showStartInput
        value={value}
      />
    </form>
  );
}
```

## Commit on release

Last committed: —

```tsx
import { Slider } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([50]);
  const [committed, setCommitted] = useState<number | null>(null);
  return (
    <form>
      <Slider
        label="Drag then release"
        onValueChange={(value) => setValue(value as number[])}
        onValueCommitted={(value) => setCommitted((value as number[])[0] ?? null)}
        value={value}
      />
      <p className="text-copy-13 text-gray-900" style={{ marginTop: 8 }}>
        Last committed: {committed === null ? "—" : committed}
      </p>
    </form>
  );
}
```

## Best Practices

- Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.

- For exact values like a port number or memory limit, pair the slider with a numeric Input; keyboard users default to typing.

- Snap to a sensible step (1, 5, 10%) so dragging never produces values like 47.83291. Clamp min and max to real product limits.

- Always render the live value next to the track in tabular nums, and label what the number represents (Sample Rate · 44 kHz). The track alone is not self-describing.

- Threshold colors (warning, error tints past a limit) should match the same numeric breakpoint surfaced elsewhere in the UI; don’t invent a slider-only threshold.

- Give the slider an accessible name through a sibling <label htmlFor> or aria-label, and let the native arrow-key, Page Up/Down, Home/End behavior do the keyboard work. Don’t intercept those keys.

Was this helpful?
