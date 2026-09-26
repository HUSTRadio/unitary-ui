import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonWrappingChildrenWithFixedSize94B70C1BExample() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton height={100} width="100%">
        {null}
      </Skeleton>

      <Skeleton height={100} width="100%">
        <Button typeName="button">Not hidden by Skeleton</Button>
      </Skeleton>
    </div>
  );
}
