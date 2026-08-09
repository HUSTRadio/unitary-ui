import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ErrorCard — Geist 错误卡片。
 * 居中排版：可选图标 + 标题 + 描述 + 操作区。
 * 用于在卡片内传达一个错误状态（如 No credits left）。
 */

interface ErrorCardProps extends React.ComponentProps<"div"> {
  /** 可选错误图标（渲染在标题上方，destructive 配色） */
  icon?: React.ReactNode;
}

function ErrorCard({ className, icon, children, ...props }: ErrorCardProps) {
  return (
    <div
      data-slot="error-card"
      className={cn(
        "flex flex-col items-center rounded-[8px] border border-gray-alpha-400 bg-background p-8 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          data-slot="error-card-icon"
          className="mb-3 flex size-8 items-center justify-center text-destructive"
          aria-hidden
        >
          {icon}
        </div>
      )}
      {children}
    </div>
  );
}

function ErrorCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="error-card-title"
      className={cn("text-heading-20 text-foreground", className)}
      {...props}
    />
  );
}

function ErrorCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="error-card-description"
      className={cn("mt-1 text-copy-14 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ErrorCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="error-card-action"
      className={cn("mt-4", className)}
      {...props}
    />
  );
}

export { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction };
