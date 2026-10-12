import { Grid, GridCell, GridSystem } from "@hustradio/unitary-ui";

export function GridSolidCellsE676560CExample() {
  return (
    <GridSystem unstable_useContainer>
      {/* A 跨 2 列 + B..H 共 7 个 = 9 个格位，正好铺满 3×3；
          rows 也必须写 3，否则第 3 行整行没有辅助线。 */}
      <Grid columns={3} rows={3}>
        <GridCell column="1/3" row="1" solid>
          A
        </GridCell>
        <GridCell>B</GridCell>
        <GridCell>C</GridCell>
        <GridCell>D</GridCell>
        <GridCell>E</GridCell>
        <GridCell>F</GridCell>
        <GridCell>G</GridCell>
        <GridCell>H</GridCell>
      </Grid>
    </GridSystem>
  );
}
