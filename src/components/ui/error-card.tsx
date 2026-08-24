import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ErrorCard — Geist 错误卡片（docs/geist-markdown-refs/components/error-card.md 实测语义）。
 * 官方实测定标：destructive 染色卡片 —— light bg #ffebeb / border #fdd8d8（本地消费 red-100 / red-400 语义 token），
 * radius 8px，图标 16px + 标题 16px/400，同色（--destructive）。
 * 居中排版：可选图标 + 标题 + 描述 + 操作区。
 */

interface ErrorCardProps extends React.ComponentProps<"div"> {
  /** 可选错误图标（渲染在标题上方，强制 16px，destructive 配色） */
  icon?: React.ReactNode;
}

function ErrorCard({ className, icon, children, ...props }: ErrorCardProps) {
  return (
    <div
      data-slot="error-card"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-red-400 bg-red-100 p-4 text-center text-error-foreground",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          data-slot="error-card-icon"
          className="flex items-center justify-center text-error-foreground [&_svg]:size-4"
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
      className={cn("text-copy-16 text-center", className)}
      {...props}
    />
  );
}

function ErrorCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="error-card-description"
      className={cn("text-copy-14 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ErrorCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="error-card-action" className={cn("mt-2", className)} {...props} />;
}

export { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction, type ErrorCardProps };
