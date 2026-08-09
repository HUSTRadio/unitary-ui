import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — Geist 官方 Input 规范（docs/geist-markdown-refs/components/input.md 实测）。
 * - 高度 32px（h-8）、圆角 6px（官方 wrapper 实测）、padding 0 12px、400 14px/20px
 * - 边框 hairline（gray-alpha-400）、背景 background-100
 * - disabled：bg gray-100 + fg gray-700
 * - size：small/medium 32px、large 40px（官方页面实测）
 * - error：官方 Error 演示实测 —— 1px red-900 边框 + 4px red-300 柔光（hover 加深 red-500、
 *   focus 保持红色），input aria-invalid + aria-describedby，下方 role="alert" 错误文案
 *   （13px red-900 + 警告图标，与 InputError 状态一致）。
 */

export type InputSize = "small" | "medium" | "large";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  /** 官方尺寸：small/medium = 32px，large = 40px（默认 medium）；数字透传原生 size 属性 */
  size?: InputSize | number;
  /** 错误文案：传入后渲染红边框 + 红柔光 + aria-invalid + 下方 alert 错误信息 */
  error?: string;
}

const INPUT_BASE =
  "flex w-full rounded-[6px] border border-gray-alpha-400 bg-background px-3 text-copy-14";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = "medium", error, ...props }, ref) => {
    const errorId = React.useId();

    const input = (
      <input
        type={type}
        data-slot="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? [errorId, props["aria-describedby"]].filter(Boolean).join(" ")
            : props["aria-describedby"]
        }
        className={cn(
          INPUT_BASE,
          size === "large" ? "h-10" : "h-8",
          "file:border-0 file:bg-transparent file:text-copy-13 file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          error
            ? cn(
                "border-red-900 shadow-[0_0_0_4px_var(--color-red-300)] transition-[border-color,box-shadow] duration-150",
                "hover:shadow-[0_0_0_4px_var(--color-red-500)]",
                "focus:border-red-900 focus:shadow-[0_0_0_4px_var(--color-red-300)] focus:outline-none",
              )
            : "input-focus-ring",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    if (!error) return input;

    return (
      <div data-slot="input-wrapper" className="w-full">
        {input}
        <p
          id={errorId}
          role="alert"
          aria-atomic="true"
          data-slot="input-error"
          className="mt-1 flex items-start gap-1.5 text-copy-13 leading-5 text-red-900"
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
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
