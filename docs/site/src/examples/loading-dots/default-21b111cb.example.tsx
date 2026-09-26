import { LoadingDots } from "@/components/ui/loading-dots";

export function LoadingDotsDefault21B111CBExample() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 flex-initial">
      <LoadingDots size="sm" />
      <LoadingDots size="md" />
      <LoadingDots size="lg" />
    </div>
  );
}
