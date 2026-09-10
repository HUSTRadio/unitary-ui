# Breadcrumbs

> Route: `/components/breadcrumbs`

Navigation aid that shows the user's location within a site's hierarchy.

[Back to Components](#/components)

# Breadcrumbs

Breadcrumbs

Navigation aid that shows the user's location within a site's hierarchy.

## When to use

- Display breadcrumb navigation in applications with multi-level structures to help users understand their current position and jump quickly to parent nodes.
- Use Breadcrumbs when URL paths reflect resource hierarchy (e.g., /projects/space/documents) as a natural synchronization mechanism.
- Place Breadcrumbs above the page title as a leading context guide.

## When not to use

- Do not overuse Breadcrumbs in flat structures—a simple page navigation menu suffices when there are only two path levels.
- Do not use Breadcrumbs for displaying filter and sort options—they are not hierarchical; use a filter bar or tab toggle instead.
- Do not force a full breadcrumb chain on mobile—in constrained space, truncate to non-core levels or use a drawer-based navigation.

## Examples

### Default breadcrumbs

Displays default breadcrumb navigation with separators and multiple hierarchy levels.

### Active state

Displays the active/disabled style for the last item to indicate the current path.

## Accessibility

- Breadcrumbs wrap in a <nav> element with aria-label='Breadcrumb', helping screen readers identify it.
- active adds aria-current='page' to the item. If href is also provided, the item still renders as a link; omit href when the current page must be inert.
- Disabled breadcrumb entries remain in the DOM but skip tabindex to ensure keyboard navigation consistency.

## Controlled behavior

Not applicable: Breadcrumbs is a passive navigational indicator driven by routing state; it accepts no controlled properties or interactive control.

## Responsive behavior

- On narrow screens, the component stays on one line and allows horizontal scrolling. Callers must explicitly construct an omitted-middle item when that presentation is needed.
- Separators maintain consistent spacing proportions across all screen sizes, ensuring readability is preserved during scaling.

## Theme behavior

- Breadcrumb text color, hover state, and current-page highlight follow theme variable text palettes and focus indicators.
- Separator colors also come from theme variables, ensuring sufficient contrast in both dark and light modes.

## Live Demo

[Home](#/)[Dashboard](#/components)[Overview](#/components/breadcrumbs)

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
```

## Active

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsActive92340695Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem active>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## Disabled

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDisabled75081B59Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Navigation destination for an item.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
