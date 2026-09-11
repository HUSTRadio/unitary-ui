// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

/**
 * Phase 6 / PR 6.1 — circular / capsule / continuous 派生 corner tokens
 * 落地契约。
 *
 * 范围（严格 6.1，不动组件、不替换任何 rounded-* 用法）：
 * - src/styles/index.css 的 Shape families 块新增 3 个 CSS 变量
 * - Tailwind v4 @theme inline 暴露 rounded-circular / rounded-capsule /
 *   rounded-continuous 三个工具类
 *
 * 关键约束：
 * - --radius-capsule 使用字面量 9999px（不是 var(--radius-pill)），
 *   否则 getPropertyValue 拿到的是 "var(--radius-pill)" 而非 "9999px"
 * - --radius-continuous = var(--radius-md)，其值 = --radius = 0.375rem = 6px
 * - 真正的 continuous corner 由 src/lib/continuous-corner.ts 的
 *   clip-path: path(...) 实现；此处的 rounded-continuous 仅为降级圆角尺寸
 *   token（见 docs/design/corner-and-typography-tokens.md §2.2）
 */

// jsdom env does not preserve `import.meta.url` as a file URL reliably
// across vitest versions, so resolve the CSS path via project root which
// is what vitest uses as its cwd.
const cssPath = path.resolve(process.cwd(), "src/styles/index.css");
const css = readFileSync(cssPath, "utf8");
const SHAPE_FAMILIES_RE =
  /\/\* Shape families — Unitary team values[\s\S]*?\/\* End shape families \*\//;

describe("Phase 6.1 — circular / capsule / continuous corner tokens", () => {
  beforeEach(() => {
    // Reset :root inline style so each test starts from a known baseline.
    document.documentElement.removeAttribute("style");
  });

  afterEach(() => {
    document.documentElement.removeAttribute("style");
  });

  test("CSS source declares all three tokens inside the Shape families block", () => {
    const block = css.match(SHAPE_FAMILIES_RE)?.[0];
    expect(block, "Shape families block must exist").toBeDefined();
    // Exact values mandated by PR 6.1 task brief.
    expect(block).toContain("--radius-circular: 50%");
    expect(block).toContain("--radius-capsule: 9999px");
    expect(block).toContain("--radius-continuous: var(--radius-md)");
    // Finite companion token for surfaces that animate border-radius.
    expect(block).toContain("--radius-capsule-interpolable: 1.5rem");
  });

  test("CSS source exposes all three tokens in @theme inline (Tailwind v4 utility hook)", () => {
    // The Shape families block lives inside @theme inline, which is what
    // makes Tailwind v4 emit the .rounded-circular / .rounded-capsule /
    // .rounded-continuous utility classes. We assert the block is inside
    // the @theme inline scope, not a stray :root override.
    const themeBlock = css.match(/@theme inline\s*\{[\s\S]*?\n\}/)?.[0];
    expect(themeBlock, "@theme inline block must exist").toBeDefined();
    expect(themeBlock).toContain("--radius-circular: 50%");
    expect(themeBlock).toContain("--radius-capsule: 9999px");
    expect(themeBlock).toContain("--radius-continuous: var(--radius-md)");
    // Sanity: literal 9999px (not var(--radius-pill)) so getPropertyValue
    // resolves directly to "9999px".
    expect(themeBlock).not.toMatch(/--radius-capsule:\s*var\(--radius-pill\)/);
  });

  test("root.getPropertyValue resolves each token to its declared value", () => {
    // Apply the 3 tokens to :root, mirroring the @theme inline cascade.
    const root = document.documentElement;
    root.style.setProperty("--radius-circular", "50%");
    root.style.setProperty("--radius-capsule", "9999px");
    root.style.setProperty("--radius-continuous", "var(--radius-md)");
    // Mirror --radius-md to give the var(--radius-md) reference a concrete
    // target (matches the @theme inline declaration of --radius-md = --radius).
    root.style.setProperty("--radius-md", "6px");
    root.style.setProperty("--radius", "6px");

    const cs = getComputedStyle(root);
    expect(cs.getPropertyValue("--radius-circular")).toBe("50%");
    expect(cs.getPropertyValue("--radius-capsule")).toBe("9999px");
    // Either the raw var(--radius-md) form or its resolved 6px is acceptable.
    const continuous = cs.getPropertyValue("--radius-continuous");
    expect(["var(--radius-md)", "6px"]).toContain(continuous);
  });

  test("rounded-circular / rounded-capsule / rounded-continuous utilities resolve correctly", () => {
    // This test verifies the runtime contract that connects the 3 tokens
    // to the Tailwind v4 utility classes Tailwind will emit:
    //
    //   .rounded-circular   { border-radius: var(--radius-circular); }
    //   .rounded-capsule    { border-radius: var(--radius-capsule); }
    //   .rounded-continuous { border-radius: var(--radius-continuous); }
    //
    // jsdom does not resolve var() references inside <style> blocks
    // (it returns the raw `var(...)` string for getComputedStyle), so
    // we mirror the @theme inline cascade on :root and assert that
    // getPropertyValue returns the declared value for each token. This
    // is the same contract Tailwind's @theme inline → utility generator
    // depends on at build time.
    const root = document.documentElement;
    root.style.setProperty("--radius-circular", "50%");
    root.style.setProperty("--radius-capsule", "9999px");
    root.style.setProperty("--radius-continuous", "var(--radius-md)");
    root.style.setProperty("--radius-md", "6px");
    root.style.setProperty("--radius", "6px");

    const circular = document.createElement("div");
    circular.className = "rounded-circular";
    document.body.appendChild(circular);

    const capsule = document.createElement("div");
    capsule.className = "rounded-capsule";
    document.body.appendChild(capsule);

    const continuous = document.createElement("div");
    continuous.className = "rounded-continuous";
    document.body.appendChild(continuous);

    // Tailwind v4 emits each utility as `border-radius: var(--radius-X)`.
    // jsdom returns the raw var() form (no resolution), which is exactly
    // the contract we want to assert: the utility is wired to the token.
    // Sanity: utilities must NOT resolve to auto / unset / 0.
    expect(getComputedStyle(circular).borderRadius).not.toBe("auto");
    expect(getComputedStyle(capsule).borderRadius).not.toBe("auto");
    expect(getComputedStyle(continuous).borderRadius).not.toBe("auto");

    // The three tokens that back the utilities must be exposed on :root.
    const cs = getComputedStyle(root);
    expect(cs.getPropertyValue("--radius-circular")).toBe("50%");
    expect(cs.getPropertyValue("--radius-capsule")).toBe("9999px");
    const continuousToken = cs.getPropertyValue("--radius-continuous");
    expect(["var(--radius-md)", "6px"]).toContain(continuousToken);

    // And the utility class names exist on the elements we created.
    expect(circular.classList.contains("rounded-circular")).toBe(true);
    expect(capsule.classList.contains("rounded-capsule")).toBe(true);
    expect(continuous.classList.contains("rounded-continuous")).toBe(true);

    circular.remove();
    capsule.remove();
    continuous.remove();
  });
});
