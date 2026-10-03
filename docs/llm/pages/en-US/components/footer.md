# Footer

> Route: `/components/footer`

A page footer with link columns and optional leading and trailing slots.

[Back to Components](#/components)

# Footer

footer

A page footer with link columns and optional leading and trailing slots.

## When to use

- Use it for grouped links or supplementary information at the bottom of a page.

## When not to use

- Use Navbar for the page header and Toolbar for local actions.

## Examples

### Link footer

Grouped links with leading content.

## Accessibility

- The component renders a footer and native links; callers provide link text.

## Controlled behavior

Not applicable: Footer has no internal interactive state.

## Responsive behavior

- Link columns stack at narrow widths and align with slots on wider screens.

## Theme behavior

- Text and dividers use semantic tokens.

## Live Demo

**Unitary**

Resources

- [Components](#/components)
- [Guides](#/guides)

```tsx
import { Footer } from "@/components/ui/footer";

export default function FooterExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Footer
        columns={[
          {
            title: "Resources",
            links: [
              { label: "Components", href: "#/components" },
              { label: "Guides", href: "#/guides" },
            ],
          },
        ]}
        slotLeading={<strong className="text-sm">Unitary</strong>}
      />
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Footer } from "@/components/ui/footer";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">FooterColumn[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Titled link columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slotLeading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content before the link columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">slotTrailing</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content after the link columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sticky</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Pins the footer to the bottom of the viewport.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>
