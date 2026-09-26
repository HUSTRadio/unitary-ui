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
