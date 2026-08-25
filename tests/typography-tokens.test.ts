import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const textStyles = [
  ["large-title", "2.125rem", "2.5625rem"],
  ["title1", "1.75rem", "2.125rem"],
  ["title2", "1.375rem", "1.75rem"],
  ["title3", "1.25rem", "1.5625rem"],
  ["headline", "1.0625rem", "1.375rem"],
  ["body", "1.0625rem", "1.375rem"],
  ["callout", "1rem", "1.3125rem"],
  ["subhead", "0.9375rem", "1.25rem"],
  ["footnote", "0.8125rem", "1.125rem"],
  ["caption1", "0.75rem", "1rem"],
  ["caption2", "0.6875rem", "0.8125rem"],
] as const;

const rhythm = [
  ["--uni-doc-space-title-lead", "0.75rem"],
  ["--uni-doc-space-section", "2.5rem"],
  ["--uni-doc-space-heading-body", "1rem"],
  ["--uni-doc-space-paragraph", "1rem"],
  ["--uni-doc-space-list-item", "0.75rem"],
  ["--uni-doc-list-indent", "1.25rem"],
] as const;

function themeStaticRule(css: string): string {
  const match = css.match(/@theme static \{([\s\S]*?)\n\}/);
  expect(match, "missing @theme static").not.toBeNull();
  return match![1];
}

function utilityRule(css: string, name: string): string {
  const match = css.match(new RegExp(`@utility ${name} \\{([\\s\\S]*?)\\n\\}`));
  expect(match, `missing @utility ${name}`).not.toBeNull();
  return match![1];
}

describe("typography tokens", () => {
  test("defines source-neutral --uni text and leading tokens", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");

    for (const [name, size, leading] of textStyles) {
      expect(css).toContain(`--uni-text-${name}: ${size}`);
      expect(css).toContain(`--uni-leading-${name}: ${leading}`);
    }

    expect(css).not.toContain("--ds-text-");
  });

  test("defines docs rhythm tokens in the static theme owner without source brands", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const theme = themeStaticRule(css);

    for (const [name, value] of rhythm) {
      expect(theme).toContain(`${name}: ${value}`);
    }

    for (const forbiddenPrefix of ["--hig-", "--apple-", "--geist-", "--vercel-"]) {
      expect(css).not.toContain(forbiddenPrefix);
    }
  });

  test("text-style utilities pair each semantic size with its leading", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");

    for (const [name] of textStyles) {
      const rule = utilityRule(css, `text-style-${name}`);
      expect(rule).toContain(`font-size: var(--uni-text-${name})`);
      expect(rule).toContain(`line-height: var(--uni-leading-${name})`);
    }
  });

  test("legacy numeric utilities stay compatible through the canonical tokens", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");

    for (const [utility, style] of [
      ["text-heading-24", "title2"],
      ["text-copy-14", "subhead"],
      ["text-label-12", "caption1"],
    ] as const) {
      const rule = utilityRule(css, utility);
      expect(rule).toContain(`font-size: var(--uni-text-${style})`);
      expect(rule).toContain(`line-height: var(--uni-leading-${style})`);
    }
  });
});
