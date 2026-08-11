import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Geist foundation and docs shell contract", () => {
  test("shared foundation exposes the required fonts, tokens, typography, materials and focus utilities", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toContain('font-family: "HarmonyOS Sans SC"');
    expect(css).toContain('font-family: "JetBrains Maple Mono"');
    for (const token of [
      "--background-100",
      "--background-200",
      "--gray-alpha-400",
      "--blue-700",
      "--red-700",
      "--amber-700",
      "--green-700",
    ]) {
      expect(css).toContain(token);
    }
    for (const utility of [
      "text-heading-72",
      "text-heading-14",
      "text-button-16",
      "text-button-14",
      "text-button-12",
      "text-label-20",
      "text-label-12-mono",
      "text-copy-24",
      "text-copy-13-mono",
      "material-base",
      "material-tooltip",
      "material-menu",
      "material-modal",
      "material-fullscreen",
      "focus-ring",
      "input-focus-ring",
    ]) {
      expect(css).toContain(`@utility ${utility}`);
    }
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  test("Clearable Input disabled placeholder token matches live Geist in both themes", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toMatch(/:root[\s\S]*?--input-disabled-placeholder:\s*#999999;/);
    expect(css).toMatch(/\.dark[\s\S]*?--input-disabled-placeholder:\s*#444444;/);
  });

  test("focus ring uses the live Geist theme-specific blue in light and dark", async () => {
    const css = await read("src/styles/index.css");
    expect(css).toMatch(/:root[\s\S]*?--focus-ring-color:\s*#0072f5;/);
    expect(css).toMatch(/\.dark[\s\S]*?--focus-ring-color:\s*#52a8ff;/);
    expect(css).toContain(
      "--focus-ring-outline: 0 0 0 2px var(--color-bg-surface), 0 0 0 4px var(--focus-ring-color);",
    );
  });

  test("docs shell provides skip navigation and a focusable main target", async () => {
    const app = await read("docs/geist/src/App.tsx");
    expect(app).toContain('href="#main-content"');
    expect(app).toContain("event.preventDefault()");
    expect(app).toContain('document.getElementById("main-content")?.focus()');
    expect(app).toMatch(/<main\s+id="main-content"\s+tabIndex=\{-1\}/);
  });

  test("hash routes update a context-specific document title", async () => {
    const app = await read("docs/geist/src/App.tsx");
    expect(app).toContain("document.title");
    expect(app).toContain("Geist Style Framework");
    expect(app).toMatch(/pathname\.startsWith\("\/components\/"\)/);
  });

  test("explicit theme owns one exact Background 1 browser chrome color", async () => {
    const html = await read("docs/geist/index.html");
    const themeColorTags = html.match(/<meta\s+name="theme-color"[^>]*>/g) ?? [];
    expect(themeColorTags).toHaveLength(1);
    expect(themeColorTags[0]).not.toContain("media=");
    expect(themeColorTags[0]).toContain('content="#ffffff"');

    const theme = await read("src/lib/theme.tsx");
    expect(theme).toContain('theme === "dark" ? "#0a0a0a" : "#ffffff"');
  });

  test("docs shell consumes named Geist typography utilities", async () => {
    const shell = await read("docs/geist/src/components/docs-shell.tsx");
    expect(shell).not.toMatch(/text-\[\d+px\]|leading-\[?\d/);
    const labelCount = shell.match(/text-label-14/g)?.length ?? 0;
    const copyCount = shell.match(/text-copy-14/g)?.length ?? 0;
    expect(labelCount + copyCount).toBeGreaterThanOrEqual(3);
  });
});
