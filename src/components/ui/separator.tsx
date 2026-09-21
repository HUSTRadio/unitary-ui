import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Separator — 水平 / 垂直分隔线（Radix Separator）。
 * horizontal: h-px + w-full（默认）/ w-10（length="short"）；
 * vertical: w-px + h-full（默认）/ h-10（length="short"）。
 * 颜色消费语义 token bg-gray-200（light #ebebeb / dark #1f1f1f）。
 * 缩进/留白/着色由调用方通过 className 追加（例如侧栏二级小组那条 40px 短线）。
 */
export type SeparatorLength = "full" | "short";
export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  orientation?: "horizontal" | "vertical";
  /** 长度档位：full 占满可用长度（默认）；short = 40px 短线（密集列表里的分组提示）。 */
  length?: SeparatorLength;
};

function Separator({
  className,
  orientation = "horizontal",
  length = "full",
  decorative = false,
  ...props
}: SeparatorProps) {
  const horizontal = orientation === "horizontal";
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-length={length}
      decorative={decorative}
      orientation={orientation}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-gray-200",
        horizontal ? "h-px" : "w-px",
        horizontal ? (length === "short" ? "w-10" : "w-full") : length === "short" ? "h-10" : "h-full",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
