import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Textarea official API contract (G12 audit fixes)", () => {
  test("G12-TEXTAREA-01: error text is official #cb2a2f (light) / #ff6166 (dark), not --red-900 token", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    const alertStart = src.indexOf('role="alert"');
    expect(alertStart).toBeGreaterThan(-1);
    const alertBlock = src.slice(alertStart, alertStart + 400);
    expect(alertBlock).toMatch(/text-\[#cb2a2f\] dark:text-\[#ff6166\]/);
    expect(alertBlock).not.toMatch(/text-\[var\(--red-900\)\]/);
  });

  test("G12-TEXTAREA-01: error alert keeps mt-2 (8px), 13px/20px, large 16px/24px", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    const alertStart = src.indexOf('role="alert"');
    const alertBlock = src.slice(alertStart, alertStart + 400);
    expect(alertBlock).toMatch(/mt-2/);
    expect(alertBlock).toMatch(/text-\[13px\] leading-5/);
    expect(alertBlock).toMatch(/large && "text-base leading-6"/);
  });

  test("error ring unchanged: 1px red-900 + 4px red-300 glow (hover red-500)", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/shadow-\[0_0_0_1px_var\(--red-900\),0_0_0_4px_var\(--red-300\)\]/);
    expect(src).toMatch(/var\(--red-500\)/);
  });

  test("sizes small/medium/large: radius 6px/6px/8px, default medium, large 16px/24px", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/type TextareaSize = "small" \| "medium" \| "large"/);
    expect(src).toMatch(/size = "medium"/);
    expect(src).toMatch(/rounded-\[8px\]/);
    expect(src).toMatch(/rounded-\[6px\]/);
  });

  test("default height 100px; rows prop switches to h-auto", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/props\.rows === undefined \? "h-\[100px\]" : "h-auto"/);
    expect(src).toMatch(/h-\[100px\]/);
    expect(src).toMatch(/h-auto/);
  });

  test("error wiring: aria-invalid + aria-describedby, role=alert, data-geist-error", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/aria-invalid=\{error \? true : undefined\}/);
    expect(src).toMatch(/aria-describedby=\{error \? errorId : undefined\}/);
    expect(src).toMatch(/role="alert"/);
    expect(src).toMatch(/data-geist-error=""/);
  });

  test("exports Textarea with displayName", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/Textarea\.displayName = "Textarea"/);
    expect(src).toMatch(/export \{ Textarea, type TextareaProps, type TextareaSize \}/);
  });
});
