# Grid

> Route: `/grid`

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

## Basic Auto Flow

Cells without explicit placement flow into the tracks in DOM order.

1

2

3

4

5

6

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

## Responsive Breakpoints

columns and rows accept responsive objects; give values for sm, md, and lg explicitly.

1

2

3

4

5

6

## Responsive Clipping

Cell placement accepts responsive objects too — a solid cell clips the guides of every breakpoint layer it covers.

Feature

3

4

5

6

7

## Hiding Row Guides

hideGuides="row" removes the horizontal guide borders.

## Hiding Column Guides

hideGuides="column" removes the vertical guide borders.

## Overlaying Cells

Cells can share tracks and overlap; stacking follows DOM order.

A

B

## Specific Clipping

Use explicit line ranges ("a/b") to clip exactly the guides under a span.

1 + 2

3

4

5 + 6

## Cross

GridCross marks an intersection of grid lines.

1

2

3

4

5

6

## Dashed Cross

Inside a GridSystem with dashedGuides, crosses render dashed as well.

1

2

3

4

5

6

## Dashed GridPage

GridPage wraps the grid in a page-level background-200 surface and centers it horizontally — with dashedGuides the guides are drawn dashed.
