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
 * Switch（分段控件）。
 * 颜色消费语义 token（--progress / --input / --foreground 随主题切换），
 * 不引入任何 `dark:` 前缀变体（Geist 原则：组件零主题分支）。
 */
function Toggle({
  className,
  thumbClassName,
  icon,
  children,
  size = "small",
  color = "blue",
  labelCasing = "title",
  direction = "ltr",
  ...props
}: Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children"> & {
  size?: "small" | "medium" | "large";
  color?: "blue" | "amber" | "red";
  labelCasing?: "title" | "normal";
  direction?: "ltr" | "rtl";
  icon?: { checked?: React.ReactNode; unchecked?: React.ReactNode };
  thumbClassName?: string;
  children?: React.ReactNode;
}) {
  const control = (
    <SwitchPrimitive.Root
      data-slot="toggle"
      data-size={size}
      className={cn(
        "peer group/toggle relative block shrink-0 cursor-pointer whitespace-nowrap rounded-[14px] transition-[background,border-color] duration-150 ease-out outline-none focus-ring disabled:cursor-not-allowed data-[state=unchecked]:bg-gray-400 disabled:data-[state=unchecked]:bg-[var(--toggle-disabled-track-unchecked)] disabled:data-[state=checked]:bg-[var(--toggle-disabled-track-checked)]",
        color === "blue" && "data-[state=checked]:bg-[var(--toggle-checked)]",
        color === "amber" && "data-[state=checked]:bg-warning data-[state=unchecked]:bg-warning",
        color === "red" &&
          "data-[state=checked]:bg-[var(--toggle-checked-red)] data-[state=unchecked]:bg-[var(--toggle-checked-red)]",
        size === "small" && "h-[14px] w-7",
        size === "medium" && "h-5 w-9",
        size === "large" && "h-6 w-10",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-thumb"
        className={cn(
          "pointer-events-none absolute top-1/2 left-[1.5px] block -translate-y-1/2 whitespace-nowrap rounded-[50%] border-gray-400 bg-[var(--toggle-thumb)] shadow-[0_0_3px_-1px_rgba(0,0,0,0.24),0_0_0.5px_rgba(0,0,0,0.16),-0.5px_2px_3px_-2px_rgba(0,0,0,0.36)] transition-transform data-[state=unchecked]:translate-x-0 data-disabled:border-transparent data-disabled:shadow-none data-disabled:data-[state=unchecked]:bg-[var(--toggle-disabled-thumb-unchecked)] data-disabled:data-[state=checked]:bg-[var(--toggle-disabled-thumb-checked)]",
          size === "small" && "size-[11px] data-[state=checked]:translate-x-[14px]",
          size === "medium" && "size-[17px] data-[state=checked]:translate-x-4",
          size === "large" && "size-[21px] data-[state=checked]:translate-x-4",
          thumbClassName,
        )}
      >
        {icon?.checked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] group-data-[state=checked]/toggle:flex">
            {icon.checked}
          </span>
        ) : null}
        {icon?.unchecked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] group-data-[state=unchecked]/toggle:flex">
            {icon.unchecked}
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );

  if (!children) {
    return (
      <span
        data-slot="toggle-line"
        className={cn(
          "flex items-center",
          size === "small" ? "h-5" : size === "medium" ? "h-[26px]" : "h-[30px]",
        )}
      >
        {control}
      </span>
    );
  }

  return (
    <label
      className={cn(
        "text-toggle-label inline-flex cursor-pointer items-center gap-3 whitespace-nowrap py-[3px] has-[:disabled]:cursor-not-allowed has-[:disabled]:text-gray-700",
        direction === "rtl" && "flex-row-reverse",
      )}
    >
      <span className={labelCasing === "title" ? "capitalize" : undefined}>{children}</span>
      {control}
    </label>
  );
}

export { Toggle };
