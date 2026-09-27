import { useEffect } from "react";

/**
 * FontMetrics — 字体度量探针（决策点3：仅三处测量优化）
 *
 * 问题：换字体档位（OPPO Sans / HMOS SC/TC / 自定义）后 CJK:ASCII 宽度比、
 * 数字宽度（tabular）、基线偏移均漂移，表格数字列、状态栏时间、代码块会错位。
 *
 * 方案：字体加载完成后（document.fonts.ready）用 canvas.measureText 测量
 * 固定探针字符串，写入 CSS 变量（--font-metric-*），消费点消费：
 *   - --font-metric-cjk-ratio : CJK 字宽 / ASCII 字宽（表格列对齐）
 *   - --font-metric-digit-w   : 0-9 最大数字宽（tabular-nums 列宽对齐）
 *   - --font-metric-baseline  : 基线偏移 px（.phone-status-time 垂直校正）
 * 结果缓存 localStorage 与档位绑定，二次进入免测（Karpathy：最小可验证）。
 *
 * 设计：模块加载即自注册（任何引入本框架 CSS 的站点自动生效），
 * 无需挂在特定 React 组件；useFontMetrics 保留供显式控制时使用（幂等）。
 */

export const FONT_METRIC_CACHE_KEY = "unitary-font-metrics-v2";

/**
 * 状态栏时间字体栈（与 .phone-status-time 一致）。
 * 基线/冒号度量必须对时间自己的字体栈做——--font-sans 档位栈（OPPO Sans 等）
 * 的度量对时间渲染无效。
 */
const STATUS_TIME_STACK =
  '-apple-system, BlinkMacSystemFont, "HarmonyOS Sans", "HarmonyOS Sans SC", "HarmonyOS Sans SC Subset", system-ui, sans-serif';

const PROBE_CJK = "中";
const PROBE_ASCII = "H";
const PROBE_DIGITS = "0123456789";
const MIN_PROBE_SIZE = 4;

interface FontMetrics {
  cjkRatio: number;
  digitWidth: number;
  /** 时间垂直校正 px（translateY 语义，负 = 上移）：数字墨迹视觉中心 − 行盒中心 */
  baseline: number;
  /** 时间冒号垂直校正 px（translateY 语义，负 = 上移）：数字墨迹中心 − 冒号墨迹中心 */
  colon: number;
  /** 测量时的有效 font-family（用于缓存失效判断） */
  family: string;
}

/**
 * 状态栏时间的基线/冒号度量（17px semibold，与 .phone-status-time 渲染一致）。
 *
 * 旧 baseline 公式（16 − capAscent）量纲错误——cap 顶隙不是基线偏移，曾致时间被
 * 整体下推 ~4px。正确语义：让字形墨迹视觉中心与行盒几何中心重合所需的 translateY。
 * 冒号：SF Pro 光学居中（Apple 环境无需校正）；HarmonyOS Sans 冒号字形偏下
 * （17px 实测 +2px），需要上移与数字对齐。
 */
function measureTimeInk(ctx: CanvasRenderingContext2D): { baseline: number; colon: number } | null {
  ctx.font = `600 17px ${STATUS_TIME_STACK}`;
  const digit = ctx.measureText("0");
  const colon = ctx.measureText(":");
  if (digit.actualBoundingBoxAscent == null || colon.actualBoundingBoxAscent == null) return null;
  const digitCenter = (digit.actualBoundingBoxDescent - digit.actualBoundingBoxAscent) / 2;
  const colonCenter = (colon.actualBoundingBoxDescent - colon.actualBoundingBoxAscent) / 2;
  const lineCenter = (digit.fontBoundingBoxDescent - digit.fontBoundingBoxAscent) / 2;
  return { baseline: lineCenter - digitCenter, colon: digitCenter - colonCenter };
}

/** 计算当前生效字体的度量。 */
export function measureFontMetrics(
  fontStack = "OPPO Sans 4.0, HarmonyOS Sans SC, HarmonyOS Sans TC, sans-serif",
): FontMetrics | null {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.font = `16px ${fontStack}`;
    const cjk = ctx.measureText(PROBE_CJK).width;
    const ascii = ctx.measureText(PROBE_ASCII).width;
    let digitWidth = 0;
    for (const ch of PROBE_DIGITS) {
      digitWidth = Math.max(digitWidth, ctx.measureText(ch).width);
    }
    if (cjk <= 0 || ascii <= 0 || digitWidth <= 0) return null;
    if (cjk < MIN_PROBE_SIZE || ascii < MIN_PROBE_SIZE || digitWidth < MIN_PROBE_SIZE) return null;
    const timeInk = measureTimeInk(ctx);
    if (!timeInk || !Number.isFinite(timeInk.baseline) || !Number.isFinite(timeInk.colon)) return null;
    return { cjkRatio: cjk / ascii, digitWidth, ...timeInk, family: fontStack };
  } catch {
    return null;
  }
}

/** 将度量写入 :root CSS 变量（幂等：值不变时不重写 style，避免循环触发）。 */
export function applyFontMetrics(metrics: FontMetrics): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const style = root.style;
  const set = (name: string, value: string) => {
    if (style.getPropertyValue(name) !== value) style.setProperty(name, value);
  };
  set("--font-metric-cjk-ratio", metrics.cjkRatio.toFixed(3));
  set("--font-metric-digit-w", `${metrics.digitWidth.toFixed(2)}px`);
  set("--font-metric-baseline", `${metrics.baseline.toFixed(2)}px`);
  set("--font-metric-colon", `${metrics.colon.toFixed(2)}px`);
}

function readCache(family: string): FontMetrics | null {
  try {
    const raw = window.localStorage.getItem(FONT_METRIC_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FontMetrics;
    if (parsed.family === family && parsed.cjkRatio > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeCache(metrics: FontMetrics): void {
  try {
    window.localStorage.setItem(FONT_METRIC_CACHE_KEY, JSON.stringify(metrics));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/** 当前生效的字体栈（读 --font-sans，含 data-font-tier 覆盖）。 */
function currentFontStack(): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim();
}

/** 探测并应用字体度量；命中缓存则直接应用（幂等）。 */
export function probeFontMetrics(fontStack?: string): void {
  if (typeof document === "undefined") return;
  const stack = fontStack ?? (currentFontStack() || "OPPO Sans 4.0, HarmonyOS Sans SC, HarmonyOS Sans TC, sans-serif");
  const cached = readCache(stack);
  if (cached) {
    applyFontMetrics(cached);
    return;
  }
  const metrics = measureFontMetrics(stack);
  if (metrics) {
    applyFontMetrics(metrics);
    writeCache(metrics);
  }
}

let registered = false;

/** 自注册：模块加载即探测（幂等，多份 bundle 合并只测一次）。 */
function autoRegister(): void {
  if (registered || typeof document === "undefined") return;
  registered = true;
  // 立即试（缓存命中或字体已就绪）
  probeFontMetrics();
  // 字体加载完成后重测，覆盖首次测量时字体未就绪（swap 未完成）的情况
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => probeFontMetrics());
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoRegister, { once: true });
  } else {
    autoRegister();
  }
}

/**
 * React hook 版本：显式控制时使用（幂等，可重复调用；默认场景不需要，
 * 因为模块加载已自注册）。额外监听 data-font-tier 变化：档位切换时
 * 用新字体栈重新探测（栈字符串变化 → 缓存 miss → 重测）。
 */
export function useFontMetrics(fontStack?: string): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) probeFontMetrics(fontStack);
    };
    run();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) run();
      });
    }
    // 档位切换（data-font-tier）或字体栈变化时重测。
    // 注意：applyFontMetrics 写 root.style 会触发 style 属性变更，需防抖
    // 且重测结果一致时不再写缓存（measurement 幂等 → 停止震荡）。
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => run(), 120);
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-font-tier", "style"] });
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [fontStack]);
}
