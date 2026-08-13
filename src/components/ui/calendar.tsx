import * as React from "react";

import { cn } from "@/lib/utils";

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
 * - trigger 按钮 w-[var(--width)]，中号 36px（--ds-size-medium）/ 小号 32px；
 * - 文本 span.truncate 由按钮 [&>span]:nth-[2]:w-full 撑满剩余宽度（不依赖字体度量）；
 * - 骨架 span[data-geist-skeleton] 常驻（加载占位，包裹触发按钮）。
 */
const SKELETON_CLASS =
  "rounded-[5px] after:animate-loading-skeleton block relative after:absolute after:inset-0 after:right-[-200%] after:bg-gradient-to-r after:from-gray-100 after:via-gray-200 after:to-gray-100 after:bg-[length:50%_100%] after:bg-[position:0_0] visible overflow-visible after:content-none after:invisible";

const TRIGGER_MEDIUM_CLASS =
  "outline-none m-0 p-0 border-0 align-baseline no-underline group/trigger relative cursor-pointer select-none transform translate-z-0 flex text-[var(--themed-fg,_var(--ds-background-100))] bg-[var(--themed-bg,_var(--ds-gray-1000))] !px-(--geist-gap-half) max-w-full items-center justify-center transition-[border-color, background,color,transform,box-shadow] ease-in-out data-[focus]:shadow-[var(--ds-focus-ring)] [&_svg]:shrink-0 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)] disabled:bg-[var(--ds-gray-100)] aria-disabled:text-[var(--ds-gray-700)] aria-disabled:bg-[var(--ds-gray-100)] disabled:![--themed-border:_var(--ds-gray-400)] [--x-padding:10px] [--height:var(--ds-size-medium)] text-[14px] !pl-[var(--x-padding)] !pr-[var(--x-padding)] rounded-md [--themed-bg:_var(--ds-background-100)] shadow-[0_0_0_1px_var(--themed-border,_transparent)] [--themed-hover-bg:_var(--ds-gray-alpha-200)] [--themed-fg:_var(--ds-gray-1000)] [--themed-border:_var(--ds-gray-400)] data-[focus]:shadow-[0_0_0_1px_var(--themed-border,_transparent),0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)] data-[focus]:transition-none h-[var(--height)] text-gray-700! dark-theme:data-[focus]:!shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] data-[focus]:!shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] hover:z-1 hover:cursor-pointer group-hover/calendar:shadow-[0_0_0_1px_var(--ds-gray-500)] font-normal !text-[14px] [&>span:nth-of-type(2)]:pl-1.5 [&>span:nth-of-type(2)]:pr-1.5 [&>span]:nth-[2]:pr-5 [&>span]:nth-[2]:w-full !font-normal transition-[box-shadow] duration-150 w-[var(--width)]";

const TRIGGER_SMALL_CLASS =
  "outline-none m-0 p-0 border-0 align-baseline no-underline group/trigger relative cursor-pointer select-none transform translate-z-0 flex text-[var(--themed-fg,_var(--ds-background-100))] bg-[var(--themed-bg,_var(--ds-gray-1000))] !px-(--geist-gap-half) max-w-full items-center justify-center transition-[border-color, background,color,transform,box-shadow] ease-in-out data-[focus]:shadow-[var(--ds-focus-ring)] [&_svg]:shrink-0 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)] disabled:bg-[var(--ds-gray-100)] aria-disabled:text-[var(--ds-gray-700)] aria-disabled:bg-[var(--ds-gray-100)] disabled:![--themed-border:_var(--ds-gray-400)] [--x-padding:6px] [--height:32px] !pl-[var(--x-padding)] !pr-[var(--x-padding)] rounded-md [--themed-bg:_var(--ds-background-100)] shadow-[0_0_0_1px_var(--themed-border,_transparent)] [--themed-hover-bg:_var(--ds-gray-alpha-200)] [--themed-fg:_var(--ds-gray-1000)] [--themed-border:_var(--ds-gray-400)] data-[focus]:shadow-[0_0_0_1px_var(--themed-border,_transparent),0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)] data-[focus]:transition-none text-(length:--geist-form-small-font) [--spinner-size:16px] h-[var(--height)] text-gray-700! dark-theme:data-[focus]:!shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] data-[focus]:!shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] hover:z-1 hover:cursor-pointer group-hover/calendar:shadow-[0_0_0_1px_var(--ds-gray-500)] font-normal !text-[14px] [&>span:nth-of-type(2)]:pl-1.5 [&>span:nth-of-type(2)]:pr-1.5 [&>span]:nth-[2]:pr-5 [&>span]:nth-[2]:w-full !font-normal transition-[box-shadow] duration-150 w-[var(--width)]";

/** 紧凑排布（trigger 左侧圆角、combobox 右侧圆角）时 trigger 按钮附加类（官方原样）。 */
const TRIGGER_ROW_EXTRA_CLASS = "rounded-l-none [&_button]:rounded-l-none [&_button]:border-l";

const ICON_SPAN_CLASS =
  "mr-[3px] min-w-5 shrink-0 flex items-center justify-center [&_svg[data-slot=geist-icon]]:size-(--ds-control-decoration-size)";

const ICON_SVG_CLASS = "size-(--ds-control-decoration-size) -mt-px";

const TEXT_SPAN_CLASS = "truncate inline-block px-1.5";

/** 触发按钮 inline style（官方原样）。 */
const TRIGGER_INLINE_STYLE = {
  display: "flex",
  justifyContent: "space-between",
  textAlign: "left",
  fontWeight: 400,
  "--geist-icon-size": "16px",
} as React.CSSProperties;

/** 小号触发按钮 inline style：额外固定高度（官方原样，--ds-size-small 由根节点注入）。 */
const TRIGGER_SMALL_INLINE_STYLE = {
  ...TRIGGER_INLINE_STYLE,
  height: "var(--ds-size-small)",
  minHeight: "var(--ds-size-small)",
} as React.CSSProperties;

/** cmdk Combobox 根节点类（官方原样；高度按尺寸追加）。 */
const COMBO_ROOT_CLASS =
  "relative flex [&_[data-radix-popper-content-wrapper]]:!absolute [&_[data-radix-popper-content-wrapper]]:!transform-none [&_[data-radix-popper-content-wrapper]]:!opacity-100";

/** sr-only 标签 inline style（官方原样）。 */
const SR_ONLY_LABEL_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

const CHEVRON_SVG_CLASS =
  "size-(--ds-control-decoration-size) right-3 pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-150 peer-focus/comboboxInput:rotate-180";

const CHEVRON_SVG_SMALL_CLASS =
  "size-(--ds-control-decoration-size) pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-150 peer-focus/comboboxInput:rotate-180 right-[9px]";

const CIRCULAR_SVG_CLASS =
  "pointer-events-none absolute z-10 size-(--ds-control-decoration-size) top-[9px] left-[9px]";

const CIRCULAR_SVG_MEDIUM_CLASS =
  "pointer-events-none absolute left-[13px] z-10 size-(--ds-control-decoration-size) top-[11px]";

/** 小方块 combobox 左分隔线（官方原样）。 */
const DIVIDER_SQUARE_CLASS =
  "absolute -top-px -bottom-px z-[1] w-px bg-[var(--ds-gray-900)] opacity-0 transition-opacity duration-150 right-auto left-px";

/** 通栏 combobox 右分隔线（官方原样）。 */
const DIVIDER_FULL_CLASS =
  "absolute -top-px -right-px -bottom-px z-[1] w-px bg-[var(--ds-gray-900)] opacity-0 transition-opacity duration-150";

const GEIST_ICON_ATTRS = {
  viewBox: "0 0 16 16",
  height: 16,
  width: 16,
  "data-slot": "geist-icon",
} as const;

interface CalendarComboboxProps {
  size: "medium" | "small";
  /** 通栏模式：占满 --width（Select Period），否则为小方块（宽度随尺寸）。 */
  full?: boolean;
  /** 通栏模式下输入框是否带 w-[var(--width)]（官方 item3 有、item4 无）。 */
  wide?: boolean;
  placeholder?: string;
  label: string;
}

function CalendarCombobox({ size, full, wide, placeholder = "", label }: CalendarComboboxProps) {
  const sizeToken = size === "small" ? "small" : "medium";
  const inputClass = full
    ? size === "small"
      ? wide
        ? "peer/comboboxInput rounded-[5px] rounded-r-none font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none w-[var(--width)] text-[var(--ds-gray-700)] h-(--ds-size-small) px-[34px]"
        : "peer/comboboxInput rounded-[5px] rounded-r-none font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none text-[var(--ds-gray-700)] h-(--ds-size-small) px-[34px]"
      : wide
        ? "peer/comboboxInput px-9 h-(--ds-size-medium) rounded-[5px] rounded-r-none font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none w-[var(--width)] text-[var(--ds-gray-700)]"
        : "peer/comboboxInput px-9 h-(--ds-size-medium) rounded-[5px] rounded-r-none font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] font-normal !w-[var(--width)] rounded-tr-[5px] rounded-b-none text-left text-[14px] outline-none text-[var(--ds-gray-700)]"
    : size === "small"
      ? "peer/comboboxInput px-9 rounded-[5px] rounded-r-none text-[14px] font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] outline-none relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] font-normal [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] pl-2 !rounded-l-none !rounded-r-[5px] text-[var(--ds-gray-700)] h-(--ds-size-small) pr-[34px]"
      : "peer/comboboxInput px-9 h-(--ds-size-medium) rounded-[5px] rounded-r-none text-[14px] font-[var(--geist-sans)] whitespace-nowrap shadow-[0_0_0_1px_var(--ds-gray-400)] outline-none relative bg-[var(--ds-background-100)] [background-clip:_padding-box] placeholder:text-[var(--ds-gray-700)] hover:cursor-pointer hover:!bg-[var(--ds-gray-100)] font-normal [&_[data-geist-button]]:font-normal transition-[box-shadow] duration-150 hover:z-10 hover:shadow-[0_0_0_1px_var(--ds-gray-500)] dark-theme:focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] !outline-none focus:z-10 focus:shadow-[0_0_0_1px_var(--ds-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] pl-2 !rounded-l-none !rounded-r-[5px] text-[var(--ds-gray-700)]";

  const chevronClass = size === "small" ? CHEVRON_SVG_SMALL_CLASS : CHEVRON_SVG_CLASS;
  const circularClass = size === "small" ? CIRCULAR_SVG_CLASS : CIRCULAR_SVG_MEDIUM_CLASS;

  return (
    <div tabIndex={-1} className={cn(COMBO_ROOT_CLASS, `h-(--ds-size-${sizeToken})`)} cmdk-root="">
      <label
        cmdk-label=""
        htmlFor="radix-calendar-combobox-input"
        id="radix-calendar-combobox-label"
        style={SR_ONLY_LABEL_STYLE}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={inputClass}
          data-error="false"
          data-testid="calendar/combobox-input"
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded="true"
          aria-controls="radix-calendar-combobox"
          data-state="closed"
          cmdk-input=""
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-autocomplete="list"
          role="combobox"
          aria-labelledby="radix-calendar-combobox-label"
          id="radix-calendar-combobox-input"
          type="text"
          defaultValue=""
          style={
            full
              ? { paddingRight: "0px" }
              : { paddingRight: "0px", width: `var(--ds-size-${sizeToken})`, color: "transparent" }
          }
        />
        {full && (
          <svg
            {...GEIST_ICON_ATTRS}
            data-glyph="circular"
            style={{ color: "var(--ds-gray-700)" }}
            className={circularClass}
          >
            <path
              fill="currentColor"
              d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13m.75 6.12 1.7 1.28.6.45-.9 1.2-.6-.45-1.9-1.43a1 1 0 0 1-.4-.8V3.5h1.5z"
            />
          </svg>
        )}
        <svg {...GEIST_ICON_ATTRS} style={{ color: "var(--ds-gray-700)" }} className={chevronClass}>
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z"
          />
        </svg>
        <div aria-hidden="true" className={full ? DIVIDER_FULL_CLASS : DIVIDER_SQUARE_CLASS} />
      </div>
    </div>
  );
}

interface CalendarProps {
  className?: string;
  /** 触发按钮文案（官方 "Select Date Range"） */
  label?: string;
  size?: "medium" | "small";
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
}

function Calendar({
  className,
  label = "Select Date Range",
  size = "medium",
  width = 250,
  showCombobox = false,
  comboboxFirst = false,
  comboboxFull = false,
  comboboxWide = false,
  comboboxPlaceholder = "",
  triggerClassName,
  comboboxLabel = "Combobox Menu",
}: CalendarProps) {
  const isSmall = size === "small";
  const groupClass = showCombobox
    ? "group/calendar relative inline-flex w-full"
    : "group/calendar relative inline-flex";

  return (
    <div
      data-geist-calendar=""
      data-version="v1"
      className={className}
      style={
        { "--width": `${width}px`, width: "auto", "--ds-size-small": "32px" } as React.CSSProperties
      }
    >
      {comboboxFirst && showCombobox && (
        <CalendarCombobox
          size={size}
          full={comboboxFull}
          wide={comboboxWide}
          placeholder={comboboxPlaceholder}
          label={comboboxLabel}
        />
      )}
      <span
        data-geist-skeleton=""
        data-testid="legacy/skeleton"
        data-version="v1"
        className={SKELETON_CLASS}
        style={{ width: "var(--width)" }}
      >
        <div className={groupClass}>
          <button
            type="submit"
            tabIndex={0}
            data-react-aria-pressable="true"
            aria-haspopup="dialog"
            aria-expanded={false}
            aria-controls="radix-calendar-trigger"
            data-testid="calendar/trigger/button"
            style={isSmall ? TRIGGER_SMALL_INLINE_STYLE : TRIGGER_INLINE_STYLE}
            title={label}
            data-state="closed"
            className={cn(isSmall ? TRIGGER_SMALL_CLASS : TRIGGER_MEDIUM_CLASS, triggerClassName)}
            data-geist-button=""
            data-prefix="true"
            data-suffix="false"
            data-version="v1"
          >
            <span className={ICON_SPAN_CLASS}>
              <svg
                {...GEIST_ICON_ATTRS}
                style={{ color: "var(--ds-gray-700)" }}
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
            <span className={TEXT_SPAN_CLASS}>{label}</span>
          </button>
        </div>
      </span>
      {!comboboxFirst && showCombobox && (
        <CalendarCombobox
          size={size}
          full={comboboxFull}
          wide={comboboxWide}
          placeholder={comboboxPlaceholder}
          label={comboboxLabel}
        />
      )}
    </div>
  );
}

/** 官方紧凑排布根类：trigger 左侧圆角 + combobox 右侧圆角（compact / sizes item2）。 */
const CALENDAR_ROW_CLASS =
  "flex items-center [&_[data-geist-button]]:rounded-l-[5px] [&_[data-geist-button]]:rounded-r-none [&_[data-geist-select]]:rounded-l-none [&_[data-geist-select]]:rounded-r-[5px] [&_input]:rounded-l-[5px] [&_input]:rounded-r-none";

/** 官方反向排布根类：combobox 左侧圆角 + trigger 右侧圆角（sizes item4）。 */
const CALENDAR_ROW_REV_CLASS =
  "flex items-center [&_[data-geist-button]]:rounded-l-none [&_[data-geist-button]]:rounded-r-[5px] [&_input]:rounded-l-[5px] [&_input]:rounded-r-none";

/** 官方纵向排布根类：combobox 在上、trigger 在下（sizes item3）。 */
function calendarColClass(size: "medium" | "small"): string {
  return `[&_[data-geist-button]]:transform-none [&_[data-geist-button]]:rounded-[5px] [&_[data-geist-button]]:rounded-t-none [&_[data-geist-button]]:text-[1rem] inline-flex flex-col [&_[data-geist-button]]:!rounded-[5px] [&_[data-geist-button]]:!rounded-t-none h-(--ds-size-${size}) [&_[data-geist-select]_select]:rounded-t [&_[data-geist-select]_select]:rounded-br-none [&_[data-geist-select]_select]:rounded-bl-none`;
}

export {
  Calendar,
  calendarColClass,
  CALENDAR_ROW_CLASS,
  CALENDAR_ROW_REV_CLASS,
  TRIGGER_ROW_EXTRA_CLASS,
};
