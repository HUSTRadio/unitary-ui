# Grid

> Route: `/layout/grid`

# Grid

A two-dimensional layout system with guide lines, cells, crosses, and breakpoints.

## Best Practices

- Use Grid when the guide lines themselves are part of the design — a visible two-dimensional layout, not generic spacing.
- For ordinary card lists without guide lines, use a plain CSS or Tailwind grid layout instead.
- Avoid nesting grids more than one level deep.
- Give rows and columns explicitly for all three supported breakpoints (sm, md, lg) so every viewport gets a deliberate layout.
- A solid cell occludes the guide borders it strictly overlaps — debug mode reveals them dashed.
- Hide a single axis of guides (hideGuides="row" or "column") only when it improves readability.
- Interactive semantics live in the cell content — guides, crosses, and pages are purely decorative and hidden from assistive technology.
- Check guide contrast against cell backgrounds in both light and dark themes.

## Empty Guides

A Grid without cells renders only its guide lines. Set height so the empty surface stays visible.

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridGrid0D7D12ACExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={6} rows={3} height={180} />
    </GridSystem>
  );
}
```

## Basic Auto Flow

Cells without explicit placement flow into the tracks in DOM order.

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
    <GridSystem unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Solid Cells

A solid cell paints over its area and hides the guide borders strictly inside its span.

A

B

C

D

E

F

G

H

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSolidCellsE676560CExample() {
  return (
    <GridSystem unstable_useContainer>
      {/* A 跨 2 列 + B..H 共 7 个 = 9 个格位，正好铺满 3×3；
          rows 也必须写 3，否则第 3 行整行没有辅助线。 */}
      <Grid columns={3} rows={3}>
        <GridCell column="1/3" row="1" solid>
          A
        </GridCell>
        <GridCell>B</GridCell>
        <GridCell>C</GridCell>
        <GridCell>D</GridCell>
        <GridCell>E</GridCell>
        <GridCell>F</GridCell>
        <GridCell>G</GridCell>
        <GridCell>H</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Responsive Breakpoints

columns and rows accept responsive objects; give values for sm, md, and lg explicitly.

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
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Responsive Clipping

Cell placement accepts responsive objects too — a solid cell clips the guides of every breakpoint layer it covers.

Feature

3

4

5

6

7

8

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGuideClippingA58874D5Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* rows 要给“该断点下内容实际占用的行数”，否则辅助线只画到一半、底部几行没有网格线：
          sm 1 列 → Feature 占 2 行 + 其余 6 格各 1 行 = 8；md 2 列 → 4；lg 4 列 → 2。 */}
      <Grid columns={{ sm: 1, md: 2, lg: 4 }} rows={{ sm: 8, md: 4, lg: 2 }}>
        <GridCell column={{ sm: "1", md: "1/3", lg: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
          Feature
        </GridCell>
        {/* 编号按“格位”算：Feature 占了前两个格位（1、2），所以其余从 3 起，
            与 specific-clipping 的 1 + 2 / 3 / 4 / 5 + 6 同一套规则。 */}
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
        <GridCell>7</GridCell>
        <GridCell>8</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Hiding Row Guides

hideGuides="row" removes the horizontal guide borders.

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenRowGuides59338B9FExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="row" />
    </GridSystem>
  );
}
```

## Hiding Column Guides

hideGuides="column" removes the vertical guide borders.

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenColumnGuidesE1033A1BExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="column" />
    </GridSystem>
  );
}
```

## Overlaying Cells

Cells can share tracks and overlap; stacking follows DOM order.

A

B

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* 必须显式给 height：不给 height 时行高是 auto，跨行单元格的内容高度
          会被均摊到它跨越的每一行（约 52px），小于单元格的 cell-padding(40px)，
          文字就被 padding-top 顶到行线上。
          315 / 3 行 = 105px，与本页其它示例的自动行高（cell-padding×2 + 文本行高）
          一致；行高一致，标签才会像其它示例那样落在所在行的垂直中部。 */}
      <Grid columns={4} rows={3} height={315}>
        <GridCell column="1/3" row="1/3">
          A
        </GridCell>
        <GridCell column="2/5" row="2/4">
          B
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Specific Clipping

Use explicit line ranges ("a/b") to clip exactly the guides under a span.

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSpecificGuideClipping4F529B64Example() {
  return (
    <GridSystem unstable_useContainer>
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

## Cross

GridCross marks an intersection of grid lines.

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
    <GridSystem unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 标上该网格的全部交点：4 条列线（columns+1）× 3 条行线（rows+1）= 12 个。
            十字以交点为中心跨骑网格线（inset 为负），最外圈的会探出网格盒，
            由 docs-local-scroll 的 padding 留出可见空间。 */}
        {[1, 2, 3, 4].flatMap((column) =>
          [1, 2, 3].map((row) => <GridCross key={`${column}-${row}`} column={column} row={row} />),
        )}
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Dashed Cross

Inside a GridSystem with dashedGuides, crosses render dashed as well.

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithCrossB76B6591Example() {
  return (
    <GridSystem dashedGuides unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 与 Cross 示例对齐：同样标上全部 12 个交点，这里用于对比虚线渲染 */}
        {[1, 2, 3, 4].flatMap((column) =>
          [1, 2, 3].map((row) => <GridCross key={`${column}-${row}`} column={column} row={row} />),
        )}
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## Dashed GridPage

GridPage wraps the grid in a page-level background-200 surface and centers it horizontally — with dashedGuides the guides are drawn dashed.

```tsx
import { Grid, GridPage as GridPageFrame, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithGridPageFA2E79AFExample() {
  return (
    <GridPageFrame>
      <GridSystem dashedGuides unstable_useContainer>
        <Grid columns={4} rows={2} height={140} />
      </GridSystem>
    </GridPageFrame>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridColumns</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Number of visible guide columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridRows</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Number of visible guide rows.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHeight</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Grid height or responsive aspect-ratio behavior.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">hideGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHideGuides</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Hides row or column guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">column</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell column placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">row</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell row placement.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solid</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a solid GridCell surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">debug</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows GridSystem debug guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dashedGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses dashed GridSystem guides.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">guideWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Sets the GridSystem guide width.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">unstable_useContainer</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Enables the experimental container-query wrapper.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
