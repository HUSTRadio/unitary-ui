# Radio

Provides single user input from a selection of options.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
> - **Radio disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#c9c9c9
> - **Radio required**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
>   "Submit" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#ffffff · bg:#171717 · r:6px
> - **Radio headless**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
> - **Radio standalone**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 16px/24px · fg:#171717
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed
> - **Radio disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#454545
> - **Radio required**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed
>   "Submit" · .outline-none · h:32px · pad:0px 6px · 500 14px/21px · fg:#0a0a0a · bg:#ededed · r:6px
> - **Radio headless**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed
> - **Radio standalone**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 16px/24px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { RadioGroup, RadioGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup label="Default Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## Radio disabled

```tsx
import { RadioGroup, RadioGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup disabled label="Disabled Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## Radio required

```tsx
import { Button, RadioGroup, RadioGroupItem } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("");

  return (
    <form className="flex flex-col items-start justify-start gap-6 flex-initial">
      <RadioGroup label="Required Radio Example" onChange={setValue} required value={value}>
        <div className="flex flex-col items-stretch justify-start gap-4 flex-initial">
          <RadioGroupItem value="one">Option 1</RadioGroupItem>

          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </div>
      </RadioGroup>
      <Button size="small">Submit</Button>
    </form>
  );
}
```

## Radio headless

Use the RadioGroup component without RadioGroup.Item.

```tsx
import { RadioGroup, useRadio } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("one");
  const { component } = useRadio({ value: "one", disabled: false });
  const { component: component2 } = useRadio({ value: "two", disabled: false });

  return (
    <RadioGroup aria-label="Options" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Option 1</span>
          {component}
        </label>

        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Option 2</span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}
```

## Radio standalone

Standalone unlabelled radio input for use in custom UI.

```tsx
import { Radio } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [value, setValue] = useState("one");

  return (
    <li className="flex flex-row items-stretch justify-start gap-2 flex-initial list-none">
      <span>Option 1</span>
      <Radio
        aria-label="Option 1"
        checked={value === "one"}
        onChange={() => setValue("one")}
        value="one"
      />
    </li>
  );
}
```

## Best Practices

### When to use

- A single choice from 2–6 mutually exclusive options where seeing every option matters (deploy regions, plan tiers, billing cycle).

- Past 6 options, switch to Select or Combobox so the list doesn’t dominate the form.

- For binary on/off, use Toggle. For richer per-option content (icon, description, badge), use Choicebox.

### Behavior

- Pre-select the safest default so the field reads as configured, never as required-but-empty. Skip the default only when the choice has real consequences and you want a deliberate pick.

- Required state goes on the RadioGroup, not on individual options. Required-against-a-single-radio is meaningless.

- Arrow keys move selection within the group and skip disabled options. Tab moves to the next field, not the next radio.

### Content

- Group label is a Title Case noun like Deployment Region or Billing Cycle. Render it via <legend> or a sibling label tied with aria-labelledby.

- Option labels are parallel: same part of speech, same length range, same register. Monthly / Yearly, not Monthly / Pay yearly.

- Disabled options need a Tooltip naming why (Available on Pro and Enterprise). A greyed-out radio with no reason reads as broken.

### Accessibility

- Wrap related radios in <fieldset> + <legend> so screen readers announce the group name before each option.

- The standalone unlabeled radio (custom UI) needs an aria-label describing the choice. Never ship a radio with no accessible name.

- Don’t replace the native focus ring with a CSS hack that drops outline-offset; keyboard users lose track of which option is focused.

Was this helpful?
