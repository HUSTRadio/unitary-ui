import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Choicebox — 选择卡片（对应官方 Choicebox，docs/geist-markdown-refs/components/choicebox.md）。
 * 基于 radix-ui RadioGroup，导出 Choicebox / ChoiceboxItem / ChoiceboxLabel / ChoiceboxDescription。
 * 整块 tile 即点击与聚焦目标；选中态用 border-progress 高亮边框 + 可选的角标。
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
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer items-start gap-3 rounded-[8px] border border-gray-alpha-400 p-4 text-left transition-colors outline-none focus-ring",
      "hover:bg-gray-alpha-100",
      "data-[state=checked]:border-progress",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ChoiceboxItem.displayName = RadioGroupPrimitive.Item.displayName;

function ChoiceboxLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("block text-label-14 font-medium text-foreground", className)}
      {...props}
    />
  );
}

function ChoiceboxDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("mt-0.5 block text-copy-13 text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Choicebox, ChoiceboxItem, ChoiceboxLabel, ChoiceboxDescription };
