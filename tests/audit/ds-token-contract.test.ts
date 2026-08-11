import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const readCss = () => readFile(path.join(root, "src/styles/index.css"), "utf8");

/**
 * Task 10 / Batch 0 `ds-token-map` contract.
 *
 * Values are frozen in docs/audits/geist-component-and-responsive-remediation-design.md §1.1
 * from persisted official runtime evidence. Only variables with exact values in both themes
 * are admitted here; Choicebox B1 adds gray-400/blue-200 from its persisted Light/Dark
 * runtime evidence. Pending or conflicting names must remain undefined instead of guessed.
 */
describe("official --ds-* compatibility token map", () => {
  test("Choicebox focus utility uses the verified indigo outline without inventing ds-focus-ring", async () => {
    const css = await readCss();
    expect(css).toContain("@utility choicebox-focus");
    expect(css).toMatch(/&:has\(:focus-visible\)\s*\{[\s\S]*outline:\s*2px solid #5b5bd6;/);
    expect(css).toMatch(/outline-offset:\s*2px;/);
  });

  test("defines theme-invariant size, focus and popover metrics", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");

    expectDeclarations(light, {
      "--ds-size-medium": "36px",
      "--ds-control-decoration-size": "14px",
      "--ds-focus-color": "#0072f5",
      "--ds-popover-padding": "6px",
      "--ds-popover-row-height": "36px",
    });
  });

  test("maps every exact light-theme color without changing the existing local scale", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");

    expectDeclarations(light, {
      "--ds-gray-100": "var(--gray-100)",
      "--ds-gray-400": "hsl(0 0% 92%)",
      "--ds-gray-500": "var(--gray-500)",
      "--ds-gray-700": "var(--gray-700)",
      "--ds-gray-900": "var(--gray-900)",
      "--ds-gray-1000": "var(--gray-1000)",
      "--ds-gray-alpha-400": "var(--gray-alpha-400)",
      "--ds-gray-alpha-600": "var(--gray-alpha-600)",
      "--ds-background-100": "var(--background-100)",
      "--ds-blue-600": "#52aeff",
      "--ds-blue-900": "#0068d6",
      "--ds-blue-100": "#f0f7ff",
      "--ds-blue-200": "hsl(210 100% 96%)",
    });
  });

  test("overrides exact dark-theme colors with persisted official values", async () => {
    const css = await readCss();
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');

    expectDeclarations(dark, {
      "--ds-gray-100": "var(--gray-100)",
      "--ds-gray-400": "hsl(0 0% 18%)",
      "--ds-gray-500": "var(--gray-500)",
      "--ds-gray-700": "var(--gray-700)",
      "--ds-gray-900": "var(--gray-900)",
      "--ds-gray-1000": "var(--gray-1000)",
      "--ds-gray-alpha-400": "var(--gray-alpha-400)",
      "--ds-gray-alpha-600": "var(--gray-alpha-600)",
      "--ds-background-100": "var(--background-100)",
      "--ds-blue-600": "#0091ff",
      "--ds-blue-900": "#52a8ff",
      "--ds-blue-100": "#0f1c2e",
      "--ds-blue-200": "hsl(214 59% 15%)",
    });
  });

  test("does not invent pending, single-theme or conflicting token values", async () => {
    const css = await readCss();
    for (const token of [
      "--ds-gray-alpha-500",
      "--ds-blue-700",
      "--ds-focus-ring",
      "--ds-shadow-modal",
      "--ds-shadow-border-medium",
      "--ds-gray-200",
      "--ds-gray-600",
    ]) {
      expect(css).not.toMatch(new RegExp(`${escapeRegExp(token)}\\s*:`));
    }
  });
});

function themeBlock(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `missing ${selector} theme block`).toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{", start) + 1;
  const end = css.indexOf("\n}", bodyStart);
  expect(end, `unterminated ${selector} theme block`).toBeGreaterThan(bodyStart);
  return css.slice(bodyStart, end);
}

function expectDeclarations(block: string, expected: Record<string, string>) {
  for (const [name, value] of Object.entries(expected)) {
    expect(block, `${name} must resolve to ${value}`).toMatch(
      new RegExp(`${escapeRegExp(name)}\\s*:\\s*${escapeRegExp(value)}\\s*;`, "i"),
    );
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
