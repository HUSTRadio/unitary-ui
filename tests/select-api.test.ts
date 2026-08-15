import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Select official API contract (G09 audit fixes)", () => {
  test("G09-SELECT-01: error text is 13px/20px (leading-5) with official red, not --danger", async () => {
    const src = await read("src/components/ui/select.tsx");
    // Error message must NOT use the --danger token color (#e5484d via text-danger)
    expect(src).not.toMatch(/text-danger/);
    // Official light color #cb2a2f (ds-red-900) and dark #ff6166
    expect(src).toMatch(/#cb2a2f/);
    expect(src).toMatch(/dark:text-\[#ff6166\]/);
    // 13px font with 20px line-height (leading-5 overrides text-copy-13's 18px)
    expect(src).toMatch(/text-copy-13 leading-5/);
  });

  test("G09-SELECT-01: large size error text is 16px/24px (text-base leading-6)", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/size === "large" \? "text-base leading-6"/);
  });

  test("G09-SELECT-01: error message keeps the non-large default at 13px/20px", async () => {
    const src = await read("src/components/ui/select.tsx");
    expect(src).toMatch(/size === "large" \? "text-base leading-6" : "text-copy-13 leading-5"/);
  });

  test("label renders mb-2 on <label> element itself (8px gap, no margin-collapse risk)", async () => {
    const src = await read("src/components/ui/select.tsx");
    // mb-2 lives on the <label> element itself (kept inside cn() so className still merges)
    expect(src).toMatch(/<label className=\{cn\("mb-2 block", className\)\}>/);
    // the inner label text div must NOT carry mb-2 (exact class string locks it)
    expect(src).toContain(
      '<div className="block max-w-full cursor-text text-[13px] text-gray-900 capitalize">',
    );
  });
});
