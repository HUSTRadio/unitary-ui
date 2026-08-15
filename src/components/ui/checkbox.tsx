import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox — Geist 官方 Checkbox 规范（docs/geist-markdown-refs/components/checkbox.md 实测）。
 * 官方实测：16×16px、圆角 4px、边框 1px gray-700、bg background-100；
 * 勾选态：box bg = 前景色（light #171717 / dark #ededed）+ 背景色对勾；
 * 禁用态：实色灰（light bg #f2f2f2 / border #c9c9c9，dark #1a1a1a / #454545），
 * 禁用勾选 box = gray-600（light #a8a8a8 / dark #878787）。颜色全部消费语义 token。
 * hover 未选中态：box 填充 gray-200（light #f2f2f2），仅未禁用未勾选时生效（G02-CHK-01）。
 * 支持 indeterminate（半选）视觉态：横线图标，由父级部分选中驱动
 * （官方 Best Practices：indeterminate 是视觉态非第三值）。
 * sm=16（官方默认）/ default=18 / lg=20（触控增强变体）。
 */
function Checkbox({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  size?: "sm" | "default" | "lg";
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(
        "group/checkbox relative inline-flex shrink-0 items-center justify-center rounded-[4px] border text-start transition duration-200 outline-none",
        "border-gray-700 bg-background-100 enabled:hover:data-[state=unchecked]:bg-gray-200",
        "focus-ring",
        "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-500",
        "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background disabled:data-[state=checked]:border-gray-600 disabled:data-[state=checked]:bg-gray-600",
        "data-[state=indeterminate]:border-foreground data-[state=indeterminate]:bg-foreground data-[state=indeterminate]:text-background disabled:data-[state=indeterminate]:border-gray-600 disabled:data-[state=indeterminate]:bg-gray-600",
        "data-[size=sm]:size-4 data-[size=default]:size-[18px] data-[size=lg]:size-5",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-transform duration-150 ease-out data-[state=checked]:scale-100 data-[state=indeterminate]:scale-100 data-[state=unchecked]:scale-0"
      >
        <Check
          className="hidden group-data-[state=checked]/checkbox:block group-data-[size=sm]/checkbox:size-3.5 group-data-[size=default]/checkbox:size-3.5 group-data-[size=lg]/checkbox:size-4"
          strokeWidth={2}
          aria-hidden
        />
        <Minus
          className="hidden group-data-[state=indeterminate]/checkbox:block group-data-[size=sm]/checkbox:size-3.5 group-data-[size=default]/checkbox:size-3.5 group-data-[size=lg]/checkbox:size-4"
          strokeWidth={2}
          aria-hidden
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
