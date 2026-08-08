# Checkbox

A control that toggles between two options, checked or unchecked.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#c9c9c9
> - **Indeterminate**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .sr-only · h:1px · 400 13px/19.5px · fg:#171717
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#454545
> - **Indeterminate**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .sr-only · h:1px · 400 13px/19.5px · fg:#ededed

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Checkbox } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox checked={checked} onChange={(): void => setChecked((b) => !b)}>
      Option 1
    </Checkbox>
  );
}
```

## Disabled

```tsx
import { Checkbox } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-start gap-4 flex-initial">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox checked disabled>
        Disabled Checked
      </Checkbox>
      <Checkbox disabled indeterminate>
        Disabled Indeterminate
      </Checkbox>
    </div>
  );
}
```

## Indeterminate

```tsx
import { Checkbox } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Checkbox indeterminate>Option 1</Checkbox>;
}
```

## Best Practices

### When to use

- Multi-select inside a list, like table-row pickers, multi-pick filters, and opt-in preference groups.

- Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).

- For a single boolean setting like dark mode or password protection, use Toggle. The on/off mechanic is clearer there than a lone checkbox.

### Behavior

- Indeterminate is a visual state, not a third value. Drive it from a parent that knows partial selection, and clear it as soon as every child is fully checked or unchecked.

- Validation on a required acknowledgment fires on submit, not on blur, so checking and unchecking shouldn’t flash an error.

- Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.

### Content

- Group label above a <fieldset> is a Title Case noun like Notifications or Required Permissions. No trailing colon.

- Acknowledgment label is a full sentence ending in a period: I agree to the Terms of Service.

- Indeterminate copy names the partial count next to the group label (3 of 5 selected). Never leave the dash state unlabeled.

### Accessibility

- Wrap related checkboxes in <fieldset> with a <legend> so screen readers announce the group name before each option.

- Row-select checkbox in a table has no visible label. Set aria-label="Select {row name}" so the row stays identifiable out of context.

- The click target already extends to the label. Don’t override the <label>/htmlFor association with a custom wrapper that breaks the click region.

Was this helpful?
