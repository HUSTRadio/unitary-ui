import * as React from "react";
import { createContext, useCallback, useContext, useId, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

import styles from "./grid.module.css";

/**
 * Grid — official Geist GridSystem API replica (docs/geist-markdown-refs/components/grid.md).
 *
 * Official surface:
 * - GridSystem: debug / guideWidth / dashedGuides / unstable_useContainer
 * - Grid: columns / rows / height / hideGuides — each accepting a number OR a
 *   responsive object ({ xs, sm, smd, md, lg }; the docs contract is { sm, md, lg })
 * - GridCell: column / row (number | "a/b" | responsive object) / solid
 * - GridCross: column / row
 * - GridPage
 *
 * Backward compatibility (kept): Grid accepts the legacy `gap` prop (ignored —
 * spacing comes from the guide system, official G06-GRID-03) and `GridItem`
 * remains exported as a span-based alias of GridCell.
 *
 * Breakpoints (official): xs <=400 / sm 401-600 / smd 601-768 / md 769-960 / lg >=961.
 * Responsive values resolve with the official fallback chains, e.g. smd:
 * smd -> md -> sm.
 */

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

/** @deprecated Legacy column presets; use `number` through `GridColumns`. */
export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
/** @deprecated Spacing comes from the guide system; `Grid.gap` is ignored. */
export type GridGap = "sm" | "md" | "lg";
/** @deprecated Use `GridResponsiveValue<number>`. */
export type GridResponsiveCols = { sm?: GridCols; md?: GridCols; lg?: GridCols };

export type GridBreakpoint = "xs" | "sm" | "smd" | "md" | "lg";
export type GridResponsiveValue<T extends number | string> = Partial<Record<GridBreakpoint, T>>;

export type GridColumns = number | GridResponsiveValue<number>;
export type GridRows = number | GridResponsiveValue<number>;
export type GridHeight =
  | "preserve-aspect-ratio"
  | number
  | GridResponsiveValue<number | "preserve-aspect-ratio">;
export type GridHideGuides = "row" | "column";
export type GridCellPosition = number | string | GridResponsiveValue<number | string>;

export interface GridSystemProps extends React.ComponentProps<"div"> {
  debug?: boolean;
  dashedGuides?: boolean;
  guideWidth?: number;
  /** Experimental container-query layout wrapper. */
  unstable_useContainer?: boolean;
}

export interface GridProps extends React.ComponentProps<"section"> {
  columns?: GridColumns;
  rows?: GridRows;
  height?: GridHeight;
  hideGuides?: GridHideGuides;
  /**
   * @deprecated Official grids have no `gap` prop — spacing comes from the guide
   * system. Kept for backward compatibility; the value is ignored.
   */
  gap?: GridGap;
}

export interface GridCellProps extends React.ComponentProps<"div"> {
  column?: GridCellPosition;
  row?: GridCellPosition;
  solid?: boolean;
}

export interface GridCrossProps extends React.ComponentProps<"div"> {
  column?: number;
  row?: number;
}

export type GridPageProps = React.ComponentProps<"div">;

/** @deprecated Use `GridCell` with an explicit `column` span. */
export interface GridItemProps extends React.ComponentProps<"div"> {
  span?: GridCols;
}

const GRID_BREAKPOINTS: readonly GridBreakpoint[] = ["xs", "sm", "smd", "md", "lg"] as const;

/* ------------------------------------------------------------------ */
/* context                                                             */
/* ------------------------------------------------------------------ */

type GridSystemContextValue = {
  guideWidth?: number;
  dashedGuides?: boolean;
  unstable_useContainer?: boolean;
};

const GridSystemContext = createContext<GridSystemContextValue | null>(null);

type CellPlacement = {
  column?: GridCellPosition;
  row?: GridCellPosition;
  solid?: boolean;
  epoch: number;
};

type RegisteredCell = CellPlacement;

type GridContextValue = {
  registerCell: (id: string, placement: CellPlacement) => void;
  epoch: number;
};

const GridContext = createContext<GridContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function resolveBreakpoint<T extends number | string>(
  value: GridResponsiveValue<T>,
  breakpoint: GridBreakpoint,
): T | undefined {
  switch (breakpoint) {
    case "xs":
      return value.xs ?? value.sm;
    case "sm":
      return value.sm;
    case "smd":
      return value.smd ?? value.md ?? value.sm;
    case "md":
      return value.md ?? value.smd ?? value.sm;
    case "lg":
      return value.lg ?? value.md ?? value.smd ?? value.sm;
  }
}

/** Resolve a responsive value at the given breakpoint (undefined = static grid). */
function resolveCellValue(
  value: GridCellPosition | undefined,
  breakpoint: GridBreakpoint | undefined,
): number | string | undefined {
  if (value == null) return undefined;
  if (typeof value === "object") {
    // static grids resolve through the sm (mobile baseline) chain
    return resolveBreakpoint(value, breakpoint ?? "sm");
  }
  return value;
}

/** Build the CSS variables for the grid section (rows first, then columns, then height). */
function buildGridVars(
  columns: GridColumns,
  rows: GridRows,
  height: GridHeight | undefined,
): Record<string, string | number> {
  const vars: Record<string, string | number> = {};
  applyResponsiveVar(vars, rows, "grid-rows");
  applyResponsiveVar(vars, columns, "grid-columns");

  if (height == null) {
    vars["--sm-height"] = "fit-content";
  } else if (height === "preserve-aspect-ratio") {
    vars["--sm-height"] = "calc(var(--width) / var(--grid-columns) * var(--grid-rows))";
  } else if (typeof height === "number") {
    vars["--sm-height"] = `${height}px`;
  } else {
    for (const breakpoint of GRID_BREAKPOINTS) {
      const value = height[breakpoint];
      if (value == null) continue;
      vars[`--${breakpoint}-height`] =
        value === "preserve-aspect-ratio"
          ? "calc(var(--width) / var(--grid-columns) * var(--grid-rows))"
          : `${value}px`;
    }
  }
  return vars;
}

function applyResponsiveVar(
  vars: Record<string, string | number>,
  value: number | GridResponsiveValue<number>,
  base: string,
): void {
  if (typeof value === "number") {
    vars[`--${base}`] = value;
    return;
  }
  for (const breakpoint of GRID_BREAKPOINTS) {
    const v = value[breakpoint];
    if (v == null) continue;
    vars[`--${breakpoint}-${base}`] = v;
  }
}

/**
 * Parse a single placement value into CSS grid value + span count.
 * Mirrors official SSR output: numbers -> "n / span 1", fractions kept as "a/b".
 */
function parsePlacement(value: number | string): [gridValue: string, span: string | undefined] {
  if (typeof value === "number") {
    return [`${value} / span 1`, "1"];
  }
  const fraction = /^\s*(\d+)\s*\/\s*(-?\d+)\s*$/.exec(value);
  if (fraction) {
    const start = Number(fraction[1]);
    const end = Number(fraction[2]);
    return [value.trim(), String(end - start)];
  }
  const span = /^\s*auto\s*\/\s*span\s+(\d+)\s*$/i.exec(value);
  if (span) {
    return [value.trim(), span[1]];
  }
  return [value.trim(), undefined];
}

/**
 * Official cells write `md` values into the --smd-* slot (the CSS fallback
 * chains --smd -> --md -> --sm then cover both the smd and md breakpoints).
 */
function placementSlot(breakpoint: GridBreakpoint): string {
  return breakpoint === "md" ? "smd" : breakpoint;
}

function forEachPlacementSlot(
  value: GridCellPosition | undefined,
  visit: (slot: string, gridValue: string, span: string | undefined) => void,
): void {
  if (value == null) {
    visit("sm", "auto", "auto");
    return;
  }
  if (typeof value === "number" || typeof value === "string") {
    const [gridValue, span] = parsePlacement(value);
    visit("sm", gridValue, span);
    return;
  }
  for (const breakpoint of GRID_BREAKPOINTS) {
    const v = value[breakpoint];
    if (v == null) continue;
    const [gridValue, span] = parsePlacement(v);
    visit(placementSlot(breakpoint), gridValue, span);
  }
}

function buildCellVars(
  column: GridCellPosition | undefined,
  row: GridCellPosition | undefined,
): Record<string, string> {
  // official SSR order: grid rows, grid columns, then span counts
  const gridVars: Record<string, string> = {};
  const spanVars: Record<string, string> = {};
  forEachPlacementSlot(row, (slot, gridValue, span) => {
    gridVars[`--${slot}-grid-row`] = gridValue;
    if (span != null) spanVars[`--${slot}-cell-rows`] = span;
  });
  forEachPlacementSlot(column, (slot, gridValue, span) => {
    gridVars[`--${slot}-grid-column`] = gridValue;
    if (span != null) spanVars[`--${slot}-cell-columns`] = span;
  });
  return { ...gridVars, ...spanVars };
}

/** Resolve a cell placement to [startLine, endLine] tracks for guide occlusion. */
function cellSpan(
  value: GridCellPosition | undefined,
  breakpoint: GridBreakpoint | undefined,
): [number, number] | null {
  const resolved = resolveCellValue(value, breakpoint);
  if (typeof resolved === "number") return [resolved, resolved + 1];
  if (typeof resolved === "string") {
    const fraction = /^\s*(\d+)\s*\/\s*(-?\d+)\s*$/.exec(resolved);
    if (fraction) {
      const start = Number(fraction[1]);
      const end = Number(fraction[2]);
      // official occlusion treats the span as |end - start| (matches SSR guide output)
      return [start, start + Math.abs(end - start)];
    }
    const single = /^\s*(\d+)\s*$/.exec(resolved);
    if (single) {
      const start = Number(single[1]);
      return [start, start + 1];
    }
  }
  return null;
}

type SolidCell = { column: [number, number]; row: [number, number] };

function collectSolidCells(
  cells: Map<string, RegisteredCell>,
  epoch: number,
  breakpoint: GridBreakpoint | undefined,
): SolidCell[] {
  const solid: SolidCell[] = [];
  for (const cell of cells.values()) {
    if (cell.epoch !== epoch || !cell.solid) continue;
    const column = cellSpan(cell.column, breakpoint);
    const row = cellSpan(cell.row, breakpoint);
    if (column && row) solid.push({ column, row });
  }
  return solid;
}

function isOccludedRight(solidCells: SolidCell[], x: number, y: number): boolean {
  // the guide's right border sits on line x+1 across row track y
  return solidCells.some(
    (cell) =>
      cell.column[0] < x + 1 && x + 1 < cell.column[1] && cell.row[0] <= y && y + 1 <= cell.row[1],
  );
}

function isOccludedBottom(solidCells: SolidCell[], x: number, y: number): boolean {
  // the guide's bottom border sits on line y+1 across column track x
  return solidCells.some(
    (cell) =>
      cell.row[0] < y + 1 && y + 1 < cell.row[1] && cell.column[0] <= x && x + 1 <= cell.column[1],
  );
}

type GuideSpec = {
  x: number;
  y: number;
  rightHidden: boolean;
  bottomHidden: boolean;
  breakpoint: GridBreakpoint | undefined;
};

function buildGuides(
  columns: GridColumns,
  rows: GridRows,
  hideGuides: GridHideGuides | undefined,
  cells: Map<string, RegisteredCell>,
  epoch: number,
): GuideSpec[] {
  const responsive = typeof columns === "object" || typeof rows === "object";
  const layers: Array<{ breakpoint: GridBreakpoint | undefined; columns: number; rows: number }> =
    [];

  if (responsive) {
    for (const breakpoint of GRID_BREAKPOINTS) {
      const cols = typeof columns === "object" ? resolveBreakpoint(columns, breakpoint) : columns;
      const rowCount = typeof rows === "object" ? resolveBreakpoint(rows, breakpoint) : rows;
      if (cols != null && rowCount != null) {
        layers.push({ breakpoint, columns: cols, rows: rowCount });
      }
    }
  } else {
    layers.push({ breakpoint: undefined, columns, rows });
  }

  const specs: GuideSpec[] = [];
  for (const layer of layers) {
    const solidCells = collectSolidCells(cells, epoch, layer.breakpoint);
    for (let y = 1; y <= layer.rows; y += 1) {
      for (let x = 1; x <= layer.columns; x += 1) {
        const rightHidden =
          hideGuides === "column" || x === layer.columns || isOccludedRight(solidCells, x, y);
        const bottomHidden =
          hideGuides === "row" || y === layer.rows || isOccludedBottom(solidCells, x, y);
        specs.push({ x, y, rightHidden, bottomHidden, breakpoint: layer.breakpoint });
      }
    }
  }
  return specs;
}

/* ------------------------------------------------------------------ */
/* components                                                          */
/* ------------------------------------------------------------------ */

/**
 * GridSystem — provides the guide overlay system. All Grid/GridCell/GridCross
 * components must live inside it (Grid alone also works standalone).
 */
function GridSystem({
  className,
  children,
  debug = false,
  dashedGuides = false,
  guideWidth,
  unstable_useContainer = false,
  ...props
}: GridSystemProps) {
  const contextValue = useMemo(
    () => ({ guideWidth, dashedGuides, unstable_useContainer }),
    [guideWidth, dashedGuides, unstable_useContainer],
  );
  const style =
    guideWidth != null
      ? ({ "--guide-width": `${guideWidth}px` } as React.CSSProperties)
      : undefined;

  const system = (
    <div
      data-slot="grid-system"
      className={cn(
        styles.gridSystem,
        debug && styles.systemDebug,
        dashedGuides && styles.systemDashed,
        className,
      )}
      style={style}
      {...props}
    >
      <GridSystemContext.Provider value={contextValue}>{children}</GridSystemContext.Provider>
      <div aria-hidden="true" className={styles.gridSystemLazyContent} />
      {debug && <div aria-hidden="true" className={styles.systemDebugOverlay} />}
    </div>
  );

  if (!unstable_useContainer) return system;

  return (
    <div data-slot="grid-system-wrapper" className={styles.unstableGridSystemWrapper}>
      {system}
    </div>
  );
}

/**
 * Grid — a cell-and-guide layout surface.
 * columns/rows: number or responsive object; height: "preserve-aspect-ratio" | number;
 * hideGuides: "row" | "column". Spacing comes from the guide system, not CSS gap.
 */
function Grid({
  className,
  children,
  columns = 4,
  rows = 1,
  height,
  hideGuides,
  gap: _gap,
  ...props
}: GridProps) {
  const system = useContext(GridSystemContext);
  const epochRef = useRef(0);
  epochRef.current += 1;
  const cellsRef = useRef<Map<string, RegisteredCell>>(new Map());
  const epoch = epochRef.current;

  const registerCell = useCallback((id: string, placement: CellPlacement) => {
    cellsRef.current.set(id, placement);
  }, []);

  const contextValue = useMemo(() => ({ registerCell, epoch }), [registerCell, epoch]);

  const style = {
    ...buildGridVars(columns, rows, height),
    "--guide-width": `${system?.guideWidth ?? 1}px`,
  } as React.CSSProperties;

  return (
    <GridContext.Provider value={contextValue}>
      <section
        data-grid=""
        data-slot="grid"
        className={cn(styles.grid, system?.unstable_useContainer && styles.useContainer, className)}
        style={style}
        {...props}
      >
        {children}
        <GridGuides
          columns={columns}
          rows={rows}
          hideGuides={hideGuides}
          dashedGuides={system?.dashedGuides ?? false}
          cellsRef={cellsRef}
          epoch={epoch}
        />
      </section>
    </GridContext.Provider>
  );
}

/**
 * Renders the decorative guide lines. Must be the last child of the grid
 * section: cells register their placement during render (via context), so by
 * the time this component renders, the registry is complete. Solid cells
 * occlude the guide borders they strictly overlap.
 */
function GridGuides({
  columns,
  rows,
  hideGuides,
  dashedGuides,
  cellsRef,
  epoch,
}: {
  columns: GridColumns;
  rows: GridRows;
  hideGuides: GridHideGuides | undefined;
  dashedGuides: boolean;
  cellsRef: React.RefObject<Map<string, RegisteredCell>>;
  epoch: number;
}) {
  const specs = buildGuides(columns, rows, hideGuides, cellsRef.current, epoch);

  return (
    <div aria-hidden="true" className={styles.guides} data-grid-guides="true">
      {specs.map((guide, index) => {
        const guideStyle = { "--x": guide.x, "--y": guide.y } as React.CSSProperties;
        if (guide.rightHidden) guideStyle.borderRight = "none";
        if (guide.bottomHidden) guideStyle.borderBottom = "none";
        return (
          <div
            key={index}
            aria-hidden="true"
            className={cn(
              styles.guide,
              guide.breakpoint && styles[`${guide.breakpoint}Guide`],
              dashedGuides && styles.dashedGuide,
            )}
            style={guideStyle}
          />
        );
      })}
    </div>
  );
}

/**
 * GridCell — a cell of the grid. column/row accept a number, a "a/b" fraction
 * (start/end grid lines), or a responsive object. `solid` occludes the guides
 * the cell overlaps (their borders are removed; debug mode shows them dashed).
 */
function GridCell({ className, children, column, row, solid = false, ...props }: GridCellProps) {
  const grid = useContext(GridContext);
  const id = useId();

  if (grid) {
    grid.registerCell(id, { column, row, solid, epoch: grid.epoch });
  }

  return (
    <div
      data-grid-cell=""
      data-slot="grid-cell"
      className={cn(styles.block, className)}
      style={buildCellVars(column, row) as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

/** GridCross — a corner marker at the given grid line intersection. */
function GridCross({ className, column, row, ...props }: GridCrossProps) {
  return (
    <div
      data-grid-cross=""
      data-slot="grid-cross"
      aria-hidden="true"
      className={cn(styles.cross, className)}
      style={{ "--cross-row": row, "--cross-column": column } as React.CSSProperties}
      {...props}
    >
      <div
        className={styles.crossLine}
        style={
          {
            width: "var(--cross-half-size)",
            height: "var(--cross-size)",
            borderRightWidth: "var(--guide-width)",
          } as React.CSSProperties
        }
      />
      <div
        className={styles.crossLine}
        style={
          {
            width: "var(--cross-size)",
            height: "var(--cross-half-size)",
            borderBottomWidth: "var(--guide-width)",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/** GridPage — page-level wrapper that centers its grid system content. */
function GridPage({ className, children, ...props }: GridPageProps) {
  return (
    <div data-slot="grid-page" className={cn(styles.page, className)} {...props}>
      <div className={styles.gridSystemContentWrapper}>{children}</div>
    </div>
  );
}

/**
 * @deprecated Use `GridCell` with an explicit `column` span.
 * GridItem — legacy component, kept for backward compatibility.
 * Maps the old `span` prop onto an auto-placed GridCell column span.
 */
function GridItem({ className, span, ...props }: GridItemProps) {
  return (
    <GridCell
      data-slot="grid-item"
      column={span != null ? `auto / span ${span}` : undefined}
      className={className}
      {...props}
    />
  );
}

export { Grid, GridCell, GridCross, GridItem, GridPage, GridSystem };
