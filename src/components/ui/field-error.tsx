import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 输入家族共享错误基础层。
 *
 * - 消息到控件的间距统一为 **4px（mt-1）**；标签到控件保持 8px（各组件 label mb-2 不变）。
 * - 图标：16×16 圆形感叹号（本地绘制 SVG，非 lucide，对齐官方 inline error 结构）。
 * - 排版：13px/20px（large 16px/24px），颜色走 --error-foreground 语义 token。
 * - 无障碍：role="alert" + aria-atomic，由各组件把消息 id 接到 aria-describedby。
 */

export const ERROR_ICON = (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5A5.5 5.5 0 1 1 2.5 8 5.51 5.51 0 0 1 8 2.5Zm-.75 4.25h1.5v5h-1.5v-5ZM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  </svg>
);

/** 控件表面错误光环：1px red-900 边 + 4px red-300 柔光，hover 加深至 red-500。 */
export const FIELD_ERROR_RING = cn(
  "!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
  "hover:!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-500)]",
  "focus-within:!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)]",
  "focus:!shadow-[0_0_0_1px_var(--color-red-900),0_0_0_4px_var(--color-red-300)] focus:outline-none",
);

interface FieldErrorProps {
  /** 消息元素 id（供 aria-describedby 关联） */
  id?: string;
  /** large 尺寸控件配套 16px/24px 文本 */
  large?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** 字段下方统一错误消息（4px 间距、图标、排版、ARIA 全部收敛于此） */
function FieldError({ id, large, className, children }: FieldErrorProps) {
  if (children === null || children === undefined || children === false || children === "") {
    return null;
  }
  return (
    <p
      id={id}
      role="alert"
      aria-atomic="true"
      data-slot="field-error"
      data-geist-error=""
      className={cn(
        "mt-1 flex items-start text-copy-13 leading-5 text-error-foreground",
        large && "text-base leading-6",
        className,
      )}
    >
      <span className={cn("mr-2 mt-0.5 flex size-4 shrink-0 items-center", large && "mt-1")}>
        {ERROR_ICON}
      </span>
      <span className="break-words">{children}</span>
    </p>
  );
}

/** 为 aria-describedby 拼接错误消息 id 与调用方自有 describedby。 */
export function joinDescribedBy(
  errorId: string | undefined,
  userDescribedBy: string | undefined,
): string | undefined {
  return [errorId, userDescribedBy].filter(Boolean).join(" ") || undefined;
}

export { FieldError };
