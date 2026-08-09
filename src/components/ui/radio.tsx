import * as React from "react";
import { Label as LabelPrimitive, RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Radio — 单选组（对应官方 Radio，docs/geist-markdown-refs/components/radio.md）。
 * 基于 radix-ui RadioGroup，导出 RadioGroup / RadioGroupItem / RadioGroupLabel。
 * 语义：单个多选一（2–6 项）；超过 6 项改用 Select/Combobox，二选一布尔用 Toggle。
 * 圆点 16×16、边框 gray-alpha-400；选中态 border-progress，中心圆点 bg-progress。
 * 颜色消费语义 token（--progress / --gray-alpha / --foreground），零 `dark:` 分支。
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  children?: React.ReactNode;
}) {
  return (
    <label data-slot="radio-item-wrapper" className="flex cursor-pointer items-center gap-2.5">
      <RadioGroupPrimitive.Item
        data-slot="radio-item"
        className={cn(
          "grid size-4 shrink-0 place-content-center rounded-full border border-gray-alpha-400 transition-colors outline-none focus-ring",
          "data-[state=checked]:border-progress",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-indicator"
          className="size-2 rounded-full bg-progress"
        />
      </RadioGroupPrimitive.Item>
      {children ? (
        <span className="text-copy-14 text-foreground">{children}</span>
      ) : null}
    </label>
  );
}

function RadioGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="radio-group-label"
      className={cn("text-label-14 text-foreground", className)}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupLabel };
