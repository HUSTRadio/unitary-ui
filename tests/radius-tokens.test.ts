import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/**
 * Apple HIG 浮层圆角契约（2026-08-23 起）：
 * - 浮层容器（menu / context-menu / dots-menu / combobox 列表）6px
 * - 容器内嵌套高亮项 4px（同心）
 * - 一律走 --radius-overlay / --radius-overlay-item token，禁止魔法 px 回流。
 */

const css = readFileSync(new URL("../src/styles/index.css", import.meta.url), "utf8");

const overlayFiles = ["menu.tsx", "context-menu.tsx", "dots-menu.tsx", "combobox.tsx"].map((f) => ({
  file: f,
  src: readFileSync(new URL(`../src/components/ui/${f}`, import.meta.url), "utf8"),
}));

describe("overlay radius tokens (Apple HIG)", () => {
  test("tokens exist with concentric values", () => {
    expect(css).toMatch(/--radius-overlay:\s*var\(--radius\)/);
    expect(css).toMatch(/--radius-overlay-item:\s*calc\(var\(--radius\) - 2px\)/);
  });

  test("floating layers use tokens, not magic px", () => {
    for (const { file, src } of overlayFiles) {
      expect(src, file).not.toMatch(/rounded-\[(6|12|4)px\]/);
      expect(src, file).not.toContain("rounded-xl");
      expect(src, file).toContain("rounded-overlay");
    }
  });

  test("nested highlight rows use the inner (4px) token", () => {
    for (const f of ["menu.tsx", "context-menu.tsx", "dots-menu.tsx"]) {
      const src = readFileSync(new URL(`../src/components/ui/${f}`, import.meta.url), "utf8");
      expect(src, f).toContain("rounded-overlay-item");
    }
  });
});
