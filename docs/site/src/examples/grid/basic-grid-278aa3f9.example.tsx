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
