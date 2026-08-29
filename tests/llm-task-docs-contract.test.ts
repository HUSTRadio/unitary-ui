import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fragmentPaths = [
  "llm/policies/safety.md",
  "llm/policies/git.md",
  "llm/policies/documentation.md",
  "llm/tasks/docs-update/prompt.md",
];

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function expectLiteralDiscovery(content: string): void {
  expect(content).toContain("llm/registry.json");
  expect(content).toContain("llm/tasks/docs-update/task.json");
  let cursor = -1;
  for (const fragmentPath of fragmentPaths) {
    const next = content.indexOf(fragmentPath);
    expect(next, fragmentPath).toBeGreaterThan(cursor);
    cursor = next;
  }
}

describe("LLM task documentation contract", () => {
  it("provides bilingual task-package documentation", () => {
    expect(existsSync(path.join(root, "llm", "README.md"))).toBe(true);
    expect(existsSync(path.join(root, "llm", "README.en.md"))).toBe(true);
    expect(read("llm/README.md")).toContain("README.en.md");
    expect(read("llm/README.en.md")).toContain("README.md");
  });

  it("lets an LLM discover prompt fragments from AGENTS.md without running a command", () => {
    const agents = read("AGENTS.md");
    expectLiteralDiscovery(agents);
    expect(agents).toContain("No command is required to discover these prompt paths");
    expect(agents).toContain("Read the `promptFragments` array in order");
  });

  it("documents the same static discovery procedure and fragment order in both task READMEs", () => {
    const zh = read("llm/README.md");
    const en = read("llm/README.en.md");
    expectLiteralDiscovery(zh);
    expectLiteralDiscovery(en);
    expect(zh).toContain("无需运行 `vp run`");
    expect(en).toContain("No `vp run` command is required");
    expect(zh).toContain("运行时上下文");
    expect(en).toContain("runtime context");
  });

  it("links the task package from human and corpus documentation", () => {
    for (const relativePath of [
      "README.md",
      "README.en.md",
      "docs/llm/README.md",
      "docs/llm/README.en.md",
    ]) {
      expect(read(relativePath), relativePath).toContain("llm/README");
    }
  });

  it("records the migration without retaining legacy configuration paths", () => {
    for (const relativePath of ["CHANGELOG.md", "CHANGELOG.en.md"]) {
      const changelog = read(relativePath);
      expect(changelog).toContain("llm/registry.json");
      expect(changelog).not.toContain("docs-agent.config.json");
      expect(changelog).not.toContain("docs/llm/update-prompt.md");
    }
  });
});
