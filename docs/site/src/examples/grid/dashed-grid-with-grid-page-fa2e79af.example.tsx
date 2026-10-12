import { Grid, GridPage as GridPageFrame, GridSystem } from "@hustradio/unitary-ui";

export function GridDashedGridWithGridPageFA2E79AFExample() {
  return (
    <GridPageFrame>
      <GridSystem dashedGuides unstable_useContainer>
        <Grid columns={4} rows={2} height={140} />
      </GridSystem>
    </GridPageFrame>
  );
}
