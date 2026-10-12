import { Progress } from "@hustradio/unitary-ui";

export function ProgressLabelPositionsF2E2D4C4Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Progress value={45} label="left" labelPosition="left" aria-label="Label left" />
      <Progress value={45} label="right" labelPosition="right" aria-label="Label right" />
      <Progress value={45} label="top-left" labelPosition="top-left" aria-label="Label top left" />
      <Progress value={45} label="top-center" labelPosition="top-center" aria-label="Label top center" />
      <Progress value={45} label="top-right" labelPosition="top-right" aria-label="Label top right" />
      <Progress value={45} label="bottom-left" labelPosition="bottom-left" aria-label="Label bottom left" />
      <Progress value={45} label="bottom-center" labelPosition="bottom-center" aria-label="Label bottom center" />
      <Progress value={45} label="bottom-right" labelPosition="bottom-right" aria-label="Label bottom right" />
    </div>
  );
}
