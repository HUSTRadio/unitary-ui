# Choicebox

> Route: `/components/choicebox`

A larger form of Radio for choices with more detail.

[Back to Components](#/components)

# Choicebox

choicebox

A larger form of Radio for choices with more detail.

## When to use

- Use Choicebox when a choice benefits from a larger tap target plus a description or icon.
- Single-select for mutually exclusive choices, multi-select for additive ones — don't mix the two within one group.

## When not to use

- Past 4-6 tiles, switch to Select or Combobox so the page doesn't scroll for a single field.
- When options are plain short text labels with no detail to show, a regular Radio is more compact.

## Examples

### Single-select

A single-select tile group for mutually exclusive choices.

### Multi-select

A multi-select tile group for additive choices.

### Custom content

Custom content (icons, badges) renders only while the option is selected; unselected tiles stay plain.

## Accessibility

- The whole tile is the click target, but keyboard semantics stay radio/checkbox: arrow keys move within the group, Space toggles.
- Selection can't rely on border color alone; keep a selected state that assistive tech can read.

## Controlled behavior

- Selection is controlled by the parent; single-select reports the switch immediately, multi-select returns the full set.
- Disabled items stay out of the focus order and keyboard traversal.

## Responsive behavior

- The tile grid wraps with container width and degrades to a single stacked column on narrow viewports.
- Tiles keep comfortable heights on mobile to serve as large tap targets.

## Theme behavior

- Selected border, background, and description text colors follow theme variables.
- Selected and unselected tiles keep a clear hierarchy difference in dark mode.

## Live Demo

Pro TrialFree for two weeks

ProGet started now

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxSingleSelectF99FF34BExample() {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="radio"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
```

## Multi select

Pro TrialFree for two weeks

ProGet started now

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxMultiSelect294DCC0FExample() {
  const [value, setValue] = useState([] as string[]);

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="checkbox"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
    </ChoiceboxGroup>
  );
}
```

## Disabled

Choicebox group disabled

Pro TrialFree for two weeks

ProGet started now

Single input disabled

Pro TrialFree for two weeks

ProGet started now

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxDisabled17EB3C01Example() {
  const [value, setValue] = useState("");

  const [value2, setValue2] = useState([] as string[]);

  return (
    <div className="flex flex-col items-stretch justify-start gap-6">
      <ChoiceboxGroup
        disabled
        label="Choicebox group disabled"
        listClassName="flex-row"
        onChange={setValue}
        showLabel
        type="radio"
        value={value}
      >
        <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>

      <ChoiceboxGroup
        label="Single input disabled"
        listClassName="flex-row"
        onChange={setValue2}
        showLabel
        type="checkbox"
        value={value2}
      >
        <ChoiceboxGroupItem
          description="Free for two weeks"
          disabled
          title="Pro Trial"
          value="trial"
        />
        <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
      </ChoiceboxGroup>
    </div>
  );
}
```

## Custom content

Custom content (icons, badges) renders only while the option is selected; unselected tiles stay plain.

Pro TrialFree for two weeks

Trial

ProGet started now

```tsx
import { Badge } from "@/components/ui/badge";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

export function ChoiceboxCustomContent2D9A6A02Example() {
  const [value, setValue] = useState("trial");

  return (
    <ChoiceboxGroup
      label="select a plan"
      listClassName="flex-row"
      onChange={setValue}
      type="radio"
      value={value}
    >
      <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial">
        <div className="flex justify-center p-2">
          <Badge variant="trial">Trial</Badge>
        </div>
      </ChoiceboxGroupItem>
      <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro">
        <div className="flex justify-center p-2">
          <Badge variant="blue">Pro</Badge>
        </div>
      </ChoiceboxGroupItem>
    </ChoiceboxGroup>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible group label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"radio" | "checkbox"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Single- or multi-select group mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected value(s), matching the group type.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">((value: string) =&gt; void) | ((value: string[]) =&gt; void)</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives the next value shape for the selected group type.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">listClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls the item list layout.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders the group label visibly.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables every item in the group.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">required</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks the group as required.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Choicebox item title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Choicebox item description.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Choicebox when a choice benefits from a larger tap target plus a description or icon.
- Single-select for mutually exclusive choices, multi-select for additive ones. Don't mix the two within one group.
- Cap at 4-6 tiles. Past that, switch to Select or Combobox so the page doesn't scroll for a single field.
