import * as React from "react";

import { cn } from "@/lib/utils";

import { FieldError } from "./field-error";

/**
 * Field — 表单字段的组合外壳：标签 + 控件 + 说明 + 错误。
 *
 * 设计边界（M2-02）：
 * - 只做组合与排版，**不接管控件状态**：value / onChange 仍由调用方与控件直接约定。
 * - **不 clone 子元素、不注入 ARIA**：`aria-describedby` 等关联仍由调用方按需接线；
 *   错误消息经 FieldError 的 role="alert" 自行广播。
 * - **不绑定校验库**：error 是 ReactNode，zod / 手写校验都由调用方决定。
 * - 标签排版与 Input / Select / Textarea 内置标签一致（13px、mb-2、capitalize）；
 *   错误复用 field-error.tsx（4px 间距、图标、13/16px 排版）。
 */
export interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** 字段标签文本；渲染为与控件关联的 <label htmlFor>。 */
  label?: React.ReactNode;
  /** 控件 id：仅用于标签关联，Field 不会把它写到子元素上。 */
  htmlFor?: string;
  /** 辅助说明，位于控件下方、错误之前。 */
  description?: React.ReactNode;
  /** 错误消息：空值不渲染，内容原样交给 FieldError。 */
  error?: React.ReactNode;
  /** 与 large 尺寸控件对齐（说明与错误使用 16px/24px 排版）。 */
  large?: boolean;
  children: React.ReactNode;
}

function Field({
  label,
  htmlFor,
  description,
  error,
  large = false,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div
      data-slot="field"
      data-size={large ? "large" : "default"}
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    >
      {label ? (
        <label htmlFor={htmlFor} data-slot="field-label" className="block cursor-text">
          <div className="mb-2 block max-w-full text-copy-13 capitalize text-gray-900">{label}</div>
        </label>
      ) : null}
      {children}
      {description ? (
        <p
          data-slot="field-description"
          className={cn(
            "mt-1 text-copy-13 leading-5 text-gray-700",
            large && "text-base leading-6",
          )}
        >
          {description}
        </p>
      ) : null}
      <FieldError large={large}>{error}</FieldError>
    </div>
  );
}

export { Field };
