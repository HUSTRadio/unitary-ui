import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = async (relative: string) =>
  (await readFile(path.join(root, relative), "utf8")).replace(/\r\n/g, "\n");

describe("视觉修复固化（badge / calendar compact / a11y）", () => {
  test("badge outline 无任何 dark: 覆盖（单 token 自动翻转，暗色禁 gray-400 深灰档）", async () => {
    const src = await read("src/components/ui/badge.tsx");
    const outlineBlock = src.match(/outline:\s*"([^"]*)"/s)?.[1] ?? "";
    expect(outlineBlock).toContain("bg-transparent border border-gray-alpha-500 text-gray-900");
    expect(outlineBlock).not.toContain("dark:text-gray-400");
    // 曾出现过的过重边框档（51% 白）亦禁止
    expect(outlineBlock).not.toContain("dark:border-gray-alpha-600");
  });

  test("calendar compact 行类：trigger 左圆角 + 右侧控件右圆角", async () => {
    const src = await read("src/components/ui/calendar-classes.ts");
    const rowClass = src.match(/const CALENDAR_ROW_CLASS =\s*"([^"]*)"/s)?.[1] ?? "";
    expect(rowClass).toContain("[&_[data-uni-button]]:rounded-l-[5px]");
    expect(rowClass).toContain("[&_[data-uni-button]]:rounded-r-none");
    expect(rowClass).toContain("[&_[data-uni-select]]:rounded-r-[5px]");
  });

  test("theme-switcher / grabber 均消费标准 focus-ring（键盘焦点可见）", async () => {
    const switcher = await read("src/components/ui/theme-switcher.tsx");
    const grabber = await read("src/components/ui/grabber.tsx");
    expect(switcher).toContain("outline-none focus-ring");
    expect(grabber).toContain("focus-ring");
    expect(grabber).toContain("outline-none");
  });

  test("modal/sheet/collapse/motion 组件保留 motion-reduce 适配", async () => {
    const expectations: Array<[string, string]> = [
      ["src/components/ui/sheet.tsx", "motion-reduce:animate-none!"],
      ["src/components/ui/modal.tsx", "motion-reduce:animate-none!"],
      ["src/components/ui/context-card.tsx", "motion-reduce:animate-none!"],
      ["src/components/ui/collapse.tsx", "motion-reduce:transition-none"],
      ["src/components/ui/destructive-action-modal.tsx", "motion-reduce:animate-none!"],
    ];
    for (const [file, needle] of expectations) {
      const src = await read(file);
      expect(src, file).toContain(needle);
    }
  });
});
