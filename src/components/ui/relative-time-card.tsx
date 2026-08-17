import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { defaultLocale, formatRelativeTime } from "@/lib/date-locale";

/**
 * RelativeTimeCard — Geist 官方 RelativeTimeCard（docs/geist-markdown-refs/components/relative-time-card.md）。
 * 官方语义：Popover —— 触发区显示短相对时间（2m ago / 5h ago / Yesterday），
 * hover 浮层显示精确绝对时间（UTC + 本地）。
 * - date：Unix 毫秒时间戳（number），勿预格式化
 * - side：浮层方位，默认 top
 * - children：自定义触发内容（官方用 <Button>Hover Me</Button>）；缺省渲染短相对时间文本
 * - 浮层材质复用 repo 语义 token（bg-popover / border-gray-alpha-400 / shadow-md），零 `dark:` 分支
 */
function formatLocal(date: Date, locale: string): string {
  return date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

function formatUtc(date: Date, locale: string): string {
  return date.toLocaleString(locale, {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface RelativeTimeCardProps {
  /** Unix 毫秒时间戳（number，官方 API：勿传格式化字符串） */
  date: number;
  /** 浮层方位，默认 top */
  side?: "top" | "right" | "bottom" | "left";
  /** 自定义触发内容（非时间标签：Just now / Pending / Queued） */
  children?: React.ReactNode;
  /** 浮层内容 className */
  className?: string;
  /** 语言 locale（BCP 47），驱动相对时间文案与本地/UTC 时间格式 */
  locale?: string;
}

function RelativeTimeCard({
  date,
  side = "top",
  className,
  children,
  locale = defaultLocale(),
}: RelativeTimeCardProps) {
  const timestamp = new Date(date);

  return (
    <HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild={children != null}>
        {children ?? (
          <span
            data-slot="relative-time-card"
            className="inline-flex cursor-help items-baseline whitespace-nowrap border-b border-dotted border-muted-foreground/60 text-copy-14 text-foreground"
          >
            {formatRelativeTime(date, locale)}
          </span>
        )}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side={side}
          sideOffset={6}
          align="start"
          className={cn(
            "z-50 w-64 rounded-lg border border-gray-alpha-400 bg-popover px-3 py-2.5 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            className,
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-copy-14 text-foreground">{formatLocal(timestamp, locale)}</span>
            <span className="text-copy-13 text-muted-foreground">
              UTC {formatUtc(timestamp, locale)}
            </span>
          </div>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

export { RelativeTimeCard };
