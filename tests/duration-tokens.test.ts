import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("animation duration tokens", () => {
  test("@theme registers the four ds-duration tokens", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    for (const [tok, val] of [
      ["--ds-duration-fast", "150ms"],
      ["--ds-duration-base", "200ms"],
      ["--ds-duration-slow", "300ms"],
      ["--ds-duration-slower", "500ms"],
    ] as const) {
      expect(css).toContain(`${tok}: ${val}`);
    }
  });

  test("motion.ts mirrors ds-duration values for JS consumers", async () => {
    const ts = await readFile(path.join(root, "src/lib/motion.ts"), "utf8");
    expect(ts).toContain("export const DURATION_FAST_MS = 150");
    expect(ts).toContain("export const DURATION_BASE_MS = 200");
    expect(ts).toContain("export const DURATION_SLOW_MS = 300");
    expect(ts).toContain("export const DURATION_SLOWER_MS = 500");
  });
});
