import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * RelativeTimeCard — Geist 官方 RelativeTimeCard（docs/geist-markdown-refs/components/relative-time-card.md）。
 * 官方语义：Popover —— 触发区显示短相对时间（2m ago / 5h ago / Yesterday），
 * hover 浮层显示精确绝对时间（UTC + 本地）。
 * - date：Unix 毫秒时间戳（number），勿预格式化
 * - side：浮层方位，默认 top
 * - children：自定义触发内容（官方用 <Button>Hover Me</Button>）；缺省渲染短相对时间文本
 * - 浮层材质复用 repo 语义 token（bg-popover / border-gray-alpha-400 / shadow-md），零 `dark:` 分支
 */
const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/** 官方短格式：just now / 2m ago / 5h ago / Yesterday / 3d ago / 2w ago / 4mo ago / 1y ago */
function formatShort(ms: number): string {
  const elapsed = Date.now() - ms;
  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ms >= startOfToday - DAY && ms < startOfToday) return "Yesterday";

  if (elapsed < WEEK) return `${Math.floor(elapsed / DAY)}d ago`;
  if (elapsed < MONTH) return `${Math.floor(elapsed / WEEK)}w ago`;
  if (elapsed < YEAR) return `${Math.floor(elapsed / MONTH)}mo ago`;
  return `${Math.floor(elapsed / YEAR)}y ago`;
}

function formatLocal(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function formatUtc(date: Date): string {
  return date.toLocaleString(undefined, {
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
}

function RelativeTimeCard({ date, side = "top", className, children }: RelativeTimeCardProps) {
  const timestamp = new Date(date);

  return (
    <HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild={children != null}>
        {children ?? (
          <span
            data-slot="relative-time-card"
            className="inline-flex cursor-help items-baseline whitespace-nowrap border-b border-dotted border-muted-foreground/60 text-copy-14 text-foreground"
          >
            {formatShort(date)}
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
            <span className="text-copy-14 text-foreground">{formatLocal(timestamp)}</span>
            <span className="text-copy-13 text-muted-foreground">UTC {formatUtc(timestamp)}</span>
          </div>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

export { RelativeTimeCard };
