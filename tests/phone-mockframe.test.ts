import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Phone react-mockframe contract", () => {
  test("uses MockFrame with the iPhone 17 device and modular iphone CSS only", async () => {
    const src = await read("src/components/ui/phone.tsx");
    expect(src).toMatch(/import \{ MockFrame \} from "react-mockframe"/);
    expect(src).toMatch(/import "react-mockframe\/styles\/mockframe-iphones\.css"/);
    // No other device CSS bundles
    expect(src).not.toMatch(/mockframe-(android|laptops|tablets|\.min)\.css/);
    expect(src).toMatch(/device="iPhone 17"/);
    // Content size 393×852 passed explicitly
    expect(src).toMatch(/PHONE_CONTENT_WIDTH = 393/);
    expect(src).toMatch(/PHONE_CONTENT_HEIGHT = 852/);
    // Dynamic island maps to hideNotch (default off)
    expect(src).toMatch(/hideNotch=\{!dynamicIsland\}/);
  });

  test("default color is black (dark body) and all 7 colors are type-constrained", async () => {
    const src = await read("src/components/ui/phone.tsx");
    const colorUnion = src.match(/type IPhone17Color =([\s\S]*?);/)?.[1] ?? "";
    for (const c of [
      "black",
      "white",
      "mist-blue",
      "sage",
      "lavender",
      "cosmic-orange",
      "deep-blue",
    ]) {
      expect(colorUnion).toContain(`"${c}"`);
    }
    expect(colorUnion.match(/"/g)!.length / 2).toBe(7);
    expect(src).toMatch(/color = "black"/);
  });

  test("zoom takes priority over autoFit; autoFit only shrinks (max 1)", async () => {
    const src = await read("src/components/ui/phone.tsx");
    expect(src).toMatch(/zoom !== undefined \? zoom :/);
    expect(src).toMatch(/Math\.min\(1, containerWidth \/ frameWidth\)/);
  });

  test("third-party transition:all is overridden; animated allows transform-only; reduced-motion kills transitions", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toMatch(/\.phone-frame-static\.mockframe,\n\.phone-frame-animated\.mockframe \{\n  transition: none !important;\n\}/);
    expect(css).toMatch(/transition: transform 0\.2s ease-out !important;/);
    expect(css).toMatch(/prefers-reduced-motion: reduce/);
    const src = await read("src/components/ui/phone.tsx");
    expect(src).toMatch(/animated\n\s+\?\s+"phone-frame-animated"/);
  });

  test("PhoneScreen drops fixed min-height/padding and fills the screen", async () => {
    const src = await read("src/components/ui/phone.tsx");
    expect(src).not.toMatch(/min-h-\[568px\]/);
    expect(src).toMatch(/"h-full w-full overflow-hidden"/);
  });
});
