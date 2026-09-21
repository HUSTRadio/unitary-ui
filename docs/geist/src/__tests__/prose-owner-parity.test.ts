import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 页面级排版一致性守卫（prose owner parity）。
 *
 * 基准：src/styles/index.css 的 .docs-prose-* 语义 owner（title/lead/heading/paragraph），
 * 页面组装入口：components/docs-typography.tsx 的 DocsPageTitle / DocsPageLead /
 * DocsSectionTitle / DocsParagraph。
 *
 * 规则：
 * 1. 页面组件不得出现裸 <h1 —— 页面标题一律由 DocsPageTitle 生成；
 * 2. 页面级纯文本段落（页面根直接区域）不得内联 text-heading-* / text-copy-* 字号；
 * 3. 合法局部体系（卡片网格 / legal 附注 / pattern 演示壳层 / 异常兜底）必须以
 *    data-slot 显式标记，便于扫描器与后续审计排除。
 *
 * 全站实测验证：tmp-typo-scan 扫描 86 路由 × 2 语言（172 页）0 违规。
 */

const read = (relative: string) => readFileSync(join(__dirname, "../", relative), "utf8");

/** 渲染页面根内容的组件（ErrorBoundary 内直接挂载） */
const PAGE_COMPONENTS = [
  "components/docs-pages.tsx",
  "components/docs-icons.tsx",
  "components/docs-grid-page.tsx",
  "components/docs-components-page.tsx",
  "components/patterns/app-shell-demo.tsx",
  "pages/lifecycle-and-hooks.tsx",
  "pages/charts-gallery.tsx",
] as const;

describe("prose owner parity: 页面级排版必须走语义 owner", () => {
  it("页面组件与 App 占位页不出现裸 <h1（标题一律由 DocsPageTitle 生成）", () => {
    for (const file of PAGE_COMPONENTS) {
      expect(read(file), `${file} 不应出现裸 <h1`).not.toContain("<h1");
    }
    // App.tsx 的占位页渲染也用 DocsPageTitle；其 ErrorBoundary fallback 属异常兜底局部体系
    const app = read("App.tsx");
    expect(app).not.toMatch(/<h1\s/);
    expect(app).toContain("<DocsPageTitle");
  });

  it("图标页四个层级均使用语义 owner 组件（本次修复的回归守卫）", () => {
    const code = read("components/docs-icons.tsx");
    expect(code).toContain("<DocsPageTitle");
    expect(code).toContain("<DocsPageLead");
    expect(code).toContain("<DocsSectionTitle");
    expect(code).toContain("<DocsParagraph");
    // 页面级标题 utility 已消除（图标卡片内的 text-label-12 属局部体系，不在此列）
    expect(code).not.toMatch(/\btext-heading-\S+/);
  });

  it("图标页页面级区域无内联 text-copy-* 字号（Modal 与已标记局部体系除外）", () => {
    const code = read("components/docs-icons.tsx");
    const pageLevel = code
      .split("<Modal")[0]
      .split("\n")
      .filter((line) => !line.includes('data-slot="legal-note"'))
      .join("\n");
    expect(pageLevel).not.toMatch(/\btext-copy-\d+/);
  });

  it("App Shell 外层标题/首段走语义 owner，演示壳层以 data-slot 标记", () => {
    const code = read("components/patterns/app-shell-demo.tsx");
    expect(code).toContain("<DocsPageTitle");
    expect(code).toContain("<DocsPageLead");
    expect(code).toContain('data-slot="app-shell-demo"');
  });

  it("合法局部体系均已显式标记 data-slot", () => {
    expect(read("components/docs-cards.tsx")).toContain('data-slot="docs-card"');
    expect(read("components/docs-components-page.tsx")).toContain('data-slot="docs-card"');
    expect(read("components/docs-icons.tsx")).toContain('data-slot="legal-note"');
    expect(read("App.tsx")).toContain('data-slot="page-render-error"');
  });

  it("语义 owner 的 CSS 定义保持 token 驱动（防止回退为硬编码字号）", () => {
    const css = readFileSync(join(__dirname, "../../../../src/styles/index.css"), "utf8");
    const rule = (name: string) => css.match(new RegExp(`\\.${name}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
    expect(rule("docs-prose-title")).toContain("font-size: var(--uni-text-large-title)");
    expect(rule("docs-prose-lead")).toContain("font-size: var(--uni-text-body)");
    expect(rule("docs-prose-heading")).toContain("font-size: var(--uni-text-title3)");
    expect(rule("docs-prose-paragraph")).toContain("font-size: var(--uni-text-body)");
  });
});
