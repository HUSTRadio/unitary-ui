import type { CSSProperties } from "react";

/**
 * Calendar 类名与 inline style 常量（2026-09-15 从 calendar.tsx 拆出）。
 * 全部为纯数据：类名逐字来自官方 Geist 实测，禁止手改；
 * 颜色字面量已登记在 tests/audit/raw-color-allowlist.json 账本。
 */

const SKELETON_CLASS =
  "rounded-[5px] after:animate-loading-skeleton block relative after:absolute after:inset-0 after:right-[-200%] after:bg-gradient-to-r after:from-gray-100 after:via-gray-200 after:to-gray-100 after:bg-[length:50%_100%] after:bg-[position:0_0] visible overflow-visible after:content-none after:invisible";

const TRIGGER_MEDIUM_CLASS =
  "outline-none m-0 p-0 border-0 align-baseline no-underline group/trigger relative cursor-pointer select-none transform translate-z-0 flex text-[var(--themed-fg,_var(--uni-background-100))] bg-[var(--themed-bg,_var(--uni-gray-1000))] max-w-full items-center justify-center transition-[border-color, background,color,transform,box-shadow] ease-in-out [&_svg]:shrink-0 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:text-[var(--uni-gray-700)] disabled:bg-[var(--uni-gray-100)] aria-disabled:text-[var(--uni-gray-700)] aria-disabled:bg-[var(--uni-gray-100)] disabled:![--themed-border:_var(--uni-gray-400)] [--x-padding:10px] [--height:var(--uni-size-medium)] text-[14px] !pl-[var(--x-padding)] !pr-[var(--x-padding)] rounded-md [--themed-bg:_var(--uni-background-100)] shadow-[0_0_0_1px_var(--themed-border,_transparent)] [--themed-hover-bg:_var(--uni-gray-alpha-200)] [--themed-fg:_var(--uni-gray-1000)] [--themed-border:_var(--uni-gray-400)] data-[focus]:shadow-[0_0_0_1px_var(--themed-border,_transparent),0_0_0_2px_var(--uni-background-100),0_0_0_4px_var(--uni-focus-color)] data-[focus]:transition-none h-[var(--height)] text-gray-700! dark:data-[focus]:!shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] data-[focus]:!shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] hover:z-1 hover:cursor-pointer group-hover/calendar:shadow-[0_0_0_1px_var(--uni-gray-500)] font-normal !text-[14px] [&>span:nth-of-type(2)]:pl-1.5 [&>span:nth-of-type(2)]:pr-1.5 [&>span]:nth-[2]:pr-5 [&>span]:nth-[2]:w-full !font-normal transition-[box-shadow] duration-(--uni-duration-fast) w-[var(--width)]";

const TRIGGER_SMALL_CLASS =
  "outline-none m-0 p-0 border-0 align-baseline no-underline group/trigger relative cursor-pointer select-none transform translate-z-0 flex text-[var(--themed-fg,_var(--uni-background-100))] bg-[var(--themed-bg,_var(--uni-gray-1000))] max-w-full items-center justify-center transition-[border-color, background,color,transform,box-shadow] ease-in-out [&_svg]:shrink-0 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:text-[var(--uni-gray-700)] disabled:bg-[var(--uni-gray-100)] aria-disabled:text-[var(--uni-gray-700)] aria-disabled:bg-[var(--uni-gray-100)] disabled:![--themed-border:_var(--uni-gray-400)] [--x-padding:6px] [--height:32px] !pl-[var(--x-padding)] !pr-[var(--x-padding)] rounded-md [--themed-bg:_var(--uni-background-100)] shadow-[0_0_0_1px_var(--themed-border,_transparent)] [--themed-hover-bg:_var(--uni-gray-alpha-200)] [--themed-fg:_var(--uni-gray-1000)] [--themed-border:_var(--uni-gray-400)] data-[focus]:shadow-[0_0_0_1px_var(--themed-border,_transparent),0_0_0_2px_var(--uni-background-100),0_0_0_4px_var(--uni-focus-color)] data-[focus]:transition-none [--spinner-size:16px] h-[var(--height)] text-gray-700! dark:data-[focus]:!shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] data-[focus]:!shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark:focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] focus-visible:z-10 focus-visible:shadow-[0_0_0_1px_var(--uni-gray-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] hover:z-1 hover:cursor-pointer group-hover/calendar:shadow-[0_0_0_1px_var(--uni-gray-500)] font-normal !text-[14px] [&>span:nth-of-type(2)]:pl-1.5 [&>span:nth-of-type(2)]:pr-1.5 [&>span]:nth-[2]:pr-5 [&>span]:nth-[2]:w-full !font-normal transition-[box-shadow] duration-(--uni-duration-fast) w-[var(--width)]";

/** 紧凑排布（trigger 左侧圆角、combobox 右侧圆角）时 trigger 按钮附加类（官方原样）。 */
const TRIGGER_ROW_EXTRA_CLASS = "rounded-l-none [&_button]:rounded-l-none [&_button]:border-l";

const ICON_SPAN_CLASS =
  "mr-[3px] min-w-5 shrink-0 flex items-center justify-center [&_svg[data-slot=unitary-icon]]:size-(--uni-control-decoration-size)";

const ICON_SVG_CLASS = "size-(--uni-control-decoration-size) -mt-px";

const TEXT_SPAN_CLASS = "truncate inline-block px-1.5";

/** 触发按钮 inline style（官方原样）。 */
const TRIGGER_INLINE_STYLE = {
  display: "flex",
  justifyContent: "space-between",
  textAlign: "left",
  fontWeight: 400,
} as CSSProperties;

/** 小号触发按钮 inline style：额外固定高度（官方原样，--uni-size-small 由根节点注入）。 */
const TRIGGER_SMALL_INLINE_STYLE = {
  ...TRIGGER_INLINE_STYLE,
  height: "var(--uni-size-small)",
  minHeight: "var(--uni-size-small)",
} as CSSProperties;

/** cmdk Combobox 根节点类（官方原样；高度按尺寸追加）。 */
const COMBO_ROOT_CLASS =
  "relative flex [&_[data-radix-popper-content-wrapper]]:!absolute [&_[data-radix-popper-content-wrapper]]:!transform-none [&_[data-radix-popper-content-wrapper]]:!opacity-100";

/** sr-only 标签 inline style（官方原样）。 */
const SR_ONLY_LABEL_STYLE: CSSProperties = {
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
  "size-(--uni-control-decoration-size) right-3 pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-(--uni-duration-fast)";

const CHEVRON_SVG_SMALL_CLASS =
  "size-(--uni-control-decoration-size) pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition duration-(--uni-duration-fast) right-[9px]";

const CIRCULAR_SVG_CLASS =
  "pointer-events-none absolute z-10 size-(--uni-control-decoration-size) top-[9px] left-[9px]";

const CIRCULAR_SVG_MEDIUM_CLASS =
  "pointer-events-none absolute left-[13px] z-10 size-(--uni-control-decoration-size) top-[11px]";

/** 小方块 combobox 左分隔线（官方原样）。 */
const DIVIDER_SQUARE_CLASS =
  "absolute -top-px -bottom-px z-[1] w-px bg-[var(--uni-gray-900)] opacity-0 transition-opacity duration-(--uni-duration-fast) right-auto left-px";

/** 通栏 combobox 右分隔线（官方原样）。 */
const DIVIDER_FULL_CLASS =
  "absolute -top-px -right-px -bottom-px z-[1] w-px bg-[var(--uni-gray-900)] opacity-0 transition-opacity duration-(--uni-duration-fast)";

const UNI_ICON_ATTRS = {
  viewBox: "0 0 16 16",
  height: 16,
  width: 16,
  "data-slot": "unitary-icon",
} as const;

/** combobox 弹出菜单（官方 cmdk-root：grid 容器 + p-2 group + h-9 item，2026-08-16 实测）。
    HIG-AUD-009：层级走 popover 带（与 combobox/select 内容同族），原超大数值字面量收敛。 */
const COMBO_MENU_CLASS =
  "grid bg-[var(--uni-background-100)] rounded-lg shadow-[var(--uni-shadow-menu)] overflow-hidden z-[var(--uni-z-popover)]";

const COMBO_GROUP_CLASS = "p-2";

const COMBO_ITEM_CLASS =
  "max-sm:h-12 max-sm:text-[16px] h-9 text-[14px] px-2 rounded-sm flex scroll-m-2 cursor-pointer items-center font-normal text-[var(--uni-gray-1000)] hover:bg-[var(--uni-gray-alpha-300)]";

/** 官方右列「Type relative times」相对时间快捷按钮（showHints，2026-08-16 实测；文案 locale 化）。 */
const COMBO_HINT_COL_CLASS = "p-4 pr-[30px]";

const COMBO_HINT_TITLE_CLASS = "text-copy-14 text-gray-900";

const COMBO_HINT_WRAP_CLASS = "flex flex-wrap mt-2 gap-1";

const COMBO_HINT_BUTTON_CLASS =
  "text-[13px] hover:bg-[hsl(0,0%,87%)] dark:hover:bg-[hsl(0,0%,30%)] px-1.5 h-5 inline-flex items-center font-[var(--font-mono)] bg-[var(--uni-gray-100)] border-none rounded-sm cursor-pointer text-[var(--uni-gray-1000)] focus-visible:outline-2 focus-visible:outline-gray-700";

/** 官方紧凑排布根类：trigger 左侧圆角 + combobox 右侧圆角（compact / sizes item2）。 */
const CALENDAR_ROW_CLASS =
  "flex items-center [&_[data-uni-button]]:rounded-l-[5px] [&_[data-uni-button]]:rounded-r-none [&_[data-uni-select]]:rounded-l-none [&_[data-uni-select]]:rounded-r-[5px] [&_input]:rounded-l-[5px] [&_input]:rounded-r-none";

/** 官方反向排布根类：combobox 左侧圆角 + trigger 右侧圆角（sizes item4）。 */
const CALENDAR_ROW_REV_CLASS =
  "flex items-center [&_[data-uni-button]]:rounded-l-none [&_[data-uni-button]]:rounded-r-[5px] [&_input]:rounded-l-[5px] [&_input]:rounded-r-none";

/** 官方纵向排布根类：combobox 在上、trigger 在下（sizes item3）。 */
function calendarColClass(size: "medium" | "small"): string {
  return `[&_[data-uni-button]]:transform-none [&_[data-uni-button]]:rounded-[5px] [&_[data-uni-button]]:rounded-t-none [&_[data-uni-button]]:text-[1rem] inline-flex flex-col [&_[data-uni-button]]:!rounded-[5px] [&_[data-uni-button]]:!rounded-t-none h-(--uni-size-${size}) [&_[data-uni-select]_select]:rounded-t [&_[data-uni-select]_select]:rounded-br-none [&_[data-uni-select]_select]:rounded-bl-none`;
}

/* ---------- 打开态 Popover 面板（官方 date range picker，2026-08-15 实测） ---------- */

const PANEL_CONTENT_CLASS = "relative rounded-md p-(--padding) [--padding:_12px]";

const START_END_LABEL_CLASS =
  "block text-[13px] max-w-full text-gray-900 cursor-text capitalize mb-0";

const DATE_INPUT_WRAP_CLASS =
  "flex max-w-full transition-all duration-(--uni-duration-fast) shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] overflow-hidden font-normal rounded-md [&>input]:h-8 text-sm [&>input]:px-3 has-[:focus]:!shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] dark:has-[:focus]:!shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0px_0px_0px_4px_rgba(255,255,255,0.24)] hover:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)]";

const DATE_INPUT_CLASS =
  "inline-flex appearance-none min-w-0 w-full border-none bg-background-100 text-[var(--foreground)] outline-none focus:outline-none disabled:bg-[var(--uni-gray-100)] disabled:text-[var(--uni-gray-700)] disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const NAV_BUTTON_CLASS =
  "p-0.5 active:bg-gray-300 flex aspect-square shrink-0 items-center rounded-full bg-transparent text-[var(--uni-gray-700)] hover:text-[var(--uni-gray-1000)] disabled:cursor-not-allowed disabled:text-[var(--uni-gray-700)]";

const GRID_TABLE_CLASS = "relative block table-fixed border-collapse w-full";
const GRID_HEAD_TR_CLASS = "last:mb-0 flex flex-nowrap mt-4 mb-2";
const GRID_HEAD_TH_CLASS =
  "p-0 font-normal flex-1 text-center text-[0.75rem] text-[var(--uni-gray-900)] uppercase";
const GRID_BODY_CLASS = "block !mt-2";
const GRID_ROW_CLASS = "last:mb-0 flex flex-nowrap my-2";
const GRID_CELL_CLASS = "flex-1 flex justify-center size-8 p-0 text-center";

export {
  SKELETON_CLASS,
  TRIGGER_MEDIUM_CLASS,
  TRIGGER_SMALL_CLASS,
  TRIGGER_ROW_EXTRA_CLASS,
  ICON_SPAN_CLASS,
  ICON_SVG_CLASS,
  TEXT_SPAN_CLASS,
  TRIGGER_INLINE_STYLE,
  TRIGGER_SMALL_INLINE_STYLE,
  COMBO_ROOT_CLASS,
  SR_ONLY_LABEL_STYLE,
  CHEVRON_SVG_CLASS,
  CHEVRON_SVG_SMALL_CLASS,
  CIRCULAR_SVG_CLASS,
  CIRCULAR_SVG_MEDIUM_CLASS,
  DIVIDER_SQUARE_CLASS,
  DIVIDER_FULL_CLASS,
  UNI_ICON_ATTRS,
  COMBO_MENU_CLASS,
  COMBO_GROUP_CLASS,
  COMBO_ITEM_CLASS,
  COMBO_HINT_COL_CLASS,
  COMBO_HINT_TITLE_CLASS,
  COMBO_HINT_WRAP_CLASS,
  COMBO_HINT_BUTTON_CLASS,
  CALENDAR_ROW_CLASS,
  CALENDAR_ROW_REV_CLASS,
  calendarColClass,
  PANEL_CONTENT_CLASS,
  START_END_LABEL_CLASS,
  DATE_INPUT_WRAP_CLASS,
  DATE_INPUT_CLASS,
  NAV_BUTTON_CLASS,
  GRID_TABLE_CLASS,
  GRID_HEAD_TR_CLASS,
  GRID_HEAD_TH_CLASS,
  GRID_BODY_CLASS,
  GRID_ROW_CLASS,
  GRID_CELL_CLASS,
};
