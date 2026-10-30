"use client";

import * as React from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { Button } from "./button";

/**
 * LogView — 日志查看器（M2-06）。
 *
 * 调用方传入 `entries`（顺序即渲染顺序），组件负责级别过滤、复制/导出、
 * 底部自动跟随与「手动上滚后暂停跟随」。首版不做虚拟化：行数上限由调用方控制。
 * 不做网络请求，也不持有日志数据。
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export const LOG_LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"];

const SEVERITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export interface LogEntry {
  /** 稳定标识（行 key）。 */
  id: string;
  level: LogLevel;
  /** 展示用时间；已格式化字符串或 Date。 */
  time: string | number | Date;
  message: string;
}

export type LogLevelFilter = LogLevel | "all";

export interface LogViewClipboard {
  writeText(text: string): Promise<void> | void;
}

export interface LogViewProps extends Omit<React.ComponentProps<"div">, "children" | "onCopy" | "title"> {
  entries: LogEntry[];
  /** 受控过滤级别（按最低级别过滤）。不传时用内部状态与 `defaultLevel`。 */
  level?: LogLevelFilter;
  defaultLevel?: LogLevelFilter;
  onLevelChange?: (level: LogLevelFilter) => void;
  /** 视口高度，数字按 px 处理，默认 320。 */
  height?: number | string;
  title?: React.ReactNode;
  /** 空列表文案。 */
  emptyLabel?: React.ReactNode;
  /** 复制实现注入点，默认 `navigator.clipboard`。 */
  clipboard?: LogViewClipboard;
  /** 提供时接手导出文本，否则下载文本文件。 */
  onExport?: (text: string, entries: LogEntry[]) => void;
  /** 下载文件名，默认 `logs.txt`。 */
  exportFileName?: string;
}

const LEVEL_LABELS: Record<LogLevelFilter, string> = {
  all: "All",
  debug: "Debug",
  info: "Info",
  warn: "Warn",
  error: "Error",
};

const LEVEL_CLASSES: Record<LogLevel, string> = {
  debug: "text-gray-700",
  info: "text-gray-1000",
  warn: "text-button-warning",
  error: "text-error-foreground",
};

function formatTime(time: LogEntry["time"]): string {
  if (time instanceof Date) return time.toISOString();
  return String(time);
}

/** 单条日志的纯文本形式：`<time> <LEVEL> <message>`。 */
export function formatLogLine(entry: LogEntry): string {
  return `${formatTime(entry.time)} ${entry.level.toUpperCase()} ${entry.message}`;
}

export function logEntriesToText(entries: LogEntry[]): string {
  return entries.map(formatLogLine).join("\n");
}

function LogView({
  className,
  style,
  entries,
  level,
  defaultLevel = "all",
  onLevelChange,
  height = 320,
  title,
  emptyLabel,
  clipboard,
  onExport,
  exportFileName = "logs.txt",
  ...props
}: LogViewProps) {
  const { t } = useI18n();
  const [internalLevel, setInternalLevel] = React.useState<LogLevelFilter>(defaultLevel);
  const [copied, setCopied] = React.useState(false);
  const [following, setFollowing] = React.useState(true);
  const scroller = React.useRef<HTMLDivElement>(null);
  const copiedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeLevel = level ?? internalLevel;
  const visible = React.useMemo(
    () =>
      activeLevel === "all"
        ? entries
        : entries.filter((entry) => SEVERITY[entry.level] >= SEVERITY[activeLevel]),
    [entries, activeLevel],
  );

  // 跟随开启时，新日志到达后贴到底部。
  React.useEffect(() => {
    if (!following) return;
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [following, visible.length]);

  React.useEffect(
    () => () => {
      if (copiedTimer.current !== undefined) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const handleScroll = () => {
    const element = scroller.current;
    if (!element) return;
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= 8;
    setFollowing(atBottom);
  };

  const jumpToLatest = () => {
    setFollowing(true);
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  };

  const pickLevel = (next: LogLevelFilter) => {
    if (level === undefined) setInternalLevel(next);
    onLevelChange?.(next);
  };

  const copy = async () => {
    const text = logEntriesToText(visible);
    const target = clipboard ?? (typeof navigator !== "undefined" ? navigator.clipboard : undefined);
    if (!target) return;
    try {
      await target.writeText(text);
      setCopied(true);
      if (copiedTimer.current !== undefined) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      // 剪贴板被拒绝时保持原状，不抛给调用方。
    }
  };

  const exportLogs = () => {
    const text = logEntriesToText(visible);
    if (onExport) {
      onExport(text, visible);
      return;
    }
    if (typeof document === "undefined") return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = exportFileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      data-slot="log-view"
      data-level={activeLevel}
      data-following={following ? "true" : "false"}
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      style={style}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {title ? (
          <div data-slot="log-view-title" className="text-copy-14 leading-5 text-gray-1000">
            {title}
          </div>
        ) : (
          <span />
        )}
        <div data-slot="log-view-actions" className="flex flex-wrap items-center gap-1">
          <div data-slot="log-view-levels" className="flex items-center gap-1">
            {(["all", ...LOG_LEVELS] as LogLevelFilter[]).map((option) => (
              <button
                key={option}
                type="button"
                data-slot="log-view-level"
                data-level={option}
                data-active={activeLevel === option ? "true" : "false"}
                onClick={() => pickLevel(option)}
                className={cn(
                  "rounded-md px-2 py-1 text-label-12 outline-none focus-ring",
                  activeLevel === option
                    ? "bg-gray-alpha-300 text-gray-1000"
                    : "text-gray-700 hover:bg-gray-alpha-200",
                )}
              >
                {LEVEL_LABELS[option]}
              </button>
            ))}
          </div>
          <Button type="tertiary" size="tiny" onClick={() => void copy()}>
            {copied ? t("Copied") : t("Copy")}
          </Button>
          <Button type="tertiary" size="tiny" onClick={exportLogs}>
            {t("Export")}
          </Button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scroller}
          data-slot="log-view-scroller"
          onScroll={handleScroll}
          className="overflow-auto rounded-lg bg-background-200 shadow-[0_0_0_1px_var(--gray-alpha-300)]"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          {visible.length === 0 ? (
            <div data-slot="log-view-empty" className="p-3 text-copy-13 text-gray-700">
              {emptyLabel ?? t("No log entries")}
            </div>
          ) : (
            <ul data-slot="log-view-rows" className="m-0 flex flex-col p-0">
              {visible.map((entry) => (
                <li
                  key={entry.id}
                  data-slot="log-view-row"
                  data-level={entry.level}
                  className="flex gap-2 px-3 py-1 font-mono text-label-12 leading-5"
                >
                  <span data-slot="log-view-time" className="shrink-0 text-gray-700">
                    {formatTime(entry.time)}
                  </span>
                  <span
                    data-slot="log-view-level-tag"
                    className={cn("w-10 shrink-0 uppercase", LEVEL_CLASSES[entry.level])}
                  >
                    {entry.level}
                  </span>
                  <span data-slot="log-view-message" className="min-w-0 whitespace-pre-wrap break-words">
                    {entry.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {following ? null : (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
            <Button type="secondary" size="tiny" className="pointer-events-auto" data-slot="log-view-jump" onClick={jumpToLatest}>
              {t("Jump to latest")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { LogView };
