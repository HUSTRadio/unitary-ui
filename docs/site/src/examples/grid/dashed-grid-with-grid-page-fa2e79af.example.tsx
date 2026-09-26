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
