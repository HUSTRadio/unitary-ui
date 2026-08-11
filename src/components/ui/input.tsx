import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — Geist 官方 Input 规范（docs/geist-markdown-refs/components/input.md 实测 + G06 审计修复）。
 * - 尺寸：small 32px（h-8）/ default 36px（h-9，默认）/ large 40px（h-10）；官方无中间档命名
 * - 圆角：small/default 6px（rounded-[6px]），large 8px（rounded-lg）
 * - 边框 hairline（gray-alpha-400）、背景 background-100
 * - disabled：bg gray-100 + fg gray-700
 * - prefix/suffix：在输入内容前后渲染（icon 或字符串）；prefixStyling/suffixStyling 控制
 *   分隔线样式（默认 true），rounded 把 prefix/suffix 渲染为圆角 chip。带 prefix/suffix 时
 *   由 wrapper 承担边框/圆角/高度，内部 input 无边框（官方 wrapper 方案）
 * - label：渲染关联 <label htmlFor>（未传 id 时自动生成）
 * - error：1px red-900 边框 + 4px red-300 柔光（hover 加深 red-500、focus 保持红色），
 *   input aria-invalid + aria-describedby，下方 role="alert" 错误文案
 *   （mt-2 8px、13px/20px、#cb2a2f + 警告图标）。
 */

export type InputSize = "small" | "default" | "large";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size" | "prefix"> {
  /** 官方尺寸：small 32px / default 36px / large 40px（默认 default）；数字透传原生 size 属性 */
  size?: InputSize | number;
  /** 错误文案：传入后渲染红边框 + 红柔光 + aria-invalid + 下方 alert 错误信息 */
  error?: string;
  /** 关联标签：渲染 <label htmlFor={id}>，未传 id 时自动生成 */
  label?: React.ReactNode;
  /** 前缀内容（icon 或字符串），渲染在输入内容之前 */
  prefix?: React.ReactNode;
  /** 前缀是否带样式（右侧分隔线；rounded 时含 chip 背景），默认 true */
  prefixStyling?: boolean;
  /** 后缀内容（icon 或字符串），渲染在输入内容之后 */
  suffix?: React.ReactNode;
  /** 后缀是否带样式（左侧分隔线；rounded 时含 chip 背景），默认 true */
  suffixStyling?: boolean;
  /** prefix/suffix 渲染为圆角 chip */
  rounded?: boolean;
}

const INPUT_BASE = "flex w-full min-w-0 border-none bg-transparent px-3 text-copy-14 outline-none";

const WRAPPER_BASE = cn(
  "flex max-w-full items-center overflow-hidden bg-background-100",
  "shadow-[0_0_0_1px_var(--color-gray-alpha-400)] transition-[box-shadow] duration-150",
  "hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)] focus-within:outline-none",
  "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-muted",
  "has-[input:disabled]:hover:shadow-[0_0_0_1px_var(--color-gray-alpha-400)]",
);

const ERROR_WRAPPER_CLASSES = cn(
  "shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
  "hover:shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size = "default",
      error,
      label,
      prefix,
      prefixStyling = true,
      suffix,
      suffixStyling = true,
      rounded,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const generatedId = React.useId();
    const id = label ? (idProp ?? generatedId) : idProp;

    const height = size === "small" ? "h-8" : size === "large" ? "h-10" : "h-9";
    const radius = size === "large" ? "rounded-lg" : "rounded-[6px]";

    const control = (
      <div
        data-geist-input-wrapper=""
        data-version="v1"
        data-slot="input-container"
        className={cn(WRAPPER_BASE, height, radius, error && ERROR_WRAPPER_CLASSES)}
      >
        {prefix && (
          <span
            data-slot="input-prefix"
            className={cn(
              "mr-2 flex h-full shrink-0 items-center",
              prefixStyling &&
                (rounded
                  ? "rounded-full border-r border-gray-alpha-400 bg-gray-alpha-100 px-2 py-0.5"
                  : "border-r border-gray-alpha-400 pr-2"),
            )}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          id={id}
          data-slot="input"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? [errorId, props["aria-describedby"]].filter(Boolean).join(" ")
              : props["aria-describedby"]
          }
          className={cn(
            INPUT_BASE,
            "h-full",
            "file:border-0 file:bg-transparent file:text-copy-13 file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:text-muted-foreground",
            className,
          )}
          ref={ref}
          {...(typeof size === "number" ? { size } : {})}
          {...props}
        />
        {suffix && (
          <span
            data-slot="input-suffix"
            className={cn(
              "ml-2 flex h-full shrink-0 items-center",
              suffixStyling &&
                (rounded
                  ? "rounded-full border-l border-gray-alpha-400 bg-gray-alpha-100 px-2 py-0.5"
                  : "border-l border-gray-alpha-400 pl-2"),
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    );

    if (!error && !label) return control;

    return (
      <div data-slot="input-field" className={cn("flex w-full flex-col", label && "gap-1.5")}>
        {label && (
          <label
            htmlFor={id}
            data-slot="input-label"
            className="text-copy-13 font-medium text-foreground"
          >
            {label}
          </label>
        )}
        {control}
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-atomic="true"
            data-slot="input-error"
            className="mt-2 flex items-start gap-1.5 text-copy-13 leading-5 text-[#cb2a2f]"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
              fill="currentColor"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5A5.5 5.5 0 1 1 2.5 8 5.51 5.51 0 0 1 8 2.5Zm-.75 4.25h1.5v5h-1.5v-5ZM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            <span className="break-words">{error}</span>
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
