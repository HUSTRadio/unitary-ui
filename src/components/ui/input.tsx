import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — Geist 官方 Input 规范（vercel.com/geist/input 实时页面 + B3 复刻采集）。
 * - 尺寸：small 32px（h-8）/ default 36px（h-9，默认）/ large 40px（h-10）
 * - 圆角：small/default 6px（rounded-[6px]），large 8px（rounded-lg）
 * - wrapper 透明、由 input 自身承载 background-100（官方结构）；边框 hairline 用
 *   shadow-[0_0_0_1px_gray-alpha-400]，hover 加深 gray-alpha-500，focus-within
 *   gray-alpha-600 + 4px rgba(0,0,0,0.16) 柔光（--input-focus-* token）
 * - disabled：input bg gray-100 + text gray-700（官方 disabled:bg-gray-100 /
 *   disabled:text-gray-700），wrapper cursor-not-allowed
 * - prefix/suffix：wrapper 内 label 式 chip（bg-background-200 + 分隔线 + px-3）；
 *   prefixStyling/suffixStyling=false 时 bg-background-100 + ml-px -mr-3（无分隔线）
 * - rounded：wrapper rounded-full + mt-3（官方原样），input 同步 rounded-full
 * - label：<label> 包裹 text div（data-slot=input-label，13px/19.5px gray-900，
 *   capitalize + mb-2）与输入控件（官方 label[data-version=v1] 结构）
 * - error：1px red-900 边框 + 4px red-300 柔光（hover red-500、focus 保持 red-300），
 *   input aria-invalid + aria-describedby，下方 role="alert" 错误文案
 *   （mt-2 8px、13px/20px，large 16px/24px、#cb2a2f + 16×16 警告图标）
 */

export type InputSize = "small" | "default" | "large";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size" | "prefix"> {
  /** 官方尺寸：small 32px / default 36px / large 40px（默认 default）；数字透传原生 size 属性 */
  size?: InputSize | number;
  /** 错误文案：传入后渲染红边框 + 红柔光 + aria-invalid + 下方 alert 错误信息 */
  error?: string;
  /** 关联标签：渲染 <label htmlFor={id}>（官方 label[data-version=v1] 结构），未传 id 时自动生成 */
  label?: React.ReactNode;
  /** 前缀内容（icon 或字符串），渲染在输入内容之前 */
  prefix?: React.ReactNode;
  /** 前缀是否带样式（bg-background-200 + 右分隔线；false 时 bg-background-100 无分隔线），默认 true */
  prefixStyling?: boolean;
  /** 后缀内容（icon 或字符串），渲染在输入内容之后 */
  suffix?: React.ReactNode;
  /** 后缀是否带样式（bg-background-200 + 左分隔线；false 时 bg-background-100 无分隔线），默认 true */
  suffixStyling?: boolean;
  /** prefix/suffix 渲染为圆角 chip（wrapper rounded-full + mt-3，官方原样） */
  rounded?: boolean;
}

const INPUT_BASE = cn(
  "inline-flex w-full min-w-0 appearance-none border-none bg-background-100 px-3 text-copy-14 outline-none",
  "placeholder:text-gray-700",
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700 disabled:placeholder:text-[#999999]",
);

const WRAPPER_BASE = cn(
  "flex max-w-full items-center overflow-hidden",
  "shadow-[0_0_0_1px_var(--color-gray-alpha-400)] transition-[box-shadow] duration-150",
  "hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)] focus-within:outline-none",
  "has-[input:disabled]:cursor-not-allowed",
  "has-[input:disabled]:hover:shadow-[0_0_0_1px_var(--color-gray-alpha-400)]",
);

const ERROR_WRAPPER_CLASSES = cn(
  "shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
  "hover:shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
);

/** prefixStyling/suffixStyling=false：官方 bg-background-100 + ml-px -mr-3（无分隔线） */
const NO_STYLING_CLASSES = cn("ml-px -mr-3 bg-background-100");

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
        className={cn(
          WRAPPER_BASE,
          height,
          radius,
          rounded && "mt-3 rounded-full",
          error && ERROR_WRAPPER_CLASSES,
        )}
      >
        {prefix && (
          <span
            data-slot="input-prefix"
            className={cn(
              "relative flex h-full shrink-0 items-center px-3 text-gray-700",
              prefixStyling
                ? "border-r border-gray-alpha-400 bg-background-200"
                : NO_STYLING_CLASSES,
            )}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          id={id}
          data-slot="input"
          aria-invalid={error ? true : false}
          aria-describedby={
            error
              ? [errorId, props["aria-describedby"]].filter(Boolean).join(" ")
              : props["aria-describedby"]
          }
          className={cn(
            INPUT_BASE,
            "h-full",
            rounded && "rounded-full",
            "file:border-0 file:bg-transparent file:text-copy-13 file:font-medium file:text-foreground",
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
              "relative flex h-full shrink-0 items-center px-3 text-gray-700",
              suffixStyling
                ? "border-l border-gray-alpha-400 bg-background-200"
                : NO_STYLING_CLASSES,
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    );

    if (!error && !label) return control;

    return (
      <div data-slot="input-field" className="block">
        {label && (
          <label htmlFor={id} className="block cursor-text">
            <div
              data-slot="input-label"
              className="mb-2 block max-w-full text-copy-13 capitalize leading-[19.5px] text-gray-900"
            >
              {label}
            </div>
          </label>
        )}
        {control}
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-atomic="true"
            data-slot="input-error"
            className={cn(
              "mt-2 flex items-start text-[13px] leading-5 text-[#cb2a2f]",
              size === "large" && "text-base leading-6",
            )}
          >
            <span
              className={cn(
                "mr-2 mt-0.5 flex size-4 shrink-0 items-center",
                size === "large" && "mt-1",
              )}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5A5.5 5.5 0 1 1 2.5 8 5.51 5.51 0 0 1 8 2.5Zm-.75 4.25h1.5v5h-1.5v-5ZM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
              </svg>
            </span>
            <span className="break-words">{error}</span>
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
