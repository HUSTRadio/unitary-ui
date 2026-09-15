import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { resolveRangeColors, type RangeColorScheme } from "@/lib/calendar-colors";
import {
  defaultDateFmt,
  defaultTimeFmt,
  formatDateTime,
  formatTimeOfDay,
  parseDateTime,
  parseTimeOfDay,
  resolveTimeZone,
  setTimeOfDay,
} from "@/lib/date-time";
import { useI18n } from "@/lib/i18n";
import { getMonthTitle, getWeekStartDay, getWeekdayLabels } from "@/lib/date-locale";
import {
  DATE_INPUT_CLASS,
  DATE_INPUT_WRAP_CLASS,
  GRID_BODY_CLASS,
  GRID_CELL_CLASS,
  GRID_HEAD_TH_CLASS,
  GRID_HEAD_TR_CLASS,
  GRID_ROW_CLASS,
  GRID_TABLE_CLASS,
  NAV_BUTTON_CLASS,
  PANEL_CONTENT_CLASS,
  START_END_LABEL_CLASS,
} from "./calendar-classes";
import { monthGrid, sameDay } from "./calendar-utils";

/**
 * CalendarPanel — 打开态 Popover 面板（官方 date range picker，2026-08-15 实测）。
 * 2026-09-15 从 calendar.tsx 拆出（含自身视图状态/输入校验/日期网格）。
 */

export interface CalendarPanelProps {
  horizontalLayout?: boolean;
  pinnedTimezone?: string;
  minValue?: Date;
  maxValue?: Date;
  locale: string;
  timeZone?: string;
  dateTimeFormat?: string;
  timeFormat?: string;
  colorScheme?: Partial<RangeColorScheme>;
  /** 点击 Apply 时回调选中的日期范围（官方 onChange 语义）。 */
  onApply?: (range: { start: Date | null; end: Date | null }) => void;
  /** 外部受控范围（preset 选中 / 父组件回填），变化时同步内部选中态。 */
  value?: { start: Date | null; end: Date | null };
  /** 内部点选 / 范围变化回调。 */
  onValueChange?: (range: { start: Date | null; end: Date | null }) => void;
}

export function CalendarPanel({
  horizontalLayout = false,
  pinnedTimezone,
  minValue,
  maxValue,
  locale,
  timeZone: requestedTimeZone,
  dateTimeFormat,
  timeFormat,
  colorScheme,
  onApply,
  value,
  onValueChange,
}: CalendarPanelProps) {
  const { t } = useI18n();
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());
  const [start, setStart] = React.useState<Date | null>(null);
  const [end, setEnd] = React.useState<Date | null>(null);
  const [inputs, setInputs] = React.useState<Record<string, string>>({});
  const [inputErrors, setInputErrors] = React.useState<Record<string, boolean>>({});

  // 外部受控范围（preset 选中）变化时同步内部选中态
  React.useEffect(() => {
    if (value && (value.start || value.end)) {
      setStart(value.start);
      setEnd(value.end);
    }
  }, [value?.start, value?.end]);

  const timeZone = pinnedTimezone ?? resolveTimeZone(requestedTimeZone);
  const datePattern = dateTimeFormat ?? defaultDateFmt(locale, timeZone);
  const clockPattern = timeFormat ?? defaultTimeFmt();
  const colors = resolveRangeColors(colorScheme);
  const colorStyle = {
    "--calendar-range-selected-bg": colors.selectedBg,
    "--calendar-range-selected-fg": colors.selectedFg,
    "--calendar-range-soft-bg": colors.softBg,
    "--calendar-range-soft-fg": colors.softFg,
  } as React.CSSProperties;

  const getDateInput = (field: "start" | "end") => {
    const selected = field === "start" ? start : end;
    return (
      inputs[`${field}-date`] ??
      (selected ? formatDateTime(selected, { locale, timeZone, dateTimeFormat: datePattern }) : "")
    );
  };
  const getTimeInput = (field: "start" | "end") => {
    const selected = field === "start" ? start : end;
    return (
      inputs[`${field}-time`] ??
      (selected
        ? formatTimeOfDay(selected, { timeZone, timeFormat: clockPattern })
        : field === "end"
          ? "23:59"
          : "00:00")
    );
  };
  const setInput = (key: string, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));
  const setInputError = (key: string, invalid: boolean) =>
    setInputErrors((current) => ({ ...current, [key]: invalid }));

  const updateDate = (field: "start" | "end", raw: string) => {
    const key = `${field}-date`;
    const parsed = parseDateTime(raw, { locale, timeZone, dateTimeFormat: datePattern });
    if (!parsed) {
      setInputError(key, true);
      return;
    }
    const time = parseTimeOfDay(getTimeInput(field), clockPattern) ?? {
      hours: field === "end" ? 23 : 0,
      minutes: 0,
    };
    const next = setTimeOfDay(parsed, time, timeZone);
    if (field === "start") setStart(next);
    else setEnd(next);
    setInputs((values) => {
      const nextValues = { ...values };
      delete nextValues[key];
      return nextValues;
    });
    setInputError(key, false);
  };
  const updateTime = (field: "start" | "end", raw: string) => {
    const key = `${field}-time`;
    const time = parseTimeOfDay(raw, clockPattern);
    const current = field === "start" ? start : end;
    if (!time || !current) {
      setInputError(key, true);
      return;
    }
    const next = setTimeOfDay(current, time, timeZone);
    if (field === "start") setStart(next);
    else setEnd(next);
    setInputs((values) => {
      const nextValues = { ...values };
      delete nextValues[key];
      return nextValues;
    });
    setInputError(key, false);
  };

  const cells = monthGrid(viewYear, viewMonth, getWeekStartDay(locale));

  const selectDate = (d: Date) => {
    let next: { start: Date | null; end: Date | null };
    if (!start || (start && end)) {
      next = { start: d, end: null };
    } else if (d < start) {
      next = { start: d, end: start };
    } else {
      next = { start, end: d };
    }
    setStart(next.start);
    setEnd(next.end);
    onValueChange?.(next);
  };

  const isStart = (d: Date) => (start ? sameDay(d, start) : false);
  const isEnd = (d: Date) => (end ? sameDay(d, end) : false);
  const inRange = (d: Date) => !!(start && end && d > start && d < end);
  const isSelected = (d: Date) => isStart(d) || isEnd(d) || inRange(d);
  const isDisabled = (d: Date) =>
    (minValue !== undefined && d < minValue) || (maxValue !== undefined && d > maxValue);

  const prevMonth = () => {
    const m = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };
  const nextMonth = () => {
    const m = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };

  return (
    <div className={PANEL_CONTENT_CLASS} style={colorStyle}>
      <div className={horizontalLayout ? "flex flex-row items-stretch" : "flex flex-col"}>
        {/* 日历（上 / 左） */}
        <div className={horizontalLayout ? "min-w-0 flex-1" : ""}>
          <div
            className="flex flex-row items-center justify-between"
            style={{ margin: "-3px 0px" }}
          >
            <div
              style={{
                overflow: "hidden",
                marginLeft: "-16px",
                paddingLeft: "16px",
                flex: "1 1 0%",
              }}
            >
              <h2 className="m-0 font-medium text-gray-1000 block w-fit max-w-full text-[14px]">
                {getMonthTitle(new Date(viewYear, viewMonth, 1), locale)}
              </h2>
            </div>
            <button
              type="button"
              aria-label={t("Previous month")}
              className={NAV_BUTTON_CLASS}
              onClick={prevMonth}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("Next month")}
              className={NAV_BUTTON_CLASS}
              onClick={nextMonth}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <table className={GRID_TABLE_CLASS}>
            <caption className="sr-only">{t("Calendar")}</caption>
            <thead className="block">
              <tr className={GRID_HEAD_TR_CLASS}>
                {getWeekdayLabels(locale).map((d, i) => (
                  <th key={i} className={GRID_HEAD_TH_CLASS}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={GRID_BODY_CLASS}>
              {Array.from({ length: 6 }, (_, week) => (
                <tr key={week} className={GRID_ROW_CLASS}>
                  {cells.slice(week * 7, week * 7 + 7).map((d, i) => {
                    const idx = week * 7 + i;
                    const inMonth = d.getMonth() === viewMonth;
                    const selected = isSelected(d);
                    const startDay = isStart(d);
                    const endDay = isEnd(d);
                    const disabled = isDisabled(d);
                    // 连续区间：同行内区间段两端圆角、中间无圆角（几何圆角，非 start/end 语义）
                    const inSel = !!(start && end && d >= start && d <= end);
                    const leftIn =
                      i > 0 && !!(start && end && cells[idx - 1] >= start && cells[idx - 1] <= end);
                    const rightIn =
                      i < 6 && !!(start && end && cells[idx + 1] >= start && cells[idx + 1] <= end);
                    const isLeftEdge = inSel && !leftIn;
                    const isRightEdge = inSel && !rightIn;
                    const rounded = !inSel
                      ? "rounded-[5px]"
                      : isLeftEdge && isRightEdge
                        ? "rounded-[5px]"
                        : isLeftEdge
                          ? "rounded-l-[5px] rounded-r-none"
                          : isRightEdge
                            ? "rounded-r-[5px] rounded-l-none"
                            : "rounded-none";
                    return (
                      <td
                        key={i}
                        role="gridcell"
                        aria-selected={selected}
                        className={GRID_CELL_CLASS}
                      >
                        <span
                          role="button"
                          tabIndex={-1}
                          aria-label={d.toLocaleDateString(locale)}
                          aria-disabled={disabled || undefined}
                          data-testid={`calendar/cell/date-${d.getDate()}`}
                          className={cn(
                            "z-[1] outline-none block h-9 w-full text-[14px] font-normal text-center border border-transparent m-0 leading-9 transition-[background-color,border-radius] duration-(--uni-duration-fast)",
                            rounded,
                            disabled ? "cursor-not-allowed text-gray-500" : "cursor-pointer",
                            !disabled &&
                              (startDay || endDay
                                ? "bg-[var(--calendar-range-selected-bg)] !text-[var(--calendar-range-selected-fg)]"
                                : inRange(d)
                                  ? "bg-[var(--calendar-range-soft-bg)] text-[var(--calendar-range-soft-fg)]"
                                  : inMonth
                                    ? "text-gray-1000"
                                    : "text-gray-700"),
                          )}
                          onClick={() => {
                            if (!disabled) selectDate(d);
                          }}
                        >
                          {d.getDate()}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Start / End（横向：右列 border-l；纵向：上分割线） */}
        <div
          data-slot="calendar-range-controls"
          className={
            horizontalLayout
              ? "ml-3 flex w-60 shrink-0 self-stretch flex-col border-l border-gray-alpha-200 pl-3"
              : "-ml-3 -mr-3 mt-3 border-t border-gray-alpha-200 px-3 pt-3"
          }
        >
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label>
                  <div className={START_END_LABEL_CLASS}>{t("Start")}</div>
                </label>
              </div>
              <div className="flex gap-2">
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-full")} data-geist-input-wrapper="">
                  <input
                    aria-label={t("Start date")}
                    placeholder={datePattern}
                    aria-invalid={inputErrors["start-date"] || undefined}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    className={cn(
                      DATE_INPUT_CLASS,
                      "text-center",
                      inputErrors["start-date"] &&
                        "!shadow-[0_0_0_1px_var(--danger),0_0_0_4px_color-mix(in_srgb,var(--danger)_20%,transparent)]",
                    )}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={getDateInput("start")}
                    onChange={(event) => setInput("start-date", event.target.value)}
                    onBlur={(event) => updateDate("start", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") updateDate("start", event.currentTarget.value);
                    }}
                  />
                </div>
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-36")} data-geist-input-wrapper="">
                  <input
                    aria-label={t("Start time")}
                    placeholder={clockPattern}
                    aria-invalid={inputErrors["start-time"] || undefined}
                    autoComplete="off"
                    className={cn(
                      DATE_INPUT_CLASS,
                      "text-center",
                      inputErrors["start-time"] &&
                        "!shadow-[0_0_0_1px_var(--danger),0_0_0_4px_color-mix(in_srgb,var(--danger)_20%,transparent)]",
                    )}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={getTimeInput("start")}
                    onChange={(event) => setInput("start-time", event.target.value)}
                    onBlur={(event) => updateTime("start", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") updateTime("start", event.currentTarget.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label>
                  <div className={START_END_LABEL_CLASS}>{t("End")}</div>
                </label>
              </div>
              <div className="flex gap-2">
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-full")} data-geist-input-wrapper="">
                  <input
                    aria-label={t("End date")}
                    placeholder={datePattern}
                    aria-invalid={inputErrors["end-date"] || undefined}
                    autoComplete="off"
                    className={cn(
                      DATE_INPUT_CLASS,
                      "text-center",
                      inputErrors["end-date"] &&
                        "!shadow-[0_0_0_1px_var(--danger),0_0_0_4px_color-mix(in_srgb,var(--danger)_20%,transparent)]",
                    )}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={getDateInput("end")}
                    onChange={(event) => setInput("end-date", event.target.value)}
                    onBlur={(event) => updateDate("end", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") updateDate("end", event.currentTarget.value);
                    }}
                  />
                </div>
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-36")} data-geist-input-wrapper="">
                  <input
                    aria-label={t("End time")}
                    placeholder={clockPattern}
                    aria-invalid={inputErrors["end-time"] || undefined}
                    autoComplete="off"
                    className={cn(
                      DATE_INPUT_CLASS,
                      "text-center",
                      inputErrors["end-time"] &&
                        "!shadow-[0_0_0_1px_var(--danger),0_0_0_4px_color-mix(in_srgb,var(--danger)_20%,transparent)]",
                    )}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={getTimeInput("end")}
                    onChange={(event) => setInput("end-time", event.target.value)}
                    onBlur={(event) => updateTime("end", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") updateTime("end", event.currentTarget.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 横向布局时，操作组锚定至右列底部；纵向布局仍按表单流显示。 */}
          <div
            className={horizontalLayout ? "mt-auto pt-3" : "mt-3"}
            data-slot="calendar-range-actions"
          >
            <div data-slot="calendar-apply">
              <Button
                className="w-full"
                size="small"
                type="secondary"
                typeName="button"
                onClick={() => {
                  const range = { start, end };
                  onApply?.(range);
                  onValueChange?.(range);
                }}
              >
                {t("Apply")}
                <span className="ml-2 text-xs" aria-hidden>
                  ↵
                </span>
              </Button>
            </div>

            {/* 时区选择器（mt-1 为 Geist 4px 档） */}
            <div className="mt-1 flex justify-center">
              <span className="text-xs text-gray-800">
                {pinnedTimezone
                  ? t("Timezone: {timeZone}", { timeZone: pinnedTimezone })
                  : t("Local ({timeZone})", { timeZone })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
