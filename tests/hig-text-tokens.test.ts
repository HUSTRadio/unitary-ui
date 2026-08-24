import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("HIG text size tokens", () => {
  test("index.css defines --ds-text-* HIG semantic tokens", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    // HIG 口径 token（px 值 = HIG Text Styles）
    for (const [tok, val] of [
      ["--ds-text-large-title", "2.125rem"], // 34px Large Title
      ["--ds-text-title1", "1.75rem"], // 28px Title 1
      ["--ds-text-title2", "1.375rem"], // 22px Title 2
      ["--ds-text-title3", "1.25rem"], // 20px Title 3
      ["--ds-text-headline", "1.0625rem"], // 17px Headline (semibold)
      ["--ds-text-body", "1.0625rem"], // 17px Body
      ["--ds-text-callout", "1rem"], // 16px Callout
      ["--ds-text-subhead", "0.9375rem"], // 15px Subhead
      ["--ds-text-footnote", "0.8125rem"], // 13px Footnote
      ["--ds-text-caption1", "0.75rem"], // 12px Caption 1
      ["--ds-text-caption2", "0.6875rem"], // 11px Caption 2
    ] as const) {
      expect(css).toContain(`${tok}: ${val}`);
    }
  });

  test("text utilities reference tokens instead of hardcoded sizes", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    // 抽查：heading-24 应引用 --ds-text-title2（22px≈24px 档），copy-14 引用 --ds-text-subhead
    expect(css).toMatch(/@utility text-heading-24 \{[^}]*font-size:\s*var\(--ds-text-title2\)/s);
    expect(css).toMatch(/@utility text-copy-14 \{[^}]*font-size:\s*var\(--ds-text-subhead\)/s);
    expect(css).toMatch(/@utility text-label-12 \{[^}]*font-size:\s*var\(--ds-text-caption1\)/s);
  });
});
