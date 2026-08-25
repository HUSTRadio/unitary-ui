// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/**
 * Task 8 / B0 `foundation-materials` TDD 契约。
 *
 * 数值来源：src/styles/index.css 的 @utility material-* 声明（官方 materials.md
 * 实测，2026-08-08）。逐项断言八类 utility 的 radius/surface/shadow 关系，
 * 而非仅检查 "@utility material-*" 字符串存在。
 *
 * 冻结契约互锁：tests/menu-surface.test.tsx（不在本任务允许清单）锁定 Menu
 * 内容层 = rounded-overlay(6px) + bg-surface + p-1.5 +
 * shadow-[var(--material-shadow-menu)] 无 border；因此 material-menu 的
 * radius/surface 口径必须与该浮层契约一致（6px overlay / surface），而不是
 * 旧的 12px/bg-elevated 声明。tooltip 保持 6px，浮层表面统一 elevated→surface
 * 的对齐由 CSS 侧完成，这里锁定最终口径。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readCss = () => readFile(path.join(root, "src/styles/index.css"), "utf8");

interface UtilityBlock {
  radius: string | null;
  surface: string | null;
  shadowToken: string | null;
}

function parseUtility(css: string, name: string): UtilityBlock {
  const re = new RegExp(`@utility material-${name} \\{([\\s\\S]*?)\\n\\}`);
  const match = css.match(re);
  expect(match, `@utility material-${name} must exist`).not.toBeNull();
  const body = match![1];
  return {
    radius: body.match(/border-radius:\s*([^;]+);/)?.[1]?.trim() ?? null,
    surface: body.match(/background-color:\s*([^;]+);/)?.[1]?.trim() ?? null,
    shadowToken: body.match(/box-shadow:\s*var\(--material-shadow-[a-z]+\)/)?.[0] ?? null,
  };
}

describe("Material elevation contract (B0 foundation-materials)", () => {
  test("all eight canonical material utilities exist", async () => {
    const css = await readCss();
    for (const name of [
      "base",
      "small",
      "medium",
      "large",
      "tooltip",
      "menu",
      "modal",
      "fullscreen",
    ]) {
      expect(css).toContain(`@utility material-${name}`);
    }
  });

  test("surface tier: base/small 6px, medium/large 12px, all on bg-surface", async () => {
    const css = await readCss();
    for (const [name, radius] of [
      ["base", "6px"],
      ["small", "6px"],
      ["medium", "12px"],
      ["large", "12px"],
    ] as const) {
      const block = parseUtility(css, name);
      expect(block.radius, `material-${name} radius`).toBe(radius);
      expect(block.surface, `material-${name} surface`).toBe("var(--color-bg-surface)");
      expect(block.shadowToken, `material-${name} own shadow token`).toMatch(
        new RegExp(`--material-shadow-${name}`),
      );
    }
  });

  test("floating tier radii follow the official scale and each owns its shadow token", async () => {
    const css = await readCss();
    for (const [name, radius] of [
      ["tooltip", "6px"],
      ["modal", "12px"],
      ["fullscreen", "16px"],
    ] as const) {
      const block = parseUtility(css, name);
      expect(block.radius, `material-${name} radius`).toBe(radius);
      expect(block.shadowToken, `material-${name} own shadow token`).toMatch(
        new RegExp(`--material-shadow-${name}`),
      );
    }
    // material-menu radius is locked to the frozen overlay contract in its own test below.
  });

  test("floating menu surface aligns with the frozen menu-surface overlay contract (6px/surface, not 12px/elevated)", async () => {
    const css = await readCss();
    // tests/menu-surface.test.tsx freezes the live menu content layer:
    // rounded-overlay (= --radius-overlay → var(--radius) = 6px) + bg-surface.
    // material-menu must not drift from that measured contract.
    const block = parseUtility(css, "menu");
    expect(block.radius).toBe("var(--radius-overlay)");
    expect(block.surface).toBe("var(--color-bg-surface)");
  });

  test("shadow tokens are defined per theme with light and dark owners", async () => {
    const css = await readCss();
    for (const token of [
      "--material-shadow-base",
      "--material-shadow-small",
      "--material-shadow-medium",
      "--material-shadow-large",
      "--material-shadow-tooltip",
      "--material-shadow-menu",
      "--material-shadow-modal",
      "--material-shadow-fullscreen",
    ]) {
      // :root (light) owner … then .dark override later in the file
      const lightIdx = css.indexOf(`--${token.replace(/^--/, "")}:`);
      expect(lightIdx, `${token} light owner`).toBeGreaterThan(-1);
    }
    const darkSection = css.slice(css.indexOf(".dark"));
    for (const name of [
      "base",
      "small",
      "medium",
      "large",
      "tooltip",
      "menu",
      "modal",
      "fullscreen",
    ]) {
      expect(darkSection).toContain(`--material-shadow-${name}:`);
    }
  });
});
