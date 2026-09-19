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
    // 33dce90 起 Apple 键帽基线：修饰符渲染为 Material Symbols Rounded 键帽图标
    // （PUA codepoint + msr-keycap 字体），不再内联 Unicode 字形文本。
    expect(src).toContain('meta: "\\uEAE7"'); // ⌘ keyboard_command_key
    expect(src).toContain('shift: "\\uE5F2"'); // ⇧ shift
    expect(src).toContain('alt: "\\uEAE8"'); // ⌥ keyboard_option_key
    expect(src).toContain('ctrl: "\\uEAE6"'); // ⌃ keyboard_control_key
    // PUA 字形对读屏不可读：修饰符槽 aria-hidden，键名槽不隐藏
    expect(src).toContain("aria-hidden={slot.modifier ? true : undefined}");
    expect(src).not.toContain("Ctrl\\u00a0");
    expect(src).not.toContain("Alt\\u00a0");
  });

  test("G06-KBD-03: default kbd uses the compact line box, square keycap geometry, and system font", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    // Apple 键帽：高度锁定 24px 方块；等宽网格 wrapper（列宽 = 组内最宽槽位，零硬编码）；
    // 键名继承文档主字体（[font-family:inherit] 覆盖 preflight 的 mono 预设）。
    expect(src).toContain("inline-grid grid-flow-col auto-cols-[1fr]");
    expect(src).toContain("[font-family:inherit]");
    expect(src).not.toContain("font-mono");
    expect(src).toContain('"h-6 rounded-sm px-1 text-base"');
    expect(src).toContain("whitespace-nowrap");
    expect(src).toContain("leading-none");
    expect(src).toContain('!plain && (small ? "ml-0.5" : "ml-1")');
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

  test("G06-KBD-04: multi-modifier renders adjacent keycap slots, one slot per modifier", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).not.toMatch(/modifiers\.join/);
    // 每个键位一个 kbd-key 槽位（slots 数组驱动），键名 children 占独立槽位
    expect(src).toContain('data-slot="kbd-key"');
    expect(src).toContain('slots.push({ char: MODIFIER_GLYPHS.meta, modifier: "meta" })');
    expect(src).toContain("if (children != null) slots.push({ char: children, modifier: null })");
    // 邻接间隙：有框键帽 4px（Apple 菜单 ≈0.25em 字间间隙），plain 纯文本 1px 微缝
    expect(src).toContain('plain ? "gap-[1px]" : "gap-[4px]"');
    expect(src).not.toContain('style={{ display: "inline-block", minWidth: "1em" }}');
  });

  test("small variant keeps the compact 20px square keycap for dense surfaces", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    expect(src).toContain('"h-5 rounded-sm px-1 text-xs"');
  });

  test("modifier glyphs are narrowed to the key letter ink height (0.8125em)", async () => {
    const src = await read("src/components/ui/keyboard-input.tsx");
    // 实测：Material Symbols 字形铺满 em 框（ink = 1em），OPPO Sans cap 系字母墨迹
    // 仅 ≈0.8125em（16px 字号下 K 的 ink 为 13px）——不收窄则图标比字母高 23%，
    // 即便墨迹中心对齐（实测差 0）也会因上缘更高、基线更低而看起来"没对齐"。
    expect(src).toContain('slot.modifier && "text-[0.8125em]"');
  });

  test("plain variant supports borderless command shortcuts without bypassing platform modifiers", async () => {
    const [src, docs] = await Promise.all([
      read("src/components/ui/keyboard-input.tsx"),
      read("docs/geist/src/components/docs-components-page.tsx"),
    ]);
    const example = EXAMPLE_SOURCE["keyboard-input"]["plain-command"];
    expect(src).toMatch(/plain\??:\s*boolean/);
    expect(src).toContain('"bg-transparent shadow-none"');
    expect(src).toContain('"gap-[1px]"');
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
