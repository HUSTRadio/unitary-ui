import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Choicebox — 选择卡片（对应官方 Choicebox，docs/geist-markdown-refs/components/choicebox.md 实测）。
 * 基于 radix-ui RadioGroup，导出 Choicebox / ChoiceboxItem / ChoiceboxLabel / ChoiceboxDescription。
 * 整块 tile 即点击与聚焦目标；选中态：官方实测 border #52aeff（亮）/ #0091ff（暗）、
 * 浅蓝填充（blue-100）、文字变蓝 #0068d6、右侧单选圆点。
 * 官方最佳实践：4–6 张以内用 Choicebox，更多改用 Select/Combobox；tile 内不放嵌套按钮/链接。
 */
function Choicebox({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="choicebox"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

const ChoiceboxItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group/choicebox flex min-h-[70px] cursor-pointer items-start gap-3 rounded-[6px] border border-gray-alpha-400 p-3 text-left transition-colors outline-none focus-ring",
      "hover:bg-gray-100",
      "data-[state=checked]:border-[#52aeff] data-[state=checked]:bg-blue-100 data-[state=checked]:text-[#0068d6] dark:data-[state=checked]:border-[#0091ff] dark:data-[state=checked]:text-[#0091ff]",
      "disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-500",
      className,
    )}
    {...props}
  >
    {children}
    {/* 官方选中态右侧单选圆点：外圈 + 选中填充 */}
    <span
      aria-hidden
      className="ml-auto mt-0.5 grid size-4 shrink-0 place-content-center rounded-full border border-gray-700 transition-colors group-data-[state=checked]/choicebox:border-[#52aeff] dark:group-data-[state=checked]/choicebox:border-[#0091ff] group-disabled/choicebox:border-gray-500"
    >
      <span className="size-1.5 rounded-full bg-current opacity-0 transition-opacity group-data-[state=checked]/choicebox:opacity-100" />
    </span>
  </RadioGroupPrimitive.Item>
));
ChoiceboxItem.displayName = RadioGroupPrimitive.Item.displayName;

function ChoiceboxLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("block text-label-14 font-medium", className)} {...props} />;
}

function ChoiceboxDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("mt-0.5 block text-copy-14 text-muted-foreground", className)} {...props} />
  );
}

export { Choicebox, ChoiceboxItem, ChoiceboxLabel, ChoiceboxDescription };
