import { Grid, GridCell, GridCross, GridSystem } from "@hustradio/unitary-ui";

export function GridGridWithCross6A783E1BExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 标上该网格的全部交点：4 条列线（columns+1）× 3 条行线（rows+1）= 12 个。
            十字以交点为中心跨骑网格线（inset 为负），最外圈的会探出网格盒，
            由 docs-local-scroll 的 padding 留出可见空间。 */}
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
