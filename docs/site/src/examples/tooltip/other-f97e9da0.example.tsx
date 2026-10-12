import { Tooltip } from "@hustradio/unitary-ui";

export function TooltipOtherF97E9DA0Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
          No tip indicator
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip center={false} text="The Evil Rabbit Jumped over the Fence multiple times.">
          No center text
        </Tooltip>
      </div>
    </div>
  );
}
