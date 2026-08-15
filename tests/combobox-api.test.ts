import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Combobox official API contract (label semantics)", () => {
  test("label prop exists and renders mb-2 on <label> element itself (8px gap, no margin-collapse risk)", async () => {
    const src = await read("src/components/ui/combobox.tsx");
    const lines = src.split("\n");
    // label prop exists on ComboboxProps
    expect(src).toMatch(/label\?: string;/);
    // mb-2 lives on the <label> element itself
    expect(src).toMatch(/<label className="mb-2 block cursor-text">/);
    // the inner label text div must NOT carry mb-2 (exact class string locks it)
    expect(src).toContain(
      '<div className="block max-w-full cursor-text text-[13px] text-gray-900 capitalize">',
    );
    // no-label path keeps the bare combobox root (existing render unchanged)
    expect(src).toMatch(/\) : \(\n\s*<>\n/);
    const rootIdx = lines.findIndex((line) => line.includes("ref={rootRef}"));
    expect(rootIdx).toBeGreaterThan(-1);
    expect(lines[rootIdx]).toMatch(/ref=\{rootRef\}/);
  });

  test("label wrapper contains children + combobox root, aria-label untouched", async () => {
    const src = await read("src/components/ui/combobox.tsx");
    // the combobox root is extracted into a variable rendered in both paths
    expect(src).toMatch(/const comboboxRoot = \(/);
    expect(src).toContain("{comboboxRoot}");
    // input accessible name comes from "aria-label" prop (unchanged by label addition)
    expect(src).toMatch(/"aria-label"\?: string;/);
    expect(src).toMatch(/aria-label=\{searchLabel\}/);
  });
});
