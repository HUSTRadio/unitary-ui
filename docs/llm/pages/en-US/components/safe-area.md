# Safe Area

> Route: `/components/safe-area`

A spacing container that keeps content clear of device safe areas.

[Back to Components](#/components)

# Safe Area

Safe Area

A spacing container that keeps content clear of device safe areas.

## When to use

- When content must stay clear of rounded corners, notches, or system bars.
- When a page needs one consistent minimum inset on all sides.

## When not to use

- For grid or multi-column layout — use Grid.
- For scrolling or snapping behavior — use Scroller.

## Examples

### Default safe area

Safe-area padding on the top and bottom edges keeps content clear of system bars.

## Accessibility

Not applicable: A pure layout container: no interaction and no ARIA role; accessibility comes from its content.

## Controlled behavior

Not applicable: Stateless — it only emits padding and holds no state of its own.

## Responsive behavior

- Padding takes the larger of the spacing step and the device safe area, so it follows rotation and system bar changes.
- Edges are opt-in: apply the safe area only where it is needed, such as top and bottom.

## Theme behavior

Not applicable: It only emits padding and consumes no color tokens, so it does not vary by theme.

## Live Demo

Content stays clear of rounded corners, notches, and system bars.

```tsx
import { SafeArea } from "@/components/ui/layout";

/**
 * SafeArea —— 安全区边距容器：内边距取「间距档」与设备安全区 env() 的较大值，
 * 内容因此不会被圆角、刘海或系统栏遮挡。
 */
export function SafeAreaDefault2C9F5A41Example() {
  return (
    <SafeArea
      edges={["top", "bottom"]}
      padding="md"
      className="w-full rounded-lg bg-gray-alpha-100"
    >
      <div className="rounded-md bg-background p-3 text-copy-13 text-gray-1000">
        Content stays clear of rounded corners, notches, and system bars.
      </div>
    </SafeArea>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { SafeArea } from "@/components/ui/safe-area";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">edges</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SafeAreaEdge | readonly SafeAreaEdge[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Edges that receive safe-area padding; "all" covers every side.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">padding</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayoutSpacing</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Spacing step used as the minimum inset, compared against env(safe-area-inset-*).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr></tbody></table>
