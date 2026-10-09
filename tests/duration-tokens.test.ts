import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readThemeCss(): Promise<string> {
  return readFile(path.join(root, "src/styles/index.css"), "utf8");
}

describe("animation duration tokens", () => {
  test("@theme registers the four uni-duration tier tokens with HIG-anchored values", async () => {
    const css = await readThemeCss();
    for (const [token, value] of [
      ["--uni-duration-fast", "150ms"],
      ["--uni-duration-base", "250ms"],
      ["--uni-duration-slow", "350ms"],
      ["--uni-duration-slower", "500ms"],
    ] as const) {
      expect(css).toContain(`${token}: ${value}`);
    }
    expect(css).not.toContain("--ds-duration-");
  });

  test("tier values are strictly increasing and bounded (feedback stays brief, surfaces stay under 600ms)", async () => {
    const css = await readThemeCss();
    const tiers = ["fast", "base", "slow", "slower"].map((tier) => {
      const match = css.match(new RegExp(`--uni-duration-${tier}:\\s*(\\d+)ms`));
      expect(match, `--uni-duration-${tier} is not defined`).not.toBeNull();
      return Number(match![1]);
    });
    for (let i = 1; i < tiers.length; i += 1) {
      // HIG Motion「Aim for brevity and precision」→ 高频档必须短于低频档
      expect(tiers[i], "tiers must be strictly increasing").toBeGreaterThan(tiers[i - 1]);
    }
    expect(tiers[0]).toBeLessThanOrEqual(200);
    expect(tiers[tiers.length - 1]).toBeLessThanOrEqual(600);
  });

  test("semantic aliases resolve to tiers instead of raw values", async () => {
    const css = await readThemeCss();
    for (const [alias, tier] of [
      ["--uni-motion-feedback", "--uni-duration-fast"],
      ["--uni-motion-state", "--uni-duration-base"],
      ["--uni-motion-overlay", "--uni-duration-slow"],
      ["--uni-motion-expansive", "--uni-duration-slower"],
    ] as const) {
      expect(css).toContain(`${alias}: var(${tier});`);
    }
  });

  test("loop period token converges blink and shimmer cadence", async () => {
    const css = await readThemeCss();
    expect(css).toContain("--uni-loop-standard: 1400ms;");
    expect(css).toContain("--animate-blink: blink var(--uni-loop-standard) var(--ease-in-out) infinite backwards;");
    expect(css).toContain(
      "--animate-skeleton-shimmer: skeleton-shimmer var(--uni-loop-standard) var(--ease-in-out) infinite;",
    );
  });

  test("Tailwind implicit transition duration is bound to the fast tier", async () => {
    const css = await readThemeCss();
    expect(css).toContain("--default-transition-duration: var(--uni-duration-fast);");
  });
});

describe("overlay motion durations reference tokens (HIG-AUD-012)", () => {
  const readSource = (relative: string) => readFile(path.join(root, relative), "utf8");

  test.each([
    "menu.tsx",
    "menu-bar.tsx",
    "context-menu.tsx",
    "multi-select.tsx",
    "feedback.tsx",
    "edit-menu.tsx",
    "select.tsx",
    "relative-time-card.tsx",
    "context-card.tsx",
    "modal.tsx",
    "destructive-action-modal.tsx",
    "drawer.tsx",
    "sheet.tsx",
    "bottom-sheet.tsx",
    "responsive-drawer.tsx",
  ])("%s overlay animation consumes duration tokens", async (file) => {
    const src = await readSource(`src/components/ui/${file}`);
    expect(src).toMatch(/duration-\(--uni-(?:duration|motion)-/);
  });

  test.each([
    ["bottom-sheet.tsx", "height var(--uni-motion-overlay)"],
    ["responsive-drawer.tsx", "height var(--uni-motion-overlay)"],
    ["drawer.tsx", "transform var(--uni-motion-expansive)"],
  ])("%s inline transition consumes motion tokens", async (file, needle) => {
    const src = await readSource(`src/components/ui/${file}`);
    expect(src).toContain(needle);
  });

  test("command-menu overlay utilities consume tier tokens (no raw 0.3s/0.4s left)", async () => {
    const css = await readThemeCss();
    const start = css.indexOf("@utility command-menu-overlay");
    const end = css.indexOf("@media (prefers-reduced-motion: reduce)", start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const block = css.slice(start, end);
    expect(block).toContain("var(--uni-motion-overlay)");
    expect(block).toContain("var(--uni-motion-expansive)");
    expect(block).not.toMatch(/0\.3s|0\.4s/);
  });
});
