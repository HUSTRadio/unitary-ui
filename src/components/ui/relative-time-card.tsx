import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * RelativeTimeCard — Geist 相对时间显示（Clock 图标 + 相对时间文本）。
 * 输入 string | Date，计算相对时间（just now / 2m ago / 5h ago / 3d ago）。
 * 超过 7 天渲染绝对日期（Mar 14, 2026），遵循 Geist 表格相对时间规范。
 */

function formatRelative(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface RelativeTimeCardProps {
  /** 要显示的时间：Date 对象或可解析的字符串 */
  time: string | Date;
  className?: string;
}

function RelativeTimeCard({ time, className }: RelativeTimeCardProps) {
  return (
    <span
      data-slot="relative-time-card"
      className={cn(
        "flex items-center gap-2 whitespace-nowrap text-copy-14 text-muted-foreground",
        className,
      )}
    >
      <Clock className="size-3.5 shrink-0" aria-hidden />
      {formatRelative(time)}
    </span>
  );
}

export { RelativeTimeCard };
