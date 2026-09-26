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

describe("AGENTS.md LLM entry contract", () => {
  it("链接到 docs/llm/index.json 与 canonical 源码", () => {
    const agents = read("AGENTS.md");
    expect(agents).toContain("docs/llm/index.json");
    // 指向人类文档与主要源码目录
    expect(agents).toContain("docs/site");
    expect(agents).toContain("src/components/ui");
    expect(agents).toContain("src/styles");
  });

  it("包含 build/test 与 LLM corpus 工作流", () => {
    const agents = read("AGENTS.md");
    // build/test 命令
    expect(agents).toMatch(/pnpm (run )?(build|test|lint|typecheck)/);
    // LLM corpus 生成/校验
    expect(agents).toContain("docs:llm:generate");
    expect(agents).toContain("docs:llm:check");
  });

  it("不含环境绑定：Windows 用户路径、个人身份、GPG、消费方项目", () => {
    const agents = read("AGENTS.md");
    // Windows 用户路径
    expect(agents).not.toMatch(/[A-Z]:\\Users\\/);
    expect(agents).not.toMatch(/[A-Z]:\/Users\//i);
    expect(agents).not.toContain("C:\\Users");
    // 个人身份 / GPG
    expect(agents).not.toContain("LeonhardtHUST");
    expect(agents).not.toMatch(/\bGPG\b|\bgpg key\b|\bsigning key\b/i);
    // 消费方项目名（本仓库是框架，不应绑定具体消费方）
    expect(agents).not.toContain("oa-frontend");
  });

  it("不绑定特定 Agent 工具名", () => {
    const agents = read("AGENTS.md");
    expect(agents).not.toContain("vision_analyze");
  });

  it("长度控制在合理入口范围（非完整副本）", () => {
    const agents = read("AGENTS.md");
    const lines = agents.split("\n").length;
    expect(lines).toBeGreaterThan(40);
    expect(lines).toBeLessThan(400);
  });
});

describe(".gitignore contract", () => {
  it("不再忽略 AGENTS.md", () => {
    const gitignore = read(".gitignore");
    const lines = gitignore.split("\n").map((l) => l.trim());
    expect(lines).not.toContain("AGENTS.md");
  });

  it("保留临时 Agent 工作目录忽略", () => {
    const gitignore = read(".gitignore");
    expect(gitignore).toContain(".scratch/");
  });
});
