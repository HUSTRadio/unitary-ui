import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { type RangeColorScheme } from "@/lib/calendar-colors";
import { formatDateTime } from "@/lib/date-time";
import { useI18n } from "@/lib/i18n";
import { getRelativeTimePresets } from "@/lib/date-locale";

/**
 * Calendar — 日期范围选择器（对应官方 geist Calendar，关闭态视觉复刻）。
 *
 * 官方为 Popover 日期范围选择器（Trigger 按钮 + 快速选择 Combobox + 弹出面板），
 * 打开态 Popover 超出本组件范围（BLOCKED，见 manifest）。本组件逐字复刻官方
 * 关闭态 DOM：div[data-geist-calendar] > span[data-geist-skeleton]（包裹
 * group/calendar > trigger button）+ 可选 cmdk Combobox（快速选择输入框）。
 * 类名与官方一致（Tailwind v4 同一引擎），计算样式/几何逐像素对齐。
 *
 * 实测（Light 1440×900，2026-08-13）：
 * - trigger 按钮 w-[var(--width)]，中号 36px（--uni-size-medium）/ 小号 32px；
 * - 文本 span.truncate 由按钮 [&>span]:nth-[2]:w-full 撑满剩余宽度（不依赖字体度量）；
 * - 骨架 span[data-geist-skeleton] 常驻（加载占位，包裹触发按钮）。
 */
import {
  CALENDAR_ROW_CLASS,
  CALENDAR_ROW_REV_CLASS,
  CHEVRON_SVG_CLASS,
  CHEVRON_SVG_SMALL_CLASS,
  CIRCULAR_SVG_CLASS,
  CIRCULAR_SVG_MEDIUM_CLASS,
  COMBO_GROUP_CLASS,
  COMBO_HINT_BUTTON_CLASS,
  COMBO_HINT_COL_CLASS,
  COMBO_HINT_TITLE_CLASS,
  COMBO_HINT_WRAP_CLASS,
  COMBO_ITEM_CLASS,
  COMBO_MENU_CLASS,
  COMBO_ROOT_CLASS,
  DIVIDER_FULL_CLASS,
  DIVIDER_SQUARE_CLASS,
  GEIST_ICON_ATTRS,
  ICON_SPAN_CLASS,
  ICON_SVG_CLASS,
  SKELETON_CLASS,
  SR_ONLY_LABEL_STYLE,
  TEXT_SPAN_CLASS,
  TRIGGER_INLINE_STYLE,
  TRIGGER_MEDIUM_CLASS,
  TRIGGER_ROW_EXTRA_CLASS,
  TRIGGER_SMALL_CLASS,
  TRIGGER_SMALL_INLINE_STYLE,
  calendarColClass,
} from "./calendar-classes";
import { CalendarPanel } from "./calendar-panel";

type CalendarSize = "medium" | "small";

interface CalendarDateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarPreset {
  text: string;
  start: Date;
  end: Date;
}

type CalendarPresets = Record<string, CalendarPreset>;

interface CalendarComboboxProps {
  size: CalendarSize;
  /** 通栏模式：占满 --width（Select Period），否则为小方块（宽度随尺寸）。 */
  full?: boolean;
  /** 通栏模式下输入框是否带 w-[var(--width)]（官方 item3 有、item4 无）。 */
  wide?: boolean;
  placeholder?: string;
  label: string;
  /** 快速选择 preset 映射（官方 presets：{key: {text, start, end}}）。 */
  presets?: CalendarPresets;
  /** 受控选中值（preset text）。 */
  value?: string;
  onValueChange?: (value: string) => void;
  /** 默认选中 preset 索引（官方 presetIndex）。 */
  defaultIndex?: number;
  /** 语言 locale（BCP 47），驱动相对时间快捷按钮文案。 */
  locale: string;
}

function CalendarCombobox({
  size,
  full,
  wide,
  placeholder = "",
  label,
  presets = {},
  value,
  onValueChange,
  defaultIndex,
  locale = "en-US",
}: CalendarComboboxProps) {
  const { t } = useI18n();
  const inputId = React.useId();
  const labelId = React.useId();
  const sizeToken = size === "small" ? "small" : "medium";
  const presetEntries = Object.entries(presets);
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(() =>
    defaultIndex !== undefined ? (presetEntries[defaultIndex]?.[1]?.text ?? "") : "",
  );
  const currentValue = value !== undefined ? value : internalValue;

  const select = (text: string) => {
    setInternalValue(text);
    onValueChange?.(text);
    setOpen(false);
  };
  const inputClass = full
    ? size === "small"
      ? wide
        ? "peer/comboboxInput rounded-[5px] rounded-r-none font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none w-[var(--width)] text-[var(--uni-gray-700)] h-(--uni-size-small) px-[34px]"
        : "peer/comboboxInput rounded-[5px] rounded-r-none font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none text-[var(--uni-gray-700)] h-(--uni-size-small) px-[34px]"
      : wide
        ? "peer/comboboxInput px-9 h-(--uni-size-medium) rounded-[5px] rounded-r-none font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none w-[var(--width)] text-[var(--uni-gray-700)]"
        : "peer/comboboxInput px-9 h-(--uni-size-medium) rounded-[5px] rounded-r-none font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none text-[var(--uni-gray-700)]"
    : size === "small"
      ? "peer/comboboxInput px-9 rounded-[5px] rounded-r-none text-[14px] font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] outline-none relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] font-normal [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] pl-2 !rounded-l-none !rounded-r-[5px] text-[var(--uni-gray-700)] h-(--uni-size-small) pr-[34px]"
      : "peer/comboboxInput px-9 h-(--uni-size-medium) rounded-[5px] rounded-r-none text-[14px] font-[var(--font-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--uni-gray-400)] outline-none relative bg-[var(--uni-background-100)] [background-clip:_padding-box] placeholder:text-[var(--uni-gray-700)] hover:cursor-pointer hover:!bg-[var(--uni-gray-100)] font-normal [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-(--uni-duration-fast) hover:z-10 hover:shadow-[0_0_0_1px_var(--uni-gray-500)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] pl-2 !rounded-l-none !rounded-r-[5px] text-[var(--uni-gray-700)]";

  const chevronClass = size === "small" ? CHEVRON_SVG_SMALL_CLASS : CHEVRON_SVG_CLASS;
  const circularClass = size === "small" ? CIRCULAR_SVG_CLASS : CIRCULAR_SVG_MEDIUM_CLASS;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div
        tabIndex={-1}
        className={cn(COMBO_ROOT_CLASS, `h-(--uni-size-${sizeToken})`)}
        cmdk-root=""
      >
        <label
          cmdk-label=""
          htmlFor={inputId}
          id={labelId}
          style={SR_ONLY_LABEL_STYLE}
        >
          {label}
        </label>
        <div className="relative">
          <PopoverPrimitive.Trigger asChild>
            <input
              className={inputClass}
              data-error="false"
              data-testid="calendar/combobox-input"
              placeholder={placeholder}
              cmdk-input=""
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-autocomplete="list"
              role="combobox"
              aria-labelledby={labelId}
              id={inputId}
              type="text"
              readOnly
              value={currentValue}
              onChange={() => {}}
              style={
                full
                  ? { paddingRight: "0px" }
                  : {
                      paddingRight: "0px",
                      width: `var(--uni-size-${sizeToken})`,
                      color: "transparent",
                    }
              }
            />
          </PopoverPrimitive.Trigger>
          {full && (
            <svg
              {...GEIST_ICON_ATTRS}
              data-glyph="circular"
              style={{ color: "var(--uni-gray-700)" }}
              className={circularClass}
            >
              <path
                fill="currentColor"
                d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m.75 6.12 1.7 1.28.6.45-.9 1.2-.6-.45-1.9-1.43a1 1 0 0 1-.4-.8V3.5h1.5z"
              />
            </svg>
          )}
          <svg
            {...GEIST_ICON_ATTRS}
            style={{ color: "var(--uni-gray-700)" }}
            className={cn(chevronClass, open && "rotate-180")}
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z"
            />
          </svg>
          <div aria-hidden="true" className={full ? DIVIDER_FULL_CLASS : DIVIDER_SQUARE_CLASS} />
        </div>
        {Object.keys(presets).length > 0 && (
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={8}
              className={cn(COMBO_MENU_CLASS, full && "grid-cols-2")}
              style={{
                width: full
                  ? "calc(var(--radix-popover-trigger-width) * 2 + 2px)"
                  : "var(--radix-popover-trigger-width)",
                minWidth: full ? "370px" : "165px",
              }}
            >
              <div
                className={cn(
                  COMBO_GROUP_CLASS,
                  full && "border-r border-[var(--uni-gray-alpha-400)]",
                )}
              >
                {presetEntries.map(([key, { text }]) => (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      COMBO_ITEM_CLASS,
                      "w-full",
                      currentValue === text && "bg-[var(--uni-gray-alpha-300)]",
                    )}
                    onClick={() => select(text)}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      {text}
                      <span className="text-gray-900" />
                    </div>
                  </button>
                ))}
              </div>
              {full && (
                <div className={COMBO_HINT_COL_CLASS}>
                  <p className={COMBO_HINT_TITLE_CLASS}>{t("Type relative times")}</p>
                  <div className={COMBO_HINT_WRAP_CLASS}>
                    {getRelativeTimePresets(locale).map((text) => (
                      <button
                        key={text}
                        type="button"
                        className={COMBO_HINT_BUTTON_CLASS}
                        onClick={() => select(text)}
                        onMouseUp={(event) => event.preventDefault()}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </div>
    </PopoverPrimitive.Root>
  );
}

interface CalendarProps {
  className?: string;
  /** 触发按钮文案（官方 "Select Date Range"） */
  label?: string;
  size?: CalendarSize;
  /** --width 值：触发按钮/骨架宽度（官方 default 250、紧凑排布 180） */
  width?: number;
  /** 渲染快速选择 Combobox */
  showCombobox?: boolean;
  /** combobox 在 trigger 之前（官方 sizes item3/item4） */
  comboboxFirst?: boolean;
  /** combobox 通栏模式（Select Period） */
  comboboxFull?: boolean;
  /** 通栏输入框带 w-[var(--width)]（官方 item3） */
  comboboxWide?: boolean;
  /** 通栏 combobox 占位文案（官方 "Select Period"） */
  comboboxPlaceholder?: string;
  /** 触发按钮附加类（官方紧凑排布 rounded-l-none 等） */
  triggerClassName?: string;
  /** combobox 的 sr-only 标签文案（官方 "Combobox Menu"） */
  comboboxLabel?: string;
  /** 快速选择 preset 映射（官方 presets：{key: {text, start, end}}）。 */
  presets?: CalendarPresets;
  /** 选中日期范围变化回调（官方 onChange：preset 选中 / Apply / 日历点选均触发）。 */
  onChange?: (range: CalendarDateRange) => void;
  /** 打开态横向布局（官方 horizontalLayout：日历在左、Start/End 在右） */
  horizontalLayout?: boolean;
  /** 紧凑排布（官方 compact：trigger 左圆角 + combobox 右圆角，宽 180） */
  compact?: boolean;
  /** 纵向堆叠（官方 stacked：combobox 在上、trigger 在下） */
  stacked?: boolean;
  /** 固定时区标签（官方 pinnedTimezone，覆盖默认 Local 时区） */
  pinnedTimezone?: string;
  /** 默认选中 preset 索引（官方 presetIndex，触发按钮显示该 preset 的日期范围） */
  presetIndex?: number;
  /** 可选最小日期（官方 minValue，范围外日期禁用） */
  minValue?: Date;
  /** 可选最大日期（官方 maxValue，范围外日期禁用） */
  maxValue?: Date;
  /** 语言 locale（BCP 47），驱动日期格式/星期起始/月份标题/相对时间文案 */
  locale?: string;
  /** IANA 时区；未声明时读取当前浏览器用户时区。 */
  timeZone?: string;
  /** Unicode LDML/UTS#35 日期格式，例如 yyyy/MM/dd。 */
  dateTimeFormat?: string;
  /** Unicode LDML/UTS#35 时间格式，例如 HH:mm。 */
  timeFormat?: string;
  /** 覆盖日期区间端点与中段的语义颜色。 */
  colorScheme?: Partial<RangeColorScheme>;
  /** 允许 trigger 的日期范围按日期对象整体自动换行。 */
  wrap?: boolean;
  wrapWidth?: number;
  wrapMinWidth?: number;
  wrapMaxWidth?: number;
  wrapMinHeight?: number;
  wrapMaxHeight?: number;
  wrapMinRows?: number;
  wrapMaxRows?: number;
}

function Calendar({
  className,
  label: labelProp,
  size = "medium",
  width = 250,
  showCombobox = false,
  comboboxFirst = false,
  comboboxFull = false,
  comboboxWide = false,
  comboboxPlaceholder = "",
  triggerClassName,
  comboboxLabel: comboboxLabelProp,
  presets = {},
  horizontalLayout = false,
  compact = false,
  stacked = false,
  pinnedTimezone,
  presetIndex,
  minValue,
  maxValue,
  locale: localeProp,
  timeZone,
  dateTimeFormat,
  timeFormat,
  colorScheme,
  wrap = false,
  wrapWidth,
  wrapMinWidth,
  wrapMaxWidth,
  wrapMinHeight,
  wrapMaxHeight,
  wrapMinRows = 1,
  wrapMaxRows = 3,
  onChange,
}: CalendarProps) {
  const { t, locale: frameworkLocale } = useI18n();
  const locale = localeProp ?? (frameworkLocale === "en" ? "en-US" : frameworkLocale);
  const label = labelProp ?? t("Select Date Range");
  const comboboxLabel = comboboxLabelProp ?? t("Combobox Menu");
  const isSmall = size === "small";
  // compact/stacked 隐含 combobox + 排布（官方：compact 横向紧凑、stacked 纵向堆叠）
  const effectiveShowCombobox = showCombobox || compact || stacked;
  const effectiveComboboxFirst = compact ? false : stacked ? true : comboboxFirst;
  const effectiveComboboxFull = stacked ? true : comboboxFull;
  const effectiveWidth = compact ? 180 : width;
  const rowHeight = 21;
  const minimumHeight = Math.max(wrapMinHeight ?? 0, wrapMinRows * rowHeight);
  const maximumHeight = Math.min(
    wrapMaxHeight ?? Number.POSITIVE_INFINITY,
    wrapMaxRows * rowHeight,
  );
  if (import.meta.env.DEV && wrap && minimumHeight > maximumHeight) {
    throw new Error("Calendar wrapMinHeight/wrapMinRows cannot exceed wrapMaxHeight/wrapMaxRows");
  }
  const effectiveClassName = compact
    ? cn(CALENDAR_ROW_CLASS, className)
    : stacked
      ? cn(calendarColClass(size), className)
      : className;
  const groupClass = effectiveShowCombobox
    ? "group/calendar relative inline-flex w-full"
    : "group/calendar relative inline-flex";

  // Apply 后写回 trigger 的已选范围（官方 onChange 受控语义的非受控内部实现）
  const [applied, setApplied] = React.useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const appliedLabel =
    applied.start && applied.end
      ? `${formatDateTime(applied.start, { locale, timeZone, dateTimeFormat })} – ${formatDateTime(applied.end, { locale, timeZone, dateTimeFormat })}`
      : label;
  const triggerStyle: React.CSSProperties = {
    ...(isSmall ? TRIGGER_SMALL_INLINE_STYLE : TRIGGER_INLINE_STYLE),
    ...(wrap
      ? {
          minWidth: wrapMinWidth ?? effectiveWidth,
          maxWidth: wrapMaxWidth ?? wrapWidth ?? effectiveWidth,
          minHeight: minimumHeight,
          maxHeight: maximumHeight,
          overflow: "hidden",
        }
      : {}),
  };
  const rootStyle = {
    "--width": `${effectiveWidth}px`,
    width: "auto",
    "--uni-size-small": "32px",
    ...(wrap
      ? {
          "--wrap-width": `${wrapWidth ?? effectiveWidth}px`,
          "--wrap-min-width": `${wrapMinWidth ?? effectiveWidth}px`,
          "--wrap-max-width": `${wrapMaxWidth ?? wrapWidth ?? effectiveWidth}px`,
          "--wrap-min-height": `${minimumHeight}px`,
          "--wrap-max-height": `${maximumHeight}px`,
          "--wrap-min-rows": String(wrapMinRows),
          "--wrap-max-rows": String(wrapMaxRows),
        }
      : {}),
  } as React.CSSProperties;

  // preset 选中：按 text 查映射，写回 applied + 触发 onChange
  const handlePresetSelect = (text: string) => {
    const entry = Object.values(presets).find((p) => p.text === text);
    if (!entry) return;
    const range = { start: entry.start, end: entry.end };
    setApplied(range);
    onChange?.(range);
  };

  return (
    <div data-geist-calendar="" data-version="v1" className={effectiveClassName} style={rootStyle}>
      {effectiveComboboxFirst && effectiveShowCombobox && (
        <CalendarCombobox
          size={size}
          full={effectiveComboboxFull}
          wide={comboboxWide}
          placeholder={comboboxPlaceholder}
          label={comboboxLabel}
          presets={presets}
          defaultIndex={presetIndex}
          locale={locale}
          onValueChange={handlePresetSelect}
        />
      )}
      <PopoverPrimitive.Root>
        <span
          data-geist-skeleton=""
          data-testid="legacy/skeleton"
          data-version="v1"
          className={SKELETON_CLASS}
          style={{ width: "var(--width)" }}
        >
          <div className={groupClass}>
            <PopoverPrimitive.Trigger asChild>
              <button
                type="button"
                tabIndex={0}
                data-react-aria-pressable="true"
                aria-haspopup="dialog"
                data-testid="calendar/trigger/button"
                style={triggerStyle}
                title={label}
                className={cn(
                  isSmall ? TRIGGER_SMALL_CLASS : TRIGGER_MEDIUM_CLASS,
                  wrap ? "!whitespace-normal items-start py-1" : "whitespace-nowrap",
                  triggerClassName,
                )}
                data-geist-button=""
                data-prefix="true"
                data-suffix="false"
                data-version="v1"
              >
                <span className={ICON_SPAN_CLASS}>
                  <svg
                    {...GEIST_ICON_ATTRS}
                    style={{ color: "var(--uni-gray-700)" }}
                    className={ICON_SVG_CLASS}
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5.5V2h5V.5H12V2h3.5v11.5A2.5 2.5 0 0 1 13 16H3a2.5 2.5 0 0 1-2.5-2.5V2H4V.5zM2 3.5h12V6H2zm0 4v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6z"
                    />
                  </svg>
                </span>
                {wrap && applied.start && applied.end ? (
                  <span className={cn(TEXT_SPAN_CLASS, "!whitespace-normal")}>
                    <span className="whitespace-nowrap">
                      {formatDateTime(applied.start, { locale, timeZone, dateTimeFormat })}
                    </span>
                    {" – "}
                    <span className="whitespace-nowrap">
                      {formatDateTime(applied.end, { locale, timeZone, dateTimeFormat })}
                    </span>
                  </span>
                ) : (
                  <span className={TEXT_SPAN_CLASS}>{appliedLabel}</span>
                )}
              </button>
            </PopoverPrimitive.Trigger>
          </div>
        </span>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="bottom"
            align="start"
            sideOffset={4}
            data-slot="calendar-popover"
            className={cn(
              "group/popover z-30 overflow-x-hidden overflow-y-auto rounded-xl bg-[var(--uni-background-100)] shadow-[var(--uni-shadow-menu)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none!",
              horizontalLayout ? "w-[520px]" : "w-[280px]",
            )}
          >
            <button type="button" className="sr-only" />
            <CalendarPanel
              horizontalLayout={horizontalLayout}
              pinnedTimezone={pinnedTimezone}
              minValue={minValue}
              maxValue={maxValue}
              locale={locale}
              timeZone={timeZone}
              dateTimeFormat={dateTimeFormat}
              timeFormat={timeFormat}
              colorScheme={colorScheme}
              onApply={setApplied}
              value={applied}
              onValueChange={(range) => {
                setApplied(range);
                onChange?.(range);
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {!effectiveComboboxFirst && effectiveShowCombobox && (
        <CalendarCombobox
          size={size}
          full={effectiveComboboxFull}
          wide={comboboxWide}
          placeholder={comboboxPlaceholder}
          label={comboboxLabel}
          presets={presets}
          defaultIndex={presetIndex}
          locale={locale}
          onValueChange={handlePresetSelect}
        />
      )}
    </div>
  );
}

export {
  Calendar,
  calendarColClass,
  CALENDAR_ROW_CLASS,
  CALENDAR_ROW_REV_CLASS,
  TRIGGER_ROW_EXTRA_CLASS,
};
export type { CalendarDateRange, CalendarPreset, CalendarPresets, CalendarProps, CalendarSize };
