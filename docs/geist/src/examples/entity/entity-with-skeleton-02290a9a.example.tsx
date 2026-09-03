import { Entity } from "@/components/ui/entity";
import { Skeleton } from "@/components/ui/skeleton";

export function EntityEntityWithSkeleton02290A9AExample() {
  return (
    <Entity>
      <div className="flex flex-col items-stretch justify-start gap-2 flex-1">
        <Skeleton height={20} width="100%" />
        <div className="flex flex-row items-center justify-start gap-2 flex-initial">
          <Skeleton height={20} width={70} />
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={68} />
        </div>
      </div>
    </Entity>
  );
}
