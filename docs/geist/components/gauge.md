# Gauge

A circular visual for conveying a percentage.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Default color scale**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom color range**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Custom secondary color**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Arc priority**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Indeterminate**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Default color scale**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom color range**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Custom secondary color**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Arc priority**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Indeterminate**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Gauge size="tiny" value={50} />
      <Gauge size="small" value={50} />
      <Gauge size="medium" value={50} />
      <Gauge size="large" value={50} />
    </div>
  );
}
```

## Label

80

100

80

100

80

100

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Gauge showValue size="tiny" value={80} />
      <Gauge showValue size="small" value={80} />
      <Gauge showValue size="small" value={100} />
      <Gauge showValue size="medium" value={80} />
      <Gauge showValue size="medium" value={100} />
      <Gauge showValue size="large" value={80} />
      <Gauge showValue size="large" value={100} />
    </div>
  );
}
```

## Default color scale

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Gauge size="small" value={14} />
      <Gauge size="small" value={34} />
      <Gauge size="small" value={68} />
    </div>
  );
}
```

## Custom color range

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-2 flex-initial">
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={0}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={10}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={20}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={30}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={40}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={50}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={60}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={70}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={80}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={90}
      />
      <Gauge
        colors={{
          "0": "var(--ds-pink-100)",
          "10": "var(--ds-pink-200)",
          "20": "var(--ds-pink-300)",
          "30": "var(--ds-pink-400)",
          "50": "var(--ds-pink-500)",
          "60": "var(--ds-pink-600)",
          "70": "var(--ds-pink-700)",
          "80": "var(--ds-pink-800)",
          "90": "var(--ds-pink-900)",
          "100": "var(--ds-pink-1000)",
        }}
        size="small"
        value={100}
      />
    </div>
  );
}
```

## Custom secondary color

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex justify-start">
      <Gauge
        colors={{
          primary: "var(--ds-blue-700)",
          secondary: "var(--ds-blue-300)",
        }}
        size="medium"
        value={50}
      />
    </div>
  );
}
```

## Arc priority

When using the gauge to display a ratio, use the equal arc priority to make both arcs are equally sized.

50

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-2 flex-initial">
      <Gauge
        arcPriority="equal"
        colors={{
          primary: "var(--ds-blue-700)",
          secondary: "var(--ds-red-700)",
        }}
        showValue
        size="medium"
        value={50}
      />
    </div>
  );
}
```

## Indeterminate

```tsx
import { Gauge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-row items-stretch justify-start gap-2 flex-initial">
      <Gauge indeterminate size="tiny" value={25} />
      <Gauge indeterminate size="small" value={25} />
      <Gauge indeterminate size="medium" value={25} />
      <Gauge indeterminate size="large" value={25} />
    </div>
  );
}
```

## Best Practices

### When to use

- A 0–100 ratio against a fixed maximum where the comparison is the point, like quota usage, build cache hit rate, uptime, or billing-period consumption.

- For determinate task progress with a known total (uploads, multi-step setup), use Progress.

- For binary or enumerated state, use Status Dot for deployments or Badge for everything else.

### Behavior

- Use arc="equal" for true ratios so 50% reads as exactly half. Use the default primary arc for single-percentage usage where the filled portion is the story.

- Threshold colors should match the same numeric breakpoints used elsewhere in the product (>=80% warning, >=95% error). Don’t invent gauge-only thresholds.

- Pair indeterminate with explanatory copy nearby (Calculating usage…) so the user knows the value is loading, not zero.

### Content

- Always pair the gauge with an adjacent label or Tooltip naming what the number represents (Build Cache Hit Rate). The gauge alone is not self-describing.

- Don’t put units inside children; the label carries the unit (Uptime · 99.97%). children is reserved for an icon overlay.

- When showValue is on, the rendered number is the value only. Never inject a % or unit string into the prop.

### Accessibility

- The component sets role="progressbar" with aria-valuemin, aria-valuemax, and aria-valuenow. Don’t override those.

- The adjacent label is the gauge’s accessible name. Tie it with aria-labelledby on the gauge wrapper so screen readers read “Uptime, 99 percent.”

- Don’t use color to encode the threshold without redundant text; pair the warning tint with copy below or in the Tooltip.

Was this helpful?
