import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Separator official API contract (G09 audit fixes)", () => {
  test("G09-SEP-01: default decorative=false → renders role=separator (not role=none)", async () => {
    const src = await read("src/components/ui/separator.tsx");
    // Default must be false so Radix renders role="separator" by default
    expect(src).toMatch(/decorative\s*=\s*false/);
    // The audit-found deviation (decorative default true → role="none") must be gone
    expect(src).not.toMatch(/decorative\s*=\s*true/);
    // The prop must still be forwarded to the Radix root
    expect(src).toMatch(/decorative=\{decorative\}/);
  });

  test("G09-SEP-02: separator color is bg-gray-200, not bg-border", async () => {
    const src = await read("src/components/ui/separator.tsx");
    // Root className must use the official gray-200 token
    expect(src).toMatch(/bg-gray-200/);
    // The audit-found deviation (bg-border = dark #2e2e2e) must be gone
    expect(src).not.toMatch(/bg-border/);
  });

  test("G09-SEP-02: gray-200 token resolves to official values in the theme", async () => {
    const css = await read("src/styles/index.css");
    // Light theme: gray-200 = #ebebeb
    expect(css).toMatch(/--gray-200:\s*#ebebeb/);
    // Dark theme: gray-200 = #1f1f1f
    expect(css).toMatch(/--gray-200:\s*#1f1f1f/);
  });
});

describe("Separator length scale (2026-09-21)", () => {
  test("length defaults to full and exposes data-length for both orientations", async () => {
    const src = await read("src/components/ui/separator.tsx");
    expect(src).toMatch(/length\s*=\s*"full"/);
    expect(src).toMatch(/data-length=\{length\}/);
    // horizontal: h-px + w-full / w-10；vertical: w-px + h-full / h-10
    expect(src).toMatch(/"h-px"/);
    expect(src).toMatch(/"w-px"/);
    expect(src).toMatch(/"w-full"/);
    expect(src).toMatch(/"w-10"/);
    expect(src).toMatch(/"h-full"/);
    expect(src).toMatch(/"h-10"/);
  });

  test("length=short is documented as a 40px stub for dense lists", async () => {
    const src = await read("src/components/ui/separator.tsx");
    expect(src).toContain("40px");
    expect(src).toMatch(/length\?: SeparatorLength/);
  });
});
