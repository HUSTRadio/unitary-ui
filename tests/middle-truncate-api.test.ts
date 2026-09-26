// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MiddleTruncate } from "../src/components/ui/middle-truncate";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

// React 19 需要在 jsdom 中显式开启 act 环境
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 无 canvas 实现：显式返回 null，使度量退化为确定性估算（单字符 7px，省略号 14px）
HTMLCanvasElement.prototype.getContext = (() =>
  null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

/**
 * 以指定的父容器可用宽度渲染 MiddleTruncate，返回可见文本。
 * 可见文本 = 根节点文本剔除 sr-only 中的完整值（该值始终保留在 DOM 中）。
 */
async function renderVisible(value: string, availableWidth: number): Promise<string> {
  document.body.innerHTML = "";
  const parent = document.createElement("div");
  Object.defineProperty(parent, "clientWidth", { value: availableWidth, configurable: true });
  document.body.appendChild(parent);

  const container = createRoot(parent);
  await act(async () => {
    container.render(React.createElement(MiddleTruncate, { value }));
  });
  await act(async () => Promise.resolve());

  const node = parent.querySelector<HTMLElement>('[data-slot="middle-truncate"]');
  const fullText = node?.querySelector("span.sr-only")?.textContent ?? "";
  const text = node?.textContent ?? "";

  return fullText ? text.replace(fullText, "") : text;
}

// 官方 demo 的两个代表性字符串（docs/geist-markdown-refs/components/middle-truncate.md Examples）
const BRANCH = "feature/redesign-dashboard-navigation-with-sidebar-improvements";
const PREVIEW_URL = "platform-web-git-feature-redesign-dashboard-navigation-phamous.vercel.app";

describe("MiddleTruncate width-adaptive truncation (G07-MT-01)", () => {
  it("keeps the longest fitting head/tail pair instead of fixed 1 head + 1 tail", async () => {
    // 窄容器：只能放 1 头 1 尾（BRANCH 首字符 'f'、末字符 's'）
    expect(await renderVisible(BRANCH, 40)).toBe("f…s");

    // 120px 级容器（fallback 度量下 126px 正好是 8 头 + … + 8 尾的宽度）
    // → 官方在 width=120 的实测渲染 'feature/…ovements'
    const narrow = await renderVisible(BRANCH, 130);
    expect(narrow).toBe("feature/…ovements");

    // 同宽度下官方另一条实测渲染 'platform-…ercel.app'
    // PREVIEW_URL 保留官方测量样本原文（如上注释所示来自 docs/geist-markdown-refs 的实测记录），
    // 它是宽度断言的证据输入，不是产品品牌文案，故不做中性化改写。
    expect(await renderVisible(PREVIEW_URL, 145)).toBe("platform-…ercel.app");

    // 更宽容器 → head/tail 单调变长（布局自适应，而非固定 1/1）
    const [h2, t2] = narrow.split("…");
    const [h4, t4] = (await renderVisible(BRANCH, 400)).split("…");
    expect(h4!.length).toBeGreaterThan(h2!.length);
    expect(t4!.length).toBeGreaterThan(t2!.length);
    expect(h4!.length).toBe(t4!.length);
  });

  it("renders the full value as-is when it fits, with a single … glyph when truncated", async () => {
    // 放得下 → 不出现省略号，完整值即为可见文本
    expect(await renderVisible("sidebar.tsx", 1000)).toBe("sidebar.tsx");

    // head/tail 等长且总宽不超过 maxWidth
    const visible = await renderVisible(BRANCH, 200);
    expect(visible).toContain("…");
    const [h, t] = visible.split("…");
    expect(h!.length).toBe(t!.length);
    const perChar = 7;
    expect(h!.length * perChar + 14 + t!.length * perChar).toBeLessThanOrEqual(200);
  });

  it("handles degenerate inputs without collapsing to a single character", async () => {
    // 单字符
    expect(await renderVisible("a", 10)).toBe("a");
    // 空字符串
    expect(await renderVisible("", 100)).toBe("");
    // maxWidth <= 0（尚未布局/隐藏容器）：保持完整文本，绝不塌缩为 'h…t'
    expect(await renderVisible(BRANCH, 0)).toBe(BRANCH);
    expect(await renderVisible(BRANCH, -5)).toBe(BRANCH);
  });

  it("renders full value + a11y surface in SSR markup (full value stays in DOM)", () => {
    const markup = renderToStaticMarkup(
      React.createElement(MiddleTruncate, { value: BRANCH, className: "text-copy-14" }),
    );

    expect(markup).toContain('data-slot="middle-truncate"');
    expect(markup).toContain(`data-value="${BRANCH}"`);
    expect(markup).toContain(`aria-label="${BRANCH}"`);
    expect(markup).toContain(`title="${BRANCH}"`);
    expect(markup).toContain('class="sr-only"');
    expect(markup).toContain(BRANCH); // 完整值留在 DOM（可见文本 + sr-only），复制拿到原文
    expect(markup).toContain("text-copy-14"); // className 透传
  });

  it("docs demo constrains its fixed width to the mobile content box", () => {
    const example = EXAMPLE_SOURCE["middle-truncate"]?.["Examples"];

    expect(example).toBeDefined();
    expect(example).toContain('className="w-64 font-mono');
  });

  it("component guide cards can shrink long inline paths on narrow viewports", async () => {
    const guideSections = await read("docs/site/src/components/component-guide-sections.tsx");

    expect(guideSections).toContain(
      'className="min-w-0 [overflow-wrap:anywhere] rounded-lg border border-border p-4"',
    );
  });

  it("measures the PARENT container, not its own shrinking width (root cause)", async () => {
    const src = await read("src/components/ui/middle-truncate.tsx");

    // 可用宽度来自父容器
    expect(src).toContain("parentElement");
    expect(src).toContain("parent.clientWidth");
    // ResizeObserver 观察父容器
    expect(src).toMatch(/observer\.observe\(parent\)/);
    // 不再测量自身宽度（首帧空内容 → 0px → 永久塌缩 'h…t'）
    expect(src).not.toContain("node.clientWidth");
    // 不再固定 1 头 1 尾
    expect(src).not.toMatch(/slice\(0,\s*1\)/);
    expect(src).not.toMatch(/slice\(-1\)/);
    expect(src).not.toContain("TEXT_PAD");
    // 单个省略号字形 …（非三个句点）
    expect(src).toContain('"…"');
    expect(src).not.toContain('"..."');
  });
});
