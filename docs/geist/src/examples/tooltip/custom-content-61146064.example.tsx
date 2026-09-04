import { Tooltip } from "@/components/ui/tooltip";

export function TooltipCustomContent61146064Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="bottom"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="left"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="right"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
