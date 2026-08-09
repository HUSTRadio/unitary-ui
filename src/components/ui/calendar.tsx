import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Calendar — 月历（对应官方 Calendar，docs/geist-markdown-refs/components/calendar.md 简化版）。
 * 用原生 <table> 渲染当前月；header 左右 Chevron 切换月份。
 * 官方实测（单月网格）：周表头单字母 12px/400、月份标题 16px/400、
 * 日期格 32×32 rounded-[4px]、选中 bg-gray-300、无今日高亮、导航按钮 32×32 rounded-full。
 * 键盘：方向键在日期格间移动（焦点环 focus-ring）。
 * 注：官方完整实现为 Popover 日期范围选择器（Start/End+时间+Presets），超出本组件范围（BLOCKED）。
 */
interface CalendarProps {
  className?: string;
  /** 受控选中的日期 */
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  /** 初始聚焦的月份（默认当月） */
  defaultMonth?: Date;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Calendar({ className, selected, onSelect, defaultMonth }: CalendarProps) {
  const now = new Date();
  const tableRef = React.useRef<HTMLTableElement>(null);
  const [view, setView] = React.useState(() =>
    defaultMonth
      ? new Date(defaultMonth.getFullYear(), defaultMonth.getMonth(), 1)
      : new Date(now.getFullYear(), now.getMonth(), 1),
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const prev = () => setView(new Date(year, month - 1, 1));
  const next = () => setView(new Date(year, month + 1, 1));

  /** 方向键网格导航：从当前聚焦格按 ±1 / ±7 移动焦点（越界忽略） */
  const handleTableKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const target = e.target as HTMLElement;
    const day = Number(target.dataset.day);
    if (!day) return;
    let nextDay = day;
    if (e.key === "ArrowRight") nextDay = day + 1;
    else if (e.key === "ArrowLeft") nextDay = day - 1;
    else if (e.key === "ArrowDown") nextDay = day + 7;
    else if (e.key === "ArrowUp") nextDay = day - 7;
    else return;
    e.preventDefault();
    if (nextDay < 1 || nextDay > daysInMonth) return;
    const nextEl = tableRef.current?.querySelector<HTMLElement>(`[data-day="${nextDay}"]`);
    nextEl?.focus();
  };

  return (
    <div className={cn("rounded-[12px] border border-gray-alpha-400 bg-background p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="text-[length:16px] font-normal text-foreground">{monthLabel}</span>
        <button
          type="button"
          onClick={next}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <table
        ref={tableRef}
        onKeyDown={handleTableKeyDown}
        className="w-full border-collapse text-center text-copy-14"
      >
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th
                key={w}
                className="pb-2 text-[length:12px] font-normal uppercase text-muted-foreground"
              >
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((week, rowIdx) => (
            <tr key={rowIdx}>
              {week.map((day, colIdx) => {
                const date = day ? new Date(year, month, day) : null;
                const isSelected = date && selected ? isSameDay(date, selected) : false;
                return (
                  <td key={colIdx} className="p-0.5">
                    {day === null ? (
                      <span className="block size-8" aria-hidden />
                    ) : (
                      <button
                        type="button"
                        data-day={day}
                        onClick={() => date && onSelect?.(date)}
                        className={cn(
                          "mx-auto flex size-8 items-center justify-center rounded-[4px] transition-colors outline-none focus-ring",
                          isSelected
                            ? "bg-gray-300 text-foreground"
                            : "text-foreground hover:bg-gray-alpha-200",
                        )}
                      >
                        {day}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Calendar };
