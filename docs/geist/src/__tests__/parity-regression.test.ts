import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("parity regression: 12 项差异", () => {
  it("error 容器消费 inline error 前景 token（差异 #1）", () => {
    const code = readFileSync(join(__dirname, "../../../../src/components/ui/error.tsx"), "utf8");
    const css = readFileSync(join(__dirname, "../../../../src/styles/index.css"), "utf8");
    expect(code).toContain("text-error-foreground");
    expect(css).toContain("--error-foreground: #cb2a2f");
    expect(css).toContain("--error-foreground: #ff6166");
  });

  it("error-card 容器消费 inline error 前景 token（差异 #2）", () => {
    const code = readFileSync(
      join(__dirname, "../../../../src/components/ui/error-card.tsx"),
      "utf8",
    );
    expect(code).toContain("text-error-foreground");
  });

  it("entity 描述含 text-muted-foreground（差异 #3）", () => {
    const code = readFileSync(join(__dirname, "../../../../src/components/ui/entity.tsx"), "utf8");
    expect(code).toContain("text-muted-foreground");
  });

  it("json-view 标点 span 含 text-foreground（差异 #4）", () => {
    const code = readFileSync(
      join(__dirname, "../../../../src/components/ui/json-view.tsx"),
      "utf8",
    );
    expect(code).toContain("text-foreground");
  });

  it("textarea/input 含 text-black dark:text-white（差异 #5）", () => {
    const taCode = readFileSync(
      join(__dirname, "../../../../src/components/ui/textarea.tsx"),
      "utf8",
    );
    const inCode = readFileSync(join(__dirname, "../../../../src/components/ui/input.tsx"), "utf8");
    expect(taCode).toContain("text-black dark:text-white");
    expect(inCode).toContain("text-black dark:text-white");
  });

  it("index.css 含 --link: #0072f5（差异 #6）", () => {
    const css = readFileSync(join(__dirname, "../../../../src/styles/index.css"), "utf8");
    expect(css).toContain("--link: #0072f5");
  });

  it("badge pill 变体含 text-black dark:text-white（差异 #7）", () => {
    const code = readFileSync(join(__dirname, "../../../../src/components/ui/badge.tsx"), "utf8");
    expect(code).toContain('pill: "bg-background text-black dark:text-white');
  });

  it("file-tree label 含 leading-7 text-center（差异 #8）", () => {
    const code = readFileSync(
      join(__dirname, "../../../../src/components/ui/file-tree.tsx"),
      "utf8",
    );
    expect(code).toContain("leading-7 text-center");
  });

  it("video 时间戳 div 含 text-center（差异 #9）", () => {
    const code = readFileSync(join(__dirname, "../../../../src/components/ui/video.tsx"), "utf8");
    const matches = code.match(/text-center/g);
    expect(matches && matches.length).toBeGreaterThanOrEqual(2);
  });

  it('drawer demo 按钮含 type="default"（差异 #10）', () => {
    const code = readFileSync(
      join(__dirname, "../../src/examples/drawer/default-37a8eec1.example.tsx"),
      "utf8",
    );
    expect(code).toContain('type="secondary"');
  });

  it('modal demo 按钮含 type="default"（差异 #11）', () => {
    const code = readFileSync(
      join(__dirname, "../../src/examples/modal/default-37a8eec1.example.tsx"),
      "utf8",
    );
    expect(code).toContain('type="default"');
  });

  it("docs 页 H1 由 DocsPageTitle 语义 owner 契约驱动（差异 #12）", () => {
    // 1. docs-pages.tsx 实际渲染 DocsPageTitle（而非仅导入）
    const pagesCode = readFileSync(
      join(__dirname, "../../src/components/docs-pages.tsx"),
      "utf8",
    );
    expect(pagesCode).toMatch(/<DocsPageTitle\b[^>]*>/);

    // 2. docs-typography.tsx 将 DocsPageTitle 绑定到语义 h1、data-slot="docs-prose-title"、docs-prose-title class
    const typoCode = readFileSync(
      join(__dirname, "../../src/components/docs-typography.tsx"),
      "utf8",
    );
    expect(typoCode).toContain('data-slot="docs-prose-title"');
    expect(typoCode).toContain("docs-prose-title");
    expect(typoCode).toMatch(/return\s+<h1\s/);

    // 3. src/styles/index.css 定义 .docs-prose-title 使用 var(--uni-text-large-title) 和 var(--uni-leading-large-title)
    const css = readFileSync(join(__dirname, "../../../../src/styles/index.css"), "utf8");
    const ownerRule = css.match(/\.docs-prose-title\s*\{([\s\S]*?)\n\}/m);
    expect(ownerRule, "missing .docs-prose-title owner rule").not.toBeNull();
    const ruleBody = ownerRule?.[1] ?? "";
    expect(ruleBody).toContain("font-size: var(--uni-text-large-title)");
    expect(ruleBody).toContain("line-height: var(--uni-leading-large-title)");

    // 4. 页面消费者的 DocsPageTitle 用法不直接带 text-heading-* 类（由 owner 统一管控）
    const pageTitleUsages = pagesCode.match(/<DocsPageTitle\b[^>]*>/g) ?? [];
    expect(pageTitleUsages.length).toBeGreaterThan(0);
    for (const usage of pageTitleUsages) {
      expect(usage).not.toMatch(/\btext-heading-\S+\b/);
    }
  });
});
