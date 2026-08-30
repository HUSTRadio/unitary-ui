// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  const filePath = path.join(ROOT, rel);
  expect(existsSync(filePath), `${rel} 必须存在`).toBe(true);
  return readFileSync(filePath, "utf8");
}

function screenshotPaths(markdown: string): string[] {
  return [...markdown.matchAll(/!\[[^\]]*\]\((images\/styleguide\/[^)]+)\)/g)].map(
    (match) => match[1],
  );
}

function screenshotRows(markdown: string): string[] {
  const start = "<!-- STYLEGUIDE_SCREENSHOTS_START -->";
  const end = "<!-- STYLEGUIDE_SCREENSHOTS_END -->";
  const block = markdown.slice(markdown.indexOf(start), markdown.indexOf(end));
  return block.split("\n").filter((line) => /^\| .+ \| !\[/.test(line));
}

describe("README 示例截图生成合同", () => {
  it("提供生成与只读漂移检查命令，但不要求 README 用户执行", () => {
    const pkg = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
    expect(pkg.scripts?.["docs:readme:screenshots"]).toBe(
      "node scripts/capture-readme-screenshots.mjs",
    );
    expect(pkg.scripts?.["docs:readme:screenshots:check"]).toBe(
      "node scripts/capture-readme-screenshots.mjs --check",
    );

    expect(read("README.md")).not.toContain("vp run docs:readme:screenshots");
    expect(read("README.en.md")).not.toContain("vp run docs:readme:screenshots");
    expect(read("AGENTS.md")).toContain("pnpm run docs:readme:screenshots:check");
  });

  it("双语 README 只展示 living styleguide 页面且每页都有 light/dark", () => {
    const zh = read("README.md");
    const en = read("README.en.md");
    const zhPaths = screenshotPaths(zh);
    const enPaths = screenshotPaths(en);

    expect(zh).toContain("<!-- STYLEGUIDE_SCREENSHOTS_START -->");
    expect(zh).toContain("<!-- STYLEGUIDE_SCREENSHOTS_END -->");
    expect(en).toContain("<!-- STYLEGUIDE_SCREENSHOTS_START -->");
    expect(en).toContain("<!-- STYLEGUIDE_SCREENSHOTS_END -->");
    expect(enPaths).toEqual(zhPaths);
    expect(screenshotRows(zh).length).toBeGreaterThan(0);
    expect(screenshotRows(en)).toHaveLength(screenshotRows(zh).length);
    expect(zhPaths).toHaveLength(screenshotRows(zh).length * 2);
    expect(new Set(zhPaths).size).toBe(zhPaths.length);
    expect(zhPaths.some((file) => file.includes("json-view"))).toBe(false);

    for (const imagePath of zhPaths) {
      expect(existsSync(path.join(ROOT, imagePath)), `${imagePath} 必须存在`).toBe(true);
    }
  });

  it("生成器从导航 DOM 自动发现页面，不硬编码页面名称", () => {
    const app = read("src/App.tsx");
    const generator = read("scripts/capture-readme-screenshots.mjs");

    expect(app).toContain("data-styleguide-page");
    expect(app).toContain("data-styleguide-label-en");
    expect(generator).toContain("[data-styleguide-page]");
    expect(generator).toContain("STYLEGUIDE_SCREENSHOTS_START");
    expect(generator).toContain("--check");
    expect(generator).toContain('["fmt", targetPath, "--write"]');
    expect(generator).toContain("must contain exactly one managed screenshot marker pair");
    expect(generator).not.toContain("组件总览");
  });

  it("README 顶部提供简洁语言入口与唯一 LLM 入口", () => {
    const zh = read("README.md");
    const en = read("README.en.md");
    const instruction =
      "To LLM Agents: see [AGENTS.md](./AGENTS.md) for llm-specified documentation.";

    expect(zh.split("\n").slice(0, 8)).toContain("[English](./README.en.md)");
    expect(en.split("\n").slice(0, 8)).toContain("[简体中文](./README.md)");
    expect(zh.split("\n").slice(0, 8)).toContain(instruction);
    expect(en.split("\n").slice(0, 8)).toContain(instruction);
    expect(zh).not.toContain("## LLM / AI agent usage");
    expect(en).not.toContain("## LLM / AI agent usage");
  });
});
