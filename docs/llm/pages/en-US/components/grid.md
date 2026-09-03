# Grid

> Route: `/components/grid`

Displays elements in a grid layout.

[Back to Components](#/components)

# Grid

Grid

Displays elements in a grid layout.

## When to use

- For two-dimensional cell-and-guide layouts in marketing pages, docs landing pages, and feature breakdowns where the rule lines and cell borders are part of the design.
- When you want to align multiple items without excessive nesting while maintaining visual hierarchy.

## When not to use

- For plain n-column responsive content (cards, lists), use Tailwind grid grid-cols-\* utilities directly; Grid is overkill when guides aren't visible.
- Don't nest Grids more than one level; the guide overlap reads as visual noise and breaks the cell math.

## Examples

### Basic grid

The simplest grid layout example: define rows and columns, elements fill the grid automatically with default guides and spacing.

### Solid cells

Add solid borders to every cell for a stronger partition feel, suitable for data panels where alignment relationships must be very explicit.

### Responsive grid

Automatically adjusts column count and dimensions based on viewport, reducing columns on small screens for readability while maximizing horizontal space on larger views.

### Dashed grid with cross

Combines dashed guide lines with cross-point decorations for an advanced, design-forward structured grid, often used for decorative layouts in technical docs or branded pages.

## Accessibility

Not applicable: Grid is a purely visual layout component without interactive elements or semantic ARIA roles. Accessibility is determined by the actual components placed inside the grid cells (buttons, links, headings, etc.).

## Controlled behavior

Not applicable: As a layout container, Grid manages no internal state or user interaction data. Its behavior is entirely dictated by props passed to child elements (row count, column count, alignment, etc.).

## Responsive behavior

- The Grid component includes built-in responsive breakpoints that automatically adjust column counts and guide visibility across different viewports.
- Row and column guides can be hidden independently to suit specific layout needs; hiding both usually means a plain Tailwind grid is the right tool.

## Theme behavior

- Grid line colors and cell backgrounds are drawn from theme tokens, ensuring proper contrast in both light and dark modes.
- Guide thickness and style (solid, dashed) are adjustable via props and stay consistent with design system tokens.

## Live Demo

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridGrid0D7D12ACExample() {
  return (
    <GridSystem debug guideWidth={1} unstable_useContainer>
      <Grid columns={5} height="preserve-aspect-ratio" rows={2} />
    </GridSystem>
  );
}
```

## Basic grid

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridBasicGrid278AA3F9Example() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## Solid cells

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSolidCellsE676560CExample() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCell column="1/3" row="1" solid>
          1 + 2
        </GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell column="2/4" row="2" solid>
          5 + 6
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Responsive grid

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGrid8DF1FB3EExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## Responsive guide clipping

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGuideClippingA58874D5Example() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
        <GridCell column={{ sm: "1", md: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
          1 + 2
        </GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell column={{ sm: 1, md: "1/3", lg: "2/4" }} row={{ sm: "5/7", md: 3, lg: 2 }} solid>
          5 + 6
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Hidden row guides

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenRowGuides59338B9FExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} height="preserve-aspect-ratio" hideGuides="row" rows={3} />
    </GridSystem>
  );
}
```

## Hidden column guides

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenColumnGuidesE1033A1BExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} height="preserve-aspect-ratio" hideGuides="column" rows={3} />
    </GridSystem>
  );
}
```

## Overlaying cells

1

2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis

3

4

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3}>
        <GridCell column="1/3" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="2/4" row="2/4">
          2
        </GridCell>
        <GridCell column="3/10" row="2/4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis
        </GridCell>
        <GridCell column="7/12" row="1/-1" solid>
          3
        </GridCell>
        <GridCell column="11/13" row="1/3" solid>
          4
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Specific guide clipping

1

2

3

4

5

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSpecificGuideClipping4F529B64Example() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={4}>
        <GridCell column="1/2" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="3/4" row="1/2" solid>
          2
        </GridCell>
        <GridCell column="2/3" row="2/4">
          3
        </GridCell>
        <GridCell column="1/2" row="4/5" solid>
          4
        </GridCell>
        <GridCell column="3/4" row="3/5" solid>
          5
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Grid with cross

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridGridWithCross6A783E1BExample() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCross column={1} row={1} />
        <GridCross column={4} row={1} />
        <GridCross column={4} row={3} />
        <GridCross column={1} row={3} />
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## Dashed grid with cross

Content here

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithCrossB76B6591Example() {
  return (
    <GridSystem dashedGuides guideWidth={1} unstable_useContainer>
      <Grid columns={1} rows={1}>
        <GridCross column={1} row={1} />
        <GridCross column={2} row={2} />
        <GridCross column={2} row={1} />
        <GridCross column={1} row={2} />
        <GridCell>Content here</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Dashed grid with grid page

Content here

```tsx
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithGridPageFA2E79AFExample() {
  return (
    <GridPage>
      <GridSystem dashedGuides guideWidth={1}>
        <Grid columns={1} rows={1}>
          <GridCross column={1} row={1} />
          <GridCross column={2} row={2} />
          <GridCross column={2} row={1} />
          <GridCross column={1} row={2} />
          <GridCell>Content here</GridCell>
        </Grid>
      </GridSystem>
    </GridPage>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Grid, GridCell, GridCross, GridItem, GridPage, GridSystem } from "@/components/ui/grid";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridColumns</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Number of visible guide columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridRows</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Number of visible guide rows.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHeight</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Grid height or responsive aspect-ratio behavior.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">hideGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHideGuides</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Hides row or column guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gap</code><span class="ml-2 text-label-12 text-muted-foreground">Deprecated</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridGap</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Deprecated compatibility prop; guide spacing ignores it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">column</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell column placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">row</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell row placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solid</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a solid GridCell surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">debug</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows GridSystem debug guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dashedGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses dashed GridSystem guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">guideWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Sets the GridSystem guide width.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">unstable_useContainer</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Enables the experimental container-query wrapper.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">span</code><span class="ml-2 text-label-12 text-muted-foreground">Deprecated</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCols</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Deprecated GridItem column span; use GridCell.column.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Grid for two-dimensional cell-and-guide layouts in marketing pages, docs landing pages, and feature breakdowns where the rule lines and cell borders are part of the design.
- For plain n-column responsive content (cards, lists), use Tailwind grid grid-cols-\* utilities directly; Grid is overkill when guides aren't visible.
- Don't nest Grids more than one level; the guide overlap reads as visual noise and breaks the cell math.
- Hide row or column guides only when their absence improves clarity (single-axis layouts, hero rows). Hiding both usually means a plain Tailwind grid is the right tool.
