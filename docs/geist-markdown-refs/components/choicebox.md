# Choicebox

A larger form of Radio or Checkbox, where the user has a larger tap target and more details.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Single-select**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 16px/24px · fg:#171717
> - **Multi-select**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 16px/24px · fg:#c9c9c9
> - **Custom content**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 16px/24px · fg:#171717
>
> **Dark 主题**
>
> - **Single-select**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 16px/24px · fg:#ededed
> - **Multi-select**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 16px/24px · fg:#454545
> - **Custom content**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 16px/24px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Single-select

```tsx
"use client";

import { ChoiceboxGroup, ChoiceboxGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      onChange={setValue}
      type="radio"
      value={value}
      listClassName="flex-row"
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
```

## Multi-select

```tsx
"use client";

import { ChoiceboxGroup, ChoiceboxGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState([] as string[]);

  return (
    <ChoiceboxGroup
      label="select a plan"
      onChange={setValue}
      type="checkbox"
      value={value}
      listClassName="flex-row"
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
```

## Disabled

```tsx
"use client";

import { ChoiceboxGroup, ChoiceboxGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState([] as string[]);

  return (
    <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
      <ChoiceboxGroup
        disabled
        label="Choicebox group disabled"
        onChange={setValue}
        showLabel
        type="radio"
        value={value}
        listClassName="flex-row"
      >
        <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>

      <ChoiceboxGroup
        label="Single input disabled"
        onChange={setValue2}
        showLabel
        type="checkbox"
        value={value2}
        listClassName="flex-row"
      >
        <ChoiceboxGroupItem
          description="Free for two weeks"
          disabled
          title="Pro Trial"
          value="trial"
        />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>
    </div>
  );
}
```

## Custom content

Custom content is displayed when selecting the option.

```tsx
"use client";

import { Badge, ChoiceboxGroup, ChoiceboxGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      onChange={setValue}
      type="radio"
      value={value}
      listClassName="flex-row"
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial">
        <div className="flex justify-center p-2">
          <Badge variant="trial">Trial</Badge>
        </div>
      </ChoiceboxGroupItem>
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro">
        <div className="flex justify-center p-2">
          <Badge variant="blue">Pro</Badge>
        </div>
      </ChoiceboxGroupItem>
    </ChoiceboxGroup>
  );
}
```

## Best Practices

### When to use

- A choice that benefits from a larger tap target plus a description or icon, like a framework picker, plan comparison, or deployment region with latency.

- Single-select for mutually exclusive choices, multi-select for additive ones. Don’t mix the two within one group.

- Cap at 4–6 tiles. Past that, switch to Select or Combobox so the page doesn’t scroll for a single field. For plain text labels with no description, use Radio.

### Behavior

- The whole tile is the click and focus target; tapping anywhere inside selects it. Don’t place nested buttons or links inside a tile that would steal the click.

- Selected state shows a check or filled dot in the corner. The border highlight alone isn’t enough on low-contrast screens.

- Disabled tiles need a Tooltip naming why (Available on Pro). A faded tile with no reason reads as broken.

### Content

- Titles are parallel: one Title Case title plus one sentence-case description per tile, ending in a period.

- Don’t restate the title in the description. The description adds the differentiator ($20/mo · 100 GB bandwidth), not a synonym.

- Icons are decorative when paired with a title; if the icon is the only label, give the tile an aria-label naming the choice.

### Accessibility

- Tiles render as radios or checkboxes under the hood, so keep them inside a <fieldset> with a <legend> so screen readers announce the group.

- Arrow keys move within a single-select group, Space toggles in multi-select. Don’t override those keys with custom handlers.

- Color is not the selection signal. Pair the highlight border with the corner check so colorblind users still see what’s active.

Was this helpful?
