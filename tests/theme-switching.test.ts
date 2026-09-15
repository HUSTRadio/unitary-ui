import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readCss = async () =>
  (await readFile(path.join(root, "src", "styles", "index.css"), "utf8")).replace(/\r\n/g, "\n");

function themeBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing ${selector} theme block`).toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{", start) + 1;
  const end = css.indexOf("\n}", bodyStart);
  expect(end).toBeGreaterThan(bodyStart);
  return css.slice(bodyStart, end);
}

describe("主题切换双通道（.dark 类 / data-theme 属性）", () => {
  test("@custom-variant dark 同时匹配 .dark 与 [data-theme=dark]", async () => {
    const css = await readCss();
    expect(css).toMatch(
      /@custom-variant dark \(&:is\(\.dark \*, \[data-theme="dark"\] \*\)\)/,
    );
  });

  test("dark 主块选择器并列双通道", async () => {
    const css = await readCss();
    expect(css).toContain('.dark,\n[data-theme="dark"] {');
  });

  test("不存在仅匹配 .dark 的规则块（防止属性切换者拿不到变量）", async () => {
    const css = await readCss();
    // 行首 `.dark {`（无 data-theme 并列）一律禁止；.dark 出现在 :is()/后代选择器中不受影响。
    expect(css).not.toMatch(/(^|\n)\.dark\s*\{/);
  });

  test("曾被单匹配 .dark 尾块遗漏的变量已在主块内", async () => {
    const css = await readCss();
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');
    const light = themeBlock(css, ":root");
    for (const name of [
      "--context-card-tip-stroke",
      "--code-highlight",
      "--code-added",
      "--code-removed",
      "--code-referenced",
    ]) {
      expect(dark, `${name} 应在 .dark 主块`).toMatch(new RegExp(`\\s${name}\\s*:`));
    }
    for (const name of [
      "--banner-focus-color",
      "--code-highlight",
      "--code-added",
      "--code-removed",
      "--code-referenced",
    ]) {
      expect(light, `${name} 应在 :root 主块`).toMatch(new RegExp(`\\s${name}\\s*:`));
    }
  });
});
