// @vitest-environment node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runnerPath = path.join(repoRoot, "scripts", "lib", "llm-task-runner.mjs");
const fakeAgent = path.join(repoRoot, "tests", "fixtures", "fake-doc-agent.mjs");
const cleanups: string[] = [];

afterEach(() => {
  while (cleanups.length) rmSync(cleanups.pop()!, { recursive: true, force: true });
});

function makeRepo(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-llm-runner-"));
  cleanups.push(dir);
  const git = (args: string[]) =>
    spawnSync("git", ["-c", "commit.gpgsign=false", ...args], {
      cwd: dir,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_AUTHOR_NAME: "runner-test",
        GIT_AUTHOR_EMAIL: "runner@example.com",
        GIT_COMMITTER_NAME: "runner-test",
        GIT_COMMITTER_EMAIL: "runner@example.com",
      },
    });
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "user.name", "runner-test"],
    ["config", "user.email", "runner@example.com"],
  ]) {
    const result = git(args);
    if (result.status !== 0) throw new Error(result.stderr);
  }
  mkdirSync(path.join(dir, "src"), { recursive: true });
  writeFileSync(path.join(dir, "src", "app.txt"), "source\n");
  git(["add", "src/app.txt"]);
  const commit = git(["commit", "-q", "-m", "init"]);
  if (commit.status !== 0) throw new Error(commit.stderr);
  return dir;
}

function fakeConfig() {
  return {
    enabled: true,
    agent: {
      command: "node",
      codexCli: false,
      subcommand: [fakeAgent],
      model: "fake-model",
      timeoutMs: 10_000,
    },
  };
}

function fakeTask() {
  return {
    id: "docs-update",
    version: 1,
    validators: ["docs-corpus", "docs-contracts"],
    allowedWriteGlobs: ["docs/**"],
    fixedPrompt: "fixed prompt\n",
    promptBundleHash: "a".repeat(64),
  };
}

async function loadRunner() {
  expect(existsSync(runnerPath)).toBe(true);
  return import(pathToFileURL(runnerPath).href);
}

describe("generic LLM task runner", () => {
  it("owns fixed validator IDs instead of accepting command arrays from manifests", async () => {
    const runner = await loadRunner();
    expect(Object.keys(runner.VALIDATORS).sort()).toEqual(["docs-contracts", "docs-corpus"]);
    expect(runner.validateTaskCapabilities(fakeTask())).toBeUndefined();
    expect(() =>
      runner.validateTaskCapabilities({ ...fakeTask(), validators: ["sh-c-true"] }),
    ).toThrow(/unknown validator/);
  });

  it("builds a minimal environment and strips parent secrets", async () => {
    const runner = await loadRunner();
    const env = runner.buildAgentEnvironment({
      PATH: "test-path",
      SYSTEMROOT: "C:/Windows",
      UNSAFE_SECRET: "do-not-pass",
    });
    expect(env.PATH).toBe("test-path");
    expect(env.SYSTEMROOT).toBe("C:/Windows");
    expect(env.UNSAFE_SECRET).toBeUndefined();
    expect(env.GIT_TERMINAL_PROMPT).toBe("0");
  });

  it("uses the fixed production Codex template and rejects a substituted executable", async () => {
    const runner = await loadRunner();
    const config = {
      enabled: true,
      agent: {
        command: "codex",
        codexCli: true,
        subcommand: ["exec"],
        model: "gpt-5.6-terra",
        reasoningEffort: "high",
        approvalMode: "approve-for-me",
        ephemeral: true,
      },
    };
    expect(runner.buildAgentArgs(config, "PROMPT")).toEqual([
      "exec",
      "-m",
      "gpt-5.6-terra",
      "-c",
      'model_reasoning_effort="high"',
      "--approve-for-me",
      "--ephemeral",
      "-C",
      ".",
      "PROMPT",
    ]);
    expect(() =>
      runner.buildAgentArgs({ ...config, agent: { ...config.agent, command: "node" } }, "PROMPT"),
    ).toThrow(/fixed Codex/);
  });

  it("returns status 2 for allowlisted writes without committing", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    const before = spawnSync("git", ["rev-parse", "HEAD"], { cwd: dir, encoding: "utf8" }).stdout.trim();
    const result = await runner.runTask({
      repoRoot: dir,
      resolvedTask: fakeTask(),
      runnerConfig: fakeConfig(),
      runtimeContext: { mode: "test" },
      testMode: true,
      testEnvironment: { FAKE_AGENT_TOUCH: "docs/new.md" },
      testValidationExit: 0,
      writeRunRecord: false,
    });
    const after = spawnSync("git", ["rev-parse", "HEAD"], { cwd: dir, encoding: "utf8" }).stdout.trim();
    expect(result.status).toBe(2);
    expect(result.changedPaths).toEqual(["docs/new.md"]);
    expect(after).toBe(before);
  });

  it("rejects writes outside the task allowlist", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    await expect(
      runner.runTask({
        repoRoot: dir,
        resolvedTask: fakeTask(),
        runnerConfig: fakeConfig(),
        runtimeContext: { mode: "test" },
        testMode: true,
        testEnvironment: { FAKE_AGENT_TOUCH: "evil.txt" },
        testValidationExit: 0,
        writeRunRecord: false,
      }),
    ).rejects.toThrow(/evil\.txt/);
  });

  it("suppresses raw agent stderr and does not inherit unsafe environment values", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    const secret = "RUNNER_SECRET_SENTINEL";
    await expect(
      runner.runTask({
        repoRoot: dir,
        resolvedTask: fakeTask(),
        runnerConfig: fakeConfig(),
        runtimeContext: { mode: "test" },
        testMode: true,
        testEnvironment: {
          UNSAFE_SECRET: secret,
          FAKE_AGENT_ASSERT_ENV_ABSENT: "UNSAFE_SECRET",
          FAKE_AGENT_STDERR: secret,
          FAKE_AGENT_EXIT: "9",
        },
        testValidationExit: 0,
        writeRunRecord: false,
      }),
    ).rejects.toThrow(/agent exited with status 9/);
  });
});
