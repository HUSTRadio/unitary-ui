import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

// Semantic *-200 tokens that exist in src/styles/index.css (light + dark).
const SUBTLE_VARIANTS = ["gray", "blue", "purple", "amber", "red", "pink", "green", "teal"];

// Matches the className string of one contrast:low compound variant.
// "s" flag lets "." span the newline between `className:` and the quoted string.
function subtleClassName(src: string, color: string): string {
  const compounds = src.slice(src.indexOf("compoundVariants"), src.indexOf("defaultVariants"));
  const match = compounds.match(new RegExp(`variant: "${color}",.*?className:.*?"([^"]*)"`, "s"));
  return match?.[1] ?? "";
}

describe("Badge official subtle tint contract", () => {
  test("badge.tsx exports Badge and badgeVariants", async () => {
    const src = await read("src/components/ui/badge.tsx");
    expect(src).toMatch(/export\s*\{[^}]*Badge\b[^}]*\}/);
    expect(src).toMatch(/export\s*\{[^}]*badgeVariants\b[^}]*\}/);
  });

  test("each subtle variant tints its ::before from its own semantic *-200 token", async () => {
    const src = await read("src/components/ui/badge.tsx");

    for (const color of SUBTLE_VARIANTS) {
      const entry = subtleClassName(src, color);
      expect(entry, `${color}-subtle compound variant must exist`).not.toBe("");
      // Light tint: relative oklch from the *-200 token at 0.94 lightness.
      expect(entry).toContain(`before:bg-[oklch(from_var(--${color}-200)_0.94_c_h)]`);
      // Dark tint: same token at 0.27 lightness.
      expect(entry).toContain(`dark:before:bg-[oklch(from_var(--${color}-200)_0.27_c_h)]`);
    }
  });

  test("no non-gray subtle variant falls back to the gray-200 fill", async () => {
    const src = await read("src/components/ui/badge.tsx");

    for (const color of SUBTLE_VARIANTS.filter((c) => c !== "gray")) {
      const entry = subtleClassName(src, color);
      expect(entry).not.toContain("--gray-200");
    }
  });

  test("contrast.low base keeps structure but no hardcoded fill token", async () => {
    const src = await read("src/components/ui/badge.tsx");
    const lowVariant = src.match(/low: "([^"]*)"/)?.[1] ?? "";
    expect(lowVariant).toContain("before:mix-blend-multiply");
    expect(lowVariant).toContain("dark:before:mix-blend-screen");
    expect(lowVariant).not.toContain("oklch");
    expect(lowVariant).not.toContain("gray-200");
  });

  test("subtle text colors are preserved per variant", async () => {
    const src = await read("src/components/ui/badge.tsx");

    const expectedText = {
      gray: "text-gray-1000",
      blue: "text-[#0068d6] dark:text-[#52a8ff]",
      purple: "text-[#7820bc] dark:text-[#bf7af0]",
      amber: "text-[#a35200] dark:text-[#f2a20d]",
      red: "text-[#cb2a2f] dark:text-[#ff6166]",
      pink: "text-[#bd2864] dark:text-[#f75f8f]",
      green: "text-[#297a3a] dark:text-[#62c073]",
      teal: "text-[#067a6e] dark:text-[#0ac7b4]",
    } as const;

    for (const [color, textClass] of Object.entries(expectedText)) {
      const entry = subtleClassName(src, color);
      expect(entry, `${color}-subtle text color`).toContain(textClass);
    }
  });
});
