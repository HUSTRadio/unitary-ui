import { Tooltip } from "@/components/ui/tooltip";

export function TooltipCustomType2E67D6C7Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" type="error">
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence" type="warning">
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence" type="violet">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
