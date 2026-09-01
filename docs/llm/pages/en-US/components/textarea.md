# Textarea

> Route: `/components/textarea`

A multi-line text field for longer input.

[Back to Components](#/components)

# Textarea

Textarea

A multi-line text field for longer input.

## When to use

- Input content that wraps to multiple lines, such as commit messages, descriptions, or notes where users enter free-form multi-line text.
- When a form field needs sufficient writing space and a single-line Input would break the layout, Textarea offers controllable row count and optional growth.

## When not to use

- Do not use Textarea for single-value inputs (usernames, domains, tokens)—use Input for those scenarios.
- Do not force a large Textarea above primary action zones lacking vertical room—it can push critical action buttons below the fold, forcing users to scroll to find submit controls.

## Examples

### Default textarea

Displays the default Textarea appearance with basic placeholder text and border styling.

### Sizes

Showcases different size variants of Textarea to match varying form layout densities.

### Error state

Demonstrates the error state with a red border and inline validation message displayed inside the field.

## Accessibility

- Associate the textarea with a visible <label> element linked via htmlFor/id so screen readers can announce the field name correctly.
- Validation error messages should be linked to the textarea via aria-describedby so screen readers announce them together when focused.
- Placeholders should show an example value (e.g. my-description), never instruction text (e.g. Enter a description), to avoid misleading assistive technology users.

## Controlled behavior

- Manage text content controllably via value and onChange props, supporting programmatic assignment and real-time input listening.
- The readOnly property puts the textarea into a read-only mode where the text cannot be edited but remains selectable and focusable.
- Disabled state prevents all user input with a grayed appearance and skips the element in keyboard navigation order.

## Responsive behavior

- Set a generous default row count and grow only when the surface has vertical room, without pushing primary action buttons below the fold.
- On narrow screens, the Textarea width fills the available space proportionally with proportional scaling of line height and padding.

## Theme behavior

- Textarea borders, background, and text color follow theme variables with optimized palettes for both dark and light modes.
- Error-state red borders and warning-state amber borders maintain sufficient contrast across themes for legibility.

## Live Demo

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Default"
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>;
```

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Disabled"
  disabled
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>;
```

There has been an error.

There has been an error.

There has been an error.

## Error

There has been an error.

There has been an error.

There has been an error.

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-8">
  <Textarea
    aria-label="With error (small)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (medium)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (large)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="large"
    style={{ minHeight: 100 }}
  />
</div>;
```

## Sizes

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-6">
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="large"
    style={{ minHeight: 100 }}
  />
</div>;
```

## Read Only

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col">
  <Textarea aria-label="Read only" defaultValue={LOREM_IPSUM} readOnly style={{ minHeight: 100 }} />
</div>;
```

## Rows

```tsx
import { Textarea } from "@/components/ui/textarea";

<div className="flex w-full max-w-md flex-col">
  <Textarea
    aria-label="Textarea with fixed rows"
    placeholder="Textarea with fixed number of rows"
    rows={5}
  />
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Textarea } from "@/components/ui/textarea";
```

Native props: `TextareaHTMLAttributes<HTMLTextAreaElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TextareaSize</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Textarea size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Inline validation message and error styling.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible label wrapping the textarea surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls root width and surface height constraints.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Pick <Textarea> for content that wraps to multiple lines (commit messages, descriptions, notes); use Input for a single value like a name or domain.
- Set a generous default rows and grow only when the surface has vertical room; don’t let the field push primary actions below the fold.
- Validate on blur and pass a string to error to render the inline message; the validation replaces helper text on failure.
- Trim leading and trailing whitespace on submit so empty newlines don’t pass a required check.
- Labels are short Title Case nouns (Description, Release Notes); placeholders show an example value, not instructions like Enter a description.
- Validation names the field and constraint, ends in a period, and skips please (Description is required., Release notes can’t exceed 500 characters.).
- Render helper text as a sibling <p> linked through aria-describedby; sentence case, one sentence, with a period.
