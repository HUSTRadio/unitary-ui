# Combobox

Filters large lists to selectable options based on the matching query.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Uncontrolled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Controlled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:36px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2 · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Errored**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#da2f35 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#da2f35 · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Custom width input**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Custom width list**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Lorem ipsum dolor sit amet, consectetur " · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "Lorem ipsum dolor sit amet, consectetur " · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Custom empty message**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
> - **Clearable**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "onetwothree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:36px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "one" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **With prefix icons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **With suffix icons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **With label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "United StatesCanadaUnited KingdomGermany" · .relative · h:36px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "United States" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "OneTwoThree" · .relative · h:40px · 400 16px/24px · fg:#171717 · r:6px
>   .w-full · h:32px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#171717 · bg:#ffffff · r:6px
>   .outline-hidden · h:32px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#171717 · r:6px
> - **Used inside a Modal**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Open Modal" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Inside a Sheet with multi-line options**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Link Shared Variable" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Uncontrolled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Controlled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:36px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Errored**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#d93036 · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#d93036 · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Custom width input**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Custom width list**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Lorem ipsum dolor sit amet, consectetur " · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "Lorem ipsum dolor sit amet, consectetur " · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Custom empty message**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
> - **Clearable**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "onetwothree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:36px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "one" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **With prefix icons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **With suffix icons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **With label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "United StatesCanadaUnited KingdomGermany" · .relative · h:36px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:36px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:100% · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "United States" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "OneTwoThree" · .relative · h:40px · 400 16px/24px · fg:#ededed · r:6px
>   .w-full · h:32px · pad:0px 36px 0px 40px · 400 14px/20px · fg:#ededed · bg:#0a0a0a · r:6px
>   .outline-hidden · h:32px · pad:0px 12px · 400 16px/24px · fg:#8f8f8f · r:0px 5px 5px 0px
>   "One" · .flex · h:36px · pad:0px 8px · 400 14px/20px · fg:#ededed · r:6px
> - **Used inside a Modal**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Open Modal" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Inside a Sheet with multi-line options**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Link Shared Variable" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Uncontrolled

- One

- Two

- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Controlled

- One

- Two

- Three

```tsx
import { useState, type JSX } from "react";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";

export function Component(): JSX.Element {
  const [value, setValue] = useState<string | null>("b");

  return (
    <Combobox aria-label="Search" onChange={setValue} placeholder="Search..." value={value}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Disabled

- One

- Two

- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" disabled placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Errored

- One

- Two

- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" errored placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Custom width input

- One

- Two

- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Custom width list

- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList maxWidth={500}>
        <ComboboxOption value="a">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.{" "}
        </ComboboxOption>
        <ComboboxOption value="b">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </ComboboxOption>
        <ComboboxOption value="c">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## Custom empty message

```tsx
import { Combobox, ComboboxInput, ComboboxList } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList emptyMessage="Nothing to see here..." />
    </Combobox>
  );
}
```

## Clearable

Set clearable to show a clear button when a value is selected.

- one

- two

- three

```tsx
import { useState, type JSX } from "react";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";

export function Component(): JSX.Element {
  const [value, setValue] = useState<string | null>("two");

  return (
    <Combobox
      aria-label="Search"
      clearable
      onChange={setValue}
      placeholder="Search..."
      value={value}
    >
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="one">one</ComboboxOption>
        <ComboboxOption value="two">two</ComboboxOption>
        <ComboboxOption value="three">three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## With prefix icons

- One

- Two

- Three

```tsx
import type { JSX } from "react";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import { LogoIconVercelSvg } from "@vercel/geistcn-assets/logos";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search..." className="w-fit">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" prefix={<LogoIconVercelSvg />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" prefix={<LogoIconVercelSvg />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" prefix={<LogoIconVercelSvg />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## With suffix icons

- One

- Two

- Three

```tsx
import type { JSX } from "react";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import { LogoIconVercelSvg } from "@vercel/geistcn-assets/logos";

export function Component(): JSX.Element {
  return (
    <Combobox aria-label="Search" placeholder="Search..." className="w-fit">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" suffix={<LogoIconVercelSvg />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" suffix={<LogoIconVercelSvg />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" suffix={<LogoIconVercelSvg />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## With label

- United States

- Canada

- United Kingdom

- Germany

- France

- Japan

- Australia

- Brazil

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import { useId, type JSX } from "react";

export function Component(): JSX.Element {
  const id = useId();

  return (
    <div className="space-y-2">
      <label className="text-label-14 text-gray-900" htmlFor={id}>
        Select your country
      </label>
      <Combobox aria-label="Select your country" id={id} placeholder="Search countries…">
        <ComboboxInput />
        <ComboboxList>
          <ComboboxOption value="us">United States</ComboboxOption>
          <ComboboxOption value="ca">Canada</ComboboxOption>
          <ComboboxOption value="uk">United Kingdom</ComboboxOption>
          <ComboboxOption value="de">Germany</ComboboxOption>
          <ComboboxOption value="fr">France</ComboboxOption>
          <ComboboxOption value="jp">Japan</ComboboxOption>
          <ComboboxOption value="au">Australia</ComboboxOption>
          <ComboboxOption value="br">Brazil</ComboboxOption>
        </ComboboxList>
      </Combobox>
    </div>
  );
}
```

## Sizes

- One

- Two

- Three

- One

- Two

- Three

- One

- Two

- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  const options = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
      <Combobox aria-label="Search" placeholder="Search..." size="small">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search...">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search..." size="large">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  );
}
```

## Used inside a Modal

It is common to use Combobox inside a Modal. On mobile, the Modal automatically renders a Dialog instead.

```tsx
import {
  Combobox,
  Modal,
  Button,
  Label,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  ModalInset,
  ModalActions,
  ModalAction,
} from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
      <Button onClick={() => setOpen(true)} size="small">
        Open Modal
      </Button>

      <Modal active={open} onClickOutside={() => setOpen(false)}>
        <ModalBody>
          <ModalHeader>
            <ModalTitle>Create Token</ModalTitle>
            <ModalSubtitle>
              Enter a unique name for your token to differentiate it from other tokens and then
              select the scope.
            </ModalSubtitle>
          </ModalHeader>

          <ModalInset last>
            <div className="flex flex-col items-stretch justify-start gap-2.5 flex-initial">
              <Label value="Region">
                <Combobox aria-label="Region" placeholder="Search..." size="small">
                  <ComboboxInput />
                  <ComboboxList>
                    {options.map((option) => (
                      <ComboboxOption key={option.value} value={option.value}>
                        {option.label}
                      </ComboboxOption>
                    ))}
                  </ComboboxList>
                </Combobox>
              </Label>
              <p className="text-copy-13 text-gray-900">
                This is the region where your database reads and writes will take place.
              </p>
            </div>
          </ModalInset>
        </ModalBody>

        <ModalActions>
          <ModalAction onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </ModalAction>

          <ModalAction onClick={() => setOpen(false)}>Submit</ModalAction>
        </ModalActions>
      </Modal>
    </div>
  );
}
```

## Inside a Sheet with multi-line options

Options can opt out of the fixed row height with ignoreDefaultHeight to render multi-line content (e.g. a shared environment variable name plus its target). The list sizes each row to its content and stays scrollable.

```tsx
import { useMemo, useState, type JSX } from "react";
import {
  Button,
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@vercel/geistcn/components";
import { IconCross } from "@vercel/geistcn-assets/icons";

interface SharedVar {
  key: string;
  target: string;
}

// Mirrors the "Link Shared Variable" list from vercel-site: two-line options
// (env var name + target) that opt out of the fixed row height. Enough rows to
// force the list to scroll.
const SHARED_VARS: SharedVar[] = [
  {
    key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID",
    target: "Preview and Production",
  },
  { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
  { key: "SCREENSHOT_SECRET_DEPLOYMENT_SUMMARY", target: "failover" },
  { key: "FLAGS_VERCEL_MARKETING", target: "Preview and Production" },
  { key: "FLAGS_VERCEL_MARKETING", target: "Development" },
  { key: "FLAGS_VERCEL_MARKETING", target: "Preview" },
  { key: "DATABASE_URL", target: "Production" },
  { key: "REDIS_URL", target: "Preview and Production" },
  { key: "STRIPE_SECRET_KEY", target: "Production" },
  { key: "STRIPE_WEBHOOK_SECRET", target: "Development" },
  { key: "OPENAI_API_KEY", target: "Preview and Production" },
  { key: "SENTRY_AUTH_TOKEN", target: "Preview" },
  { key: "NEXT_PUBLIC_ANALYTICS_ID", target: "Development" },
  { key: "AWS_ACCESS_KEY_ID", target: "Production" },
  { key: "AWS_SECRET_ACCESS_KEY", target: "Production" },
  { key: "GITHUB_APP_PRIVATE_KEY", target: "Preview and Production" },
];

export function Component(): JSX.Element {
  const [search, setSearch] = useState("");
  const [linked, setLinked] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return SHARED_VARS.filter((v) => !linked.includes(`${v.key}::${v.target}`));
  }, [linked]);

  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button size="small">Link Shared Variable</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-clip rounded-2xl bg-background-100 p-0 lg:w-5/6 sm:max-w-[auto]"
      >
        <div className="flex flex-shrink-0 items-center justify-between pt-3 pl-4 pr-3">
          <SheetTitle className="text-heading-20">Link Shared Variable</SheetTitle>
          <SheetClose asChild>
            <Button aria-label="Close" shape="square" svgOnly variant="tertiary">
              <IconCross />
            </Button>
          </SheetClose>
        </div>
        <p className="px-4 pb-2 text-copy-14 text-gray-900">
          Changes to shared variables sync automatically across all linked projects.
        </p>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
          <Combobox
            aria-label="Search for shared environment variables"
            onChange={(v: string | null): void => {
              if (v) {
                setLinked((prev) => [...prev, v]);
              }
            }}
            placeholder="Search for shared environment variables…"
            value={search}
          >
            <ComboboxInput
              onChange={(e): void => {
                setSearch(e.target.value);
              }}
            />
            <ComboboxList>
              {filtered.map((v) => (
                <ComboboxOption
                  ignoreDefaultHeight
                  key={`${v.key}::${v.target}`}
                  value={`${v.key}::${v.target}`}
                >
                  <div className="flex flex-col items-stretch justify-start py-[15px] px-2">
                    <p className="font-mono text-sm font-medium">{v.key}</p>
                    <p className="mt-[3px] text-xs text-gray-900">{v.target}</p>
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxList>
          </Combobox>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

## Best Practices

### When to use

- Pick <Combobox> when users type to filter a known list of values (regions, frameworks, env-var names).

- For short, fixed lists where typing adds nothing, switch to Select.

- When more than one value can be chosen at once, use MultiSelect.

- For free-form filter strings that don’t resolve to a single option, drop in Input with the search variant.

### Behavior

- Show a loading state for async results; don’t collapse the list while the request is in flight.

- Render a custom empty state of the form No {items} match "{query}" rather than a bare No results.

- Inside a Modal, Geist switches to a Dialog on mobile automatically; don’t layer a second portal.

- Keep arrow-key navigation through <Combobox.Option> items; don’t hijack Enter to submit the surrounding form while the list is open.

### Content

- Visible label is a short Title Case noun (Region, Environment Variable Name).

- Placeholder is the inline hint: Search regions, DATABASE_URL. Never bare Search… and never the label restated.

- Option text is Title Case for short values and matches canonical branding (Next.js, not NextJS); same register across the list.

- Validation names the field and constraint, sentence case with a period (Select a region.).

### Accessibility

- <Combobox> has no label prop; pair a sibling <Label htmlFor> with the root id, or set aria-label on the root for icon-only triggers.

- The root accepts aria-label only; there is no aria-labelledby prop, so the sibling-label path is the way to reference visible text.

- Trap focus inside the popover when nested in a Modal so Tab cycles options instead of the page behind it.

Was this helpful?
