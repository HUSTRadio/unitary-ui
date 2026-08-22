import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — Geist 官方 Textarea 规范（live /geist/textarea 实测 2026-08-09 + B3 复刻采集）。
 * - 结构：wrapper（圆角 + 发丝线 shadow 环 + focus/error 光环）+ textarea（本体 r:0、border-none）
 * - 几何：pad 10px 12px、默认 min-h 100px（rows 存在时 min-h unset、高度由行数决定）、
 *   medium 14px/20px r:6px、large 16px/24px r:8px；
 *   disabled：bg gray-100 + fg gray-700 + placeholder gray-600
 * - error：红色光环（1px red-900 + 4px red-300），文案 inline 渲染在字段下方
 *   [role=alert] 13px/20px（large 16px/24px）#cb2a2f / dark #ff6166，margin-top 8px
 * - 官方 textarea 元素本身不带 aria-invalid/aria-describedby（实测仅 aria-label），
 *   错误消息仅以 [role=alert] 渲染在字段下方
 */

type TextareaSize = "small" | "medium" | "large";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 官方 size：small/medium/large（默认 medium）。large 字号 16px/24px、wrapper r:8px */
  size?: TextareaSize;
  /** 官方 error：传入字符串时在字段下方渲染 inline 错误消息，并切换红色光环 */
  error?: React.ReactNode;
  /** 关联标签：存在时用 <label className="block cursor-text"> 包裹标签文本（13px capitalize gray-900，mb-2 8px 间距在文本 div 上）与输入控件（对齐 Input 结构） */
  label?: React.ReactNode;
}

const ERROR_ICON = (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5A5.5 5.5 0 1 1 2.5 8 5.51 5.51 0 0 1 8 2.5Zm-.75 4.25h1.5v5h-1.5v-5ZM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  </svg>
);

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "medium", error, label, ...props }, ref) => {
    const large = size === "large";
    const errorId = React.useId();

    const wrapper = (
      <div
        data-slot="textarea-wrapper"
        data-size={size}
        className={cn(
          "inline-flex w-full overflow-hidden font-normal transition-all duration-150",
          "shadow-[0_0_0_1px_var(--gray-alpha-400)] hover:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
          "focus-within:!shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]",
          "dark:focus-within:!shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(255,255,255,0.24)]",
          error
            ? cn(
                "shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-300)]",
                "hover:shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-500)]",
                "focus-within:!shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-300)]",
              )
            : undefined,
          large ? "rounded-[8px]" : "rounded-[6px]",
        )}
      >
        <textarea
          ref={ref}
          data-slot="textarea"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex min-w-0 w-full resize-none border-none bg-background px-3 py-2.5 text-copy-14 text-black dark:text-white outline-none",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:bg-[var(--gray-100)] disabled:text-[var(--gray-700)] disabled:placeholder:text-[var(--gray-600)]",
            props.rows === undefined ? "h-[100px]" : "h-auto",
            large && "text-base leading-6",
            className,
          )}
          {...props}
        />
      </div>
    );

    return (
      <>
        {label ? (
          <label className="block cursor-text">
            <div className="mb-2 block max-w-full text-copy-13 capitalize text-gray-900">
              {label}
            </div>
            {wrapper}
          </label>
        ) : (
          wrapper
        )}
        {error ? (
          <div
            role="alert"
            aria-atomic="true"
            data-geist-error=""
            className={cn(
              "mt-2 flex items-start text-[13px] leading-5 text-error-foreground",
              large && "text-base leading-6",
            )}
          >
            <span className={cn("mr-2 mt-0.5 flex size-4 shrink-0 items-center", large && "mt-1")}>
              {ERROR_ICON}
            </span>
            <span className="break-words">{error}</span>
          </div>
        ) : null}
      </>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps, type TextareaSize };
