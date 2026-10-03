# Checkbox

> Route: `/components/checkbox`

Select multiple options, confirm a statement, or select table rows.

[Back to Components](#/components)

# Checkbox

checkbox

Select multiple options, confirm a statement, or select table rows.

## When to use

- Multi-select inside a list: table-row pickers, multi-pick filters, and opt-in preference groups.
- Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).
- A row-select checkbox with no visible label needs aria-label="Select {row name}" so the row stays identifiable out of context.

## When not to use

- For a single boolean setting like dark mode or password protection, use Toggle — the on/off mechanic is clearer than a lone checkbox.
- Don't use checkboxes for mutually exclusive options; that's Radio/Choicebox territory.
- Don't override the label/htmlFor association with a custom wrapper — the click target already extends to the label.

## Examples

### Default checkbox

A basic checkable checkbox with its label.

### Indeterminate

Indeterminate is a visual state, not a third value: drive it from a parent that knows partial selection and clear it when children are fully checked or unchecked.

### Disabled

Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.

## Accessibility

- Wrap related checkboxes in a <fieldset> with a <legend> so screen readers announce the group name before each option.
- Group label is a Title Case noun (Notifications, Required Permissions) without a trailing colon; acknowledgment labels are full sentences ending in a period.
- Indeterminate copy names the partial count next to the group label (3 of 5 selected); never leave the dash state unlabeled.

## Controlled behavior

- Checked state is controlled by the parent; validation on required acknowledgments fires on submit, not on blur, so checking and unchecking shouldn't flash an error.
- The parent computes and drives the indeterminate state from child selections.

## Responsive behavior

- The click target already extends to the label, so no extra hit area is needed on mobile.
- Long labels wrap instead of truncating.

## Theme behavior

- Checked fill, focus ring, and disabled greys follow theme variables.
- Disabled and enabled states remain distinguishable in dark mode.

## Live Demo

Option 1

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function CheckboxDefault37A8EEC1Example() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox checked={checked} onChange={(): void => setChecked((b) => !b)}>
      Option 1
    </Checkbox>
  );
}
```

## Disabled

DisabledDisabled CheckedDisabled Indeterminate

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-4">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox checked readOnly disabled>
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

Indeterminate (partial selection)CheckedUnchecked

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxIndeterminateD5DB1EBAExample() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox indeterminate aria-label="Indeterminate" />
        <span className="text-copy-14 text-foreground">Indeterminate (partial selection)</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox checked readOnly aria-label="Checked" />
        <span className="text-copy-14 text-muted-foreground">Checked</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox aria-label="Unchecked" />
        <span className="text-copy-14 text-muted-foreground">Unchecked</span>
      </label>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled checked state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">No-argument change callback (official). Toggle your own state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultChecked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uncontrolled initial value (framework extension).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indeterminate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visual mixed state, not a third value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables the checkbox.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "default" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Control size (framework extension).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm"</td></tr></tbody></table>

## Best Practices

- Multi-select inside a list, like table-row pickers, multi-pick filters, and opt-in preference groups.
- Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).
- For a single boolean setting like dark mode or password protection, use Toggle. The on/off mechanic is clearer there than a lone checkbox.
- Indeterminate is a visual state, not a third value. Drive it from a parent that knows partial selection, and clear it as soon as every child is fully checked or unchecked.
- Validation on a required acknowledgment fires on submit, not on blur, so checking and unchecking shouldn’t flash an error.
- Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.
- Group label above a <fieldset> is a Title Case noun like Notifications or Required Permissions. No trailing colon.
- Acknowledgment label is a full sentence ending in a period: I agree to the Terms of Service.
- Indeterminate copy names the partial count next to the group label (3 of 5 selected). Never leave the dash state unlabeled.
- Wrap related checkboxes in <fieldset> with a <legend> so screen readers announce the group name before each option.
- Row-select checkbox in a table has no visible label. Set aria-label="Select {row name}" so the row stays identifiable out of context.
- The click target already extends to the label. Don’t override the <label>/htmlFor association with a custom wrapper that breaks the click region.
