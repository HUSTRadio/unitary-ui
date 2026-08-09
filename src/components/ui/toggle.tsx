import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Toggle — Geist 布尔开关（对应官方 Toggle，docs/geist-markdown-refs/components/toggle.md）。
 * 官方当前实测（2026-08-08 浏览器 computed style，官方页面 /geist/toggle）：
 * - 轨道：lg 40×24 / md 36×20 / sm 28×14，圆角 14px，on 态 bg 主色、off 态灰
 * - 圆钮：lg 21px / md 17px / sm 11px，absolute left-[1.5px] + top-1/2 -translate-y-1/2
 * - checked 位移：lg/md 16px / sm 14px（边距恒 1.5px：left + 位移 + thumb = 轨道宽 - 1.5）
 * - 边距 1.5px 而非 2px：2px 在 125% DPI 下 = 2.5px 撞亚像素 .5，
 *   上下取整方向不同导致圆钮视觉歪斜；1.5px × 1.25 = 1.875px 不撞 .5，
 *   光栅化取整对称，任意 DPI 下视觉均匀。
 * 官方语义：Toggle = 单个布尔设置（ON 立即生效）；2–3 个互斥视图用
 * Switch（分段控件，本项目为 SegmentedControl）。
 * 颜色消费语义 token（--progress / --input / --foreground 随主题切换），
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
        "peer group/toggle relative inline-block shrink-0 cursor-pointer rounded-[14px] transition-colors outline-none focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-9 data-[state=checked]:bg-progress data-[state=unchecked]:bg-[var(--gray-200)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-thumb"
        className={cn(
          "pointer-events-none absolute left-[1.5px] top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-[var(--toggle-thumb)] text-foreground ring-0 transition-transform group-data-[size=default]/toggle:size-[21px] group-data-[size=sm]/toggle:size-[17px] data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          thumbClassName,
        )}
      >
        {children}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Toggle };
