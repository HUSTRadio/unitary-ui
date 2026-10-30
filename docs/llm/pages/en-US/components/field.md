# Field

> Route: `/components/field`

Compose a label, control, helper text and error message around any form control.

[Back to Components](#/components)

# Field

field

Compose a label, control, helper text and error message around any form control.

## When to use

- A custom or third-party control needs the same label and error typography as Input, Select and Textarea.
- One field must show helper text and an error message with consistent spacing and size.
- The field as a whole should take part in the surrounding layout, so the container carries the caller className.

## When not to use

- Input, Select and Textarea already render their own label and error; wrapping them in Field produces two labels.
- Validation rules, async checks or form state belong to a form library; Field does not own control state.
- Card-style grouping with a heading, footer actions and a shared error state belongs to Fieldset.

## Examples

### Label, helper text and error

Field composes the label, helper text and error message; the control stays controlled and the caller decides the copy.

## Accessibility

Not applicable: Accessibility work is out of scope this round: Field only provides the label/htmlFor association. Callers wire aria-describedby and aria-invalid themselves, and FieldError announces through role="alert".

## Controlled behavior

Not applicable: Field holds no state and never reads the control value; value and onChange stay between the caller and the control.

## Responsive behavior

- The root uses w-full min-w-0, so width follows the surrounding layout instead of overflowing grids or narrow containers.
- Helper text and error copy wrap at the control width; FieldError already declares break-words.
- There are no breakpoint branches: viewport differences come from the outer layout, not from Field.

## Theme behavior

- The label uses text-gray-900, helper text uses text-gray-700 and the error uses the --error-foreground semantic token, so both themes follow automatically.
- Field introduces no new color or spacing tokens, so theme switching adds no extra state.

## Live Demo

Workspace name

Used in URLs and mentions.

```tsx
import { useState } from "react";
import { Field, Input } from "@hustradio/unitary-ui";

export function FieldBasic3F9A1C7EExample() {
  const [value, setValue] = useState("");
  const error = value.includes(" ") ? "Workspace names cannot contain spaces." : "";

  return (
    <div className="w-full max-w-sm">
      <Field
        label="Workspace name"
        htmlFor="field-basic-workspace"
        description="Used in URLs and mentions."
        error={error}
      >
        <Input
          id="field-basic-workspace"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="acme"
        />
      </Field>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Field } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Field label; rendered as a label element pointing at htmlFor.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">htmlFor</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Id of the control the label targets; Field never writes it to the child.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Helper text under the control, above the error.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Error message routed through FieldError; empty values render nothing.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">large</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Aligns helper text and error with large controls.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">The control itself, rendered as-is.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Field for layout and copy only; the control keeps its own value, validation and aria-describedby wiring.
- Pair htmlFor with the control id so the label associates; Field never rewrites the child element.
- Keep helper text to one sentence and put the actionable rule in the error message.
- Errors render through FieldError, so empty values are omitted and long copy wraps without clipping.
