import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Note — 提示框组件（docs/geist-markdown-refs/components/note.md 官方语义）。
 * 导出：Note。
 * 左侧语义图标 + 右侧 children 文案，variant 决定图标与语义色。
 * 材质对齐 Geist 实测（2026-08）：
 * - 容器：flex gap-3 rounded-[8px] border border-gray-alpha-400 bg-background p-4
 * 变体：default(Info/info) / info(Info/info) / success(CheckCircle2/success)
 *        warning(AlertTriangle/warning) / destructive(XCircle/destructive)
 */

export type NoteVariant = "default" | "info" | "success" | "warning" | "destructive";

const NOTE_STYLES: Record<
  NoteVariant,
  { icon: React.ElementType; iconClass: string }
> = {
  default: { icon: Info, iconClass: "text-info" },
  info: { icon: Info, iconClass: "text-info" },
  success: { icon: CheckCircle2, iconClass: "text-success" },
  warning: { icon: AlertTriangle, iconClass: "text-warning" },
  destructive: { icon: XCircle, iconClass: "text-destructive" },
};

interface NoteProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoteVariant;
}

function Note({ className, variant = "default", children, ...props }: NoteProps) {
  const { icon: Icon, iconClass } = NOTE_STYLES[variant];

  return (
    <div
      data-slot="note"
      data-variant={variant}
      className={cn(
        "flex gap-3 rounded-[8px] border border-gray-alpha-400 bg-background p-4",
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} aria-hidden />
      <div className="min-w-0 text-copy-14 text-foreground">{children}</div>
    </div>
  );
}

export { Note };
