import { Tooltip } from "@/components/ui/tooltip";

export function TooltipBoxAlign42ACE5E0Example() {
  return (
    <>
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom/Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom/Center</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom/Right</span>
        </Tooltip>
      </div>
    </div>
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="left" position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left/Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left/Center</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="right" position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left/Right</span>
        </Tooltip>
      </div>
    </div>
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="left" position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right/Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right/Center</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip boxAlign="right" position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right/Right</span>
        </Tooltip>
      </div>
    </div>
    </>
  );
}
