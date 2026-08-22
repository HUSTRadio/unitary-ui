import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Separator — 水平 / 垂直分隔线（Radix Separator）。
 * horizontal: h-px w-full；vertical: w-px h-full。
 * 颜色消费语义 token bg-gray-200（light #ebebeb / dark #1f1f1f）。
 */
export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  orientation?: "horizontal" | "vertical";
};

function Separator({
  className,
  orientation = "horizontal",
  decorative = false,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-gray-200",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
