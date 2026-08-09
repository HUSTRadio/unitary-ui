import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ErrorText — 表单字段内联错误提示（对应官方 Error 的字段级用法）。
 * 官方 Best Practices：字段级校验错误（validate on blur 后）用 error prop 内联展示，
 * 与 Input/Select/Textarea 搭配，位于控件下方 mt-1。
 * 样式：text-copy-13 text-destructive；颜色消费语义 token（--destructive），零 `dark:` 分支。
 */
function ErrorText({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p data-slot="error-text" className={cn("mt-1 text-copy-13 text-destructive", className)} {...props} />
  );
}

export { ErrorText };
