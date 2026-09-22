import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (file: string) =>
  readFileSync(new URL(`../src/components/ui/${file}`, import.meta.url), "utf8");

/**
 * HIG-AUD-013 源码契约：触屏（pointer: coarse）下把命中区抬到 ≥44×44，
 * 桌面维持原视觉尺寸。逐组件锁定声明，防止改动时丢类。
 *
 * 命中区语义：`min-h-11` = 2.75rem = 44px；窄元素（图标按钮 / 胶囊）同时补
 * `min-w-11`。行类元素宽度本已足够，仅需高度。
 */
const ONLY_HEIGHT: Array<[file: string, note: string]> = [
  ["menu.tsx", "MenuItem（36px 行）"],
  ["select.tsx", "Select 触发器三档 + Item"],
  ["multi-select.tsx", "MultiSelect 行 + 触发器"],
];

const WIDTH_AND_HEIGHT: Array<[file: string, note: string]> = [
  ["dots-menu.tsx", "DotsMenu 触发器（32px 方形）"],
  ["toast.tsx", "Toast action / 关闭（32px / 24px）"],
  ["theme-switcher.tsx", "ThemeSwitcher 选项（24/32px 圆形）"],
  ["edit-menu.tsx", "EditMenu 胶囊项（28px）"],
  ["toolbar.tsx", "ToolbarItem（32px）"],
  ["hamburger-menu.tsx", "汉堡面板搜索清除（28px）"],
  // 短标签会在触屏下窄于 44，必须补 min-w：
  ["menu-bar.tsx", "MenuBarTrigger（28px，短标签约 36px 宽）"],
  ["destructive-action-modal.tsx", "确认主按钮（32px）"],
];

describe("touch target contract (HIG-AUD-013)", () => {
  for (const [file, note] of ONLY_HEIGHT) {
    test(`${note} 声明 pointer-coarse 命中高度`, () => {
      expect(read(file)).toContain("pointer-coarse:min-h-11");
    });
  }

  for (const [file, note] of WIDTH_AND_HEIGHT) {
    test(`${note} 声明 pointer-coarse 命中宽高`, () => {
      const source = read(file);
      expect(source).toContain("pointer-coarse:min-h-11");
      expect(source).toContain("pointer-coarse:min-w-11");
    });
  }

  test("Select 的触发器三档与 Item 全部覆盖（≥4 处）", () => {
    const matches = read("select.tsx").match(/pointer-coarse:min-h-11/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(4);
  });

  test("Toast 的 action 与关闭按钮全部覆盖（≥2 处）", () => {
    const matches = read("toast.tsx").match(/pointer-coarse:min-h-11/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test("MultiSelect 的行与触发器全部覆盖（≥2 处）", () => {
    const matches = read("multi-select.tsx").match(/pointer-coarse:min-h-11/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test("命中区统一 44px 档：不出现其它 min-h 数值的 pointer-coarse 变体", () => {
    const all = [...ONLY_HEIGHT, ...WIDTH_AND_HEIGHT]
      .map(([file]) => read(file))
      .join("\n");
    for (const match of all.matchAll(/pointer-coarse:min-[hw]-[^\s"']+/g)) {
      expect(match[0]).toMatch(/pointer-coarse:min-[hw]-11/);
    }
  });
});
