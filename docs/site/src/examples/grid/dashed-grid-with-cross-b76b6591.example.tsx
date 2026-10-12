import { Grid, GridCell, GridCross, GridSystem } from "@hustradio/unitary-ui";

export function GridDashedGridWithCrossB76B6591Example() {
  return (
    <GridSystem dashedGuides unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 与 Cross 示例对齐：同样标上全部 12 个交点，这里用于对比虚线渲染 */}
        {[1, 2, 3, 4].flatMap((column) =>
          [1, 2, 3].map((row) => (
            <GridCross key={`${column}-${row}`} column={column} row={row} />
          )),
        )}
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
