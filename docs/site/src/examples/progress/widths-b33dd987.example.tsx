import { Progress } from "@hustradio/unitary-ui";

export function ProgressWidthsB33DD987Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress value={60} width={100} aria-label="Progress width 100" />
      <Progress value={60} width={200} aria-label="Progress width 200" />
      <Progress value={60} width={300} aria-label="Progress width 300" />
      <Progress value={60} width="50%" aria-label="Progress width 50%" />
      <Progress value={60} width="100%" aria-label="Progress full width" />
    </div>
  );
}
