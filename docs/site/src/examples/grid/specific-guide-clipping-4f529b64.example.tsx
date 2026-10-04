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
