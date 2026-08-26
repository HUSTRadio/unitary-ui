import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Label official API contract (G06 audit fixes)", () => {
  test("G06-LABEL-01: text color is gray-900 (#4d4d4d light / #a1a1a1 dark), not text-foreground", async () => {
    const src = await read("src/components/ui/label.tsx");
    // Root className must use the official gray-900 token
    expect(src).toMatch(/text-gray-900/);
    // The audit-found deviation (text-foreground = #171717/#ededed) must be gone
    expect(src).not.toMatch(/text-foreground/);
  });

  test("G06-LABEL-01: gray-900 token resolves to official values in the theme", async () => {
    const css = await read("src/styles/index.css");
    // Light theme: gray-900 = #4d4d4d
    expect(css).toMatch(/--gray-900:\s*#4d4d4d/);
    // Dark theme: gray-900 = #a1a1a1
    expect(css).toMatch(/--gray-900:\s*#a1a1a1/);
  });

  test("slider.tsx inherits the canonical Label color and spacing", async () => {
    const slider = await read("src/components/ui/slider.tsx");
    // Slider still renders the shared Label for its accessible name and 8px field rhythm.
    expect(slider).toMatch(/from "@\/components\/ui\/label"/);
    expect(slider).toMatch(/<Label value=\{label\} id=\{rootId\} \/>/);
    // Slider must not override the canonical label color or bottom margin.
    expect(slider).not.toMatch(/<Label[^>]*(?:text-(?:foreground|gray-)|mb-\d)/);
  });
});
