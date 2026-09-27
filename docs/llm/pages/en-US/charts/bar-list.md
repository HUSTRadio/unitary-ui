# Bar List

> Route: `/charts/bar-list`

Renders a ranked list where each row carries a proportional bar and value.

[Back to Components](#/components)

# Bar List

bar-list

Renders a ranked list where each row carries a proportional bar and value.

## When to use

- Ranked comparisons that benefit from row context (name + value + link).
- Leaderboards such as page traffic or sources.

## When not to use

- Share-of-total structure — use the donut chart or category bar.
- Continuous trends — use a spark chart.

## Examples

### Default bar list

Page-visit ranking with formatted values.

## Accessibility

- Names and values are plain text; color is decorative only.

## Controlled behavior

Not applicable: Static display component.

## Responsive behavior

- Width adapts; long names truncate with an ellipsis.

## Theme behavior

- Text and bar track colors follow semantic tokens.

## Live Demo

/home

/discover

/checkout

/search

/account

123,456

98,765

76,543

54,321

23,456

```tsx
import { BarList } from "@/components/ui/charts/bar-list";

const pagesData = [
  { name: "/home", value: 123456 },
  { name: "/discover", value: 98765 },
  { name: "/checkout", value: 76543 },
  { name: "/search", value: 54321 },
  { name: "/account", value: 23456 },
];

export function BarListDefault37A8EEC1Example() {
  return (
    <BarList
      data={pagesData}
      color="gray"
      valueFormatter={(value) => Intl.NumberFormat("us").format(value).toString()}
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { BarList } from "@/components/ui/bar-list";
```

Native props: `React.HTMLAttributes<HTMLDivElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ name: string; value: number; href?: string; icon?: React.ElementType; key?: string }[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Ranked entries to render.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Bar color.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gray"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Formats the trailing value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showAnimation</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Animates bars on mount.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sortOrder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"ascending" | "descending" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Sorts entries by value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"descending"</td></tr></tbody></table>

## Best Practices

- Use BarList for ranked comparisons that benefit from row context (name + value + link).
- Provide valueFormatter for units such as currency or percentages.
- Use showAnimation sparingly; static bars read fine and reduce motion cost.
