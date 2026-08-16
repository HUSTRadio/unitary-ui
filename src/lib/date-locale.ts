/**
 * date-locale — 通用日期/本地化工具层（locale 驱动，framework 内复用）。
 *
 * 背景：calendar 与 relative-time-card 曾硬编码西方习惯（英文月份名、"Aug 02, 2026"、
 * 周日为一周起始、英文相对时间 "2m ago"）。本模块把这些逻辑收拢为 locale 驱动的纯函数，
 * 组件不硬编码任何 zh 分支，全部由 locale 决定输出。
 *
 * 约定：
 * - locale 形如 BCP 47（"zh-CN" / "en-US" / "zh-TW"）。
 * - zh 系（locale 以 "zh" 开头）使用本地习惯：YYYY-MM-DD、每周周一开始、中文相对时间；
 *   其余保持官方西方习惯（"Aug 02, 2026"、周日开始、英文缩写相对时间）。
 */

const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** 周日开头的英文星期短标签（官方 WEEKDAYS）。 */
const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** 周日开头的中文星期短标签。 */
const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"] as const;

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/** locale 是否中文系。 */
function isZhLocale(locale: string): boolean {
  return locale.toLowerCase().replace("_", "-").startsWith("zh");
}

/** 默认 locale（浏览器语言；无 Intl 时回退 en-US）。 */
export function defaultLocale(): string {
  return typeof Intl === "undefined" ? "en-US" : Intl.DateTimeFormat().resolvedOptions().locale;
}

/**
 * 每周起始日（0=周日 … 6=周六）。
 * 优先 `Intl.Locale#weekInfo.firstDay`；不支持时按已知 locale 表 fallback（zh 周一、其余周日）。
 */
export function getWeekStartDay(locale: string): number {
  try {
    const weekInfo = (new Intl.Locale(locale) as unknown as {
      weekInfo?: { firstDay?: number };
    }).weekInfo;
    if (weekInfo && typeof weekInfo.firstDay === "number") return weekInfo.firstDay;
  } catch {
    // fall through
  }
  return isZhLocale(locale) ? 1 : 0;
}

/**
 * 日期格式化：zh 系 → YYYY-MM-DD（补零横杠）；其余 → 官方 "Aug 02, 2026"。
 */
export function formatDate(date: Date, locale: string): string {
  if (isZhLocale(locale)) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

/**
 * 从每周起始日开始的 7 个星期短标签。
 * en → S M T W T F S（周日开头）；zh → 一 二 三 四 五 六 日（周一开始）。
 */
export function getWeekdayLabels(locale: string): string[] {
  const start = getWeekStartDay(locale);
  const base = isZhLocale(locale) ? WEEKDAYS_ZH : WEEKDAYS_EN;
  return Array.from({ length: 7 }, (_, i) => base[(start + i) % 7]);
}

/**
 * 月份标题：zh 系 → "2026年8月"；其余 → "August 2026"。
 */
export function getMonthTitle(date: Date, locale: string): string {
  if (isZhLocale(locale)) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  }
  return `${MONTH_NAMES_EN[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * 相对时间短格式（官方单位与阈值，仅文案 locale 化）：
 * en → just now / 2m ago / 5h ago / Yesterday / 3d ago / 2w ago / 4mo ago / 1y ago；
 * zh → 刚刚 / 2分钟前 / 5小时前 / 昨天 / 3天前 / 2周前 / 4个月前 / 1年前。
 */
export function formatRelativeTime(ms: number, locale: string): string {
  const zh = isZhLocale(locale);
  const elapsed = Date.now() - ms;
  if (elapsed < MINUTE) return zh ? "刚刚" : "just now";
  if (elapsed < HOUR) {
    const n = Math.floor(elapsed / MINUTE);
    return zh ? `${n}分钟前` : `${n}m ago`;
  }
  if (elapsed < DAY) {
    const n = Math.floor(elapsed / HOUR);
    return zh ? `${n}小时前` : `${n}h ago`;
  }
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ms >= startOfToday - DAY && ms < startOfToday) return zh ? "昨天" : "Yesterday";
  if (elapsed < WEEK) {
    const n = Math.floor(elapsed / DAY);
    return zh ? `${n}天前` : `${n}d ago`;
  }
  if (elapsed < MONTH) {
    const n = Math.floor(elapsed / WEEK);
    return zh ? `${n}周前` : `${n}w ago`;
  }
  if (elapsed < YEAR) {
    const n = Math.floor(elapsed / MONTH);
    return zh ? `${n}个月前` : `${n}mo ago`;
  }
  const n = Math.floor(elapsed / YEAR);
  return zh ? `${n}年前` : `${n}y ago`;
}

/**
 * calendar 快捷 preset 文案（"Type relative times" 列）locale 化。
 */
export function getRelativeTimePresets(locale: string): string[] {
  if (isZhLocale(locale)) {
    return ["45分钟", "12小时", "10天", "2周", "上个月", "昨天", "今天"];
  }
  return ["45m", "12 hours", "10d", "2 weeks", "last month", "yesterday", "today"];
}
