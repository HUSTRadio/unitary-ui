# Note

> Route: `/components/note`

Displays text that requires attention or provides additional information.

[Back to Components](#/components)

# Note

Note

Displays text that requires attention or provides additional information.

## When to use

- For inline contextual feedback next to the field, card, or section it describes, such as a region change warning, rate-limit notice, or usage gauge.
- When you need to display a persistent message inline until the underlying state changes, without escalating to a full-page banner or transient toast.
- When conveying different types of feedback through semantic variants (destructive, warning, success).

## When not to use

- Pick Banner when the message is page-level or system-wide and needs a CTA, Toast for transient acknowledgments, Modal for destructive confirmations.
- One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.

## Examples

### Sizes

Note offers multiple size variants to suit different layout density needs — compact fits dense table rows, standard works well between cards and paragraphs.

### With action

Adds a call-to-action button or link within a Note so users can execute a follow-up action directly, such as viewing documentation or learning more details.

### With label

Attaches a custom label to a Note for improved semantic clarity, displaying an icon and text label before the note body to help users quickly understand the meaning of the notice content.

### Custom icon

Replaces the default icon slot with a custom SVG icon to meet brand-specific visual needs and provide richer contextual expression.

## Accessibility

- Different variants (destructive, warning, success) convey semantics through color and icons, but color alone is insufficient — explicit text descriptions must accompany them.
- A Note is persistent rather than transient; its content is announced immediately by screen readers on page load.
- The disabled state sets both aria-disabled and native inert, so the entire Note becomes non-interactive and leaves the accessibility tree.

## Controlled behavior

Not applicable: Note is a purely presentational notification component with no internal interactive state. Its behavior is entirely driven by props (variant, icon, children), with no controlled/uncontrolled distinction.

## Responsive behavior

- Note's width adapts to its container, remaining legible and non-overflowing on narrow screens.
- Size variants (small/large) can be selected based on the density requirements of the surrounding area.

## Theme behavior

- Each semantic variant color (destructive, warning, success, secondary, violet, cyan) is drawn from theme tokens, automatically adapting for light and dark mode contrast.
- Disabled Note state reduces opacity while retaining sufficient contrast for readability.

## Live Demo

A small note.

A medium note.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note size="small">
        <NoteContent>A small note.</NoteContent>
      </Note>
      <Note>
        <NoteContent>A medium note.</NoteContent>
      </Note>
    </div>
  );
}
```

## Action

This note details some information.

This note details a large amount information that could potentially wrap into two or more lines.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteAction64CFF131Example() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex w-full flex-col gap-3">
      <Note>
        <NoteContent>This note details some information.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small" onClick={() => setMessage("Upgrade requested")}>
            Upgrade
          </Button>
        </NoteAction>
      </Note>
      <Note>
        <NoteContent>
          This note details a large amount information that could potentially wrap into two or more
          lines.
        </NoteContent>
        <NoteAction>
          <Button typeName="button" size="small" onClick={() => setMessage("Upgrade requested")}>
            Upgrade
          </Button>
        </NoteAction>
      </Note>
      <span role="status" aria-live="polite" className="min-h-5 text-copy-13 text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
```

## Secondary

This note details some secondary information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteSecondary62F2CCFFExample() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note variant="secondary">
        <NoteContent>This note details some secondary information.</NoteContent>
      </Note>
    </div>
  );
}
```

## Violet

This note details some violet information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteViolet2A364288Example() {
  return (
    <Note variant="violet">
      <NoteContent>This note details some violet information.</NoteContent>
    </Note>
  );
}
```

## Cyan

This note details some cyan information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteCyanE95BB222Example() {
  return (
    <Note variant="cyan">
      <NoteContent>This note details some cyan information.</NoteContent>
    </Note>
  );
}
```

## Disabled

This note details a warning.

```tsx
import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteDisabled75081B59Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note disabled fill variant="warning">
        <NoteContent>This note details a warning.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small">
            Upgrade
          </Button>
        </NoteAction>
      </Note>
    </div>
  );
}
```

## Label

Region Change:Changing this region restarts all functions.

```tsx
import { Note, NoteContent, NoteLabel } from "@/components/ui/note";

export function NoteLabel0E66373FExample() {
  return (
    <Note>
      <NoteContent>
        <NoteLabel>Region Change:</NoteLabel>Changing this region restarts all functions.
      </NoteContent>
    </Note>
  );
}
```

## Custom icon

A custom icon replaces the variant's default.

Pass a null icon to render no icon at all.

```tsx
import { Note, NoteContent } from "@/components/ui/note";
import { Sparkles } from "lucide-react";

export function NoteCustomIconEE5755A2Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note icon={<Sparkles className="size-4" aria-hidden />}>
        <NoteContent>A custom icon replaces the variant's default.</NoteContent>
      </Note>
      <Note icon={null}>
        <NoteContent>Pass a null icon to render no icon at all.</NoteContent>
      </Note>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Note, NoteContent, NoteAction, NoteLabel } from "@/components/ui/note";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">NoteVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Semantic note style.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fill</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses a soft filled background.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "medium"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Note size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Custom icon; null removes the icon.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables actions inside the note.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use a Note for inline contextual feedback next to the field, card, or section it describes: a region change warning above a region picker, a rate-limit notice next to a usage gauge.
- Pick Banner when the message is page-level or system-wide and needs a CTA, Toast for transient acknowledgments, Modal for destructive confirmations.
- Choose variant by meaning: destructive for a problem the user must fix, warning for a consequence to acknowledge, success for a passed check; omit variant for the default info icon.
- A Note is persistent until the underlying state changes; don’t add an ad hoc dismiss control because it competes with the message.
- One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.
- The body is one sentence in active voice that names the impact: Changing this region restarts all functions.
