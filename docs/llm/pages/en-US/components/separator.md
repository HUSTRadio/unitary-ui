# Separator

> Route: `/components/separator`

Divides content into visually distinct groups.

[Back to Components](#/components)

# Separator

Separator

Divides content into visually distinct groups.

## When to use

- When you need a visual divider between menu items, list sections, or layout blocks.
- When a lightweight line conveys partitioning better than additional spacing layers alone.

## When not to use

- When whitespace or background surface transitions already provide sufficient visual grouping.
- For a purely visual rule, set decorative={true} explicitly so it does not add unnecessary semantics.

## Examples

### Horizontal separator

A horizontal line spanning the full container width, suitable for separating vertically stacked content blocks.

### Vertical separator

A vertical line filling the available height of a flex row, useful for spacing horizontally laid-out items.

## Accessibility

- The default decorative={false} exposes a semantic separator and its orientation to assistive technologies.
- Set decorative={true} only for a purely visual rule that assistive technologies should ignore.

## Controlled behavior

Not applicable: The separator is a purely presentational component with no interactive state or internal mutability; controlled behavior does not apply.

## Responsive behavior

- Horizontal separators stretch to fill the container width; vertical ones grow to fill the flex item's available height.

## Theme behavior

- Color inherits from theme CSS variables, adjusting automatically for stroke and contrast in dark themes.

## Live Demo

### Section 1

This is the first section of content.

### Section 2

This is the second section of content.

```tsx
import { Separator } from "@/components/ui/separator";

export function SeparatorHorizontal69B273A2Example() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-label-16">Section 1</h3>
        <p className="text-copy-14 text-gray-900">This is the first section of content.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-label-16">Section 2</h3>
        <p className="text-copy-14 text-gray-900">This is the second section of content.</p>
      </div>
    </div>
  );
}
```

## Vertical

Home

About

Services

Contact

```tsx
import { Separator } from "@/components/ui/separator";

export function SeparatorVertical34DA5602Example() {
  return (
    <div className="flex h-8 items-center space-x-4">
      <p className="text-copy-14 text-gray-1000">Home</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">About</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Services</p>
      <Separator orientation="vertical" />
      <p className="text-copy-14 text-gray-1000">Contact</p>
    </div>
  );
}
```

## Orientation variants

#### Horizontal Separators

Content above separator

Content below separator

#### Vertical Separators

Left

Center

Right

```tsx
import { Separator } from "@/components/ui/separator";

export function SeparatorOrientationVariants25A5D06AExample() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-2 text-label-14">Horizontal Separators</h4>
        <div className="space-y-2">
          <p className="text-copy-14">Content above separator</p>
          <Separator orientation="horizontal" />
          <p className="text-copy-14">Content below separator</p>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-label-14">Vertical Separators</h4>
        <div className="flex h-6 items-center space-x-2">
          <span className="text-copy-14">Left</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Center</span>
          <Separator orientation="vertical" />
          <span className="text-copy-14">Right</span>
        </div>
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Separator } from "@/components/ui/separator";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">orientation</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal" | "vertical"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visual separator orientation.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal"</td></tr></tbody></table>

## Best Practices

- Use Separator to divide content into visually distinct groups, like between sections of a list or menu items.
- Horizontal separators span the full width of their container; vertical ones fill the available height of a flex row.
- Separators are semantic by default (decorative={false}). Set decorative={true} only for a purely visual rule that assistive technologies should ignore.
- Don’t overuse separators; grouping with white space or a background surface is often enough and reads cleaner.
