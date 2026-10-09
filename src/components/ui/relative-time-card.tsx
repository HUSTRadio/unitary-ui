import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/date-locale";
import { useI18n } from "@/lib/i18n";

const LayerHoverCardPrimitiveContent = withLayerBridge(HoverCardPrimitive.Content);

/**
 * RelativeTimeCard — Geist 官方 RelativeTimeCard（docs/geist-markdown-refs/components/relative-time-card.md）。
 * 官方语义：Popover —— 触发区显示短相对时间（2m ago / 5h ago / Yesterday），
 * hover 浮层显示精确绝对时间（UTC + 本地）。
 * - date：Unix 毫秒时间戳（number），勿预格式化
 * - side：浮层方位，默认 top
 * - children：自定义触发内容（官方用 <Button>Hover Me</Button>）；缺省渲染短相对时间文本
 * - 浮层材质复用 repo 语义 token（bg-popover / border-gray-alpha-400 / shadow-md），零 `dark:` 分支
 */
/** 浮层日期/时间拆分展示（官方：日期行在左 label 块、时间值右对齐 mono）。 */
function formatDateTimeParts(
  date: Date,
  locale: string,
  timeZone?: string,
): { date: string; time: string } {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(timeZone ? { timeZone } : {}),
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  };
  return {
    date: date.toLocaleDateString(locale, dateOptions),
    time: date.toLocaleTimeString(locale, timeOptions),
  };
}

/** 本地时区短标签（官方浮层 Local 行左侧，如 "GMT+8"；不支持时回退 "Local"）。 */
function getLocalTimeZoneLabel(date: Date, locale: string): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, { timeZoneName: "shortOffset" }).formatToParts(
      date,
    );
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "Local";
  } catch {
    return "Local";
  }
}

export interface RelativeTimeCardProps {
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
  locale: localeProp,
}: RelativeTimeCardProps) {
  const { locale: frameworkLocale } = useI18n();
  const locale = localeProp ?? (frameworkLocale === "en" ? "en-US" : frameworkLocale);
  const timestamp = new Date(date);

  return (
    <HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
      <HoverCardPrimitive.Trigger asChild={children != null}>
        {children ?? (
          <span
            data-slot="relative-time-card"
            tabIndex={0}
            className="inline-flex cursor-pointer items-baseline whitespace-nowrap text-copy-14 text-foreground"
          >
            {formatRelativeTime(date, locale)}
          </span>
        )}
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <LayerHoverCardPrimitiveContent
          data-material="floating"
          data-slot="relative-time-card-popover"
          side={side}
          sideOffset={6}
          align="start"
          className={cn(
            "z-[var(--uni-z-popover)] min-w-[300px] rounded-lg border border-gray-alpha-400 bg-popover p-3 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-base) motion-reduce:animate-none!",
            className,
          )}
        >
          <div className="flex flex-col gap-3">
            <span className="block text-[13px] leading-[19.5px] tabular-nums text-gray-900">
              {formatRelativeTime(date, locale)}
            </span>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "UTC",
                  ...formatDateTimeParts(timestamp, locale, "UTC"),
                },
                {
                  label: getLocalTimeZoneLabel(timestamp, locale),
                  ...formatDateTimeParts(timestamp, locale),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  data-slot="relative-time-card-row"
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-1.5 text-copy-13 text-muted-foreground">
                    <span>{row.label}</span>
                    <span>{row.date}</span>
                  </div>
                  <span className="tabular-nums font-mono text-[12px] leading-[18px] text-gray-900">
                    {row.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </LayerHoverCardPrimitiveContent>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

export { RelativeTimeCard };
