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
