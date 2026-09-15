import * as React from "react";

import { cn } from "@/lib/utils";
import { layoutRootStyle, layoutSurfaceStyle, type ControlLayout } from "@/lib/control-layout";
import { FieldError, FIELD_ERROR_RING, joinDescribedBy } from "./field-error";

/**
 * Input — Geist 官方 Input 规范（vercel.com/geist/input 实时页面 + B3 复刻采集）。
 * - 尺寸：small 32px（h-8）/ default 36px（h-9，默认）/ large 40px（h-10）
 * - 圆角：统一 8px（rounded-lg，Apple HIG 标准控件口径，2026-08-24 起不再按尺寸区分）
 * - wrapper 透明、由 input 自身承载 background-100（官方结构）；边框 hairline 用
 *   shadow-[0_0_0_1px_gray-alpha-400]，hover 加深 gray-alpha-500，focus-within
 *   gray-alpha-600 + 4px rgba(0,0,0,0.16) 柔光（--input-focus-* token）
 * - disabled：input bg gray-100 + text gray-700（官方 disabled:bg-gray-100 /
 *   disabled:text-gray-700），styled prefix/suffix 保留 background-200 的固定修饰语义；
 *   plain prefix/suffix 才跟随 input 合并为 gray-100；wrapper cursor-not-allowed
 * - prefix/suffix：wrapper 内三段无缝拼接；装饰段 px-3，styled 时使用
 *   bg-background-200 + 单侧 1px 分隔线；各段之间无正 margin。
 *   prefixStyling=false 时用 -mr-3 与 input 的左 padding 重叠，suffixStyling=false
 *   保持 bg-background-100 且无分隔线。
 * - rounded：wrapper rounded-full + mt-3（官方原样），input 同步 rounded-full
 * - label：<label> 包裹 text div（data-slot=input-label，13px/19.5px gray-900，
 *   capitalize + mb-2）与输入控件（官方 label[data-version=v1] 结构）
 * - error：共享 FieldError 基础层（4px 间距、图标、排版、ARIA 统一），
 *   input aria-invalid + aria-describedby
 * - layout：ControlLayout——宽度三件套+flex 作用于字段根容器，高度三件套作用于 wrapper 表面
 */

export type InputSize = "small" | "default" | "large";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size" | "prefix"> {
  /** 官方尺寸：small 32px / default 36px / large 40px（默认 default）；数字透传原生 size 属性 */
  size?: InputSize | number;
  /** 错误文案：传入后渲染红边框 + 红柔光 + aria-invalid + 下方 alert 错误信息 */
  error?: React.ReactNode;
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
  /** 统一尺寸 API：宽度/flex → 字段根容器；高度 → 控件表面 */
  layout?: ControlLayout;
}

const INPUT_BASE = cn(
  "inline-flex w-full min-w-0 appearance-none border-none bg-background-100 px-3 text-black dark:text-white outline-none",
  "placeholder:text-gray-700",
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700 disabled:placeholder:text-(--input-disabled-placeholder)",
);

const WRAPPER_BASE = cn(
  "flex max-w-full items-center overflow-hidden bg-background-100",
  "shadow-[0_0_0_1px_var(--color-gray-alpha-400)] transition-[box-shadow] duration-(--uni-duration-fast)",
  "hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)] focus-within:outline-none",
  "has-[input:disabled]:cursor-not-allowed",
  "has-[input:disabled]:hover:shadow-[0_0_0_1px_var(--color-gray-alpha-400)]",
  // disabled 仅让 plain affix 跟随 input 的 gray-100；styled affix 保留
  // background-200 + 分隔线，避免禁用状态抹掉固定修饰与可编辑值的角色差异。
  "has-[input:disabled]:[&_[data-slot=input-prefix][data-styling=plain]]:bg-gray-100",
  "has-[input:disabled]:[&_[data-slot=input-suffix][data-styling=plain]]:bg-gray-100",
);

/** prefixStyling/suffixStyling=false：官方 bg-background-100，无分隔线。 */
const NO_STYLING_CLASSES = cn("bg-background-100");

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
      layout,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const generatedId = React.useId();
    const id = label ? (idProp ?? generatedId) : idProp;

    const height = size === "small" ? "h-8" : size === "large" ? "h-10" : "h-9";
    const radius = "rounded-lg";

    const control = (
      <div
        data-geist-input-wrapper=""
        data-version="v1"
        data-slot="input-container"
        style={layoutSurfaceStyle(layout)}
        className={cn(
          WRAPPER_BASE,
          height,
          radius,
          size === "large" ? "text-copy-16" : "text-copy-14",
          rounded && "mt-3 rounded-full",
          error && FIELD_ERROR_RING,
        )}
      >
        {prefix && (
          <span
            data-slot="input-prefix"
            data-styling={prefixStyling ? "styled" : "plain"}
            className={cn(
              "flex h-full shrink-0 items-center px-3 text-gray-700",
              rounded && "rounded-full",
              prefixStyling
                ? "border-r border-gray-alpha-400 bg-background-200"
                : cn(NO_STYLING_CLASSES, "-mr-3"),
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
            error ? joinDescribedBy(errorId, props["aria-describedby"]) : props["aria-describedby"]
          }
          className={cn(
            INPUT_BASE,
            "h-full flex-1 w-auto min-w-0",
            size === "large" ? "text-copy-16" : "text-copy-14",
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
            data-styling={suffixStyling ? "styled" : "plain"}
            className={cn(
              "flex h-full shrink-0 items-center px-3 text-gray-700",
              rounded && "rounded-full",
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

    if (!error && !label && !layout) return control;

    return (
      <div data-slot="input-field" className="block w-full min-w-0" style={layoutRootStyle(layout)}>
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
        <FieldError id={errorId} large={size === "large"}>
          {error}
        </FieldError>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
