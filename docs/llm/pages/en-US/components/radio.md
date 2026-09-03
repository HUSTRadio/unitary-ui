# Radio

> Route: `/components/radio`

Provides single user input from a selection of options.

[Back to Components](#/components)

# Radio

Radio

Provides single user input from a selection of options.

## When to use

- Use Radio for a single choice from 2–6 mutually exclusive options where seeing every option matters, such as deploy regions, plan tiers, or billing cycle.
- Wrap related radios in <fieldset> + <legend> so screen readers announce the group name before each option.
- Pre-select the safest default so the field reads as configured, never as required-but-empty.

## When not to use

- Past 6 options, switch to Select or Combobox so the list does not dominate the form.
- For binary on/off settings, use Toggle rather than Radio—a single on/off is more intuitive with a switch mechanism.
- When each option requires rich additional content (icon, detailed description, badge), use Choicebox for a larger tap target and better information hierarchy.

## Examples

### Default radio

Displays basic Radio usage with a group of mutually exclusive options and a default selected state.

### Disabled state

Demonstrates how to disable a specific radio option so users cannot select it.

### Required validation

Showcases the RadioGroup's required marker and validation feedback to help users identify incomplete forms.

## Accessibility

- Related radio buttons should be wrapped in <fieldset> with a <legend> labeling the group name, ensuring screen readers announce the group before each option.
- The Required state should be set at the RadioGroup level rather than on individual options to avoid redundant announcements.
- Keyboard users can cycle through options with Up/Down arrows, and activate a selection with Enter or Space.

## Controlled behavior

- Radio accepts a controlled checked prop; developers can manage selection state via onChange callbacks and drive it from external state.
- In controlled mode, the radio-group behaves identically to native HTML <input type='radio'> but is driven precisely by React state.

## Responsive behavior

- Radio option lists increase spacing on narrow screens and provide sufficiently large touch targets for each option.
- Vertically stacked Radio groups maintain consistent line height and padding across all viewports without squishing or overflow.

## Theme behavior

- The checked-state dot and border color follow the theme variable's primary hue, adapting automatically between dark and light modes.
- Disabled radio adjustments to opacity and contrast are achieved through the theme palette's alpha channel while maintaining WCAG contrast requirements.

## Live Demo

Default Radio Example

Option 1Option 2

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

export function RadioDefault37A8EEC1Example() {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup label="Default Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## Radio disabled

Disabled Radio Example

Option 1Option 2

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function RadioRadioDisabled2226FEE4Example() {
  return (
    <RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## Radio required

```tsx
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function RadioRadioRequired0BCA93F0Example() {
  return (
    <form className="flex flex-col items-start justify-start gap-6">
      <RadioGroup label="Required Radio Example" required defaultValue="">
        <div className="flex flex-col items-stretch justify-start gap-4">
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

Option 1Option 2

```tsx
import { useState } from "react";
import { RadioGroup, useRadio } from "@/components/ui/radio";

export function RadioRadioHeadlessF2D8A0DBExample() {
  const [value, setValue] = useState("one");

  const { component } = useRadio({ value: "one", disabled: false });

  const { component: component2 } = useRadio({ value: "two", disabled: false });

  return (
    <RadioGroup aria-label="Options" onChange={setValue} value={value}>
      <div className="flex w-full min-w-56 flex-col items-stretch justify-start gap-6">
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 1</span>
          {component}
        </label>
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 2</span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}
```

## Radio standalone

- Option 1

```tsx
import { Radio } from "@/components/ui/radio";

export function RadioRadioStandalone65A01781Example() {
  return (
    <li className="flex w-full items-center gap-2">
      <span className="text-base leading-6 text-foreground">Option 1</span>
      <Radio aria-label="Option 1" defaultChecked value="one" />
    </li>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Radio, RadioGroup, RadioGroupItem, useRadio } from "@/components/ui/radio";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives a new group selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- A single choice from 2–6 mutually exclusive options where seeing every option matters (deploy regions, plan tiers, billing cycle).
- Past 6 options, switch to Select or Combobox so the list doesn't dominate the form.
- For binary on/off, use Toggle. For richer per-option content (icon, description, badge), use Choicebox.
- Pre-select the safest default so the field reads as configured, never as required-but-empty.
- Required state goes on the RadioGroup, not on individual options.
- Wrap related radios in <fieldset> + <legend> so screen readers announce the group name before each option.
