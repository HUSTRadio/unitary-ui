# Navbar

> Route: `/components/navbar`

A page header with static, pinned, or auto-hiding scroll behavior.

[Back to Components](#/components)

# Navbar

Unitary Navbar

A page header with static, pinned, or auto-hiding scroll behavior.

## When to use

- Use it for a static, pinned, or scroll-aware page header.

## When not to use

- Use Toolbar for grouped commands and SidebarNav for side navigation.

## Examples

### Pinned header

Show the default header inside a preview region.

## Accessibility

- The component renders a header; callers must name interactive controls.

## Controlled behavior

Not applicable: Scroll direction is observed internally; there is no externally controlled state.

## Responsive behavior

- Callers arrange header content; auto-hide uses viewport-fixed positioning.

## Theme behavior

- The solid variant uses semantic background and border tokens.

## Live Demo

UnitaryWorkspace

Page content begins below the header.

```tsx
import { Navbar } from "@/components/ui/navbar";

export default function NavbarExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <Navbar scrollBehavior="static" className="flex items-center px-5">
        <span className="font-semibold">Unitary</span>
        <span className="ml-auto text-sm text-muted-foreground">Workspace</span>
      </Navbar>
      <div className="border-t border-border p-6 text-sm text-muted-foreground">
        Page content begins below the header.
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Navbar } from "@/components/ui/navbar";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollBehavior</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"static" | "pinned" | "auto-hide"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Header positioning and scroll behavior.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pinned"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"solid" | "transparent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial surface treatment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"solid"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solidOnScroll</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Fills a transparent header after scrolling down.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">CSS height class or numeric inline height; defaults to h-16.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"h-16"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Header content arranged by the caller.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
