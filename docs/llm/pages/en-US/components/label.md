# Label

> Route: `/components/label`

Accessible text label for form controls.

[Back to Components](#/components)

# Label

Label

Accessible text label for form controls.

## When to use

-   When a visible text label needs to be associated with a form control so screen readers announce the field name.
-   By matching the label to the control via htmlFor and the control's id so clicking the label focuses the field.
-   Keep labels short Title Case nouns such as Project Name, Domain, and Environment Variable Name.

## When not to use

-   Don't wrap a labelled Input in a Tooltip; put the explainer on a sibling icon button so the label stays announced to screen readers.
-   When no form control association or accessibility announcement is needed, use plain text paragraphs directly instead.

## Examples

### Default label

The most basic Label usage: pass a text string as a visible label that renders as a semantic <label> element bound to the associated form control.

### Label with input

Correct usage of Label paired with Input: establish focus-on-click behavior through htmlFor/id pairing, ensuring keyboard operation and screen reader accessibility.

### Bypass casing

Use bypassCasing when the label text requires preserving specific capitalization (such as brand names or technical identifiers), preventing the component from auto-converting letter case.

## Accessibility

-   Label associates with form controls via htmlFor/id pairing so screen readers correctly announce the field name, enabling users with disabilities to understand each field's purpose.
-   All labelled inputs must wire helper text through aria-describedby to associate supplementary instructions with the input control.

## Controlled behavior

Not applicable: Label is a purely presentational component that renders only the given label text and establishes its association with a target form control. It has no internal state or user interaction capability; all behavior is determined by the passed props.

## Responsive behavior

Not applicable: The Label component itself involves no responsive layout logic. Its visual presentation flows naturally with the containing form row context across different viewports.

## Theme behavior

-   Label text color is drawn from theme tokens, ensuring good readability and contrast in both light and dark modes.
-   Font size and weight follow the design system's typography scale, maintaining consistent visual hierarchy with adjacent inputs.

## Live Demo

This is a label

```tsx
import { Label } from "@/components/ui/label";

<Label id="label-default" value="This is a label" />
```

Email Address

Email address

## With Input

Email Address

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label id="label-input" value="Email Address" withInput />
  <Input
    aria-labelledby="label-input"
    id="label-input"
    placeholder="Enter email address..."
  />
</div>
```

## Bypass Casing

Email address

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label bypassCasing id="label-input-bypass" value="Email address" withInput />
  <Input
    aria-labelledby="label-input-bypass"
    id="label-input-bypass"
    placeholder="Enter email address..."
  />
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Label } from "@/components/ui/label"
```

Native props: `LabelHTMLAttributes<HTMLLabelElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">htmlFor</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Associates the label with a control ID.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Label to associate a visible text label with a form control so screen readers announce the field name.
-   Match the label to the control via htmlFor and the control's id so clicking the label focuses the field.
-   Keep labels short Title Case nouns: Project Name, Domain, Environment Variable Name.
