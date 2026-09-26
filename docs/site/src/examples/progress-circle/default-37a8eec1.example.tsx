import { ProgressCircle } from "@/components/ui/charts/progress-circle";

export function ProgressCircleDefault37A8EEC1Example() {
  return (
    <div className="flex items-center gap-3">
      <ProgressCircle value={75} max={100} radius={40} strokeWidth={6} color="blue">
        <p className="text-copy-14 font-medium text-foreground">75%</p>
      </ProgressCircle>
      <div className="flex flex-col">
        <p className="text-copy-14 font-medium text-foreground">Bandwidth used</p>
        <p className="text-copy-13 text-muted-foreground">375 GB of 500 GB</p>
      </div>
    </div>
  );
}
