/**
 * CopyButton 契约测试：复制反馈动效 = 复制图标缩小淡出 + 对勾描边绘制动画，
 * 随后对勾 fade out 切回复制图标。渲染断言 + 源码断言双轨。
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

describe("CopyButton icon layers", () => {
  test("renders BOTH icons stacked; copy visible, check hidden initially", () => {
    const html = renderToStaticMarkup(
      createElement(CopyButton, { textToCopy: "lipsum", label: "copy text" }),
    );
    // 两个图标常驻叠加（非条件替换 DOM）
    expect(html).toContain("opacity-100 duration-(--ds-duration-fast)"); // copy 初始可见
    expect(html).toContain("opacity-0"); // check 初始隐藏
    expect(html).not.toContain("animate-copy-check-draw"); // 未复制时不触发绘制动画
  });

  test("no text-success coloring on check icon (inherits foreground)", () => {
    const html = renderToStaticMarkup(createElement(CopyButton, { textToCopy: "lipsum" }));
    expect(html).not.toContain("text-success");
  });
});

describe("CopyButton source contract", () => {
  test("check uses stroke draw animation class (no SVG content edits)", async () => {
    const src = await read("src/components/ui/copy-button.tsx");
    expect(src).toContain("[&_svg_path:first-child]:animate-copy-check-draw");
    // 单独的对勾延迟进入，避免 CopyCheck 整体图形切换产生跳变。
    expect(src).toContain('import { Check, Copy } from "lucide-react"');
    expect(src).toContain('"scale-75 -rotate-6 opacity-0 duration-(--ds-duration-fast)"');
    expect(src).toContain('"scale-100 rotate-0 opacity-100 delay-[60ms] duration-(--ds-duration-base)"');
  });

  test("draw keyframes exist in global styles", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toContain("--animate-copy-check-draw: copy-check-draw 0.2s ease-out both");
    expect(css).toContain("@keyframes copy-check-draw");
    expect(css).toContain("stroke-dasharray: 24"); // lucide Check getTotalLength 实测全长 22.63，24 留余量
    expect(css).toContain("stroke-dashoffset: 24");
    expect(css).toContain("stroke-dashoffset: 0");
  });

  test("reverts after 1200ms", async () => {
    const src = await read("src/components/ui/copy-button.tsx");
    expect(src).toContain("1200");
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
