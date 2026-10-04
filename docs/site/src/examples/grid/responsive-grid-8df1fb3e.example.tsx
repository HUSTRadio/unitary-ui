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
