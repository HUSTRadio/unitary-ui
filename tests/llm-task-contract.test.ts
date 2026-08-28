// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(repoRoot, "llm", "registry.json");
const registrySchemaPath = path.join(repoRoot, "llm", "registry.schema.json");
const taskPath = path.join(repoRoot, "llm", "tasks", "docs-update", "task.json");
const taskSchemaPath = path.join(repoRoot, "llm", "task.schema.json");
const runnerConfigPath = path.join(repoRoot, "llm", "runner.config.json");
const runnerSchemaPath = path.join(repoRoot, "llm", "runner.schema.json");
const cliPath = path.join(repoRoot, "scripts", "run-llm-task.mjs");

const expectedFragments = [
  "llm/policies/safety.md",
  "llm/policies/git.md",
  "llm/policies/documentation.md",
  "llm/tasks/docs-update/prompt.md",
];

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function validate(schemaPath: string, value: unknown): boolean {
  const ajv = new Ajv({ allErrors: true, strict: true });
  return ajv.compile(readJson(schemaPath))(value) as boolean;
}

describe("versioned LLM task package contract", () => {
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
      validators: string[];
    };

    expect(registry.version).toBe(1);
    expect(registry.tasks["docs-update"]).toBe("llm/tasks/docs-update/task.json");
    expect(task.id).toBe("docs-update");
    expect(task.version).toBe(1);
    expect(task.promptFragments).toEqual(expectedFragments);
    expect(task.validators).toEqual(["docs-corpus", "docs-contracts"]);
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

    expect(validate(taskSchemaPath, { ...base, promptFragments: ["../../secret.md"] })).toBe(
      false,
    );
    expect(validate(taskSchemaPath, { ...base, allowedWriteGlobs: [] })).toBe(false);
    expect(validate(taskSchemaPath, { ...base, validators: ["sh -c true"] })).toBe(false);
  });

  it("fails closed for an unknown task through the unified CLI", () => {
    const result = spawnSync(process.execPath, [cliPath, "unknown-task", "--dry-run"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unknown-task");
  });
});
