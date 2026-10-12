# Switch

> Route: `/components/switch`

Switch between a few mutually exclusive views with segmented controls.

[Back to Components](#/components)

# Switch

switch

Switch between a few mutually exclusive views with segmented controls.

## When to use

- Switching between two or three mutually exclusive options (e.g., Source vs Output views).
- When options are few and users frequently toggle between them with need for instant feedback.

## When not to use

- Use Toggle for a boolean setting and Switch for mutually exclusive options.
- Past 3 options or when labels grow beyond a couple of words, switch to Tabs or a Select.

## Examples

### Basic usage

A segmented selector with two mutually exclusive options.

### Size variants

Different size specs adapting to compact or spacious panel layouts.

### Disabled state

Demonstrating the disabled appearance and why an option is unavailable.

## Accessibility

- Every Switch.Control should carry an accessible name (even icon-only controls need a Tooltip plus an sr-only label).
- Left/Right arrows move focus across options, Enter or Space activates, Escape exits.

## Controlled behavior

- Control the Switch group with value and onValueChange; use defaultValue for an uncontrolled initial selection.
- name is required on the Switch group to associate its mutually exclusive options; each Switch.Control identifies itself with value.

## Responsive behavior

- In full-width mode on narrow screens provides better touch targets; padding per control ensures the widest label fits without resizing the active pill.

## Theme behavior

- The active pill color follows theme tokens, maintaining consistent contrast in both light and dark modes.

## Live Demo

Source

Output

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchDefault37A8EEC1Example() {
  return (
    <Switch name="default">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  );
}
```

## Disabled

Source

Output

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchDisabled75081B59Example() {
  return (
    <div className="flex w-full max-w-md flex-col items-start">
      <Switch name="reference-view-mode">
        <SwitchControl defaultChecked disabled label="Source" value="source" />
        <SwitchControl disabled label="Output" value="output" />
      </Switch>
    </div>
  );
}
```

## Sizes

Source

Output

Source

Output

Source

Output

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-small" size="small">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-default">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-sizes-large" size="large">
          <SwitchControl defaultChecked label="Source" value="source" />
          <SwitchControl label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
```

## Full width

Source

Output

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchFullWidthD34008D2Example() {
  return (
    <Switch name="reference-full-width" style={{ width: "100%" }}>
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  );
}
```

## Tooltip

Source

Output

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";
import { Tooltip } from "@hustradio/unitary-ui";

export function SwitchTooltip20F12289Example() {
  return (
    <div className="flex w-full max-w-md flex-col items-start">
      <Switch name="reference-tooltip">
        <Tooltip text="View Source">
          <SwitchControl defaultChecked label="Source" size="large" value="source" />
        </Tooltip>
        <Tooltip text="View Output">
          <SwitchControl label="Output" size="large" value="output" />
        </Tooltip>
      </Switch>
    </div>
  );
}
```

## Icon

Source

Output

Source

Output

Source

Output

```tsx
import { LayoutGrid, List } from "lucide-react";
import { Switch, SwitchControl } from "@hustradio/unitary-ui";

export function SwitchIconA35ABCD6Example() {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-small" size="small">
          <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-default">
          <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
      <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
        <Switch name="reference-icons-large" size="large">
          <SwitchControl defaultChecked icon={<LayoutGrid />} label="Source" value="source" />
          <SwitchControl icon={<List />} label="Output" value="output" />
        </Switch>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Switch, SwitchControl } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">name</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Form field name (required so the control participates in form submission).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected option.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives a new selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Switch as a segmented selector for 2–3 mutually exclusive options that show different views of the same surface, like Source vs Output.
- For a boolean on/off setting, use Toggle. Switch implements radio semantics, so two options stay mutually exclusive rather than reading as a checkbox.
- Past 3 options or when labels grow beyond a couple of words, switch to Tabs or a Select.
- Pass a name so the underlying radios are grouped; without it, more than one option can appear selected at once.
- Set defaultChecked (or controlled checked) on exactly one Switch.Control so the group has a defined initial state.
- Pad each Switch.Control so the widest label fits without the active pill resizing on selection. Test with the longest copy in the set.
- Title Case each Switch.Control label. Keep labels to one or two words and parallel: Source / Output, not Source / Show output.
- Always provide a label on every Switch.Control, even when an icon carries the meaning, so screen readers announce the option. The component renders it as sr-only for icon-only controls.
- Pair an icon-only Switch with a Tooltip on each control so sighted users get the same label assistive tech receives.
