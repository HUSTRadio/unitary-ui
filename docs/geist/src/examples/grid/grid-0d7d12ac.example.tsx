import { Grid, GridSystem } from "@/components/ui/grid";

export function GridGrid0D7D12ACExample() {
  return (
    <GridSystem debug guideWidth={1} unstable_useContainer>
      <Grid columns={5} height="preserve-aspect-ratio" rows={2} />
    </GridSystem>
  );
}
