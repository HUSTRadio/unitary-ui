import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Toggle — Geist 布尔开关（对应官方 Toggle，docs/geist-markdown-refs/components/toggle.md 实测）。
 * 官方实测：default 40×24px / sm 36×20px、圆角 14px、off 态 bg gray-300、
 * on 态 bg 主色；thumb 白圆点（24px 轨 → 20px 圆点，位移 16px）。
 * 官方语义：Toggle = 单个布尔设置（ON 立即生效）；2–3 个互斥视图用
 * Switch（分段控件，本项目为 SegmentedControl）。
 * 颜色消费语义 token（--primary / --input / --foreground 随主题切换），
 * 不引入任何 `dark:` 前缀变体（Geist 原则：组件零主题分支）。
 */
function Toggle({
  className,
  thumbClassName,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
  thumbClassName?: string;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="toggle"
      data-size={size}
      className={cn(
        "peer group/toggle inline-flex shrink-0 items-center rounded-[14px] border border-transparent transition-all outline-none focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-9 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-thumb"
        className={cn(
          "pointer-events-none flex size-full items-center justify-center rounded-full bg-background text-foreground ring-0 transition-transform group-data-[size=default]/toggle:size-5 group-data-[size=sm]/toggle:size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          thumbClassName,
        )}
      >
        {children}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Toggle };
