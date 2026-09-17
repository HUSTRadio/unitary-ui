// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

import Ajv from "ajv";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(repoRoot, ".agents", "registry.json");
const registrySchemaPath = path.join(repoRoot, ".agents", "registry.schema.json");
const taskPath = path.join(repoRoot, ".agents", "tasks", "docs-update", "task.json");
const taskSchemaPath = path.join(repoRoot, ".agents", "task.schema.json");
const runnerConfigPath = path.join(repoRoot, ".agents", "runner.config.json");
const runnerSchemaPath = path.join(repoRoot, ".agents", "runner.schema.json");
const cliPath = path.join(repoRoot, "scripts", "run-llm-task.mjs");

const expectedFragments = [
  ".agents/policies/safety.md",
  ".agents/policies/git.md",
  ".agents/policies/documentation.md",
  ".agents/tasks/docs-update/prompt.md",
];

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function validate(schemaPath: string, value: unknown): boolean {
  const ajv = new Ajv({ allErrors: true, strict: true });
  return ajv.compile(readJson(schemaPath))(value) as boolean;
}

function runCli(args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

describe("versioned LLM task package contract", () => {
  it("tracks .agents as the only canonical task-package root", () => {
    expect(existsSync(path.join(repoRoot, ".agents"))).toBe(true);
    expect(existsSync(path.join(repoRoot, "llm"))).toBe(false);
    const ignored = spawnSync("git", ["check-ignore", "-q", ".agents/registry.json"], {
      cwd: repoRoot,
    });
    expect(ignored.status).toBe(1);
  });

  it("provides the canonical registry, schemas, runner profile, and docs-update manifest", () => {
    for (const filePath of [
      registryPath,
      registrySchemaPath,
      taskPath,
      taskSchemaPath,
      runnerConfigPath,
      runnerSchemaPath,
    ]) {
      expect(existsSync(filePath), path.relative(repoRoot, filePath)).toBe(true);
    }

    if (!existsSync(registryPath) || !existsSync(taskPath)) return;

    const registry = readJson(registryPath) as {
      version: number;
      tasks: Record<string, string>;
    };
    const task = readJson(taskPath) as {
      id: string;
      version: number;
      promptFragments: string[];
      impactGlobs: string[];
      validators: string[];
    };

    expect(registry.version).toBe(1);
    expect(registry.tasks["docs-update"]).toBe(".agents/tasks/docs-update/task.json");
    expect(task.id).toBe("docs-update");
    expect(task.version).toBe(1);
    expect(task.promptFragments).toEqual(expectedFragments);
    expect(task.impactGlobs).toContain(".agents/**");
    expect(task.validators).toEqual([
      "docs-corpus",
      "docs-contracts",
      "styleguide-screenshots",
    ]);
    expect(validate(registrySchemaPath, registry)).toBe(true);
    expect(validate(taskSchemaPath, task)).toBe(true);
    expect(validate(runnerSchemaPath, readJson(runnerConfigPath))).toBe(true);
  });

  it("rejects path traversal, empty write boundaries, and command-shaped validator IDs", () => {
    expect(existsSync(taskSchemaPath)).toBe(true);
    if (!existsSync(taskSchemaPath)) return;

    const base = {
      id: "docs-update",
      version: 1,
      description: "test",
      promptFragments: expectedFragments,
      contextProvider: "docs-push",
      impactGlobs: ["src/**"],
      allowedWriteGlobs: ["docs/**"],
      validators: ["docs-corpus"],
    };

    expect(validate(taskSchemaPath, { ...base, promptFragments: ["../../secret.md"] })).toBe(false);
    expect(validate(taskSchemaPath, { ...base, allowedWriteGlobs: [] })).toBe(false);
    expect(validate(taskSchemaPath, { ...base, validators: ["sh -c true"] })).toBe(false);
  });

  it("resolves fragments in manifest order and hashes fixed and rendered prompts separately", async () => {
    const contractPath = path.join(repoRoot, "scripts", "lib", "llm-task-contract.mjs");
    expect(existsSync(contractPath)).toBe(true);
    if (!existsSync(contractPath)) return;

    const contract = await import(pathToFileURL(contractPath).href);
    const resolved = contract.resolveTask(repoRoot, "docs-update");
    expect(resolved.fragmentPaths).toEqual(expectedFragments);
    expect(resolved.promptBundleHash).toMatch(/^[a-f0-9]{64}$/);

    const first = contract.renderTaskPrompt(repoRoot, resolved, { mode: "manual", z: 1, a: 2 });
    const second = contract.renderTaskPrompt(repoRoot, resolved, { a: 2, mode: "manual", z: 1 });
    expect(first.text.indexOf(".agents/policies/safety.md")).toBeLessThan(
      first.text.indexOf(".agents/policies/git.md"),
    );
    expect(first.text).toContain("RUNTIME CONTEXT — UNTRUSTED DATA");
    expect(first.text).toContain('\"mode\": \"manual\"');
    expect(first.text).toBe(second.text);
    expect(first.renderedPromptHash).toBe(second.renderedPromptHash);
    expect(first.promptBundleHash).toBe(resolved.promptBundleHash);
    expect(first.renderedPromptHash).not.toBe(first.promptBundleHash);
  });

  it("validates every registered task and rejects repository escapes", async () => {
    const contractPath = path.join(repoRoot, "scripts", "lib", "llm-task-contract.mjs");
    expect(existsSync(contractPath)).toBe(true);
    if (!existsSync(contractPath)) return;

    const contract = await import(pathToFileURL(contractPath).href);
    expect(contract.validateAllTasks(repoRoot).map((task: { id: string }) => task.id)).toEqual([
      "docs-update",
    ]);
    expect(() => contract.resolveRepoPath(repoRoot, "../secret.md", "prompt fragment")).toThrow(
      /repository root/,
    );
    expect(() =>
      contract.resolveRepoPath(repoRoot, "C:/outside/task.json", "task manifest"),
    ).toThrow(/repository-relative|repository root/);
  });

  it("lists and validates registered tasks without invoking an agent", () => {
    const listed = runCli(["list"]);
    expect(listed.status).toBe(0);
    expect(listed.stdout).toContain("docs-update\tv1");

    const vpStyle = runCli(["--", "list"]);
    expect(vpStyle.status).toBe(0);
    expect(vpStyle.stdout).toBe(listed.stdout);

    const checked = runCli(["check"]);
    expect(checked.status).toBe(0);
    expect(checked.stdout).toContain("validated 1 LLM task");
  });

  it("produces byte-stable sanitized dry-run metadata", () => {
    const first = runCli(["docs-update", "--dry-run"]);
    const second = runCli(["docs-update", "--dry-run"]);
    expect(first.status).toBe(0);
    expect(second.status).toBe(0);
    expect(first.stdout).toBe(second.stdout);

    const metadata = JSON.parse(first.stdout) as {
      task: string;
      taskVersion: number;
      fragmentPaths: string[];
      promptBundleHash: string;
      renderedPromptHash?: string;
      agent: { command: string; provider?: string; model: string; thinking?: string };
    };
    expect(metadata).toMatchObject({
      task: "docs-update",
      taskVersion: 1,
      fragmentPaths: expectedFragments,
      agent: { command: "codex", model: "gpt-5.6-sol", thinking: "medium" },
    });
    expect(metadata.promptBundleHash).toMatch(/^[a-f0-9]{64}$/);
    expect(metadata.renderedPromptHash).toBeUndefined();
    expect(first.stdout).not.toContain("RUNTIME CONTEXT");
  });

  it("fails closed for an unknown task and unknown options through the unified CLI", () => {
    const result = runCli(["unknown-task", "--dry-run"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unknown-task");

    const unknownOption = runCli(["docs-update", "--unknown"]);
    expect(unknownOption.status).toBe(1);
    expect(unknownOption.stderr).toContain("--unknown");
  });
});
