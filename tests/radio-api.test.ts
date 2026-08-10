import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Radio audit fixes (g09)", () => {
  test("G09-RADIO-01 checked circle uses FOREGROUND, not brand blue", async () => {
    const src = await read("src/components/ui/radio.tsx");
    // checked border + 8px dot must be foreground (light #171717 / dark #ededed)
    expect(src).toContain("peer-checked:border-foreground");
    expect(src).toMatch(/size-2 rounded-full bg-foreground/);
    // no brand blue (#006efe) anywhere
    expect(src).not.toContain("peer-checked:border-progress");
    expect(src).not.toMatch(/bg-progress/);
  });

  test("G09-RADIO-02 option text is 13px", async () => {
    const src = await read("src/components/ui/radio.tsx");
    expect(src).toContain("text-copy-13");
    expect(src).not.toContain("text-copy-14");
  });

  test("G09-RADIO-03 disabled uses solid gray-500 + cursor-not-allowed, no opacity dimming", async () => {
    const src = await read("src/components/ui/radio.tsx");
    // circle: solid gray label color + not-allowed cursor, no opacity-50
    expect(src).toContain("peer-disabled:cursor-not-allowed");
    expect(src).toContain("peer-disabled:text-gray-500");
    expect(src).not.toContain("peer-disabled:opacity-50");
    // option label text grays out when group/option disabled
    expect(src).toContain("group-has-[:disabled]/radio-item:text-gray-500");
    expect(src).toContain("group-has-[:disabled]/radio-item:cursor-not-allowed");
  });

  test("G09-RADIO-06 unchecked border is gray-700 solid, not alpha hairline", async () => {
    const src = await read("src/components/ui/radio.tsx");
    expect(src).toContain("border-gray-700");
    expect(src).not.toContain("border-gray-alpha-400");
  });
});
