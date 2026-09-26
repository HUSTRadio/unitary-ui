import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Grid, GridCell, GridCross, GridPage, GridSystem } from "../src/components/ui/grid";

const countGuides = (markup: string): number => (markup.match(/--x:/g) ?? []).length;

describe("G06-GRID-01: official Grid API surface", () => {
  it("renders GridSystem with guideWidth and container wrapper", () => {
    const markup = renderToStaticMarkup(
      <GridSystem guideWidth={2} unstable_useContainer>
        <Grid columns={3} rows={2} />
      </GridSystem>,
    );

    // container wrapper (unstable_useContainer)
    expect(markup).toContain('data-slot="grid-system-wrapper"');
    // guide width on the system
    expect(markup).toContain('data-slot="grid-system"');
    expect(markup).toContain("--guide-width:2px");
  });

  it("enables debug mode with systemDebug class and overlay", () => {
    const markup = renderToStaticMarkup(
      <GridSystem debug>
        <Grid columns={3} rows={2} />
      </GridSystem>,
    );

    expect(markup).toMatch(/class="[^"]*systemDebug[^"]*"/);
    expect(markup).toContain('data-slot="grid-system"');
  });

  it("enables dashedGuides with systemDashed class", () => {
    const markup = renderToStaticMarkup(
      <GridSystem dashedGuides>
        <Grid columns={3} rows={2} />
      </GridSystem>,
    );

    expect(markup).toMatch(/class="[^"]*systemDashed[^"]*"/);
  });

  it("renders Grid as a data-grid section with columns/rows vars", () => {
    const markup = renderToStaticMarkup(
      <GridSystem guideWidth={1} unstable_useContainer>
        <Grid columns={5} rows={2} />
      </GridSystem>,
    );

    expect(markup).toContain('data-grid=""');
    expect(markup).toContain("--grid-columns:5");
    expect(markup).toContain("--grid-rows:2");
    // 5 x 2 = 10 guide lines
    expect(countGuides(markup)).toBe(10);
    // last column/row guide carries both outer-edge removals
    expect(markup).toContain("--x:5;--y:2;border-right:none;border-bottom:none");
  });

  it("renders GridCell with placement vars", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} rows={2}>
          <GridCell column="1/3" row="1" solid>
            1 + 2
          </GridCell>
          <GridCell>3</GridCell>
        </Grid>
      </GridSystem>,
    );

    expect(markup).toContain('data-grid-cell=""');
    expect(markup).toContain("--sm-grid-column:1/3");
    expect(markup).toContain("--sm-grid-row:1");
    expect(markup).toContain("--sm-cell-columns:2");
    // auto cell
    expect(markup).toContain("--sm-grid-row:auto;--sm-grid-column:auto");
  });

  it("renders GridCross markers and GridPage wrapper", () => {
    const markup = renderToStaticMarkup(
      <GridPage>
        <GridSystem>
          <Grid columns={3} rows={2}>
            <GridCross column={1} row={1} />
            <GridCell>1</GridCell>
          </Grid>
        </GridSystem>
      </GridPage>,
    );

    expect(markup).toContain('data-slot="grid-page"');
    expect(markup).toContain('data-grid-cross=""');
    expect(markup).toContain("--cross-row:1;--cross-column:1");
    expect(markup).toContain("width:var(--cross-half-size);height:var(--cross-size)");
    expect(markup).toContain("width:var(--cross-size);height:var(--cross-half-size)");
  });
});

describe("G06-GRID-02: responsive reflow", () => {
  it("emits per-breakpoint columns/rows vars for {{sm, md, lg}} objects", () => {
    const markup = renderToStaticMarkup(
      <GridSystem unstable_useContainer>
        <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
          <GridCell>1</GridCell>
          <GridCell>2</GridCell>
          <GridCell>3</GridCell>
          <GridCell>4</GridCell>
          <GridCell>5</GridCell>
          <GridCell>6</GridCell>
        </Grid>
      </GridSystem>,
    );

    // official variable contract: sm -> --sm-*, md -> --md-*, lg -> --lg-*
    expect(markup).toContain("--sm-grid-columns:1");
    expect(markup).toContain("--md-grid-columns:2");
    expect(markup).toContain("--lg-grid-columns:3");
    expect(markup).toContain("--sm-grid-rows:6");
    expect(markup).toContain("--md-grid-rows:3");
    expect(markup).toContain("--lg-grid-rows:2");
    // default height
    expect(markup).toContain("--sm-height:fit-content");
  });

  it("renders a guide set per breakpoint (3 cols @lg / 2 cols @md / 1 col @sm)", () => {
    const markup = renderToStaticMarkup(
      <GridSystem unstable_useContainer>
        <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }} />
      </GridSystem>,
    );

    // xs: 1x6=6, sm: 1x6=6, smd: 2x3=6, md: 2x3=6, lg: 3x2=6
    expect(countGuides(markup)).toBe(30);
    // breakpoint classes present so CSS shows exactly one set per breakpoint
    // (CSS-module class names use `_` separators, so no \b anchors)
    expect(markup).toMatch(/class="[^"]*xsGuide[^"]*"/);
    expect(markup).toMatch(/class="[^"]*smGuide[^"]*"/);
    expect(markup).toMatch(/class="[^"]*smdGuide[^"]*"/);
    expect(markup).toMatch(/class="[^"]*mdGuide[^"]*"/);
    expect(markup).toMatch(/class="[^"]*lgGuide[^"]*"/);
  });

  it("keeps static grids static across breakpoints (inline --grid-* wins)", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} rows={2} />
      </GridSystem>,
    );

    expect(countGuides(markup)).toBe(6);
    expect(markup).toContain("--grid-columns:3");
    expect(markup).toContain("--grid-rows:2");
  });
});

describe("G06-GRID-03: spacing comes from guides, not CSS gap", () => {
  it("renders no gap utility classes", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} rows={2}>
          <GridCell>1</GridCell>
          <GridCell>2</GridCell>
        </Grid>
      </GridSystem>,
    );

    expect(markup).not.toMatch(/class="[^"]*gap-[^"]*"/);
  });

});

describe("G06-GRID-04: rows prop", () => {
  it("accepts a number and renders row guides", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} rows={4} />
      </GridSystem>,
    );

    expect(markup).toContain("--grid-rows:4");
    expect(countGuides(markup)).toBe(12);
  });

  it("accepts a responsive object", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} rows={{ sm: 6, md: 3, lg: 2 }} />
      </GridSystem>,
    );

    expect(markup).toContain("--sm-grid-rows:6");
    expect(markup).toContain("--md-grid-rows:3");
    expect(markup).toContain("--lg-grid-rows:2");
  });
});

describe("Grid height and hideGuides", () => {
  it("preserves aspect ratio via --sm-height calc", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={12} height="preserve-aspect-ratio" rows={3} />
      </GridSystem>,
    );

    expect(markup).toContain(
      "--sm-height:calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
    );
  });

  it('hides row guides when hideGuides="row"', () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} hideGuides="row" rows={2} />
      </GridSystem>,
    );

    const guideStyles = markup.match(/--x:\d+;--y:\d+[^"]*/g) ?? [];
    expect(guideStyles.length).toBe(6);
    for (const style of guideStyles) {
      expect(style).toContain("border-bottom:none");
    }
  });

  it('hides column guides when hideGuides="column"', () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={3} hideGuides="column" rows={2} />
      </GridSystem>,
    );

    const guideStyles = markup.match(/--x:\d+;--y:\d+[^"]*/g) ?? [];
    expect(guideStyles.length).toBe(6);
    for (const style of guideStyles) {
      expect(style).toContain("border-right:none");
    }
  });
});

describe("GridCell solid guide occlusion", () => {
  it("removes guide borders strictly inside a solid cell span", () => {
    const markup = renderToStaticMarkup(
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
      </GridSystem>,
    );

    // official solid-cells demo geometry
    expect(markup).toContain('style="--x:1;--y:1;border-right:none"');
    expect(markup).toContain('style="--x:2;--y:2;border-right:none;border-bottom:none"');
    // border on the solid cell's end line stays (not strictly inside)
    expect(markup).toContain('style="--x:2;--y:1"');
    expect(markup).not.toContain('style="--x:2;--y:1;border-right:none"');
  });

  it("supports responsive cell placement with guide clipping", () => {
    const markup = renderToStaticMarkup(
      <GridSystem unstable_useContainer>
        <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
          <GridCell column={{ sm: "1", md: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
            1 + 2
          </GridCell>
        </Grid>
      </GridSystem>,
    );

    expect(markup).toContain("--sm-grid-column:1");
    expect(markup).toContain("--smd-grid-column:1/3");
    expect(markup).toContain("--sm-grid-row:1/3");
    expect(markup).toContain("--smd-grid-row:1 / span 1");
    expect(markup).toContain("--smd-cell-columns:2");
    expect(markup).toContain("--smd-cell-rows:1");
  });
});

describe("span-based grid cells", () => {
  it("renders GridCell spans with the official custom properties", () => {
    const markup = renderToStaticMarkup(
      <GridSystem>
        <Grid columns={12} rows={2}>
          <GridCell column="auto / span 6">span 6</GridCell>
          <GridCell column="auto / span 6">span 6</GridCell>
        </Grid>
      </GridSystem>,
    );

    expect(markup).toContain('data-slot="grid-cell"');
    expect(markup).toContain("--sm-grid-column:auto / span 6");
    expect(markup).toContain("--sm-cell-columns:6");
  });

  it("supports the standalone Grid usage (no GridSystem)", () => {
    const markup = renderToStaticMarkup(
      <Grid columns={3}>
        <div>1</div>
        <div>2</div>
      </Grid>,
    );

    expect(markup).toContain('data-grid=""');
    expect(markup).toContain("--grid-columns:3");
  });
});

describe("G06-GRID-06: decorative semantics", () => {
  it("marks the GridCross root node as aria-hidden", () => {
    const markup = renderToStaticMarkup(<GridCross column={1} row={1} />);
    const rootTag = markup.match(/<div[^>]*data-grid-cross[^>]*>/)?.[0] ?? "";

    expect(rootTag).not.toBe("");
    expect(rootTag).toContain('aria-hidden="true"');
  });
});
