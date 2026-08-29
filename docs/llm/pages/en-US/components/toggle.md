# Toggle

> Route: `/components/toggle`

A switch for a single boolean setting.

[Back to Components](#/components)

# Toggle

Toggle

A switch for a single boolean setting.

## When to use

- For a single boolean setting where ON takes effect right away (e.g., password protection, auto-cancel builds). Use Toggle instead of Checkbox for multi-select lists, or Switch for 2–3 mutually exclusive views.
- When you need a clear on/off toggle for one independent setting presented alongside other form controls.

## When not to use

- For selecting multiple items from a list; use Checkbox instead. Toggle only expresses a single on/off state.
- For switching between two or more mutually exclusive views; use Switch instead. Toggle is designed for a single boolean setting.

## Examples

### Default style

Showcases the basic Toggle usage with checked and onChange callback.

### Disabled state

Disables the Toggle when the action is impossible and explains why via helper text.

### Size variants

Demonstrates different sizes of Toggle to fit varying UI density requirements.

### Toggle with label

Passes a Title Case label through children and pairs it with descriptive copy explaining what being ON means.

## Accessibility

- Provide an accessible name through children, aria-label, or aria-labelledby. Geist warns in development if all three are missing.
- Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry both visual and screen-reader labels.

## Controlled behavior

- checked is required and the component is controlled. Own the state and update it from onChange.
- Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don't leave the user wondering whether the flip stuck.

## Responsive behavior

Not applicable: Toggle is a small boolean switch whose behavior and layout remain consistent across viewports; it does not depend on responsive breakpoints or layout changes.

## Theme behavior

- Toggle follows the theme color system; the filled-on state color switches automatically with the current theme, ensuring sufficient contrast in all palette schemes.

## Live Demo

```tsx
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked2}
        onChange={() => setChecked2(!checked2)}
      />
    </div>
  );
}
```

```tsx
import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-col">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly disabled />
  <Toggle aria-label="Enable Firewall" checked readOnly disabled />
</div>;
```

```tsx
import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-row flex-wrap">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="medium" />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />
</div>;
```

```tsx
import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
    </div>
  );
}
```

Enable FirewallEnable Firewall

Enable FirewallEnable Firewall

Enable FirewallEnable Firewall

Enable FirewallEnable Firewall

```tsx
import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle checked={checked} direction="rtl" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} size="large" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Toggle } from "@/components/ui/toggle";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled on/off state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Toggle for a single boolean setting where ON takes effect immediately, like Password Protection or Auto-Cancel Builds. Switch to Checkbox for a multi-select list, or to Switch for 2–3 mutually exclusive views.
- checked is required and the component is controlled. Own the state and update it from onChange.
- Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don’t leave the user wondering whether the flip stuck. Pair with a form footer only when the setting needs an explicit Save step.
- Disable Toggle only when the action is impossible (missing plan, locked policy); pair with helper text or a Tooltip that names the resolver.
- The label is children, not a label prop. Title Case noun phrase, 1–4 words, naming what is true when ON: Password Protection, not Enable Password Protection.
- Render an optional one-sentence description as a sibling under the label that explains ON only. Don’t describe OFF; it’s the negation.
- Keep labelCasing="title" (the default) so labels match other Title Case surfaces. Use labelCasing="normal" only when sentence-case content sits inline next to the toggle.
- Provide an accessible name through children, aria-label, or aria-labelledby. Geist warns in development if all three are missing.
- Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry it so sighted and screen-reader copy stay aligned.
