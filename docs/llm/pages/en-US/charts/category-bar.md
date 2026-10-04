# Category Bar

> Route: `/charts/category-bar`

Show proportions in a segmented bar, with optional threshold markers and tooltips.

[Back to Charts](#/charts)

# Category Bar

category-bar

Show proportions in a segmented bar, with optional threshold markers and tooltips.

## When to use

- Compact share-of-total context (e.g. inside cards).
- Marking a target or threshold via marker.

## When not to use

- Exact values or rankings — use BarList.
- Slice semantics or a center metric — use the donut chart.

## Examples

### Default category bar

Three segments plus a target marker.

## Accessibility

- Cumulative labels anchor the values; the marker exposes a hover tooltip.

## Controlled behavior

Not applicable: Static display component.

## Responsive behavior

- Width adapts to the parent container.

## Theme behavior

- Segments use palette colors; label text uses semantic tokens.

## Live Demo

0

62

80

100

```tsx
import { CategoryBar } from "@/components/ui/charts/category-bar";

export function CategoryBarDefault37A8EEC1Example() {
  return (
    <CategoryBar
      values={[62, 18, 20]}
      colors={["blue", "cyan", "gray"]}
      marker={{ value: 78, tooltip: "Target: 78%" }}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { CategoryBar } from "@/components/ui/category-bar";
```

Also accepts props defined by: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">values</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Segment values; widths are proportional to the total.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Segment palette order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marker</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ value: number; tooltip?: string; className?: string }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional marker with hover tooltip.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showLabels</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows cumulative value labels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr></tbody></table>

## Best Practices

- Use CategoryBar for compact share-of-total context where a donut would be too heavy.
- Keep values normalized to a meaningful total; the component renders proportional widths.
- Limit to 3-5 segments so each remains visually distinguishable.
