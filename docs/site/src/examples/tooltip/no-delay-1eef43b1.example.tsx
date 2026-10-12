import { Tooltip } from "@hustradio/unitary-ui";

export function TooltipNoDelay1EEF43B1Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
