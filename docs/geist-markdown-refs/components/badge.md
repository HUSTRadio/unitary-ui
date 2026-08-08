# Badge

A label that emphasizes an element that requires attention, or helps categorize with other similar elements.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Variants**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With icons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Pill**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Label" · .inline-flex · h:20px · pad:2px 8px · 500 11px/20px · fg:#000000 · bg:#ffffff · r:3.35544e+07px
>   "Label" · .tracking-normal · h:24px · pad:2px 12px · 500 12px/24px · fg:#000000 · bg:#ffffff · r:3.35544e+07px
>
> **Dark 主题**
>
> - **Variants**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With icons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Pill**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Label" · .inline-flex · h:20px · pad:2px 8px · 500 11px/20px · fg:#ffffff · bg:#000000 · r:3.35544e+07px
>   "Label" · .tracking-normal · h:24px · pad:2px 12px · 500 12px/24px · fg:#ffffff · bg:#000000 · r:3.35544e+07px

<!-- GEIST-RENDER-METRICS-END -->

## Variants

```tsx
import { Badge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Badge variant="gray">gray</Badge>
        <Badge variant="gray" contrast="low">
          gray-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="blue">blue</Badge>
        <Badge variant="blue" contrast="low">
          blue-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="purple">purple</Badge>
        <Badge variant="purple" contrast="low">
          purple-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="amber">amber</Badge>
        <Badge variant="amber" contrast="low">
          amber-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="red">red</Badge>
        <Badge variant="red" contrast="low">
          red-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="pink">pink</Badge>
        <Badge variant="pink" contrast="low">
          pink-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="green">green</Badge>
        <Badge variant="green" contrast="low">
          green-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="teal">teal</Badge>
        <Badge variant="teal" contrast="low">
          teal-subtle
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="inverted">inverted</Badge>
        <Badge variant="trial">Trial</Badge>
        <Badge variant="turbo">Turborepo</Badge>
      </div>
    </div>
  );
}
```

## Sizes

```tsx
import { Badge } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
```

## With icons

```tsx
import { Badge } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconShield } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="gray">
          gray
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="gray">
          gray
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="gray">
          gray
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="gray" contrast="low">
          gray
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="gray" contrast="low">
          gray
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="gray" contrast="low">
          gray
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="blue">
          blue
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="blue">
          blue
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="blue">
          blue
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="blue" contrast="low">
          blue
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="blue" contrast="low">
          blue
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="blue" contrast="low">
          blue
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="purple">
          purple
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="purple">
          purple
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="purple">
          purple
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="purple" contrast="low">
          purple
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="purple" contrast="low">
          purple
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="purple" contrast="low">
          purple
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="amber">
          amber
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="amber">
          amber
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="amber">
          amber
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="amber" contrast="low">
          amber
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="amber" contrast="low">
          amber
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="amber" contrast="low">
          amber
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="red">
          red
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="red">
          red
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="red">
          red
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="red" contrast="low">
          red
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="red" contrast="low">
          red
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="red" contrast="low">
          red
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="pink">
          pink
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="pink">
          pink
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="pink">
          pink
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="pink" contrast="low">
          pink
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="pink" contrast="low">
          pink
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="pink" contrast="low">
          pink
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="green">
          green
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="green">
          green
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="green">
          green
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="green" contrast="low">
          green
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="green" contrast="low">
          green
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="green" contrast="low">
          green
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="teal">
          teal
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="teal">
          teal
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="teal">
          teal
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="teal" contrast="low">
          teal
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="teal" contrast="low">
          teal
        </Badge>
        <Badge icon={<IconShield />} size="lg" variant="teal" contrast="low">
          teal
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Badge icon={<IconShield />} size="lg" variant="inverted">
          inverted
        </Badge>
        <Badge icon={<IconShield />} size="md" variant="inverted">
          inverted
        </Badge>
        <Badge icon={<IconShield />} size="sm" variant="inverted">
          inverted
        </Badge>
      </div>
    </div>
  );
}
```

## Pill

A special link, not quite as prominent as a button, based on <Badge /> styling.

```tsx
import { badgeVariants } from "@vercel/geistcn/components";
import { LogoIconSlack } from "@vercel/geistcn-assets/logos";
import { cn } from "@vercel/geistcn/utils";
import { Link } from "@vercel/microfrontends/next/client";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "sm" }))}>
          Label
        </Link>
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "md" }))}>
          Label
        </Link>
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "lg" }))}>
          Label
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "sm" }))}>
          <LogoIconSlack colored data-slot="icon" />
          Label
        </Link>
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "md" }))}>
          <LogoIconSlack colored data-slot="icon" />
          Label
        </Link>
        <Link href="#badge#pill" className={cn(badgeVariants({ variant: "pill", size: "lg" }))}>
          <LogoIconSlack colored data-slot="icon" />
          Label
        </Link>
      </div>
    </div>
  );
}
```

## Best Practices

- Use Badge for short, scannable metadata that sits next to the thing it describes: status, plan tier, environment, or role. One badge per row; two side by side is a sign the row needs a second column.

- For a colored dot without text, use Status Dot. For clickable filter chips that toggle a query, use the pill variant or a small Button.

- Badges are static labels. Don’t wire onClick onto them; promote to a Button or link if the user can act on the value.

- Keep badge content to text or icon + text. Never stack two icons or a child Badge inside a Badge.

- Pair lifecycle badges (Alpha, Beta, Early Access) with a Tooltip that names the limit, like Alpha: API may change before GA.

- Title Case, one word when possible, two max: Active, Pending, Pro, Enterprise Trial. Match the canonical API or log term: Production not Prod, Deployed not Live, Canceled not Cancelled (the Vercel API uses one L).

- Don’t add a checkmark icon for success states or an X for errors; the variant carries that signal. Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production, gray for neutral. The -subtle suffix tones any of them down on dense surfaces.

- Skip stuffing sentences inside (Currently Active, You are on Pro); the surrounding row supplies the context.

- Set title for icon-only or ambiguous badges so screen readers announce the meaning. Don’t rely on color alone; the text has to be readable without it.

Was this helpful?
