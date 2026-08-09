import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Calendar — 月历（对应官方 Calendar，docs/geist-markdown-refs/components/calendar.md 简化版）。
 * 用原生 <table> 渲染当前月；header 左右 Chevron 切换月份。
 * 今日：bg-progress text-background rounded-full；选中：bg-selected rounded-full。
 * 官方最佳实践：默认用户本地时区；支持方向键在单元格间移动。
 */
interface CalendarProps {
  className?: string;
  /** 受控选中的日期 */
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  /** 初始聚焦的月份（默认当月） */
  defaultMonth?: Date;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Calendar({ className, selected, onSelect, defaultMonth }: CalendarProps) {
  const now = new Date();
  const [view, setView] = React.useState(
    () =>
      defaultMonth ? new Date(defaultMonth.getFullYear(), defaultMonth.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 1),
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

  return (
    <div
      className={cn(
        "rounded-[12px] border border-gray-alpha-400 bg-background p-4",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="text-copy-14 font-medium text-foreground">{monthLabel}</span>
        <button
          type="button"
          onClick={next}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-gray-alpha-100 hover:text-foreground focus-ring"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <table className="w-full border-collapse text-center text-copy-14">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} className="pb-2 font-normal text-muted-foreground">
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
                const isToday = date ? isSameDay(date, now) : false;
                const isSelected = date && selected ? isSameDay(date, selected) : false;
                return (
                  <td key={colIdx} className="p-0.5">
                    {day === null ? (
                      <span className="block size-8" aria-hidden />
                    ) : (
                      <button
                        type="button"
                        onClick={() => date && onSelect?.(date)}
                        className={cn(
                          "mx-auto flex size-8 items-center justify-center rounded-full transition-colors",
                          isSelected
                            ? "bg-selected text-foreground"
                            : isToday
                              ? "bg-progress text-background"
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
