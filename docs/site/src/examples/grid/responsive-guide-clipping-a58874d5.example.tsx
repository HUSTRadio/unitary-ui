import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGuideClippingA58874D5Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* rows 要给“该断点下内容实际占用的行数”，否则辅助线只画到一半、底部几行没有网格线：
          sm 1 列 → Feature 占 2 行 + 其余 6 格各 1 行 = 8；md 2 列 → 4；lg 4 列 → 2。 */}
      <Grid columns={{ sm: 1, md: 2, lg: 4 }} rows={{ sm: 8, md: 4, lg: 2 }}>
        <GridCell column={{ sm: "1", md: "1/3", lg: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
          Feature
        </GridCell>
        {/* 编号按“格位”算：Feature 占了前两个格位（1、2），所以其余从 3 起，
            与 specific-clipping 的 1 + 2 / 3 / 4 / 5 + 6 同一套规则。 */}
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
        <GridCell>7</GridCell>
        <GridCell>8</GridCell>
      </Grid>
    </GridSystem>
  );
}
