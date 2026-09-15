import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

const root = process.cwd();
const css = readFileSync(path.join(root, "src/styles/index.css"), "utf8");

function walk(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules") continue;
      walk(full, files);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

/** 去掉块注释与行注释，避免注释里的历史字面量误报。 */
function stripComments(source: string) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("easing tokens（2026-09-15 收敛基线）", () => {
  test("4 个曲线 token 定义在 @theme static（发射到 :root，供类与内联 style 双消费）", () => {
    // 值与收敛前的字面量严格相等
    expect(css).toContain("--ease-snap: cubic-bezier(0.32, 0.72, 0, 1)");
    expect(css).toContain("--ease-pop: cubic-bezier(0.175, 0.885, 0.32, 1.1)");
    expect(css).toContain("--ease-stagger: cubic-bezier(0.16, 1, 0.3, 1)");
    expect(css).toContain("--ease-toast: cubic-bezier(0.25, 0.75, 0.6, 0.98)");
  });

  test("src 内不得再现 ease-[cubic-bezier 任意值类（棘轮：新曲线必须走 token）", () => {
    const violations: string[] = [];
    for (const file of walk(path.join(root, "src"))) {
      const code = stripComments(readFileSync(file, "utf8"));
      if (/ease-\[cubic-bezier/.test(code)) {
        violations.push(path.relative(root, file).replace(/\\/g, "/"));
      }
    }
    expect(violations).toEqual([]);
  });

  test("内联 style 过渡曲线只消费 var(--ease-*)（bottom-sheet / drawer / hamburger 错峰）", () => {
    const inlineConsumers: Array<[string, string]> = [
      ["src/components/ui/bottom-sheet.tsx", "var(--ease-snap)"],
      ["src/components/ui/drawer.tsx", "var(--ease-snap)"],
      ["src/components/ui/hamburger-menu.tsx", "var(--ease-stagger)"],
    ];
    for (const [file, needle] of inlineConsumers) {
      const code = stripComments(readFileSync(path.join(root, file), "utf8"));
      expect(code, file).toContain(needle);
      expect(code, file).not.toMatch(/cubic-bezier/);
    }
  });
});
