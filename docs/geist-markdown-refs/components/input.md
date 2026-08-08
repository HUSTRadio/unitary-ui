# Input

Retrieve text input from a user.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Prefix and suffix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#f2f2f2
> - **Search**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **⌘K**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **Error**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Label**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#000000 · bg:#ffffff
> - **Rounded prefix and suffix**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
> - **Rounded prefix and suffix without styling**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#171717 · bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Prefix and suffix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#8f8f8f · bg:#1a1a1a
> - **Search**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **⌘K**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **Error**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:32px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Label**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ffffff · bg:#0a0a0a
> - **Rounded prefix and suffix**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a
> - **Rounded prefix and suffix without styling**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .inline-flex · h:36px · pad:0px 12px · 400 14px/20px · fg:#ededed · bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-4 flex-initial">
      <Input aria-labelledby="Demo input" placeholder="Small" size="small" />
      <Input aria-labelledby="Demo input" placeholder="Default" />
      <Input aria-labelledby="Demo input" placeholder="Large" size="large" />
    </div>
  );
}
```

## Prefix and suffix

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconArrowCircleUp } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-initial">
      <Input aria-labelledby="Demo" placeholder="Default" prefix={<IconArrowCircleUp />} />

      <Input aria-labelledby="Demo" placeholder="Default" suffix={<IconArrowCircleUp />} />

      <Input aria-labelledby="Demo" placeholder="Default" prefix="https://" suffix=".com" />

      <Input
        aria-labelledby="Demo"
        placeholder="Default"
        prefix={<IconArrowCircleUp />}
        prefixStyling={false}
        suffix={<IconArrowCircleUp />}
        suffixStyling={false}
      />

      <Input
        aria-labelledby="Demo"
        placeholder="Default"
        prefix="vercel/"
        suffix={<IconArrowCircleUp />}
        suffixContainer={false}
        suffixStyling={false}
      />
    </div>
  );
}
```

## Disabled

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { IconArrowCircleUp } from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Input aria-labelledby="Demo" disabled placeholder="Disabled with placeholder" />

      <Input aria-labelledby="Demo" disabled value="Disabled with value" />

      <Input
        aria-labelledby="Demo"
        disabled
        placeholder="Disabled with prefix"
        prefix={<IconArrowCircleUp />}
      />

      <Input
        aria-labelledby="Demo"
        disabled
        placeholder="Disabled with suffix"
        suffix={<IconArrowCircleUp />}
      />

      <Input
        aria-labelledby="Demo"
        disabled
        placeholder="Disabled with prefix and suffix"
        prefix="https://"
        suffix=".com"
      />

      <Input
        aria-labelledby="Demo"
        disabled
        placeholder="Disabled with prefix and suffix"
        prefix={<IconArrowCircleUp />}
        prefixStyling={false}
        suffix={<IconArrowCircleUp />}
        suffixStyling={false}
      />
    </div>
  );
}
```

## Search

Automatically clears the input if escape is pressed.

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## ⌘K

Displays the ⌘ K shortcut to indicate that the input supports a command palette.

Transitions to showing Esc when the field is dirty.

```tsx
import { SearchInput } from "@vercel/geistcn/components";
import type { JSX } from "react";
import { useState } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");
  return (
    <SearchInput
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Error

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start gap-8 flex-initial">
      <div>
        <Input
          aria-labelledby="Demo input"
          error="An error message."
          placeholder="long-error@gmail.com"
          size="small"
        />
      </div>
      <div>
        <Input
          aria-labelledby="Demo input"
          error="An error message."
          placeholder="long-error@gmail.com"
          size="medium"
        />
      </div>
      <div>
        <Input
          aria-labelledby="Demo input"
          error="An error message."
          placeholder="long-error@gmail.com"
          size="large"
        />
      </div>
    </div>
  );
}
```

## Label

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-start justify-start flex-initial">
      <Input aria-labelledby="Demo input" label="Label" placeholder="Label" />
    </div>
  );
}
```

## Rounded prefix and suffix

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Input aria-labelledby="Demo" placeholder="Label example" prefix="www." rounded suffix=".com" />
  );
}
```

## Rounded prefix and suffix without styling

```tsx
import { Input } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Input
      aria-labelledby="Demo"
      placeholder="Label example"
      prefix="www."
      prefixStyling={false}
      rounded
      suffix=".com"
      suffixStyling={false}
    />
  );
}
```

## Best Practices

### When to use

- Pick <Input> for a single line of free-form text such as names, domains, or tokens.

- Switch to Textarea the moment content can wrap to multiple lines.

- Use Combobox when the value comes from a known list the user filters by typing.

- For an inline search box, set the search variant with a scoped placeholder like Search projects; don’t embed a <SearchInput> inside an unrelated form.

### Behavior

- Validate on blur, not on every keystroke; surface the message by passing a string to error.

- Trim leading and trailing whitespace before submit so example.com and example.com resolve to one value.

- Keep the field focusable while saving; pair disabled with a spinner only when input is impossible.

- Don’t wrap a labelled <Input> in a Tooltip; put the explainer on a sibling icon button so the label stays announced.

### Content

- Labels are short Title Case nouns: Project Name, Domain, Environment Variable Name.

- Placeholders show an example value (my-awesome-project, example.com), never instructions like Enter your project name.

- Helper text is sentence case, one sentence with a trailing period, on a sibling element wired through aria-describedby.

- Validation names the field and the constraint, ends in a period, and skips please (Project name is required., Code must be 6 digits.).

### Accessibility

- Passing a string to label requires id; the InputPropsWithStringLabelAndId union won’t compile without it and screen readers lose the association.

- For icon-only affordances inside a row of inputs, use <Button shape="circle" svgOnly aria-label="…"> rather than an unlabeled icon.

- A SearchInput placeholder names the scope (Search projects) so the role is clear without sighted context.

Was this helpful?
