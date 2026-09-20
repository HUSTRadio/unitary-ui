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
    expect(css).toContain("--animate-blink: blink var(--uni-loop-standard) ease infinite backwards;");
    expect(css).toContain(
      "--animate-skeleton-shimmer: skeleton-shimmer var(--uni-loop-standard) ease-in-out infinite;",
    );
  });

  test("Tailwind implicit transition duration is bound to the fast tier", async () => {
    const css = await readThemeCss();
    expect(css).toContain("--default-transition-duration: var(--uni-duration-fast);");
  });
});
