import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Choicebox audit fixes (G02)", () => {
  test("G02-CHB-01 description text is 14px, not 13px", async () => {
    const src = await read("src/components/ui/choicebox.tsx");
    expect(src).toContain("text-copy-14");
    expect(src).not.toContain("text-copy-13");
  });

  test("G02-CHB-02 selected fill uses blue-100, not progress-soft", async () => {
    const src = await read("src/components/ui/choicebox.tsx");
    expect(src).toContain("data-[state=checked]:bg-blue-100");
    expect(src).not.toContain("bg-progress-soft");
  });

  test("G02-CHB-03 disabled tile uses explicit gray-500, no opacity dimming", async () => {
    const src = await read("src/components/ui/choicebox.tsx");
    // tile: solid gray-500 border/text + not-allowed cursor, no opacity-50
    expect(src).toContain("disabled:cursor-not-allowed");
    expect(src).toContain("disabled:border-gray-500");
    expect(src).toContain("disabled:text-gray-500");
    expect(src).not.toContain("disabled:opacity-50");
    // dot circle border grays out when tile disabled
    expect(src).toContain("group-disabled/choicebox:border-gray-500");
  });
});
