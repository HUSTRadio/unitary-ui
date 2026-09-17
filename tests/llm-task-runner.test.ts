// @vitest-environment node
import { spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
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
      piCli: false,
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
    expect(Object.keys(runner.VALIDATORS).sort()).toEqual([
      "docs-contracts",
      "docs-corpus",
      "styleguide-screenshots",
    ]);
    expect(runner.VALIDATORS["styleguide-screenshots"]).toEqual([
      [expect.stringMatching(/^vp(?:\.exe)?$/), "run", "docs:readme:screenshots:check"],
    ]);
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

  it("uses the fixed production Codex exec template and rejects a substituted executable", async () => {
    const runner = await loadRunner();
    const config = {
      enabled: true,
      agent: {
        command: "codex",
        codexCli: true,
        model: "gpt-5.6-sol",
        thinking: "medium",
        ephemeral: true,
      },
    };
    expect(runner.buildAgentArgs(config, "PROMPT")).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      "gpt-5.6-sol",
      "-c",
      'model_reasoning_effort="medium"',
      "PROMPT",
    ]);
    expect(() =>
      runner.buildAgentArgs({ ...config, agent: { ...config.agent, command: "node" } }, "PROMPT"),
    ).toThrow(/fixed Codex/);
  });

  it("returns status 2 for allowlisted writes without committing", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    const before = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
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
    const after = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
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

  it("finishes on agent exit without waiting for a close event from inherited pipes", async () => {
    const runner = await loadRunner();
    const child = new EventEmitter() as EventEmitter & {
      stdout: PassThrough;
      stderr: PassThrough;
      kill: () => boolean;
    };
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.kill = () => true;

    const result = runner.waitForAgentExit(child, 1_000, () => ({ stdout: "", stderr: "" }));
    child.emit("exit", 0);

    await expect(result).resolves.toMatchObject({ ok: true, code: 0, timedOut: false });
    expect(child.stdout.destroyed).toBe(true);
    expect(child.stderr.destroyed).toBe(true);
  });

  it("routes oversized prompts through stdin instead of a command-line argument", async () => {
    const runner = await loadRunner();
    // Windows CreateProcess caps the command line near 32k; a first branch push
    // renders the whole tree (~55k bytes) into the runtime context and used to
    // fail `spawn codex` with ENAMETOOLONG.
    expect(runner.promptViaStdin("small prompt")).toBe(false);
    expect(runner.promptViaStdin("x".repeat(runner.PROMPT_STDIN_THRESHOLD + 1))).toBe(true);

    const config = {
      enabled: true,
      agent: {
        command: "codex",
        codexCli: true,
        model: "gpt-5.6-sol",
        thinking: "medium",
        ephemeral: true,
      },
    };
    // stdin 模式：codex exec 无位置参数时自动读 stdin，不传 PROMPT
    expect(runner.buildAgentArgs(config, "PROMPT", { promptVia: "stdin" })).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      "gpt-5.6-sol",
      "-c",
      'model_reasoning_effort="medium"',
    ]);
    expect(runner.buildAgentArgs(config, "PROMPT", { promptVia: "arg" })).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      "gpt-5.6-sol",
      "-c",
      'model_reasoning_effort="medium"',
      "PROMPT",
    ]);
  });

  it("delivers oversized runtime contexts to the agent through stdin", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    // Keep the capture file inside the task allowlist (docs/**) so the runner's
    // path-audit does not flag the test artifact itself.
    const promptOut = path.join(dir, "docs", "prompt-capture.txt");
    // Pad the runtime context past the stdin threshold.
    const runtimeContext = { mode: "test", padding: "y".repeat(runner.PROMPT_STDIN_THRESHOLD + 1) };
    const result = await runner.runTask({
      repoRoot: dir,
      resolvedTask: fakeTask(),
      runnerConfig: fakeConfig(),
      runtimeContext,
      testMode: true,
      testEnvironment: {
        FAKE_AGENT_TOUCH: "docs/new.md",
        FAKE_AGENT_PROMPT_STDIN: "1",
        FAKE_AGENT_PROMPT_OUT: promptOut,
      },
      testValidationExit: 0,
      writeRunRecord: false,
    });
    expect(result.status).toBe(2);
    const captured = readFileSync(promptOut, "utf8");
    expect(captured).toContain("fixed prompt");
    expect(captured).toContain(runtimeContext.padding.slice(0, 64));
  });
});
