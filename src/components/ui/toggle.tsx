import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Toggle — Geist 布尔开关（对应官方 Toggle，docs/geist-markdown-refs/components/toggle.md）。
 * 原生 <input type="checkbox"> + sr-only + peer + 轨道/圆钮（结构对齐官方，非 Radix button[role=switch]）。
 *
 * 官方 API：checked（受控）/ onChange（无参数）/ aria-label / size / color / disabled。
 * 官方语义：Toggle = 单个布尔设置（ON 立即生效）；2–3 个互斥视图用 Switch（分段控件）。
 *
 * 官方实测几何（2026-08-08 computed + bbox，Light/Dark 一致）：
 * - 轨道：small 28×14 / medium 36×20 / large 40×24，圆角 14px；checked 蓝/琥珀/红，unchecked 灰
 * - 圆钮：10 / 16 / 20px（依用户视觉反馈较官方值收紧 1px），absolute left-[1.5px] top-1/2 -translate-y-1/2，
 *   checked 位移 15 / 17 / 17px；两端仍保留 1.5px 等距留白
 * - 边距 1.5px（非 2px，避免 125% DPI 下亚像素 .5 导致圆钮歪斜）
 * - 颜色全部消费语义 token，零 `dark:` 分支（Geist 原则：组件零主题分支）
 */

export type ToggleProps = Omit<
  React.ComponentProps<"input">,
  "type" | "checked" | "onChange" | "size" | "children"
> & {
  checked?: boolean;
  onChange?: () => void;
  size?: "small" | "medium" | "large";
  color?: "blue" | "amber" | "red";
  labelCasing?: "title" | "normal";
  direction?: "ltr" | "rtl";
  icon?: { checked?: React.ReactNode; unchecked?: React.ReactNode };
  thumbClassName?: string;
  children?: React.ReactNode;
};

function Toggle({
  className,
  thumbClassName,
  icon,
  children,
  size = "small",
  color = "blue",
  labelCasing = "title",
  direction = "ltr",
  checked,
  onChange,
  disabled,
  ...props
}: ToggleProps) {
  const control = (
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {/* 轨道 */}
      <span
        aria-hidden
        className={cn(
          "block cursor-pointer rounded-[14px] transition-[background,border-color] duration-(--uni-duration-base) ease-[cubic-bezier(0.4,0,0.2,1)]",
          "bg-gray-400 peer-focus-visible:focus-ring peer-disabled:cursor-not-allowed",
          color === "blue" && "peer-checked:bg-[var(--toggle-checked)]",
          color === "amber" && "peer-checked:bg-warning",
          color === "red" && "peer-checked:bg-[var(--toggle-checked-red)]",
          "peer-disabled:bg-[var(--toggle-disabled-track-unchecked)] peer-disabled:peer-checked:bg-[var(--toggle-disabled-track-checked)]",
          size === "small" && "h-[14px] w-7",
          size === "medium" && "h-5 w-9",
          size === "large" && "h-6 w-10",
          className,
        )}
      />
      {/* 圆钮 */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-[1.5px] block -translate-y-1/2 rounded-full border-gray-400 bg-[var(--toggle-thumb)] shadow-[0_0_3px_-1px_rgba(0,0,0,0.24),0_0_0.5px_rgba(0,0,0,0.16),-0.5px_2px_3px_-2px_rgba(0,0,0,0.36)] transition-transform duration-(--uni-duration-base) ease-[cubic-bezier(0.4,0,0.2,1)]",
          "peer-disabled:border-transparent peer-disabled:shadow-none peer-disabled:bg-[var(--toggle-disabled-thumb-unchecked)] peer-disabled:peer-checked:bg-[var(--toggle-disabled-thumb-checked)]",
          size === "small" && "size-2.5 peer-checked:translate-x-[15px]",
          size === "medium" && "size-4 peer-checked:translate-x-[17px]",
          size === "large" && "size-5 peer-checked:translate-x-[17px]",
          thumbClassName,
        )}
      >
        {icon?.checked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] peer-checked:flex">
            {icon.checked}
          </span>
        ) : null}
        {icon?.unchecked ? (
          <span className="absolute inset-0 hidden items-center justify-center text-[8px] text-[#171717] peer-checked:hidden">
            {icon.unchecked}
          </span>
        ) : null}
      </span>
    </span>
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
