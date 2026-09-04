import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonWrappingChildrenC2461A19Example() {
  return (
    <div className="flex flex-col items-start justify-start gap-4 flex-initial">
      <Skeleton>
        <Button typeName="button">Hidden by skeleton</Button>
      </Skeleton>

      <Skeleton show={false}>
        <Button typeName="button">Not hidden by skeleton</Button>
      </Skeleton>
    </div>
  );
}
