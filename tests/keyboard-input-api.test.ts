import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

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

  test("G06-KBD-01: Windows uses symbolic Shift, Alt, and Ctrl mappings without shortcut spacing", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    // Windows mapping: Shift → ⇧, Alt → ⌥, Ctrl (meta) → ⌘.
    expect(src).toContain(">⌘</span>");
    expect(src).toMatch(/shift \? <span className="inline-block min-w-\[1em\] text-center">⇧<\/span> : null/);
    expect(src).toMatch(/alt \? <span className="inline-block min-w-\[1em\] text-center">⌥<\/span> : null/);
    expect(src).toMatch(/ctrl \? <span className="inline-block min-w-\[1em\] text-center">⌃<\/span> : null/);
    expect(src).not.toContain("Ctrl\\u00a0");
    expect(src).not.toContain("Alt\\u00a0");
  });

  test("G06-KBD-03: default kbd uses the compact line box, minimum size, spacing, and mono font", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toContain("inline-block");
    expect(src).toContain("min-h-6 min-w-6");
    expect(src).toContain("!leading-[1.7em]");
    expect(src).toContain("ml-1");
    expect(src).toContain("font-mono");
    expect(src).toMatch(/text-sm/);
    expect(src).toMatch(/px-1\.5/);
    expect(src).not.toContain("font-sans");
  });

  test("G06-KBD-05: kbd surface uses the official one-pixel outer shadow", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toMatch(/bg-background-100/);
    expect(src).toContain("shadow-[0_0_0_1px_var(--uni-gray-alpha-400)]");
    expect(src).not.toContain("ring-inset");
    expect(src).not.toMatch(/bg-gray-alpha-200/);
    expect(src).not.toMatch(/border-gray-alpha-400/);
  });

  test("G06-KBD-04: multi-modifier renders as one pill with one span per modifier", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).not.toMatch(/modifiers\.join/);
    // 每个键位槽位统一 inline-block min-w-[1em]（含 meta 特例 inline style 已删除）。
    expect(src).toContain('className="inline-block min-w-[1em] text-center"');
    expect(src).toContain("{shift ? <span className=\"inline-block min-w-[1em] text-center\">⇧</span> : null}");
    expect(src).toContain("{alt ? <span className=\"inline-block min-w-[1em] text-center\">⌥</span> : null}");
    expect(src).toContain("{ctrl ? <span className=\"inline-block min-w-[1em] text-center\">⌃</span> : null}");
    expect(src).not.toContain('style={{ display: "inline-block", minWidth: "1em" }}');
    expect(src).not.toMatch(/gap-0\.5/);
  });

  test("small variant keeps the official compact size and two-pixel leading margin", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toContain('"ml-0.5 h-5 min-h-5 min-w-5 px-1 text-xs"');
  });

  test("plain variant supports borderless command shortcuts without bypassing platform modifiers", async () => {
    const [src, docs] = await Promise.all([
      read("src/components/ui/keyboard-input.tsx"),
      read("docs/geist/src/components/docs-components-page.tsx"),
    ]);
    const example = EXAMPLE_SOURCE["keyboard-input"]["plain-command"];
    expect(src).toMatch(/plain\??:\s*boolean/);
    expect(src).toContain('"ml-0 min-h-0 min-w-0 bg-transparent px-0 shadow-none"');
    expect(example).toContain("export function");
    expect(example).toMatch(/<Kbd plain meta>\s*K\s*<\/Kbd>/);
    expect(docs).toContain("EXAMPLE_REGISTRY[name]");
  });

  test("G06-KBD-02: docs demo must not hardcode modifier glyphs — uses modifier props", () => {
    const [modifiers, combination] = [
      EXAMPLE_SOURCE["keyboard-input"].modifiers,
      EXAMPLE_SOURCE["keyboard-input"].combination,
    ];
    // uses the modifier props
    expect(modifiers).toMatch(/<Kbd meta\s*\/>/);
    expect(modifiers).toMatch(/<Kbd shift\s*\/>/);
    // no hardcoded Mac glyph or spelled-out modifier words as children
    for (const example of [modifiers, combination, EXAMPLE_SOURCE["keyboard-input"].small]) {
      expect(example).not.toContain("⌘");
      expect(example).not.toContain("<Kbd>Shift</Kbd>");
      expect(example).not.toContain("<Kbd>Alt</Kbd>");
      expect(example).not.toContain("<Kbd>Ctrl</Kbd>");
    }
  });

  test("docs mirror the three official Modifiers, Combination, and Small demos", () => {
    const { modifiers, combination, small } = EXAMPLE_SOURCE["keyboard-input"];

    expect(modifiers).toContain("<Kbd meta />");
    expect(modifiers).toContain("<Kbd shift />");
    expect(modifiers).toContain("<Kbd alt />");
    expect(modifiers).toContain("<Kbd ctrl />");
    expect(combination).toContain("<Kbd meta shift />");
    expect(small).toContain("<Kbd small>/</Kbd>");
    for (const example of [modifiers, combination, small]) {
      expect(example).not.toContain("<KeyboardInput>");
    }
  });

  test("audit manifest enumerates all three official demos", async () => {
    const manifest = JSON.parse(await read("tests/audit/geist-audit-manifest.json"));
    const component = manifest.components.find(
      (candidate: { slug?: string }) => candidate.slug === "keyboard-input",
    );

    expect(component.inventoryStatus).toBe("live_enumeration_complete");
    expect(component.variants).toEqual(["modifiers", "combination", "small"]);
    expect(
      component.acceptanceContracts.map((contract: { demoId: string }) => contract.demoId),
    ).toEqual(["modifiers", "combination", "small"]);
  });
});
