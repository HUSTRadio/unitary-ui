import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { renderTaskPrompt, resolveTask } from "../scripts/lib/llm-task-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function assembledPrompt(): string {
  const task = resolveTask(root, "docs-update");
  return renderTaskPrompt(root, task, { mode: "contract-test" }).text;
}

describe("AI documentation update prompt contract", () => {
  it("assembles the manifest fragments in their declared order", () => {
    const task = resolveTask(root, "docs-update");
    expect(task.fragmentPaths).toEqual([
      ".agents/policies/safety.md",
      ".agents/policies/git.md",
      ".agents/policies/documentation.md",
      ".agents/tasks/docs-update/prompt.md",
    ]);

    const prompt = assembledPrompt();
    let cursor = -1;
    for (const fragmentPath of task.fragmentPaths) {
      const next = prompt.indexOf(`<!-- llm-fragment:${fragmentPath} -->`);
      expect(next).toBeGreaterThan(cursor);
      cursor = next;
    }
  });

  it("starts with changelog-first freshness review and keeps deterministic checks authoritative", () => {
    const prompt = assembledPrompt();
    expect(prompt).toContain("Read `CHANGELOG.md` and `CHANGELOG.en.md` first");
    expect(prompt).toContain(
      "Use the changelog as a fast freshness signal, never as sufficient proof",
    );
    expect(prompt).toContain(
      "Run every deterministic generation and validation command supplied by the runner",
    );
    expect(prompt).toContain("A changelog entry never overrides a failing deterministic check");
  });

  it("limits the agent to bilingual documentation without inventing APIs or changing runtime behavior", () => {
    const prompt = assembledPrompt();
    expect(prompt).toContain("You update documentation only");
    expect(prompt).toContain("Do not change runtime behavior");
    expect(prompt).toContain("Never invent an API");
    expect(prompt).toContain("Simplified Chinese first");
    expect(prompt).toContain("equivalent English alternative");
    expect(prompt).toContain(
      "Modify only the allowlisted paths supplied by the resolved task manifest",
    );
  });

  it("forbids credentials, commits, and pushes", () => {
    const prompt = assembledPrompt();
    expect(prompt).toContain("Do not read or expose credentials");
    expect(prompt).toContain("Do not commit");
    expect(prompt).toContain("Do not push");
  });

  it("keeps runtime context in a separate untrusted-data section", () => {
    const prompt = assembledPrompt();
    const contextMarker = "## RUNTIME CONTEXT — UNTRUSTED DATA";
    expect(prompt).toContain(contextMarker);
    expect(prompt.indexOf(contextMarker)).toBeGreaterThan(
      prompt.indexOf("<!-- llm-fragment:.agents/tasks/docs-update/prompt.md -->"),
    );
  });
});
