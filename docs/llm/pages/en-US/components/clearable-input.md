# Clearable Input

> Route: `/components/clearable-input`

A text input with an inline Esc keycap that clears on pointer activation or Escape.

[Back to Components](#/components)

# Clearable Input

Clearable Input

A text input with an inline Esc keycap that clears on pointer activation or Escape.

## When to use

- Users frequently need to reset the current value in search, filter, or short query fields.
- You need a fast way to clear the input without adding an extra button to the layout; the inline clear icon serves as a low-friction reset affordance.

## When not to use

- When the field value must not be easily cleared, such as sensitive authentication credentials; use an explicit Delete button that requires confirmation instead.
- When users may want to partially retain long input; Middle Truncate is better suited for display-only truncation of long identifiers.

## Examples

### Default clearable input

A base Clearable Input without a label, showing the input area and its inline clear keycap.

### Clearable input with label

Associates a visible label with the native input for screen reader access, while keeping the Escape clear accessible from the input itself.

### Clearable input integrated with command menu

Used as a search input in command menus like Command Menu, providing CmdK-style keyboard interaction patterns.

### Disabled clearable input

Displays the disabled visual state of the input; the entire field becomes inert, not just the clear icon.

### Clearable input with clear callback

Leverages the onChange handler to detect when the value is cleared, enabling custom post-clear logic such as resetting filtered results.

## Accessibility

- Provide a visible label associated with the native input so screen readers announce the field name correctly.
- The clear icon is part of the input experience; Escape clears from the input itself without requiring an extra accessible element.

## Controlled behavior

- Clearable Input's controlled behavior is driven by the parent input's value and onChange.
- Pass value and onChange for fully controlled mode; activating the clear keycap or pressing Escape clears through the native input event path, then calls optional onClear.

## Responsive behavior

- Width is controlled by the parent or layout, including fixed, min/max, and flex constraints.
- The CmdK shortcut suffix hides on narrow viewports; the clear keycap button hides on coarse-pointer devices while keyboard users can still press Escape from the input.

## Theme behavior

- Follows design system color variables to adapt border, text, and background colors automatically across themes.
- The clear keycap inherits semantic foreground colors and uses the same theme tokens for hover and focus states.

## Live Demo

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Demo clearable input"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## With label

Email

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithLabelBB9F6883Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      label="Email"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter your email..."
      value={value}
    />
  );
}
```

## With cmdk

Esc⌘K

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Search with cmdk"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Search..."
      value={value}
    />
  );
}
```

## Disabled

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("Some text");

  return (
    <ClearableInput
      aria-label="Disabled clearable input"
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## With clear callback

Cleared 0 times

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithClearCallback3538EFCAExample() {
  const [value, setValue] = useState("");

  const [clearCount, setClearCount] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <ClearableInput
        aria-label="Clearable input with callback"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClear={() => {
          setClearCount((prev) => prev + 1);
        }}
        placeholder="Enter some text and clear..."
        value={value}
      />
      <p className="text-copy-14 text-muted-foreground">Cleared {clearCount} times</p>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
```

Native props: `InputHTMLAttributes<HTMLInputElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible label associated with the native input.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cmdk</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the desktop command-menu shortcut suffix.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClear</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when the clear affordance is activated.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls root width and input surface height constraints.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Clearable Input for search, filter, and short query fields where resetting the current value is frequent.
- Associate visible labels with the native input, and keep Escape clearing available from the input itself.
