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
