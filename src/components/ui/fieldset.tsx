import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

/**
 * Fieldset — 表单分组（对应官方 Fieldset，docs/geist-markdown-refs/components/fieldset.md）。
 * radix-ui 统一包不含 FieldSet 原语，因此直接消费原生 <fieldset>/<legend> 语义元素，
 * 视觉与交互（legend 关联分组、legend 无障碍播报组名）与官方一致。
 * 导出 FieldSet / FieldSetLegend / FieldSetItem / FieldSetLabel：
 * - FieldSetLegend：text-label-14 text-foreground，分组标题
 * - FieldSetItem：flex items-center gap-3，单行字段（控件 + 标签）
 * - FieldSetLabel：复用 Label（cursor-pointer），绑定 FieldSetItem 内的控件
 * 颜色消费语义 token（--foreground），零 `dark:` 分支。
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="fieldset" className={cn("min-w-0", className)} {...props} />;
}

function FieldSetLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="fieldset-legend"
      className={cn("mb-2 text-label-14 text-foreground", className)}
      {...props}
    />
  );
}

function FieldSetItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fieldset-item"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

function FieldSetLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="fieldset-label" className={cn(className)} {...props} />;
}

export { FieldSet, FieldSetLegend, FieldSetItem, FieldSetLabel };
