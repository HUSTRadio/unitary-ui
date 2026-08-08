# Toggle

Displays a boolean value.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **轨道 + 圆钮（2026-08-08 补充实测，computed style + getBoundingClientRect）**
>
> 所有尺寸/状态/颜色的圆钮定位恒定：`absolute left:1.5px top:50% -translate-y-50%`，边距 1.5px。
> 1.5px 而非 2px：2px 在 125% DPI 下 = 2.5px 撞亚像素 .5，光栅化取整方向不同导致圆钮视觉歪斜；1.5px × 1.25 = 1.875px 不撞 .5，任意 DPI 下取整对称。
>
> 尺寸（Light + Dark 一致）：
>
> | size | 轨道 W×H | 圆钮 W×H | 圆钮 left | 圆钮 top | checked 位移 | 边距(上/下/活动边) |
> | --- | --- | --- | --- | --- | --- | --- |
> | small (default) | 28×14 | 11×11 | 1.5px | 7px (=14/2-1.5+1) | translate-x-[14px] | 1.5px |
> | medium | 36×20 | 17×17 | 1.5px | 10px | translate-x-[18px] | 1.5px |
> | large | 40×24 | 21×21 | 1.5px | 12px | translate-x-[18px] | 1.5px |
>
> 颜色（Light 主题）：
>
> | 状态 | 轨道 bg | 圆钮 bg |
> | --- | --- | --- |
> | unchecked | #ebebeb (gray-200) | #ffffff |
> | checked (blue) | #0070f3 (blue-600) | #ffffff |
> | checked (amber) | #ffb224 (amber-600) | #ffffff |
> | checked (red) | #f87275 (red-400) | #ffffff |
> | disabled unchecked | #ebebeb | #fafafa |
> | disabled checked | #c9c9c9 (gray-300) | #f2f2f2 |
>
> 颜色（Dark 主题）：
>
> | 状态 | 轨道 bg | 圆钮 bg |
> | --- | --- | --- |
> | unchecked | #2e2e2e (gray-600) | hsla(0,0%,93%,0.84) |
> | checked (blue) | #0070f3 | hsla(0,0%,93%,0.84) |
> | checked (amber) | #ffb224 | hsla(0,0%,93%,0.84) |
> | checked (red) | #e5484d (red-600) | hsla(0,0%,93%,0.84) |
> | disabled unchecked | #1f1f1f | #454545 |
> | disabled checked | #2e2e2e | #878787 |
>
> **容器 + sr-only（原有快照数据）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 500 12px/18px · fg:#666666
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 500 12px/18px · fg:#666666
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 500 12px/18px · fg:#666666
> - **Custom Color**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 500 12px/18px · fg:#666666
> - **With Label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 500 12px/18px · fg:#666666
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 500 12px/18px · fg:#888888
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 500 12px/18px · fg:#888888
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 500 12px/18px · fg:#888888
> - **Custom Color**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 500 12px/18px · fg:#888888
> - **With Label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 500 12px/18px · fg:#888888

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Toggle } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex relative min-w-px max-w-full flex-col flex-1">
      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked}
          onChange={(): void => setChecked(!checked)}
        />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked2}
          onChange={(): void => setChecked2(!checked2)}
        />
      </div>
    </div>
  );
}
```

## Disabled

```tsx
import { Toggle } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-col flex-1">
      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle aria-label="Enable Firewall" checked={false} disabled />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle aria-label="Enable Firewall" checked disabled />
      </div>
    </div>
  );
}
```

## Sizes

```tsx
import { Toggle } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex relative min-w-px max-w-full flex-row flex-wrap flex-1">
      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle aria-label="Enable Firewall" checked={false} />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle aria-label="Enable Firewall" checked={false} size="medium" />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle aria-label="Enable Firewall" checked={false} size="large" />
      </div>
    </div>
  );
}
```

## Custom Color

```tsx
import { Toggle } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import { IconLockClosedSmall, IconLockOpenSmall } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex relative min-w-px max-w-full flex-col flex-1">
      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked}
          color="amber"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
        />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked}
          color="red"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
        />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked}
          color="amber"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
          size="large"
        />
      </div>

      <div className="flex relative min-w-px max-w-full flex-col flex-1">
        <Toggle
          aria-label="Enable Firewall"
          checked={checked}
          color="red"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
          size="large"
        />
      </div>
    </div>
  );
}
```

## With Label

```tsx
import { Toggle } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import { IconLockClosedSmall, IconLockOpenSmall } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Toggle checked={checked} onChange={(): void => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="switch-first"
          onChange={(): void => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Toggle checked={checked} onChange={(): void => setChecked(!checked)} size="large">
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="switch-first"
          onChange={(): void => setChecked(!checked)}
          size="large"
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Toggle
          checked={checked}
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="switch-first"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4 flex-initial">
        <Toggle
          checked={checked}
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
          size="large"
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="switch-first"
          icon={{
            checked: <IconLockClosedSmall />,
            unchecked: <IconLockOpenSmall />,
          }}
          onChange={(): void => setChecked(!checked)}
          size="large"
        >
          Enable Firewall
        </Toggle>
      </div>
    </div>
  );
}
```

## Best Practices

- Use Toggle for a single boolean setting where ON takes effect immediately, like Password Protection or Auto-Cancel Builds. Switch to Checkbox for a multi-select list, or to Switch for 2–3 mutually exclusive views.

- checked is required and the component is controlled. Own the state and update it from onChange.

- Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don’t leave the user wondering whether the flip stuck. Pair with a form footer only when the setting needs an explicit Save step.

- Disable Toggle only when the action is impossible (missing plan, locked policy); pair with helper text or a Tooltip that names the resolver.

- The label is children, not a label prop. Title Case noun phrase, 1–4 words, naming what is true when ON: Password Protection, not Enable Password Protection.

- Render an optional one-sentence description as a sibling under the label that explains ON only. Don’t describe OFF; it’s the negation.

- Keep labelCasing="title" (the default) so labels match other Title Case surfaces. Use labelCasing="normal" only when sentence-case content sits inline next to the toggle.

- Provide an accessible name through children, aria-label, or aria-labelledby. Geist warns in development if all three are missing.

- Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry it so sighted and screen-reader copy stay aligned.

Was this helpful?
