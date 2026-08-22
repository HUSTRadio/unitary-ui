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
      join(__dirname, "../../src/components/docs-components-page.tsx"),
      "utf8",
    );
    expect(code).toContain('type="default"');
  });

  it('modal demo 按钮含 type="default"（差异 #11）', () => {
    const code = readFileSync(
      join(__dirname, "../../src/components/docs-components-page.tsx"),
      "utf8",
    );
    expect(code).toContain('type="default"');
  });

  it("docs 页 H1 类含 text-heading-24 sm:text-heading-40（差异 #12）", () => {
    const code = readFileSync(join(__dirname, "../../src/components/docs-pages.tsx"), "utf8");
    expect(code).toContain("text-heading-24 sm:text-heading-40");
  });
});
