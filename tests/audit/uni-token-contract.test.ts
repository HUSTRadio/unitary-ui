import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const normalizeNewlines = (value: string) => value.replace(/\r\n/g, "\n");
const readCss = async () => normalizeNewlines(await readFile(path.join(root, "src/styles/index.css"), "utf8"));

/**
 * Project-owned token namespace contract.
 *
 * Values are frozen in docs/audits/geist-component-and-responsive-remediation-design.md §1.1
 * from persisted runtime evidence. Only variables with exact values in both themes are
 * admitted here; pending or conflicting names stay undefined rather than being guessed.
 * `--uni-*` is the canonical project namespace; external reference implementations do not
 * leak their namespace into this library's public tokens.
 */
describe("canonical --uni-* token map", () => {
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
      "--uni-size-medium": "36px",
      "--uni-control-decoration-size": "14px",
      "--uni-focus-color": "#0072f5",
      "--uni-popover-padding": "6px",
      "--uni-popover-row-height": "36px",
    });
  });

  test("maps every exact light-theme color without changing the existing local scale", async () => {
    const css = await readCss();
    const light = themeBlock(css, ":root");

    expectDeclarations(light, {
      "--uni-gray-100": "var(--gray-100)",
      "--uni-gray-400": "hsl(0 0% 92%)",
      "--uni-gray-500": "var(--gray-500)",
      "--uni-gray-700": "var(--gray-700)",
      "--uni-gray-900": "var(--gray-900)",
      "--uni-gray-1000": "var(--gray-1000)",
      "--uni-gray-alpha-400": "var(--gray-alpha-400)",
      "--uni-gray-alpha-500": "var(--gray-alpha-500)",
      "--uni-gray-alpha-300": "var(--gray-alpha-300)",
      "--uni-gray-alpha-600": "var(--gray-alpha-600)",
      "--uni-gray-600": "var(--gray-600)",
      "--uni-shadow-menu": "var(--material-shadow-menu)",
      "--uni-background-100": "var(--background-100)",
      "--uni-blue-600": "#52aeff",
      "--uni-blue-900": "#0068d6",
      "--uni-blue-100": "#f0f7ff",
      "--uni-blue-200": "hsl(210 100% 96%)",
      "--uni-blue-700": "var(--blue-700)",
      "--uni-amber-800": "var(--amber-800)",
    });
  });

  test("overrides exact dark-theme colors with persisted official values", async () => {
    const css = await readCss();
    const dark = themeBlock(css, '.dark,\n[data-theme="dark"]');

    expectDeclarations(dark, {
      "--uni-gray-100": "var(--gray-100)",
      "--uni-gray-400": "hsl(0 0% 18%)",
      "--uni-gray-500": "var(--gray-500)",
      "--uni-gray-700": "var(--gray-700)",
      "--uni-gray-900": "var(--gray-900)",
      "--uni-gray-1000": "var(--gray-1000)",
      "--uni-gray-alpha-400": "var(--gray-alpha-400)",
      "--uni-gray-alpha-500": "var(--gray-alpha-500)",
      "--uni-gray-alpha-300": "var(--gray-alpha-300)",
      "--uni-gray-alpha-600": "var(--gray-alpha-600)",
      "--uni-gray-600": "var(--gray-600)",
      "--uni-shadow-menu": "var(--material-shadow-menu)",
      "--uni-background-100": "var(--background-100)",
      "--uni-blue-600": "#0091ff",
      "--uni-blue-900": "#52a8ff",
      "--uni-blue-100": "#0f1c2e",
      "--uni-blue-200": "hsl(214 59% 15%)",
      "--uni-blue-700": "var(--blue-700)",
      "--uni-amber-800": "var(--amber-800)",
    });
  });

  test("does not invent pending, single-theme or conflicting token values", async () => {
    const css = await readCss();
    for (const token of [
      "--uni-focus-ring",
      "--uni-shadow-modal",
      "--uni-shadow-border-medium",
      "--uni-gray-200",
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
