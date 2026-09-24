# Sidebar Nav

> Route: `/components/sidebar-nav`

Grouped sidebar navigation with active state and optional collapsible sections.

[Back to Components](#/components)

# Sidebar Nav

Unitary Sidebar Nav

Grouped sidebar navigation with active state and optional collapsible sections.

## When to use

- Use it for grouped navigation in desktop application layouts.

## When not to use

- Use HamburgerMenu for expandable navigation on a compact screen.

## Examples

### Grouped links

Select an item to update the current-page state.

## Accessibility

- Links retain native anchor semantics; the active item uses aria-current and collapsible headings support keyboard activation.

## Controlled behavior

- The caller supplies activeTo; onNavigate intercepts unmodified clicks, while modified clicks retain native navigation.

## Responsive behavior

- The surrounding layout sets the width; touch rows have larger hit targets.

## Theme behavior

- Links, focus rings, and selection use semantic color tokens.

## Live Demo

```tsx
import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

const groups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/overview" },
      { label: "Projects", to: "/projects" },
    ],
  },
];

export default function SidebarNavExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="w-full max-w-64 rounded-xl border border-border bg-background p-3">
      <SidebarNav groups={groups} activeTo={activeTo} onNavigate={setActiveTo} collapsible />
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { SidebarNav } from "@/components/ui/sidebar-nav";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SidebarNavGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Navigation groups and their links.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Path of the active item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Intercepts unmodified link activation; modified clicks retain native navigation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Places the divider on the right-side variant.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Allows group headings to toggle their contents.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">persistKey</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Persists collapsed groups in localStorage when provided.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
