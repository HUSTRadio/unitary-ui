# Input

> Route: `/components/input`

A single-line text field for user input.

[Back to Components](#/components)

# Input

Input

A single-line text field for user input.

## When to use

- When the user needs to enter a single line of free-form text, such as project name, email address, API key, or domain.
- When field-level validation with immediate feedback is needed to inform the user whether their input is valid.
- As part of a form submitted together with other controls to a backend.

## When not to use

- When content can wrap to multiple lines, use Textarea instead of Input, since Input's single-line semantics are unsuited for block text.
- When the value comes from a known list the user filters by typing, use Combobox instead of free-form input.
- Don't wrap a labelled <Input> in a Tooltip; put the explainer on a sibling icon button so the label stays announced.

## Examples

### Default input

The most basic input usage with a placeholder hint and standard styling, suitable for most generic text input scenarios.

### Prefix and suffix

Add prefix and suffix elements inside the input field, such as a 'https://' prefix for URL inputs or a domain suffix after usernames.

### Error state

Display a field's validation failure state by passing a validation message string to the error prop, with a red border and error text for clear visual feedback.

### Labeled input

Correct usage paired with a visible label; the component associates the label and input and generates an id when one is not supplied.

## Accessibility

- When label is provided, Input associates the label and field through htmlFor/id; it generates an id when one is not supplied.
- Error messages passed via the error prop are added to aria-describedby; helper text should also be linked through this mechanism.

## Controlled behavior

- Input accepts value and onChange for controlled behavior, or can be used uncontrolled via defaultValue initialization.
- Trim leading and trailing whitespace before submit so example.com and example.com resolve to one value.

## Responsive behavior

- Input width auto-resizes across different viewports, ensuring adequate tap targets and readable font sizes on small screens.
- Prefix and suffix elements adapt their positioning and alignment responsively to fit varying widths.

## Theme behavior

- Border color, background, and focus state all follow theme tokens, including dark mode adaptation.
- Error state red borders and normal state color distinction follow the design system's color specifications.

## Live Demo

```tsx
import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-between gap-4 md:flex-row">
  <Input size="small" placeholder="Small" />
  <Input placeholder="Default" />
  <Input size="large" placeholder="Large" />
</div>;
```

https://.com

vercel/

```tsx
import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col items-start justify-start gap-6">
  <Input placeholder="Default" prefix={icon} />
  <Input placeholder="Default" suffix={icon} />
  <Input placeholder="Default" prefix="https://" suffix=".com" />
  <Input
    placeholder="Default"
    prefix={icon}
    prefixStyling={false}
    suffix={icon}
    suffixStyling={false}
  />
  <Input placeholder="Default" prefix="vercel/" suffix={icon} suffixStyling={false} />
</div>;
```

https://.com

```tsx
import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col items-start justify-start gap-4">
  <Input disabled placeholder="Disabled with placeholder" />
  <Input disabled defaultValue="Disabled with value" />
  <Input disabled placeholder="Disabled with prefix" prefix={icon} />
  <Input disabled placeholder="Disabled with suffix" suffix={icon} />
  <Input disabled placeholder="Disabled with prefix and suffix" prefix="https://" suffix=".com" />
  <Input
    disabled
    placeholder="Disabled with prefix and suffix"
    prefix={icon}
    prefixStyling={false}
    suffix={icon}
    suffixStyling={false}
  />
</div>;
```

An error message.

An error message.

An error message.

```tsx
import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-start gap-8">
  <Input size="small" error="An error message." placeholder="long-error@gmail.com" />
  <Input error="An error message." placeholder="long-error@gmail.com" />
  <Input size="large" error="An error message." placeholder="long-error@gmail.com" />
</div>;
```

Label

```tsx
import { Input } from "@/components/ui/input";

<Input label="Label" placeholder="Label" />;
```

www..com

```tsx
import { Input } from "@/components/ui/input";

<Input rounded prefix="www." suffix=".com" placeholder="Label example" />;
```

www..com

```tsx
import { Input } from "@/components/ui/input";

<Input
  rounded
  prefix="www."
  prefixStyling={false}
  suffix=".com"
  suffixStyling={false}
  placeholder="Label example"
/>;
```

## States

```tsx
import { Input } from "@/components/ui/input";

<div className="flex w-full max-w-md flex-col gap-3">
  <Input aria-label="Default" placeholder="Default" />
  <Input aria-label="Disabled" disabled placeholder="Disabled" />
  <Input aria-label="With value" defaultValue="geist-docs" placeholder="With value" />
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Input } from "@/components/ui/input";
```

Native props: `InputHTMLAttributes<HTMLInputElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large" | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Input height; a number is forwarded to the native size attribute.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Validation message rendered below the field.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible label associated with the input.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Leading input adornment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefixStyling</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Styles and separates the prefix.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Trailing input adornment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffixStyling</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Styles and separates the suffix.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rounded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a pill-shaped input surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Applies the shared control layout contract.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Pick <Input> for a single line of free-form text such as names, domains, or tokens.
- Switch to Textarea the moment content can wrap to multiple lines.
- Use Combobox when the value comes from a known list the user filters by typing.
- For an inline search box, use <SearchInput> with a scoped placeholder like Search projects; don’t embed it inside an unrelated form.
- Validate on blur, not on every keystroke; surface the message by passing a string to error.
- Trim leading and trailing whitespace before submit so example.com and example.com resolve to one value.
- Keep the field focusable while saving; pair disabled with a spinner only when input is impossible.
- Don’t wrap a labelled <Input> in a Tooltip; put the explainer on a sibling icon button so the label stays announced.
- Labels are short Title Case nouns: Project Name, Domain, Environment Variable Name.
- Placeholders show an example value (my-awesome-project, example.com), never instructions like Enter your project name.
- Helper text is sentence case, one sentence with a trailing period, on a sibling element wired through aria-describedby.
- Validation names the field and the constraint, ends in a period, and skips please (Project name is required., Code must be 6 digits.).
- Passing label renders an associated label and generates an id when one is not supplied; provide an explicit id when another element needs to reference the field.
- For icon-only affordances inside a row of inputs, use <Button shape="circle" svgOnly aria-label="…"> rather than an unlabeled icon.
- A SearchInput placeholder names the scope (Search projects) so the role is clear without sighted context.
