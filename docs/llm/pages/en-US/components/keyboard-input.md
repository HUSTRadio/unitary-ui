# Keyboard Input

> Route: `/components/keyboard-input`

Displays keyboard input that triggers an action.

[Back to Components](#/components)

# Keyboard Input

Keyboard Input

Displays keyboard input that triggers an action.

## When to use

-   For shortcut hints inside prose, menu items, and button suffixes, letting users intuitively know the keyboard combination to trigger an action.
-   In long-form documentation narrating a shortcut, rendering keys as Kbd elements makes the document look professional and easy to scan.

## When not to use

-   Don't spell out modifiers inside children; pass modifiers via boolean props (meta, shift, alt, ctrl) so the component swaps ⌘ for Ctrl on Windows and Linux.
-   Punctuation lives outside the element: period, comma, and or separators stay in surrounding prose so screen readers don't announce them as keys.

## Examples

### Modifier keys

Pass modifier keys via boolean props; the component auto-renders the correct symbol per platform: ⌘ on macOS, Ctrl on Windows/Linux.

### Key combination

Display a sequence of multiple key presses, such as Shift + K, indicating the user should hold Shift then press K.

### Small keyboard input

Use the small size in dense surfaces like menu rows, command-bar items, or table cells to avoid crowding adjacent text.

### Plain command key

Used for single keys or named keys without modifiers, such as Enter or Esc. The children prop should contain a single key name, not a sentence.

## Accessibility

-   Kbd elements use semantic keyboard roles so screen readers pronounce key names and modifier combinations correctly.
-   Cross-platform modifier key swapping ensures users on different operating systems receive consistent semantic understanding with assistive technology.

## Controlled behavior

Not applicable: Keyboard Input (Kbd) is a purely presentational UI component that renders styled key badges. It has no internal state, event handling, or user interaction capability; all behavior is determined by its props.

## Responsive behavior

Not applicable: The Kbd component itself does not implement responsive layout logic. Its sizing is determined by context: use the small variant in dense surfaces to fit spatial constraints.

## Theme behavior

-   Background color, border, and text color of key badges are all drawn from theme tokens, ensuring good contrast and visual appearance in both light and dark modes.
-   Active state color transitions (when applicable) also follow theme specifications.

## Live Demo

⌘⇧⌥⌃

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

<>
  <Kbd meta />
  <Kbd shift />
  <Kbd alt />
  <Kbd ctrl />
</>
```

⌘⇧

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

<Kbd meta shift />
```

/

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

<Kbd small>/</Kbd>
```

⌘K

```tsx
import { Kbd } from "@/components/ui/keyboard-input";

<Kbd plain meta>K</Kbd>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { KeyboardInput, Kbd } from "@/components/ui/keyboard-input"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shortcut keys and separators.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Kbd for shortcut hints inside prose, menu items, and button suffixes. In long-form docs that narrate a shortcut, write the ⌘ K shortcut directly so the page renders the same when copied to plain text.
-   Pass modifiers via boolean props (meta, shift, alt, ctrl) so the component swaps ⌘ for Ctrl on Windows and Linux.
-   children is one key, digit, or named key (K, 7, Enter, Esc). Don't lowercase it, don't spell out modifiers inside, and don't pack a sentence into the element.
-   Use small inside dense surfaces like menu rows, command-bar items, or table cells where the default size crowds adjacent text.
-   Punctuation lives outside the element: period, comma, and or separators stay in surrounding prose so screen readers don't announce them as keys.
