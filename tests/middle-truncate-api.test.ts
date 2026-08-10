import * as React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MiddleTruncate, splitStringByWidth } from "../src/components/ui/middle-truncate";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

// 官方 demo 的两个代表性字符串（docs/geist-markdown-refs/components/middle-truncate.md Examples）
const BRANCH = "feature/redesign-dashboard-navigation-with-sidebar-improvements";
const PREVIEW_URL = "platform-web-git-feature-redesign-dashboard-navigation-phamous.vercel.app";

// node 环境无 canvas：getCharWidths 退化为确定性估算（单字符 7px，省略号 14px）
const FONT = "14px sans-serif";

describe("MiddleTruncate width-adaptive truncation (G07-MT-01)", () => {
  it("keeps the longest fitting head/tail pair instead of fixed 1 head + 1 tail", () => {
    // 窄容器：只能放 1 头 1 尾（BRANCH 首字符 'f'、末字符 's'）
    const [h1, t1] = splitStringByWidth(BRANCH, FONT, 40);
    expect(h1).toBe("f");
    expect(t1).toBe("s");

    // 120px 级容器（fallback 度量下 126px 正好是 8 头 + … + 8 尾的宽度）
    // → 官方在 width=120 的实测渲染 'feature/…ovements'
    const [h2, t2] = splitStringByWidth(BRANCH, FONT, 130);
    expect(h2).toBe("feature/");
    expect(t2).toBe("ovements");
    expect(`${h2}…${t2}`).toBe("feature/…ovements");

    // 同宽度下官方另一条实测渲染 'platform-…ercel.app'
    const [h3, t3] = splitStringByWidth(PREVIEW_URL, FONT, 145);
    expect(h3).toBe("platform-");
    expect(t3).toBe("ercel.app");
    expect(`${h3}…${t3}`).toBe("platform-…ercel.app");

    // 更宽容器 → head/tail 单调变长（布局自适应，而非固定 1/1）
    const [h4, t4] = splitStringByWidth(BRANCH, FONT, 400);
    expect(h4.length).toBeGreaterThan(h2.length);
    expect(t4.length).toBeGreaterThan(t2.length);
    expect(h4.length).toBe(t4.length);
  });

  it("renders the full value as-is when it fits, with a single … glyph when truncated", () => {
    const [head, tail] = splitStringByWidth("sidebar.tsx", FONT, 1000);
    expect(head).toBe("sidebar.tsx");
    expect(tail).toBe("");

    // head/tail 等长且总宽不超过 maxWidth
    const [h, t] = splitStringByWidth(BRANCH, FONT, 200);
    expect(h.length).toBe(t.length);
    const perChar = 7;
    expect(h.length * perChar + 14 + t.length * perChar).toBeLessThanOrEqual(200);
  });

  it("handles degenerate inputs without collapsing to a single character", () => {
    // 单字符
    expect(splitStringByWidth("a", FONT, 10)).toEqual(["a", ""]);
    // 空字符串
    expect(splitStringByWidth("", FONT, 100)).toEqual(["", ""]);
    // maxWidth <= 0（尚未布局/隐藏容器）：保持完整文本，绝不塌缩为 'h…t'
    expect(splitStringByWidth(BRANCH, FONT, 0)).toEqual([BRANCH, ""]);
    expect(splitStringByWidth(BRANCH, FONT, -5)).toEqual([BRANCH, ""]);
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
