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

  test("nav label roles (heading / subheading / item) alias one shared size and pair leading", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const theme = themeStaticRule(css);

    for (const role of ["heading", "subheading", "item"] as const) {
      // 侧栏三级标签统一字号：角色 token 只是内容尺度的别名，不引入新数值
      expect(theme).toContain(`--uni-text-nav-${role}: var(--uni-text-subhead)`);
      expect(theme).toContain(`--uni-leading-nav-${role}: var(--uni-leading-subhead)`);

      const rule = utilityRule(css, `text-style-nav-${role}`);
      expect(rule).toContain(`font-size: var(--uni-text-nav-${role})`);
      expect(rule).toContain(`line-height: var(--uni-leading-nav-${role})`);
    }

    // 层级节奏与条目行高同样走 token（HIG：指针 36px / 触控 44px）
    expect(theme).toContain("--uni-nav-space-parent: 0.375rem");
    expect(theme).toContain("--uni-nav-space-sibling: 0.25rem");
    expect(theme).toContain("--uni-nav-item-height: 2.25rem");
    expect(theme).toContain("--uni-nav-item-height-touch: 2.75rem");
    expect(utilityRule(css, "nav-space-parent")).toContain(
      "margin-bottom: var(--uni-nav-space-parent)",
    );
    expect(utilityRule(css, "nav-space-sibling")).toContain(
      "margin-block: var(--uni-nav-space-sibling)",
    );
    expect(utilityRule(css, "nav-item-row")).toContain("height: var(--uni-nav-item-height)");
    expect(utilityRule(css, "nav-item-row-touch")).toContain(
      "height: var(--uni-nav-item-height-touch)",
    );
  });

  test("ink baseline shift is one OPPO Sans token, zeroed for other font tiers", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const theme = themeStaticRule(css);

    // OPPO Sans 4.0 的墨迹补偿量：两档 token、em 单位（随字号等比缩放）
    expect(theme).toContain("--uni-ink-shift: -0.107em");
    expect(theme).toContain("--uni-ink-shift-cjk: -0.033em");
    // 非 oppo 档位显式归零（避免过补偿）
    const hmosBlock = css.match(/\[data-font-tier="hmos"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    const systemBlock = css.match(/\[data-font-tier="system"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    for (const block of [hmosBlock, systemBlock]) {
      expect(block).toContain("--uni-ink-shift: 0em");
      expect(block).toContain("--uni-ink-shift-cjk: 0em");
    }
    // 只位移文字、不改行盒：相对定位 + 逻辑块向起点
    for (const [utility, token] of [
      ["ink-shift", "--uni-ink-shift"],
      ["ink-shift-cjk", "--uni-ink-shift-cjk"],
    ] as const) {
      const rule = utilityRule(css, utility);
      expect(rule).toContain("position: relative");
      expect(rule).toContain(`inset-block-start: var(${token})`);
    }
  });

  test("ink compensation consumers use the token instead of hard-coded shifts", async () => {
    // Pill / Badge：固定高容器用 calc 内边距法（上下和不变 → 高度不变）
    for (const file of ["src/components/ui/pill.tsx", "src/components/ui/badge.tsx"]) {
      const src = await readFile(path.join(root, file), "utf8");
      expect(src, file).toContain("var(--uni-ink-shift)");
      expect(src, file).not.toMatch(/pt-\[2\.5px\]|pb-\[5\.5px\]/);
    }

    // rating-pill / feedback：中文字形档位移主体是「文字」而非图标
    for (const file of ["src/components/ui/rating-pill.tsx", "src/components/ui/feedback.tsx"]) {
      const src = await readFile(path.join(root, file), "utf8");
      expect(src, file).toContain("ink-shift-cjk");
      expect(src, file).not.toContain("translate-y-[0.5px]");
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

  test("defines mixed-script spacing and long-form leading as Unitary tokens", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const theme = themeStaticRule(css);

    expect(theme).toContain("--uni-mixed-script-gap-ui: 0.125em");
    expect(theme).toContain("--uni-mixed-script-gap-prose: 0.25em");
    expect(theme).toContain("--uni-leading-compact: 1.35");
    expect(theme).toContain("--uni-leading-prose: 1.55");
    expect(theme).toContain("--uni-leading-reading: 1.7");
    expect(css).toContain("W3C CLReq");
  });

  test("progressively enables native mixed-script autospace without changing body tracking", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    expect(css).toMatch(
      /@supports \(text-autospace: normal\)\s*\{[\s\S]*?\.text-autospace\s*\{[\s\S]*?text-autospace:\s*normal/,
    );
    expect(utilityRule(css, "text-style-body")).not.toContain("letter-spacing");
    expect(utilityRule(css, "text-heading-40")).toContain("letter-spacing: -0.02em");
  });

  test("uses prose leading and native autospace only for long docs copy", async () => {
    const css = await readFile(path.join(root, "src/styles/index.css"), "utf8");
    const paragraphRules = [...css.matchAll(/\.docs-prose-paragraph\s*\{([\s\S]*?)\}/g)].map(
      (match) => match[1],
    );
    const listRules = [...css.matchAll(/\.docs-prose-list\s*\{([\s\S]*?)\}/g)].map(
      (match) => match[1],
    );

    expect(paragraphRules.some((rule) => rule?.includes("line-height: var(--uni-leading-prose)"))).toBe(true);
    expect(listRules.some((rule) => rule?.includes("line-height: var(--uni-leading-prose)"))).toBe(true);
    expect(css).toMatch(
      /@supports \(text-autospace: normal\)[\s\S]*?\[data-slot="docs-prose-paragraph"\],[\s\S]*?\[data-slot="docs-prose-list"\]\s*\{\s*text-autospace: normal;/,
    );
  });
});
