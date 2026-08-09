import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StatusDot — 状态指示圆点（docs/geist-markdown-refs/components/status-dot.md 官方语义，
 * 简化自 Penpot 状态语义）。默认灰点，success / warning / destructive / info 各映射语义色。
 * 尺寸 8px（size-2），纯视觉装饰态（decorative）。
 */

export type StatusDotVariant = "default" | "success" | "warning" | "destructive" | "info";

const STATUS_DOT_STYLES: Record<StatusDotVariant, string> = {
  default: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

function StatusDot({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: StatusDotVariant;
}) {
  return (
    <span
      data-slot="status-dot"
      data-variant={variant}
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        STATUS_DOT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}

export { StatusDot };
