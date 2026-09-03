import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3}>
        <GridCell column="1/3" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="2/4" row="2/4">
          2
        </GridCell>
        <GridCell column="3/10" row="2/4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis
        </GridCell>
        <GridCell column="7/12" row="1/-1" solid>
          3
        </GridCell>
        <GridCell column="11/13" row="1/3" solid>
          4
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
