import * as React from "react";

import { cn } from "@/lib/utils";
import { layoutRootStyle, layoutSurfaceStyle, type ControlLayout } from "@/lib/control-layout";
import { FieldError, FIELD_ERROR_RING, joinDescribedBy } from "./field-error";

/**
 * Textarea — Geist 官方 Textarea 规范（live /geist/textarea 实测 2026-08-09 + B3 复刻采集）。
 * - 结构：wrapper（圆角 + 发丝线 shadow 环 + focus/error 光环）+ textarea（本体 r:0、border-none）
 * - 几何：pad 10px 12px、默认 min-h 100px（rows 存在时 min-h unset、高度由行数决定）、
 *   medium 14px/20px r:6px、large 16px/24px r:8px；
 *   disabled：bg gray-100 + fg gray-700 + placeholder gray-600
 * - error：共享 FieldError 基础层（4px 间距、图标、排版、ARIA 统一）+ 共享红色光环
 * - layout：ControlLayout——宽度三件套+flex 作用于字段根容器，高度三件套作用于 wrapper 表面
 */

type TextareaSize = "small" | "medium" | "large";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 官方 size：small/medium/large（默认 medium）。large 字号 16px/24px、wrapper r:8px */
  size?: TextareaSize;
  /** 官方 error：传入内容时在字段下方渲染 inline 错误消息，并切换红色光环 */
  error?: React.ReactNode;
  /** 关联标签：存在时用 <label className="block cursor-text"> 包裹标签文本（13px capitalize gray-900，mb-2 8px 间距在文本 div 上）与输入控件（对齐 Input 结构） */
  label?: React.ReactNode;
  /** 统一尺寸 API：宽度/flex → 字段根容器；高度 → wrapper 表面 */
  layout?: ControlLayout;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "medium", error, label, layout, ...props }, ref) => {
    const large = size === "large";
    const errorId = React.useId();

    const wrapper = (
      <div
        data-slot="textarea-wrapper"
        data-size={size}
        style={layoutSurfaceStyle(layout)}
        className={cn(
          "inline-flex w-full overflow-hidden font-normal transition-all duration-150",
          "shadow-[0_0_0_1px_var(--gray-alpha-400)] hover:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
          "focus-within:!shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]",
          "dark:focus-within:!shadow-[0_0_0_1px_var(--gray-alpha-600),0_0_0_4px_rgba(255,255,255,0.24)]",
          error && FIELD_ERROR_RING,
          large ? "rounded-[8px]" : "rounded-[6px]",
        )}
      >
        <textarea
          ref={ref}
          data-slot="textarea"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? joinDescribedBy(errorId, props["aria-describedby"]) : undefined}
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
      <div data-slot="textarea-field" className="block w-full min-w-0" style={layoutRootStyle(layout)}>
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
        <FieldError id={errorId} large={large}>
          {error}
        </FieldError>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps, type TextareaSize };
