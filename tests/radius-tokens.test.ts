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

describe("Unitary shape token families", () => {
  test("extends the stable radius scale through 28px without renaming existing tokens", () => {
    expect(css).toContain("--radius-sm: calc(var(--radius) - 2px)");
    expect(css).toContain("--radius-md: var(--radius)");
    expect(css).toContain("--radius-lg: 0.5rem");
    expect(css).toContain("--radius-xl: 0.75rem");
    expect(css).toContain("--radius-2xl: 1rem");
    expect(css).toContain("--radius-3xl: 1.25rem");
    expect(css).toContain("--radius-4xl: 1.5rem");
    expect(css).toContain("--radius-5xl: 1.75rem");
  });

  test("defines concentric, circle, and capsule semantics without brand names", () => {
    const block = css.match(
      /\/\* Shape families — Unitary team values[\s\S]*?\/\* End shape families \*\//,
    )?.[0];
    expect(block).toBeDefined();
    expect(block).toContain("--radius-concentric-inset: 2px");
    expect(block).toContain("--radius-circle: 50%");
    expect(block).toContain("--radius-circular: 50%");
    expect(block).toContain("--radius-capsule: 9999px");
    expect(block).toContain("--radius-continuous: var(--radius-md)");
    expect(block).not.toMatch(/apple|ios|squircle/i);
  });

  test("declares a finite, interpolatable capsule radius for animated surfaces", () => {
    const block = css.match(
      /\/\* Shape families — Unitary team values[\s\S]*?\/\* End shape families \*\//,
    )?.[0];
    expect(block).toBeDefined();
    // Must stay finite: animating to/from an effectively-infinite radius makes
    // the browser clamp every intermediate value to min(w,h)/2 and then snap.
    expect(block).toContain("--radius-capsule-interpolable: 1.5rem");
    expect(block).not.toMatch(/--radius-capsule-interpolable:\s*(?:9999px|calc\(infinity)/);
  });

  test("never animates border-radius between an infinite capsule token and a finite one", () => {
    // A transition property list that includes border-radius must not be paired
    // with an effectively-infinite radius in the same animating surface.
    const stripComments = (src: string) =>
      src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
    for (const file of ["feedback.tsx", "rating-pill.tsx"]) {
      const raw = readFileSync(new URL(`../src/components/ui/${file}`, import.meta.url), "utf8");
      const src = stripComments(raw);
      const animatesRadius = /transition-\[[^\]]*border-radius[^\]]*\]/.test(src);
      if (!animatesRadius) continue;
      expect(src, `${file} must use the finite capsule token when animating radius`).toContain(
        "rounded-capsule-interpolable",
      );
      expect(src, `${file} must not animate from rounded-full / rounded-capsule`).not.toMatch(
        /rounded-(?:full|capsule)(?![-\w])/,
      );
    }
  });
});
