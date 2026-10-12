import { Button } from "@hustradio/unitary-ui";
import { Skeleton } from "@hustradio/unitary-ui";

export function SkeletonButton707EAB0CExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Without button prop (default):</p>
        <Skeleton height={32} width={120}>
          <Button typeName="button">Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">With button prop (extends animation by 1px):</p>
        <Skeleton button height={32} width={120}>
          <Button typeName="button">Loading...</Button>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-14">Multiple buttons loading:</p>
        <div className="flex gap-3">
          <Skeleton button>
            <Button typeName="button">Save</Button>
          </Skeleton>
          <Skeleton button>
            <Button type="secondary" typeName="button">Cancel</Button>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
