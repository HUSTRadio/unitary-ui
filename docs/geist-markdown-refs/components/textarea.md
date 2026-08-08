# Textarea

Retrieve multi-line user input.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2
> - **Error**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Read Only**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Rows**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .py-2.5 · h:120px · pad:10px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a
> - **Error**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Read Only**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Lorem ipsum dolor sit amet, consectetur " · .py-2.5 · h:100px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Rows**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .py-2.5 · h:120px · pad:10px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Textarea
      aria-label="Default"
      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      style={{ minHeight: 100 }}
    />
  );
}
```

## Disabled

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Textarea
      aria-label="Disabled"
      disabled
      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      style={{ minHeight: 100 }}
    />
  );
}
```

## Error

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-8 flex-initial">
      <Textarea
        aria-label="With error (small)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="small"
        style={{ minHeight: 100 }}
      />
      <Textarea
        aria-label="With error (medium)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="medium"
        style={{ minHeight: 100 }}
      />
      <Textarea
        aria-label="With error (large)"
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        error="There has been an error."
        size="large"
        style={{ minHeight: 100 }}
      />
    </div>
  );
}
```

## Sizes

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="small"
        style={{ minHeight: 100 }}
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="medium"
        style={{ minHeight: 100 }}
      />
      <Textarea
        aria-label="Textarea"
        defaultValue={loremIpsum}
        size="large"
        style={{ minHeight: 100 }}
      />
    </div>
  );
}
```

## Read Only

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export function Component(): JSX.Element {
  return (
    <Textarea
      aria-label="Read only"
      defaultValue={loremIpsum}
      readOnly
      style={{ minHeight: 100 }}
    />
  );
}
```

## Rows

```tsx
import { Textarea } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Textarea
      aria-label="Textarea with fixed rows"
      placeholder="Textarea with fixed number of rows"
      rows={5}
    />
  );
}
```

## Best Practices

- Pick <Textarea> for content that wraps to multiple lines (commit messages, descriptions, notes); use Input for a single value like a name or domain.

- Set a generous default rows and grow only when the surface has vertical room; don’t let the field push primary actions below the fold.

- Validate on blur and pass a string to error to render the inline message; the validation replaces helper text on failure.

- Trim leading and trailing whitespace on submit so empty newlines don’t pass a required check.

- Labels are short Title Case nouns (Description, Release Notes); placeholders show an example value, not instructions like Enter a description.

- Validation names the field and constraint, ends in a period, and skips please (Description is required., Release notes can’t exceed 500 characters.).

- Render helper text as a sibling <p> linked through aria-describedby; sentence case, one sentence, with a period.

Was this helpful?
