# Select

> Route: `/components/select`

Presents a list of options in a dropdown.

[Back to Components](#/components)

# Select

Select

Presents a list of options in a dropdown.

## When to use

-   When selecting a single value from a short, fixed set of roughly ten options or fewer.
-   In constrained form layouts, settings panels, or filter rows where a dropdown saves vertical space.

## When not to use

-   When filtering from a large, open-ended list where typing materially helps; Combobox is the right tool.
-   When users need to pick multiple values at once; use Multi Select for multi-value selection.

## Examples

### Select with different sizes

The Small, Default, and Large size variants of Select shown side by side for visual comparison.

### Select in an error state

An error message displayed below the Select after a validation failure.

## Accessibility

-   Follows WAI-ARIA dropdown-listbox semantics; keyboard users navigate options with arrow keys and activate with Enter.
-   After selection, the screen reader announces the chosen value and its label clearly.

## Controlled behavior

-   Fully controllable via value and onChange props; developers manage the selected state and handle change events precisely.

## Responsive behavior

-   Built-in size variants adapt to narrow viewports by reducing font size and padding to remain usable.

## Theme behavior

-   The dropdown popover inherits background, border, and text colors from the theme system, ensuring readability in dark mode.

## Live Demo

```tsx
import { Select } from "@/components/ui/select";

<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
  <Select aria-label="Small" placeholder="Small" size="small">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </Select>
  <Select aria-label="Default" placeholder="Default">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </Select>
  <Select aria-label="Large" placeholder="Large" size="large">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </Select>
</div>
```

```tsx
import { Select } from "@/components/ui/select";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
  <Select aria-label="Small" placeholder="Small" size="small" prefix={icon} suffix={icon} />
  <Select aria-label="Default" placeholder="Default" prefix={icon} suffix={icon} />
  <Select aria-label="Large" placeholder="Large" size="large" prefix={icon} suffix={icon} />
</div>
```

```tsx
import { Select } from "@/components/ui/select";

<Select aria-label="Disabled" disabled placeholder="Disabled with placeholder" />
```

Please select a value.

Please select a value.

Please select a value.

```tsx
import { Select } from "@/components/ui/select";

<Select aria-label="Small with error" error="Please select a value." placeholder="Small" size="small" />
<Select aria-label="Default with error" error="Please select a value." placeholder="Default" />
<Select aria-label="Large with error" error="Please select a value." placeholder="Large" size="large" />
```

My label

```tsx
import { Select } from "@/components/ui/select";

<Select label="My label" placeholder="With label" />
```

Required field

```tsx
import { Select, SelectItem } from "@/components/ui/select";

<Select label="Required field" placeholder="Please select an option" required>
  <SelectItem value="option1">Option 1</SelectItem>
  <SelectItem value="option2">Option 2</SelectItem>
  <SelectItem value="option3">Option 3</SelectItem>
</Select>
```

## With Options

```tsx
import { Select } from "@/components/ui/select";

<Select className="w-56" defaultValue="banana" aria-label="Select fruit">
  <option value="apple">Apple</option>
  <option value="orange">Orange</option>
  <option value="banana">Banana</option>
  <option value="grape">Grape</option>
</Select>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Select } from "@/components/ui/select"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives selection changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Pick <Select> for short, fixed lists (under ~10 items) where typing adds nothing; switch to Combobox once filtering helps.
-   Use MultiSelect when more than one value can be chosen at once; use Switch for a 2–3 option segmented choice.
-   Group options past ~10 items with native <optgroup>; Geist <Select> has no .Group static.
-   Options are Title Case when short and match canonical branding (Next.js, not NextJS); keep the same register across the list.
-   Label is a short Title Case noun (Framework, Region); accept the prop directly on <Select>.
-   Placeholder is action-oriented (Select a framework), never Choose one…, Pick, or the label restated.
-   Validate on blur and pass a string to error; messages name the field and end in a period (Select a framework.).
-   Don’t wrap a labelled <Select> in a Tooltip; put the hint on a sibling icon button so the label stays announced.
