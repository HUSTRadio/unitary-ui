/**
 * CopyButton 契约测试：官方双图标 scale 交叉动效（官方 vercel.com/geist/copy-button 实测）。
 * 渲染断言（renderToStaticMarkup）+ 源码断言双轨。
 */
import { describe, expect, test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CopyButton } from "../src/components/ui/copy-button";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("CopyButton icon crossfade structure", () => {
  test("renders BOTH icons stacked (official mechanism, no DOM swap)", () => {
    const html = renderToStaticMarkup(
      createElement(CopyButton, { textToCopy: "lipsum", label: "copy text" }),
    );
    // 官方机制：copy + check 两个图标常驻叠加，靠 scale/opacity 过渡切换
    expect(html).toContain("scale-100 opacity-100"); // copy 初始可见
    expect(html).toContain("scale-50 opacity-0"); // check 初始隐藏
    expect(html).toContain("transition-all duration-150");
    // 不再条件渲染：两个图标同时在初始 DOM 中
    expect(html.match(/scale-50/g)?.length).toBeGreaterThanOrEqual(1);
  });

  test("no text-success coloring on check icon (official inherits foreground)", () => {
    const html = renderToStaticMarkup(
      createElement(CopyButton, { textToCopy: "lipsum" }),
    );
    expect(html).not.toContain("text-success");
  });
});

describe("CopyButton source contract", () => {
  test("reverts after 1000ms (official measured: check held ~1s then reverts)", async () => {
    const src = await read("src/components/ui/copy-button.tsx");
    expect(src).toContain("1000");
    expect(src).not.toContain("1500");
  });

  test("reduced-motion degrades transitions", async () => {
    const src = await read("src/components/ui/copy-button.tsx");
    expect(src).toContain("motion-reduce:transition-none");
  });

  test("button visuals match official metrics (36px, r6, gray-400 ring)", async () => {
    const src = await read("src/components/ui/copy-button.tsx");
    expect(src).toContain("size-9"); // 36px
    expect(src).toContain("rounded-md"); // 6px
    expect(src).toContain("shadow-[0_0_0_1px_var(--color-gray-400)]");
    expect(src).toContain("hover:bg-gray-200"); // dark 实测 #1f1f1f
  });
});
