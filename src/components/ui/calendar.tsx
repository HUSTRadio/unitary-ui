import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  defaultLocale,
  formatDate,
  getMonthTitle,
  getRelativeTimePresets,
  getWeekStartDay,
  getWeekdayLabels,
} from "@/lib/date-locale";

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
  "size-(--ds-control-decoration-size) right-3 pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-150";

const CHEVRON_SVG_SMALL_CLASS =
  "size-(--ds-control-decoration-size) pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-150 right-[9px]";

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

/** combobox 弹出菜单（官方 cmdk-root：grid 容器 + p-2 group + h-9 item，2026-08-16 实测）。 */
const COMBO_MENU_CLASS =
  "grid bg-[var(--ds-background-100)] rounded-[8px] shadow-[var(--ds-shadow-menu)] overflow-hidden z-[99999999]";

const COMBO_GROUP_CLASS = "p-2";

const COMBO_ITEM_CLASS =
  "max-sm:h-12 max-sm:text-[16px] h-9 text-[14px] px-2 rounded-[5px] flex scroll-m-2 cursor-pointer items-center font-normal text-[var(--ds-gray-1000)] hover:bg-[var(--ds-gray-alpha-300)]";

/** 官方右列「Type relative times」相对时间快捷按钮（showHints，2026-08-16 实测；文案 locale 化）。 */

const COMBO_HINT_COL_CLASS = "p-4 pr-[30px]";

const COMBO_HINT_TITLE_CLASS = "text-copy-14 text-gray-900";

const COMBO_HINT_WRAP_CLASS = "flex flex-wrap mt-2 gap-1";

const COMBO_HINT_BUTTON_CLASS =
  "text-[13px] hover:bg-[hsl(0,0%,87%)] dark-theme:hover:bg-[hsl(0,0%,30%)] px-1.5 h-5 inline-flex items-center font-[var(--font-mono)] bg-[var(--ds-gray-100)] border-none rounded-[4px] cursor-pointer text-[var(--ds-gray-1000)] focus:outline-2 focus:outline-gray-700";

interface CalendarComboboxProps {
  size: "medium" | "small";
  /** 通栏模式：占满 --width（Select Period），否则为小方块（宽度随尺寸）。 */
  full?: boolean;
  /** 通栏模式下输入框是否带 w-[var(--width)]（官方 item3 有、item4 无）。 */
  wide?: boolean;
  placeholder?: string;
  label: string;
  /** 快速选择 preset 文本列表（官方 presets 各条目 text）。 */
  presets?: string[];
  /** 受控选中值（preset text）。 */
  value?: string;
  onValueChange?: (value: string) => void;
  /** 默认选中 preset 索引（官方 presetIndex）。 */
  defaultIndex?: number;
  /** 语言 locale（BCP 47），驱动相对时间快捷按钮文案。 */
  locale?: string;
}

function CalendarCombobox({
  size,
  full,
  wide,
  placeholder = "",
  label,
  presets = [],
  value,
  onValueChange,
  defaultIndex,
  locale = "en-US",
}: CalendarComboboxProps) {
  const sizeToken = size === "small" ? "small" : "medium";
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(() =>
    defaultIndex !== undefined ? (presets[defaultIndex] ?? "") : "",
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
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div
        tabIndex={-1}
        className={cn(COMBO_ROOT_CLASS, `h-(--ds-size-${sizeToken})`)}
        cmdk-root=""
      >
        <label
          cmdk-label=""
          htmlFor="radix-calendar-combobox-input"
          id="radix-calendar-combobox-label"
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
              aria-controls="radix-calendar-combobox"
              cmdk-input=""
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-autocomplete="list"
              role="combobox"
              aria-labelledby="radix-calendar-combobox-label"
              id="radix-calendar-combobox-input"
              type="text"
              readOnly
              value={currentValue}
              onChange={() => {}}
              style={
                full
                  ? { paddingRight: "0px" }
                  : {
                      paddingRight: "0px",
                      width: `var(--ds-size-${sizeToken})`,
                      color: "transparent",
                    }
              }
            />
          </PopoverPrimitive.Trigger>
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
          <svg
            {...GEIST_ICON_ATTRS}
            style={{ color: "var(--ds-gray-700)" }}
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
        {presets.length > 0 && (
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
                  full && "border-r border-[var(--ds-gray-alpha-400)]",
                )}
              >
                {presets.map((text) => (
                  <button
                    key={text}
                    type="button"
                    className={cn(
                      COMBO_ITEM_CLASS,
                      "w-full",
                      currentValue === text && "bg-[var(--ds-gray-alpha-300)]",
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
                  <p className={COMBO_HINT_TITLE_CLASS}>Type relative times</p>
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
  /** 快速选择 preset 文本列表（传给 combobox，官方 presets 各条目 text） */
  presets?: string[];
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
  presets = [],
  horizontalLayout = false,
  compact = false,
  stacked = false,
  pinnedTimezone,
  presetIndex,
  minValue,
  maxValue,
  locale = defaultLocale(),
}: CalendarProps) {
  const isSmall = size === "small";
  // compact/stacked 隐含 combobox + 排布（官方：compact 横向紧凑、stacked 纵向堆叠）
  const effectiveShowCombobox = showCombobox || compact || stacked;
  const effectiveComboboxFirst = compact ? false : stacked ? true : comboboxFirst;
  const effectiveComboboxFull = stacked ? true : comboboxFull;
  const effectiveWidth = compact ? 180 : width;
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
      ? `${formatDate(applied.start, locale)} – ${formatDate(applied.end, locale)}`
      : label;

  return (
    <div
      data-geist-calendar=""
      data-version="v1"
      className={effectiveClassName}
      style={
        {
          "--width": `${effectiveWidth}px`,
          width: "auto",
          "--ds-size-small": "32px",
        } as React.CSSProperties
      }
    >
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
                type="submit"
                tabIndex={0}
                data-react-aria-pressable="true"
                aria-haspopup="dialog"
                aria-controls="radix-calendar-trigger"
                data-testid="calendar/trigger/button"
                style={isSmall ? TRIGGER_SMALL_INLINE_STYLE : TRIGGER_INLINE_STYLE}
                title={label}
                className={cn(
                  isSmall ? TRIGGER_SMALL_CLASS : TRIGGER_MEDIUM_CLASS,
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
                <span className={TEXT_SPAN_CLASS}>{appliedLabel}</span>
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
              "group/popover z-30 overflow-x-hidden overflow-y-auto rounded-[12px] bg-[var(--ds-background-100)] shadow-[var(--ds-shadow-menu)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
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
              onApply={setApplied}
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

/* ---------- 打开态 Popover（官方 date range picker，2026-08-15 实测） ---------- */

/** 当月 42 格日期（从当月 1 号所在周的 weekStart 开始，覆盖 6 周）。 */
function monthGrid(viewYear: number, viewMonth: number, weekStart: number): Date[] {
  const first = new Date(viewYear, viewMonth, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() - weekStart + 7) % 7));
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const PANEL_CONTENT_CLASS = "relative rounded-[6px] p-(--padding) [--padding:_12px]";

const START_END_LABEL_CLASS =
  "block text-[13px] max-w-full text-gray-900 cursor-text capitalize mb-0";

const DATE_INPUT_WRAP_CLASS =
  "flex max-w-full transition-all duration-150 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] overflow-hidden font-normal rounded-md [&>input]:h-8 text-sm [&>input]:px-3 has-[:focus]:!shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark-theme:has-[:focus]:!shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] hover:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]";

const DATE_INPUT_CLASS =
  "inline-flex appearance-none min-w-0 w-full border-none bg-background-100 text-[var(--geist-foreground)] outline-none focus:outline-none disabled:bg-[var(--ds-gray-100)] disabled:text-[var(--ds-gray-700)] disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const NAV_BUTTON_CLASS =
  "p-0.5 active:bg-gray-300 flex aspect-square shrink-0 items-center rounded-full bg-transparent text-[var(--ds-gray-700)] hover:text-[var(--ds-gray-1000)] disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)]";

const GRID_TABLE_CLASS = "relative block table-fixed border-collapse w-full";
const GRID_HEAD_TR_CLASS = "last:mb-0 flex flex-nowrap mt-4 mb-2";
const GRID_HEAD_TH_CLASS =
  "p-0 font-normal flex-1 text-center text-[0.75rem] text-[var(--ds-gray-900)] uppercase";
const GRID_BODY_CLASS = "block !mt-2";
const GRID_ROW_CLASS = "last:mb-0 flex flex-nowrap my-2";
const GRID_CELL_CLASS = "flex-1 flex justify-center size-8 p-0 text-center";

function CalendarPanel({
  horizontalLayout = false,
  pinnedTimezone,
  minValue,
  maxValue,
  locale = defaultLocale(),
  onApply,
}: {
  horizontalLayout?: boolean;
  pinnedTimezone?: string;
  minValue?: Date;
  maxValue?: Date;
  locale?: string;
  /** 点击 Apply 时回调选中的日期范围（官方 onChange 语义）。 */
  onApply?: (range: { start: Date | null; end: Date | null }) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());
  const [start, setStart] = React.useState<Date | null>(null);
  const [end, setEnd] = React.useState<Date | null>(null);

  const timeZone =
    pinnedTimezone ??
    (typeof Intl === "undefined" ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone);

  const cells = monthGrid(viewYear, viewMonth, getWeekStartDay(locale));

  const selectDate = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (d < start) {
      setEnd(start);
      setStart(d);
    } else {
      setEnd(d);
    }
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
    <div className={PANEL_CONTENT_CLASS}>
      <div className={horizontalLayout ? "flex flex-row items-start" : "flex flex-col"}>
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
              aria-label="Previous"
              className={NAV_BUTTON_CLASS}
              onClick={prevMonth}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className={NAV_BUTTON_CLASS}
              onClick={nextMonth}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <table className={GRID_TABLE_CLASS}>
            <caption className="sr-only">Calendar</caption>
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
                            "z-[1] outline-none block h-9 w-full text-[14px] font-normal text-center border border-transparent m-0 leading-9 transition-[background-color,border-radius] duration-150",
                            rounded,
                            disabled ? "cursor-not-allowed text-gray-500" : "cursor-pointer",
                            !disabled &&
                              (startDay || endDay
                                ? "bg-blue-900 !text-background-100"
                                : inRange(d)
                                  ? "bg-blue-100 text-gray-1000"
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
          className={
            horizontalLayout
              ? "ml-3 flex w-60 shrink-0 flex-col border-l border-gray-alpha-200 pl-3"
              : "-ml-3 -mr-3 mt-3 border-t border-gray-alpha-200 px-3 pt-3"
          }
        >
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label>
                  <div className={START_END_LABEL_CLASS}>Start</div>
                </label>
              </div>
              <div className="flex gap-2">
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-full")} data-geist-input-wrapper="">
                  <input
                    aria-labelledby="start-date"
                    placeholder="Jan 01, 2025"
                    aria-invalid="false"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    className={DATE_INPUT_CLASS}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={start ? formatDate(start, locale) : ""}
                    readOnly
                  />
                </div>
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-36")} data-geist-input-wrapper="">
                  <input
                    aria-labelledby="time"
                    placeholder="00:00"
                    aria-invalid="false"
                    autoComplete="off"
                    className={cn(DATE_INPUT_CLASS, "text-center")}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value="00:00"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label>
                  <div className={START_END_LABEL_CLASS}>End</div>
                </label>
              </div>
              <div className="flex gap-2">
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-full")} data-geist-input-wrapper="">
                  <input
                    aria-labelledby="end-date"
                    placeholder="Jan 01, 2025"
                    aria-invalid="false"
                    autoComplete="off"
                    className={DATE_INPUT_CLASS}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={end ? formatDate(end, locale) : ""}
                    readOnly
                  />
                </div>
                <div className={cn(DATE_INPUT_WRAP_CLASS, "w-36")} data-geist-input-wrapper="">
                  <input
                    aria-labelledby="time"
                    placeholder="23:59"
                    aria-invalid="false"
                    autoComplete="off"
                    className={cn(DATE_INPUT_CLASS, "text-center")}
                    data-geist-input=""
                    spellCheck="false"
                    type="text"
                    value={end ? "23:59" : "00:00"}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply（容器底部，全宽，mt-3 按 Geist 12px 档） */}
      <div className="mt-3">
        <Button
          className="w-full"
          size="small"
          type="secondary"
          typeName="button"
          onClick={() => onApply?.({ start, end })}
        >
          Apply
          <span className="ml-2 text-xs" aria-hidden>
            ↵
          </span>
        </Button>
      </div>

      {/* 时区选择器（mt-1 按 Geist 4px 档） */}
      <div className="mt-1 flex justify-center">
        <span className="text-xs text-gray-800">
          {pinnedTimezone ? `Timezone: ${pinnedTimezone}` : `Local (${timeZone})`}
        </span>
      </div>
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
