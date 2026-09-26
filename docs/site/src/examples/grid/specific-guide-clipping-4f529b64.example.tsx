import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSpecificGuideClipping4F529B64Example() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={4}>
        <GridCell column="1/2" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="3/4" row="1/2" solid>
          2
        </GridCell>
        <GridCell column="2/3" row="2/4">
          3
        </GridCell>
        <GridCell column="1/2" row="4/5" solid>
          4
        </GridCell>
        <GridCell column="3/4" row="3/5" solid>
          5
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
