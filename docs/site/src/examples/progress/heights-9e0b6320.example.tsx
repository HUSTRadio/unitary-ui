import { Progress } from "@hustradio/unitary-ui";

export function ProgressHeights9E0B6320Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress value={60} height={4} aria-label="Progress height 4" />
      <Progress value={60} height={10} aria-label="Progress height 10" />
      <Progress value={60} height={50} aria-label="Progress height 50" />
      <Progress value={60} height={200} aria-label="Progress height 200" />
    </div>
  );
}
