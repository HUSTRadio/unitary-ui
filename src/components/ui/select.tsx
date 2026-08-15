import * as React from "react";
import { ChevronDown, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Select — Geist 官方 Select（docs/geist-markdown-refs/components/select.md + 实时 vercel.com/geist/select）。
 * 官方形态：**原生 <select> 封装**（<option>/<optgroup> 子元素 + 原生下拉/键盘/表单校验），
 * 结构：label（包裹）> [字段标签文本] + div.group.relative.flex.items-center > [prefix span] select [suffix/chevron span] + [error 块]。
 * - placeholder：占位文案（渲染为 disabled/hidden 的占位 option）
 * - size：small 32px / 默认 36px / large 40px（large 16px 文字、8px 圆角；small/默认 6px 圆角）
 * - prefix / suffix：左右侧元素（pointer-events-none 绝对定位，输入区按 40px/36px 避让；suffix 存在时替代 chevron）
 * - error：校验错误文案（aria-invalid=true + 红色 box-shadow 环 + 下方 13px/20px 提示，官方实测 #cb2a2f / dark #ff6166）
 * - label：字段标签（Title Case 名词，直接接受在 <Select> 上，渲染为 label 内 13px 文本，capitalize）
 * - 其余 props（value / defaultValue / onChange / required / disabled / name / aria-label）为原生 select 透传
 * 颜色/尺寸按官方实时实测值落地（light 1440×900）：ring 用 --gray-alpha-400，error 环 #ee0000 + rgba(203,42,47,0.16)，
 * 焦点环 focus 0 0 0 1px #00000057 + 0 0 0 4px #00000029，focus-visible 0 0 0 2px #fff + 0 0 0 4px #0072f5。
 */
interface SelectProps extends Omit<React.ComponentProps<"select">, "size" | "prefix"> {
  /** 占位文案（未选择时显示，渲染为 disabled/hidden 的占位 option） */
  placeholder?: string;
  /** small 32px / 默认 36px / large 40px */
  size?: "small" | "large";
  /** 前缀元素（左侧，pointer-events-none） */
  prefix?: React.ReactNode;
  /** 后缀元素（右侧，替代 chevron，pointer-events-none） */
  suffix?: React.ReactNode;
  /** 校验错误文案（命名字段并以句号结尾，如 "Please select a value."） */
  error?: string;
  /** 字段标签（渲染为 label 内 13px capitalize 文本） */
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, size, prefix, suffix, error, label, id, children, ...props }, ref) => {
    const hasPrefix = prefix != null;
    const hasSuffix = suffix != null;
    const sizeClasses =
      size === "small"
        ? "h-8 rounded-[6px] text-[14px]"
        : size === "large"
          ? "h-10 rounded-lg text-[16px] leading-6"
          : "h-9 rounded-[6px] text-[14px] leading-5";

    return (
      <label className={cn(className)}>
        {label ? (
          <div className="mb-2 block max-w-full cursor-text text-[13px] text-gray-900 capitalize">
            {label}
          </div>
        ) : null}
        <div
          className={cn(
            "group relative flex items-center text-foreground",
            props.disabled && "cursor-not-allowed rounded-[6px] bg-gray-100",
            error && "text-[#ee0000]",
          )}
        >
          {hasPrefix ? (
            <span className="pointer-events-none absolute left-3 inline-flex text-gray-900 transition-colors duration-150 ease-in">
              {prefix}
            </span>
          ) : null}
          <select
            ref={ref}
            id={id}
            data-slot="select"
            aria-invalid={error ? true : false}
            className={cn(
              "peer w-full cursor-pointer truncate appearance-none border-none bg-background px-3 pr-9 text-gray-1000",
              "shadow-[0_0_0_1px_var(--gray-alpha-400)] transition-[box-shadow,color] duration-200",
              "hover:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
              "focus:shadow-[0_0_0_1px_#00000057,0_0_0_4px_#00000029] focus:outline-none",
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700 disabled:opacity-100",
              "disabled:shadow-[0_0_0_1px_var(--gray-alpha-400)]",
              "aria-[invalid=true]:shadow-[0_0_0_1px_#ee0000,0_0_0_4px_rgba(203,42,47,0.16)] aria-[invalid=true]:outline-none",
              sizeClasses,
              hasPrefix && "pl-10",
              "[&_option]:text-gray-1000",
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled className="text-gray-800">
                {placeholder}
              </option>
            ) : null}
            {children}
          </select>
          {hasSuffix ? (
            <span className="pointer-events-none absolute right-3 inline-flex text-gray-700 transition-colors duration-150 ease-in">
              {suffix}
            </span>
          ) : (
            <span className="pointer-events-none absolute right-3 inline-flex text-gray-700 transition-colors duration-150 ease-in">
              <ChevronDown className="size-3.5" aria-hidden />
            </span>
          )}
        </div>
        {error ? (
          <div
            data-geist-error=""
            aria-atomic="true"
            className={cn(
              "flex items-start text-[#cb2a2f] dark:text-[#ff6166]",
              size === "large" ? "text-base leading-6" : "text-copy-13 leading-5",
            )}
          >
            <div
              aria-hidden="true"
              className={cn("mr-2 flex items-center", size === "large" ? "mt-1" : "mt-0.5")}
            >
              <CircleAlert className="size-4" />
            </div>
            <div className="break-words">{error}</div>
          </div>
        ) : null}
      </label>
    );
  },
);
Select.displayName = "Select";

export { Select };
