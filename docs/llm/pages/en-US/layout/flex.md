# Flex

> Route: `/layout/flex`

Arrange children horizontally or vertically with consistent spacing and alignment.

# Flex

flex

Arrange children horizontally or vertically with consistent spacing and alignment.

## When to use

- When children line up in a single direction with one consistent gap.
- When spacing should come from design-system steps rather than arbitrary numbers.

## When not to use

- For grids, column widths, or irregular placement — use Grid.
- For scrolling, snapping, or virtualized lists — use Scroller.

## Examples

### Default flex layout

A column stack of two rows: one centered, one justified to the ends.

## Accessibility

Not applicable: A pure layout container: it does not change the semantics or the accessibility tree of its content.

## Controlled behavior

Not applicable: Stateless — direction, gap, and alignment come directly from props.

## Responsive behavior

Not applicable: The direction is fixed and does not change at breakpoints; pass className or breakpoint classes for responsive behavior.

## Theme behavior

Not applicable: It only emits flex and spacing and consumes no color tokens, so it does not vary by theme.

## Live Demo

Row group, centered

LeftRight

```tsx
import { Flex } from "@/components/ui/layout";

/**
 * Flex —— 方向 + 间距堆叠：语义化的 flex 预设，统一间距档，避免随机 gap 值。
 */
export function FlexDefault7E1B84D3Example() {
  return (
    <Flex direction="column" gap="md" className="w-full">
      <Flex direction="row" gap="sm" align="center">
        <span aria-hidden="true" className="size-8 rounded-md bg-gray-alpha-400" />
        <span className="text-copy-13 text-gray-1000">Row group, centered</span>
      </Flex>
      <Flex direction="row" gap="sm" justify="between">
        <span className="text-copy-13 text-gray-1000">Left</span>
        <span className="text-copy-13 text-gray-900">Right</span>
      </Flex>
    </Flex>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Flex } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">direction</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"row" | "column"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Stacking direction.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"column"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayoutSpacing</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Spacing step between children.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"start" | "center" | "end" | "stretch" | "baseline"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Cross-axis alignment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">justify</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"start" | "center" | "end" | "between"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Main-axis distribution.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">wrap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Allows children to wrap onto multiple lines.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
