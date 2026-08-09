import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — Geist 官方 Textarea 规范（live /geist/textarea 实测 2026-08-09）。
 * - 结构：wrapper（圆角 + 发丝线 shadow 环 + focus/error 光环）+ textarea（本体 r:0、border-none）
 * - 几何：pad 10px 12px、默认 h 100px（rows 存在时 h auto）、small/medium 14px/20px r:6px、
 *   large 16px/24px r:8px；disabled：bg gray-100 + fg gray-700 + placeholder gray-600
 * - error：红色光环（1px red-900 + 4px red-300），文案 inline 渲染在字段下方
 *   [role=alert] 13px/20px（large 16px/24px）red-900，margin-top 8px
 */

type TextareaSize = "small" | "medium" | "large";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 官方 size：small/medium/large（默认 medium）。large 字号 16px/24px、wrapper r:8px */
  size?: TextareaSize;
  /** 官方 error：传入字符串时在字段下方渲染 inline 错误消息，并切换红色光环 */
  error?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "medium", error, ...props }, ref) => {
    const errorId = React.useId();
    const large = size === "large";

    return (
      <>
        <div
          data-slot="textarea-wrapper"
          data-size={size}
          className={cn(
            "flex w-full overflow-hidden font-normal transition-all duration-150",
            "shadow-[0_0_0_1px_var(--gray-alpha-400)] hover:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
            "focus-within:shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]",
            "dark:focus-within:shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(255,255,255,0.24)]",
            error
              ? cn(
                  "rounded-[6px] shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-300)]",
                  "hover:shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-500)]",
                  "focus-within:shadow-[0_0_0_1px_var(--red-900),0_0_0_4px_var(--red-300)]",
                )
              : large
                ? "rounded-[8px]"
                : "rounded-[6px]",
          )}
        >
          <textarea
            ref={ref}
            data-slot="textarea"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "min-w-0 w-full resize-none border-none bg-background px-3 py-2.5 text-copy-14 text-foreground outline-none",
              "placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:bg-[var(--gray-100)] disabled:text-[var(--gray-700)] disabled:placeholder:text-[var(--gray-600)]",
              props.rows === undefined ? "h-[100px]" : "h-auto",
              large && "text-base leading-6",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <div
            id={errorId}
            role="alert"
            aria-atomic="true"
            data-geist-error=""
            className={cn(
              "mt-2 flex items-start text-[13px] leading-5 text-[var(--red-900)]",
              large && "text-base leading-6",
            )}
          >
            {error}
          </div>
        ) : null}
      </>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps, type TextareaSize };
