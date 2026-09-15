import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readCss = async () =>
  (await readFile(path.join(root, "src", "styles", "index.css"), "utf8")).replace(/\r\n/g, "\n");

/** 取首个匹配选择器块的正文（与 tests/audit/uni-token-contract.test.ts 同款：字面首匹配）。 */
function themeBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing ${selector} theme block`).toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{", start) + 1;
  const end = css.indexOf("\n}", bodyStart);
  expect(end, `unterminated ${selector} theme block`).toBeGreaterThan(bodyStart);
  return css.slice(bodyStart, end);
}

function declarations(block: string, prefix: string) {
  const names = new Set<string>();
  for (const match of block.matchAll(new RegExp(`(${prefix}[\\w-]+)\\s*:`, "g"))) {
    names.add(match[1]);
  }
  return names;
}

function value(block: string, name: string) {
  return block.match(new RegExp(`\\s${name}\\s*:\\s*([^;\\n]+)`))?.[1]?.trim() ?? "";
}

/** 主题色 token 设计契约（index.css 注释「34 semantic tokens (1:1 parity)」+ gray-alpha 10）。 */
const THEMED_COLOR_TOKENS = [
  // bg (6)
  "--color-bg-canvas",
  "--color-bg-surface",
  "--color-bg-elevated",
  "--color-bg-hover",
  "--color-bg-selected",
  "--color-bg-subtle",
  // text (5)
  "--color-text-primary",
  "--color-text-secondary",
  "--color-text-tertiary",
  "--color-text-inverse",
  "--color-text-inverse-secondary",
  // border (2)
  "--color-border-subtle",
  "--color-border-strong",
  // gray-alpha (10)
  "--gray-alpha-100",
  "--gray-alpha-200",
  "--gray-alpha-300",
  "--gray-alpha-400",
  "--gray-alpha-500",
  "--gray-alpha-600",
  "--gray-alpha-700",
  "--gray-alpha-800",
  "--gray-alpha-900",
  "--gray-alpha-1000",
  // action (4)
  "--action-primary",
  "--action-hover",
  "--action-pressed",
  "--action-soft",
  // ai (2)
  "--ai-primary",
  "--ai-soft",
  // status (15)
  "--success",
  "--success-soft",
  "--warning",
  "--warning-soft",
  "--danger",
  "--danger-soft",
  "--danger-hover",
  "--error-foreground",
  "--info",
  "--info-soft",
  "--progress",
  "--progress-soft",
  "--link",
  "--urgent",
  "--urgent-soft",
] as const;

describe("语义 token 亮暗成对性（2026-09-15 基线）", () => {
  test("44 个主题色 token 在 :root 与 .dark 主块 1:1 成对", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');
    const missing: string[] = [];
    for (const token of THEMED_COLOR_TOKENS) {
      const pattern = new RegExp(`\\s${token}\\s*:`);
      if (!pattern.test(light)) missing.push(`${token} @ :root`);
      if (!pattern.test(dark)) missing.push(`${token} @ .dark`);
    }
    expect(missing).toEqual([]);
  });

  test("gray token 亮暗语义翻转（gray-900 亮深/暗浅，gray-400 亮浅/暗深）", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');
    // 该翻转是 Geist 设计语义：gray-900 供文字（暗色须浅）、gray-400 供边框（暗色须深）。
    // badge outline 的暗色可读性依赖它；禁止「优化」为同向值。
    expect(value(light, "--gray-900").toLowerCase()).toBe("#4d4d4d");
    expect(value(dark, "--gray-900").toLowerCase()).toBe("#a1a1a1");
    expect(value(light, "--gray-400").toLowerCase()).toBe("#ebebeb");
    expect(value(dark, "--gray-400").toLowerCase()).toBe("#2e2e2e");
  });

  test("--uni-gray-alpha-200 映射已在亮暗两块的兼容层登记（calendar/hamburger 消费）", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');
    expect(value(light, "--uni-gray-alpha-200")).toBe("var(--gray-alpha-200)");
    expect(value(dark, "--uni-gray-alpha-200")).toBe("var(--gray-alpha-200)");
  });

  test("--uni-focus-ring 等 pending token 保持未定义（契约门禁，勿臆造值）", async () => {
    const css = await readCss();
    for (const token of [
      "--uni-focus-ring",
      "--uni-shadow-modal",
      "--uni-shadow-border-medium",
      "--uni-gray-200",
    ]) {
      expect(css).not.toMatch(new RegExp(`${token}\\s*:`));
    }
  });
});
