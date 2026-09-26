import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/keyboard-input";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipComponentsA150CE22Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <Button size="small" typeName="button">
            Bottom
          </Button>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
          <Badge size="sm">LEFT</Badge>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
          <Spinner />
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          text={
            /* 键帽用 small 档（20px/12px）：tooltip 正文 13px，默认 24px 键帽比例失衡；
               flex + gap-1.5 提供受控间距，ml-0 中和 Kbd 内联流的 ml-0.5，避免双重间隙。 */
            <span className="inline-flex items-center gap-1.5">
              Search
              <Kbd small className="ml-0">
                /
              </Kbd>
            </span>
          }
        >
          <span>Shortcut</span>
        </Tooltip>
      </div>
    </div>
  );
}
