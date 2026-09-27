import { Progress } from "@/components/ui/progress";

export function ProgressThemed489AC184Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress type="success" value={100} aria-label="Success progress" />
      <Progress type="error" value={10} aria-label="Error progress" />
      <Progress type="warning" value={40} aria-label="Warning progress" />
      <Progress type="secondary" value={70} aria-label="Secondary progress" />
    </div>
  );
}
