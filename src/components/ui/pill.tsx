import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pill — 可点击的筛选 chip（对应官方 Pill，docs/geist-markdown-refs/components/pill.md）。
 * 用于在一组互斥/多选的筛选项中切换查询条件。
 * variant="active" 高亮当前选中项（bg-selected + 前景色）；默认态为灰色描边 chip。
 * 颜色消费语义 token（--selected / --gray-alpha / --foreground 随主题切换），零 `dark:` 分支。
 */
function Pill({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "default" | "active";
}) {
  return (
    <button
      type="button"
      data-slot="pill"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-background-100 px-3 py-1 text-label-14 text-foreground transition-colors",
        "hover:bg-gray-200",
        "focus-ring",
        "data-[variant=active]:border-transparent data-[variant=active]:bg-selected data-[variant=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Pill };
