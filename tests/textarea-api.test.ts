import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Textarea official API contract (G12 audit fixes)", () => {
  test("G12-TEXTAREA-01: error text uses the dedicated inline-error token, not a raw red scale", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    // Error rendering delegates to the shared base layer
    expect(src).toMatch(/import \{ FieldError, FIELD_ERROR_RING, joinDescribedBy \}/);
    expect(src).toMatch(/<FieldError id=\{errorId\}/);
    const shared = await read("src/components/ui/field-error.tsx");
    expect(shared).toMatch(/text-error-foreground/);
    expect(shared).not.toMatch(/text-\[var\(--red-900\)\]/);
  });

  test("G12-TEXTAREA-01: error alert uses shared 4px gap (mt-1), 13px/20px, large 16px/24px", async () => {
    const shared = await read("src/components/ui/field-error.tsx");
    // Unified control-to-message gap is 4px (mt-1)
    expect(shared).toMatch(/\bmt-1 /);
    expect(shared).not.toMatch(/\bmt-2\b/);
    // 13px/20px default (text-copy-13 leading-5), large 16px/24px
    expect(shared).toMatch(/text-copy-13 leading-5/);
    expect(shared).toMatch(/large && "text-base leading-6"/);
  });

  test("error ring comes from the shared constant: 1px red-900 + 4px red-300 glow (hover red-500)", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/error && FIELD_ERROR_RING/);
    const shared = await read("src/components/ui/field-error.tsx");
    expect(shared).toMatch(
      /shadow-\[0_0_0_1px_var\(--color-red-900\),0_0_0_4px_var\(--color-red-300\)\]/,
    );
    expect(shared).toMatch(/var\(--color-red-500\)/);
  });

  test("sizes small/medium/large: unified rounded-lg (8px, HIG), default medium, large 16px/24px", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/type TextareaSize = "small" \| "medium" \| "large"/);
    expect(src).toMatch(/size = "medium"/);
    expect(src).toContain('"rounded-lg"');
    expect(src).not.toContain("rounded-[6px]");
    expect(src).not.toContain("rounded-[8px]");
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
    // describedby joins the error id with any caller-provided value via the shared helper
    expect(src).toMatch(/joinDescribedBy\(errorId, props\["aria-describedby"\]\)/);
    const shared = await read("src/components/ui/field-error.tsx");
    expect(shared).toMatch(/role="alert"/);
    expect(shared).toMatch(/data-geist-error=""/);
  });

  test("exports Textarea with displayName", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    expect(src).toMatch(/Textarea\.displayName = "Textarea"/);
    expect(src).toMatch(/export \{ Textarea, type TextareaProps, type TextareaSize \}/);
  });

  test("label prop: mb-2 on inner text div (8px gap, official structure)", async () => {
    const src = await read("src/components/ui/textarea.tsx");
    const lines = src.split("\n");
    // label prop exists on TextareaProps
    expect(src).toMatch(/label\?: React\.ReactNode;/);
    // mb-2 lives on the inner label text div, NOT on the <label> element
    expect(src).toMatch(/<label className="block cursor-text">/);
    expect(src).toContain(
      '<div className="mb-2 block max-w-full text-copy-13 capitalize text-gray-900">',
    );
    // no-label path keeps the bare wrapper (existing render unchanged)
    const wrapperIdx = lines.findIndex((line) => line.includes('data-slot="textarea-wrapper"'));
    expect(wrapperIdx).toBeGreaterThan(-1);
    expect(src).toMatch(/\) : \(\n\s*wrapper\n\s*\)/);
  });
});
