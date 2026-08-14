import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface LabelProps extends Omit<
  React.ComponentProps<typeof LabelPrimitive.Root>,
  "children" | "htmlFor" | "id"
> {
  /** 关联输入控件的 id。 */
  id: string;
  /** 标签文本。 */
  value: string;
  withInput?: boolean;
  bypassCasing?: boolean;
}

/**
 * Label — Geist 官方 Label 规范（vercel.com/geist/label 实时页面 + B3 复刻采集）。
 * - 官方结构：<label data-version="v1">（无样式、inline）内嵌样式 div
 *   （block text-[13px] max-w-full text-gray-900 mb-2 cursor-text [capitalize]）。
 * - 文本规格：13px / 19.5px（text-checkbox-label，继承 body 1.5 行高）、
 *   gray-900（light #4d4d4d）、margin-bottom 8px、默认 capitalize（bypassCasing 跳过）。
 */
function Label({ className, id, value, withInput, bypassCasing, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-with-input={withInput || undefined}
      htmlFor={id}
      {...props}
    >
      <div
        className={cn(
          "mb-2 block max-w-full cursor-text text-copy-13 leading-[19.5px] text-gray-900",
          !bypassCasing && "capitalize",
          className,
        )}
      >
        {value}
      </div>
    </LabelPrimitive.Root>
  );
}

export { Label };
