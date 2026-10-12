import { Grid, GridCell, GridSystem } from "@hustradio/unitary-ui";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* 必须显式给 height：不给 height 时行高是 auto，跨行单元格的内容高度
          会被均摊到它跨越的每一行（约 52px），小于单元格的 cell-padding(40px)，
          文字就被 padding-top 顶到行线上。
          315 / 3 行 = 105px，与本页其它示例的自动行高（cell-padding×2 + 文本行高）
          一致；行高一致，标签才会像其它示例那样落在所在行的垂直中部。 */}
      <Grid columns={4} rows={3} height={315}>
        <GridCell column="1/3" row="1/3">A</GridCell>
        <GridCell column="2/5" row="2/4">B</GridCell>
      </Grid>
    </GridSystem>
  );
}
