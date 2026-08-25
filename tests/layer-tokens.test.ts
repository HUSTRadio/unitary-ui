// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/**
 * Task 9 `layer-tokens` 门禁。
 *
 * 契约：overlay stacking 数值统一收敛到 index.css 的 --uni-z-* role token，
 * 组件源码不得再出现对应 raw literal。数值为保值迁移（Task 9 基线实测）：
 * material=elevation 是视觉契约，实际 stacking order 由这些 token 单独管理。
 *
 * 语义带锁定（防止未来误抬层级）：
 * - menu(50) 独立带，禁止并入 popover 带（2001）；
 * - select 与 combobox 同属 popover 带，共享 --uni-z-popover；
 * - drawer/sheet 复用既有 --uni-z-drawer，禁止 alias 链；
 * - toast viewport 用 --uni-z-toast，内部堆叠 zIndex: i + 1 不受影响。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readCss = () => readFile(path.join(root, "src/styles/index.css"), "utf8");
const readComponent = (name: string) =>
  readFile(path.join(root, "src/components/ui", name), "utf8");

/** token 名 → 保值数值（与 brief 表格一一对应，不得调整）。 */
const LAYER_TOKENS: Record<string, number> = {
  "--uni-z-menu": 50,
  "--uni-z-modal": 300,
  "--uni-z-popover": 2001,
  "--uni-z-toast": 5000,
  "--uni-z-tooltip": 99999,
  "--uni-z-context-card": 1000000,
};

describe("Layer token declarations (index.css)", () => {
  test("all six overlay stacking tokens declared with preserved values", async () => {
    const css = await readCss();
    for (const [token, value] of Object.entries(LAYER_TOKENS)) {
      const re = new RegExp(`${escape(token)}:\\s*${value};`);
      expect(
        re.test(css),
        `${token} must be declared as ${value} (value-preserving migration)`
      ).toBe(true);
    }
  });

  test("drawer token still present and no alias chain introduced", async () => {
    const css = await readCss();
    expect(css).toMatch(/--uni-z-drawer:\s*200;/);
    // 禁止 drawer 的 alias 链（如 --uni-z-sheet / --uni-z-bottom-sheet 等）
    const aliasDecls = css.match(/--uni-z-[a-z-]+:/g) ?? [];
    for (const decl of aliasDecls) {
      expect(
        ["--uni-z-drawer:", ...Object.keys(LAYER_TOKENS).map((t) => `${t}:`)],
        `unexpected layer token declaration: ${decl}`
      ).toContain(decl);
    }
  });
});

describe("Raw z-index literals removed from component sources", () => {
  test.each([
    ["menu.tsx", /(^|[\s"'])z-50(?=[\s"'(]|$)/m],
    ["modal.tsx", /z-\[300\]/],
    ["select.tsx", /z-\[2001\]/],
    ["combobox.tsx", /z-\[2001\]/],
    ["toast.tsx", /z-\[5000\]/],
    ["tooltip.tsx", /z-\[99999\]/],
    ["context-card.tsx", /z-\[1000000\]/],
  ])("%s no longer contains its raw literal", async (file, pattern) => {
    const source = await readComponent(file);
    expect(source).not.toMatch(pattern as RegExp);
  });

  test("combobox inline zIndex: 2001 is tokenized too", async () => {
    const source = await readComponent("combobox.tsx");
    expect(source).not.toMatch(/zIndex:\s*2001/);
  });
});

describe("Components consume layer tokens", () => {
  test.each([
    ["menu.tsx", "var(--uni-z-menu)"],
    ["modal.tsx", "var(--uni-z-modal)"],
    ["select.tsx", "var(--uni-z-popover)"],
    ["combobox.tsx", "var(--uni-z-popover)"],
    ["toast.tsx", "var(--uni-z-toast)"],
    ["tooltip.tsx", "var(--uni-z-tooltip)"],
    ["context-card.tsx", "var(--uni-z-context-card)"],
  ])("%s consumes %s", async (file, tokenRef) => {
    const source = await readComponent(file);
    expect(source).toContain(tokenRef);
  });

  test("menu stays out of the popover band (semantic lock)", async () => {
    const source = await readComponent("menu.tsx");
    expect(source).not.toContain("--uni-z-popover");
    expect(source).not.toContain("2001");
  });

  test("combobox inline zIndex uses var(--uni-z-popover)", async () => {
    const source = await readComponent("combobox.tsx");
    expect(source).toMatch(/zIndex:\s*"?var\(--uni-z-popover\)"?/);
  });
});

describe("drawer/sheet keep consuming --uni-z-drawer", () => {
  test.each(["drawer.tsx", "sheet.tsx"])("%s still uses var(--uni-z-drawer)", async (file) => {
    const source = await readComponent(file);
    expect(source).toContain("z-[var(--uni-z-drawer)]");
  });
});

describe("toast internal stacking untouched", () => {
  test("viewport keeps zIndex: i + 1 internal ordering", async () => {
    const source = await readComponent("toast.tsx");
    expect(source).toMatch(/zIndex:\s*i \+ 1/);
  });
});

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
