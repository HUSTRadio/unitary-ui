import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

// Matches the className string of one contrast:low compound variant.
// "s" flag lets "." span the newline between `className:` and the quoted string.
function subtleClassName(src: string, color: string): string {
  const compounds = src.slice(src.indexOf("compoundVariants"), src.indexOf("defaultVariants"));
  const match = compounds.match(new RegExp(`variant: "${color}",.*?className:.*?"([^"]*)"`, "s"));
  return match?.[1] ?? "";
}

describe("Badge official subtle contract (2026-08-24 实测 = 胶囊 + 纯文字无填充)", () => {
  test("badge.tsx exports Badge and badgeVariants", async () => {
    const src = await read("src/components/ui/badge.tsx");
    expect(src).toMatch(/export\s*\{[^}]*Badge\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*badgeVariants\b[^}]*\}/);
  });

  test("subtle variants have NO ::before tint layer (官方 subtle 无填充无淡色层)", async () => {
    const src = await read("src/components/ui/badge.tsx");
    // 官方 subtle = 纯文字胶囊，无 before 层、无 mix-blend、无 oklch 底色
    expect(src).not.toContain("before:bg-[oklch");
    expect(src).not.toContain("before:mix-blend");
    expect(src).not.toContain("before:rounded-full");
  });

  test("contrast.low base keeps transparent bg in both themes (抵消 variant 实色底)", async () => {
    const src = await read("src/components/ui/badge.tsx");
    const lowVariant = src.match(/low: "([^"]*)"/)?.[1] ?? "";
    expect(lowVariant).toContain("bg-transparent");
    // 关键：dark:bg-transparent 抵消 variant 的 dark:bg-*（cva compound 追加非覆盖）
    expect(lowVariant).toContain("dark:bg-transparent");
  });

  test("subtle text colors follow official palette (light 深 / dark 亮，token 引用禁硬编码)", async () => {
    const src = await read("src/components/ui/badge.tsx");

    const expectedText = {
      gray: "text-gray-1000",
      blue: "text-blue-900",
      purple: "text-purple-800 dark:text-purple-900",
      amber: "text-amber-900",
      red: "text-badge-red-subtle-foreground",
      pink: "text-pink-800 dark:text-pink-900",
      green: "text-green-900",
      teal: "text-teal-900",
    } as const;

    for (const [color, textClass] of Object.entries(expectedText)) {
      const entry = subtleClassName(src, color);
      expect(entry, `${color}-subtle text color`).toContain(textClass);
      expect(entry, `${color}-subtle must not hardcode hex`).not.toMatch(
        /text-\[\#[0-9a-fA-F]{6}\]/,
      );
    }
  });
});

describe("Badge solid variants & outline (2026-08-24)", () => {
  test("green/teal use badge-specific deep tokens (方案 B, dark 白字对比度 ≥4.5:1)", async () => {
    const src = await read("src/components/ui/badge.tsx");
    expect(src).toContain('green: "bg-badge-green text-badge-green-foreground"');
    expect(src).toContain('teal: "bg-badge-teal text-badge-teal-foreground"');
  });

  test("badge-green/badge-teal tokens registered in @theme (bg-* utility 生成)", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toContain("--badge-green: #267a3b");
    expect(css).toContain("--badge-teal: #0c7869");
    expect(css).toContain("--color-badge-green: var(--badge-green)");
    expect(css).toContain("--color-badge-teal: var(--badge-teal)");
  });

  test("outline variant = transparent bg + border, text same gray family (官方实测)", async () => {
    const src = await read("src/components/ui/badge.tsx");
    // outline 定义跨行：outline:\n  "bg-transparent border border-gray-alpha-500 ..."
    const outlineBlock = src.match(/outline:\s*"([^"]*)"/s)?.[1] ?? "";
    expect(outlineBlock).toContain("bg-transparent");
    expect(outlineBlock).toContain("border border-gray-alpha-500");
    expect(outlineBlock).toContain("text-gray-900");
    // gray-900 token 亮暗自动翻转（亮 #4d4d4d / 暗 #a1a1a1）；禁止 dark:text-gray-400——
    // 暗色下 gray-400 是深灰档 #2e2e2e（供边框），会破坏文字可读性（2026-09-15 Playwright 实测）。
    expect(outlineBlock).not.toContain("dark:text-gray-400");
  });
});
