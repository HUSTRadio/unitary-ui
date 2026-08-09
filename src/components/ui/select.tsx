import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Select — Geist 官方 Select（docs/geist-markdown-refs/components/select.md）。
 * 官方形态：**原生 <select> 封装**（<option>/<optgroup> 子元素 + 原生下拉/键盘/表单校验），
 * 无 Radix、无 shadcn 复合子组件。
 * - placeholder：占位文案（渲染为 disabled/hidden 的占位 option）
 * - size：small 32px / 默认 36px / large 40px（large 16px 文字、8px 圆角）
 * - prefix / suffix：左右侧元素（pointer-events-none，输入区按 40px 避让）
 * - error：校验错误文案（红色边框 + 下方提示，danger token）
 * - label：字段标签（Title Case 名词，直接接受在 <Select> 上，渲染为上方 <label>）
 * - 其余 props（value / defaultValue / onChange / required / disabled / name / aria-label）为原生 select 透传
 * 颜色全部消费语义 token（--gray-alpha / --background / --danger / input-focus-ring），零 `dark:` 分支。
 */
interface SelectProps extends Omit<React.ComponentProps<"select">, "size" | "prefix"> {
  /** 占位文案（未选择时显示） */
  placeholder?: string;
  /** small 32px / 默认 36px / large 40px */
  size?: "small" | "large";
  /** 前缀元素（左侧） */
  prefix?: React.ReactNode;
  /** 后缀元素（右侧，chevron 左侧） */
  suffix?: React.ReactNode;
  /** 校验错误文案（命名字段并以句号结尾，如 "Select a framework."） */
  error?: string;
  /** 字段标签（渲染为上方 <label>） */
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, size, prefix, suffix, error, label, id, children, ...props }, ref) => {
    const hasPrefix = prefix != null;
    const hasSuffix = suffix != null;
    const sizeClasses =
      size === "small"
        ? "h-8 rounded-[6px] text-copy-14"
        : size === "large"
          ? "h-10 rounded-lg text-copy-16"
          : "h-9 rounded-[6px] text-copy-14";

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label ? (
          <label htmlFor={id} className="text-label-14 text-foreground">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {hasPrefix ? (
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-foreground">
              {prefix}
            </span>
          ) : null}
          <select
            ref={ref}
            id={id}
            data-slot="select"
            className={cn(
              "w-full appearance-none border border-gray-alpha-400 bg-background text-foreground outline-none transition-colors input-focus-ring",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
              sizeClasses,
              "pl-3 pr-9",
              hasPrefix && "pl-10",
              hasSuffix && "pr-10",
              error && "border-danger",
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            ) : null}
            {children}
          </select>
          {hasSuffix ? (
            <span className="pointer-events-none absolute top-1/2 right-9 z-10 -translate-y-1/2 text-foreground">
              {suffix}
            </span>
          ) : null}
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground opacity-50"
            aria-hidden
          />
        </div>
        {error ? <p className="text-copy-13 text-danger">{error}</p> : null}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
