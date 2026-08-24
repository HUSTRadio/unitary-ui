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

  test("subtle text colors are preserved per variant (palette tokens, no hardcoded hex)", async () => {
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
      // 语义色必须走 palette token，禁止硬编码 hex
      expect(entry, `${color}-subtle must not hardcode hex`).not.toMatch(
        /text-\[\#[0-9a-fA-F]{6}\]/,
      );
    }
  });
});
