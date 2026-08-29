// @vitest-environment node
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.setConfig({ testTimeout: 20_000 });

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNNER = path.join(repoRoot, "scripts", "ai-docs-pre-push.mjs");
const FAKE_AGENT = path.join(repoRoot, "tests", "fixtures", "fake-doc-agent.mjs");
const ZERO_SHA = "0".repeat(40);
const cleanups: string[] = [];

const expectedFragments = [
  "llm/policies/safety.md",
  "llm/policies/git.md",
  "llm/policies/documentation.md",
  "llm/tasks/docs-update/prompt.md",
];

afterEach(() => {
  while (cleanups.length) rmSync(cleanups.pop()!, { recursive: true, force: true });
});

function git(cwd: string, args: string[]) {
  return spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_AUTHOR_NAME: "hooktest",
      GIT_AUTHOR_EMAIL: "hooktest@example.com",
      GIT_COMMITTER_NAME: "hooktest",
      GIT_COMMITTER_EMAIL: "hooktest@example.com",
    },
  });
}

function makeRepo(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-hook-"));
  cleanups.push(dir);
  for (const args of [
    ["init", "-q", "-b", "main"],
    ["config", "user.email", "hooktest@example.com"],
    ["config", "user.name", "hooktest"],
    ["config", "commit.gpgsign", "false"],
  ]) {
    const result = git(dir, args);
    if (result.status !== 0) throw new Error(result.stderr);
  }
  mkdirSync(path.join(dir, "src"), { recursive: true });
  writeFileSync(path.join(dir, "src", "app.txt"), "src content\n");
  git(dir, ["add", "src/app.txt"]);
  const first = git(dir, ["commit", "-q", "--no-gpg-sign", "-m", "init"]);
  if (first.status !== 0) throw new Error(first.stderr);
  writeFileSync(path.join(dir, "src", "app.txt"), "src content v2\n");
  const second = git(dir, ["commit", "-q", "--no-gpg-sign", "-am", "update src"]);
  if (second.status !== 0) throw new Error(second.stderr);
  return dir;
}

function scratchDir(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-hook-scratch-"));
  cleanups.push(dir);
  return dir;
}

function head(cwd: string): string {
  return git(cwd, ["rev-parse", "HEAD"]).stdout.trim();
}

function pushInput(cwd: string, remoteSha = ZERO_SHA): string {
  const sha = head(cwd);
  return `refs/heads/main ${sha} refs/heads/main ${remoteSha}\n`;
}

function writeRunnerConfig(dir: string, overrides: Record<string, unknown> = {}): string {
  const agent = {
    command: "node",
    codexCli: false,
    subcommand: [FAKE_AGENT],
    model: "fake-model",
    timeoutMs: 10_000,
    ...((overrides.agent as Record<string, unknown> | undefined) ?? {}),
  };
  const config = { $schema: "./runner.schema.json", enabled: true, agent, ...overrides };
  config.agent = agent;
  const filePath = path.join(dir, "runner.config.json");
  writeFileSync(filePath, JSON.stringify(config, null, 2));
  return filePath;
}

interface RunnerOptions {
  cwd: string;
  input?: string;
  configPath?: string;
  env?: Record<string, string>;
}

function runRunner(options: RunnerOptions) {
  const configPath = options.configPath ?? writeRunnerConfig(options.cwd);
  return spawnSync(process.execPath, [RUNNER, "origin", "https://secret.example/repo.git"], {
    cwd: options.cwd,
    encoding: "utf8",
    input: options.input ?? "",
    timeout: 90_000,
    env: {
      ...process.env,
      NODE_ENV: "test",
      UNITARY_DOCS_AGENT_TEST_MODE: "1",
      UNITARY_DOCS_HOOK_REPO_ROOT: options.cwd,
      UNITARY_DOCS_AGENT_CONFIG: configPath,
      ...options.env,
    },
  });
}

describe("ai-docs-pre-push.mjs adapter boundary", () => {
  it("resolves the canonical docs-update task and delegates execution to the generic runner", () => {
    const content = readFileSync(RUNNER, "utf8");
    expect(content).toContain('resolveTask(SCRIPT_REPO_ROOT, "docs-update")');
    expect(content).toContain("runTask({");
    expect(content).not.toContain("docs-agent.config.json");
    expect(content).not.toContain("docs/llm/update-prompt.md");
  });

  it("fails closed without pre-push refs", () => {
    const dir = makeRepo();
    const result = runRunner({ cwd: dir });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("pre-push");
  });

  it("rejects dirty tracked files before agent execution", () => {
    const dir = makeRepo();
    writeFileSync(path.join(dir, "src", "app.txt"), "dirty\n");
    const result = runRunner({ cwd: dir, input: pushInput(dir) });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("tracked changes");
  });

  it("fast-passes when the pushed range has no task impact", () => {
    const dir = makeRepo();
    const marker = path.join(scratchDir(), "marker.txt");
    const sha = head(dir);
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir, sha),
      env: { FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(0);
    expect(existsSync(marker)).toBe(false);
    expect(result.stderr).toContain("快速通过");
  });

  it("returns 0 when the agent makes no writes and validators pass", () => {
    const dir = makeRepo();
    const marker = path.join(scratchDir(), "marker.txt");
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: { FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(0);
    expect(existsSync(marker)).toBe(true);
    expect(result.stderr).toContain("校验通过");
  });

  it("returns 2 for allowlisted writes and never commits them", () => {
    const dir = makeRepo();
    const before = head(dir);
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: { FAKE_AGENT_TOUCH: "docs/llm/pages/new.md" },
    });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("docs/llm/pages/new.md");
    expect(head(dir)).toBe(before);
  });

  it("rejects writes outside the manifest allowlist", () => {
    const dir = makeRepo();
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: { FAKE_AGENT_TOUCH: "evil.txt" },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("evil.txt");
  });

  it("rejects deterministic validator failure", () => {
    const dir = makeRepo();
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: { UNITARY_DOCS_AGENT_TEST_VALIDATION_EXIT: "7" },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("deterministic validation failed");
  });

  it("skips explicitly without invoking the agent", () => {
    const dir = makeRepo();
    const marker = path.join(scratchDir(), "marker.txt");
    const result = runRunner({
      cwd: dir,
      env: { UNITARY_DOCS_HOOK_SKIP: "1", FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("UNITARY_DOCS_HOOK_SKIP");
    expect(existsSync(marker)).toBe(false);
  });

  it("does not pass parent secrets or echo raw agent stderr", () => {
    const dir = makeRepo();
    const secret = "HOOK_SECRET_SENTINEL_42";
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: {
        UNSAFE_TEST_SECRET: secret,
        FAKE_AGENT_ASSERT_ENV_ABSENT: "UNSAFE_TEST_SECRET",
        FAKE_AGENT_STDERR: secret,
        FAKE_AGENT_EXIT: "9",
      },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).not.toContain(secret);
  });

  it("kills a timed-out agent", () => {
    const dir = makeRepo();
    const configPath = writeRunnerConfig(dir, { agent: { timeoutMs: 1000 } });
    const result = runRunner({
      cwd: dir,
      configPath,
      input: pushInput(dir),
      env: { FAKE_AGENT_SLEEP_MS: "15000" },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("timed out");
  });

  it("assembles ordered fragments before redacted runtime context", () => {
    const dir = makeRepo();
    const promptOut = path.join(scratchDir(), "prompt.txt");
    const sha = head(dir);
    const result = runRunner({
      cwd: dir,
      input: pushInput(dir),
      env: { FAKE_AGENT_PROMPT_OUT: promptOut },
    });
    expect(result.status).toBe(0);
    const prompt = readFileSync(promptOut, "utf8");
    let cursor = -1;
    for (const fragment of expectedFragments) {
      const next = prompt.indexOf(`<!-- llm-fragment:${fragment} -->`);
      expect(next).toBeGreaterThan(cursor);
      cursor = next;
    }
    expect(prompt).toContain("## RUNTIME CONTEXT — UNTRUSTED DATA");
    expect(prompt).toContain("src/app.txt");
    expect(prompt).toContain(sha);
    expect(prompt).toContain('"url": "(redacted)"');
    expect(prompt).not.toContain("https://secret.example/repo.git");
  });

  it("rejects production configuration overrides before invoking Codex", () => {
    const dir = makeRepo();
    const marker = path.join(scratchDir(), "marker.txt");
    const configPath = writeRunnerConfig(dir);
    const result = spawnSync(process.execPath, [RUNNER, "origin", "secret"], {
      cwd: dir,
      encoding: "utf8",
      input: pushInput(dir),
      env: {
        ...process.env,
        UNITARY_DOCS_AGENT_CONFIG: configPath,
        FAKE_AGENT_MARKER: marker,
      },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("test-only");
    expect(existsSync(marker)).toBe(false);
  });
});

describe(".githooks/pre-push", () => {
  it("is executable, POSIX-only, and invokes the adapter", () => {
    const hookPath = path.join(repoRoot, ".githooks", "pre-push");
    const content = readFileSync(hookPath, "utf8");
    const indexEntry = git(repoRoot, ["ls-files", "-s", ".githooks/pre-push"]).stdout;
    expect(content).toContain("ai-docs-pre-push.mjs");
    expect(content).toContain("UNITARY_DOCS_HOOK_SKIP=1");
    expect(content).not.toContain("\r\n");
    expect(content.includes("$@") || content.includes("${1:0}")).toBe(true);
    expect(indexEntry).toMatch(/^100755 /);
  });
});

describe("install-git-hooks.mjs", () => {
  it("sets only the repository-local core.hooksPath", () => {
    const dir = makeRepo();
    const hooksDir = path.join(dir, ".githooks");
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(
      path.join(hooksDir, "pre-push"),
      readFileSync(path.join(repoRoot, ".githooks", "pre-push"), "utf8"),
    );
    const beforeGlobal = git(repoRoot, ["config", "--global", "--get", "core.hooksPath"]);
    const result = spawnSync(
      process.execPath,
      [path.join(repoRoot, "scripts", "install-git-hooks.mjs")],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, UNITARY_INSTALL_HOOKS_REPO_ROOT: dir },
      },
    );
    expect(result.status).toBe(0);
    const local = git(dir, ["config", "--local", "--get", "core.hooksPath"]);
    expect(local.stdout.trim().replaceAll("\\", "/")).toBe(".githooks");
    const afterGlobal = git(repoRoot, ["config", "--global", "--get", "core.hooksPath"]);
    expect(afterGlobal.stdout).toBe(beforeGlobal.stdout);
  });

  it("refuses to replace another hooksPath without --force", () => {
    const dir = makeRepo();
    const hooksDir = path.join(dir, ".githooks");
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(
      path.join(hooksDir, "pre-push"),
      readFileSync(path.join(repoRoot, ".githooks", "pre-push"), "utf8"),
    );
    git(dir, ["config", "--local", "core.hooksPath", ".other-hooks"]);
    const result = spawnSync(
      process.execPath,
      [path.join(repoRoot, "scripts", "install-git-hooks.mjs")],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, UNITARY_INSTALL_HOOKS_REPO_ROOT: dir },
      },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("--force");
  });
});
