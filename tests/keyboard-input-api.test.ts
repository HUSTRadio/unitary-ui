import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("KeyboardInput official API contract (G06 wave)", () => {
  test("keyboard-input.tsx exports KeyboardInput and Kbd", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/export\s*\{\s*KeyboardInput\s*,\s*Kbd\s*\}/);
  });

  test("Kbd exposes meta/shift/alt/ctrl boolean modifier props", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/meta\??:\s*boolean/);
    expect(src).toMatch(/shift\??:\s*boolean/);
    expect(src).toMatch(/alt\??:\s*boolean/);
    expect(src).toMatch(/ctrl\??:\s*boolean/);
  });

  test("Kbd exposes small prop", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/small\??:\s*boolean/);
  });

  test("G06-KBD-01: only meta swaps to the word 'Ctrl' off-Mac; shift/alt/ctrl keep glyphs on all platforms", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    // meta is the only modifier with a platform branch (⌘ on Mac, 'Ctrl' elsewhere)
    expect(src).toMatch(/meta && \(IS_MAC \? "⌘" : "Ctrl"\)/);
    // shift/alt/ctrl must NOT have a platform branch — they always render the glyph
    expect(src).not.toMatch(/shift && \(IS_MAC/);
    expect(src).not.toMatch(/alt && \(IS_MAC/);
    expect(src).not.toMatch(/ctrl && \(IS_MAC/);
    expect(src).toMatch(/shift && "⇧"/);
    expect(src).toMatch(/alt && "⌥"/);
    expect(src).toMatch(/ctrl && "⌃"/);
    // no non-Mac word fallbacks for shift/alt/ctrl
    expect(src).not.toMatch(/shift && \(IS_MAC \? "⇧" : "Shift"\)/);
    expect(src).not.toMatch(/alt && \(IS_MAC \? "⌥" : "Alt"\)/);
    expect(src).not.toMatch(/ctrl && \(IS_MAC \? "⌃" : "Ctrl"\)/);
  });

  test("G06-KBD-03: default kbd is 24px high (h-6), 14px (text-sm), padding 0 6px (px-1.5), sans font", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/h-6/);
    expect(src).toMatch(/text-sm/);
    expect(src).toMatch(/px-1\.5/);
    // Geist Sans, NOT mono
    expect(src).not.toMatch(/font-mono/);
    expect(src).not.toMatch(/text-label-12-mono/);
  });

  test("G06-KBD-05: kbd surface is bg-background-100 with ring, NOT gray-alpha-200 + border + mono", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/bg-background-100/);
    expect(src).toMatch(/ring/);
    expect(src).not.toMatch(/bg-gray-alpha-200/);
    expect(src).not.toMatch(/border-gray-alpha-400/);
  });

  test("G06-KBD-04: multi-modifier renders as ONE pill — modifiers joined into a single text node", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    // modifiers concatenated inside a single <kbd> ('Ctrl⇧'), no per-modifier element spacing
    expect(src).toMatch(/modifiers\.join/);
    expect(src).not.toMatch(/modifiers\.map/);
    expect(src).not.toMatch(/gap-0\.5/);
  });

  test("small variant keeps official compact size (h-5 min-w-5 px-1 text-xs)", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/small && "h-5 min-w-5 px-1 text-xs"/);
  });

  test("G06-KBD-02: docs demo must not hardcode modifier glyphs — uses modifier props", async () => {
    const demo = await read("docs/geist/src/components/docs-components-page.tsx");
    const demoBody = demo.slice(
      demo.indexOf("function KeyboardInputDemo"),
      demo.indexOf("function BannerDemo"),
    );
    // uses the modifier props
    expect(demoBody).toMatch(/<Kbd meta>/);
    expect(demoBody).toMatch(/<Kbd shift>/);
    // no hardcoded Mac glyph or spelled-out modifier words as children
    expect(demoBody).not.toContain("⌘");
    expect(demoBody).not.toContain("<Kbd>Shift</Kbd>");
    expect(demoBody).not.toContain("<Kbd>Alt</Kbd>");
    expect(demoBody).not.toContain("<Kbd>Ctrl</Kbd>");
  });
});
