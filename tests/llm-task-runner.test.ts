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

// 断言必须绑定真实仓库配置，避免夹具与实际 provider/模型脱钩。
function repoAgentConfig() {
  const config = JSON.parse(
    readFileSync(path.join(repoRoot, ".agents", "runner.config.json"), "utf8"),
  ) as {
    agent: {
      command: string;
      codexCli?: boolean;
      provider?: string;
      model: string;
      baseUrl?: string;
      apiKeyEnv?: string;
      thinking?: string;
      ephemeral?: boolean;
    };
  };
  return config.agent;
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

  it("passes only the provider credential variable and strips every other secret", async () => {
    const runner = await loadRunner();
    const env = runner.buildAgentEnvironment({
      PATH: "test-path",
      DEEPSEEK_API_KEY: "ds-sentinel",
      AWS_SECRET_ACCESS_KEY: "aws-sentinel",
      GITHUB_TOKEN: "gh-sentinel",
      OPENROUTER_API_KEY: "or-sentinel",
      ANTHROPIC_API_KEY: "anthropic-sentinel",
      DEEPSEEK_API_KEY_ID: "near-miss-sentinel",
      UNSAFE_SECRET: "unsafe-sentinel",
    });
    expect(env.DEEPSEEK_API_KEY).toBe("ds-sentinel");
    expect(env.AWS_SECRET_ACCESS_KEY).toBeUndefined();
    expect(env.GITHUB_TOKEN).toBeUndefined();
    expect(env.OPENROUTER_API_KEY).toBeUndefined();
    expect(env.ANTHROPIC_API_KEY).toBeUndefined();
    expect(env.DEEPSEEK_API_KEY_ID).toBeUndefined();
    expect(env.UNSAFE_SECRET).toBeUndefined();
  });

  it("allowlists the provider credential by exact name, never by wildcard suffix", async () => {
    const runner = await loadRunner();
    // 冻结的字符串白名单：唯一允许的 *_API_KEY 必须是当前 provider 的凭据变量，
    // 宽泛的 `*_API_KEY` 后缀匹配会让 OPENROUTER_API_KEY 等父进程密钥一并泄露。
    expect(Object.isFrozen(runner.AGENT_ENV_ALLOWLIST)).toBe(true);
    expect(runner.AGENT_ENV_ALLOWLIST).toContain("DEEPSEEK_API_KEY");
    expect(
      runner.AGENT_ENV_ALLOWLIST.filter((name: string) => name.endsWith("_API_KEY")),
    ).toEqual(["DEEPSEEK_API_KEY"]);
  });

  it("uses the fixed production Codex exec template and rejects a substituted executable", async () => {
    const runner = await loadRunner();
    const { model, thinking } = repoAgentConfig();
    const config = {
      enabled: true,
      agent: {
        command: "codex",
        codexCli: true,
        model,
        thinking,
        ephemeral: true,
      },
    };
    const args = runner.buildAgentArgs(config, "PROMPT");
    // 参数前缀必须是固定 Codex exec 模板，provider 切换不得改动它。
    expect(args.slice(0, 6)).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
    ]);
    expect(args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      model,
      "-c",
      `model_reasoning_effort="${thinking}"`,
      "PROMPT",
    ]);
    expect(() =>
      runner.buildAgentArgs({ ...config, agent: { ...config.agent, command: "node" } }, "PROMPT"),
    ).toThrow(/fixed Codex/);
  });

  it("delegates provider routing to the Codex CLI instead of pinning one inline", async () => {
    const runner = await loadRunner();
    const agent = repoAgentConfig();
    // 仓库配置不再内联 provider：provider、base_url 与凭据由 codex 自身的
    // 用户级配置决定，runner 只固定可执行文件、沙箱与提示词投递方式。
    expect(agent.provider).toBeUndefined();
    expect(agent.baseUrl).toBeUndefined();
    expect(agent.apiKeyEnv).toBeUndefined();

    const args = runner.buildAgentArgs({ enabled: true, agent }, "PROMPT");
    expect(args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      agent.model,
      "-c",
      `model_reasoning_effort="${agent.thinking}"`,
      "PROMPT",
    ]);
    expect(args.some((arg) => arg.startsWith("model_provider="))).toBe(false);
    expect(args[args.indexOf("--model") + 1]).toBe("gpt-6-sol");
  });

  it("omits provider overrides when no provider is configured", async () => {
    const runner = await loadRunner();
    const { model, thinking } = repoAgentConfig();
    const args = runner.buildAgentArgs(
      {
        enabled: true,
        agent: { command: "codex", codexCli: true, model, thinking, ephemeral: true },
      },
      "PROMPT",
    );
    expect(args.join("\n")).not.toContain("model_providers.");
    expect(args.join("\n")).not.toContain("base_url");
    expect(args.join("\n")).not.toContain("wire_api");
    expect(args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      model,
      "-c",
      `model_reasoning_effort="${thinking}"`,
      "PROMPT",
    ]);
  });

  it("omits the reasoning-effort override when the agent config has no thinking", async () => {
    const runner = await loadRunner();
    const { model } = repoAgentConfig();
    // 「未设置 thinking」这条分支无法用全局配置值覆盖，故显式构造局部夹具。
    const args = runner.buildAgentArgs(
      { enabled: true, agent: { command: "codex", codexCli: true, model } },
      "PROMPT",
      { testMode: true },
    );
    expect(args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      model,
      "PROMPT",
    ]);
    expect(args).not.toContain("model_reasoning_effort");
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

    const { model, thinking } = repoAgentConfig();
    const config = {
      enabled: true,
      agent: {
        command: "codex",
        codexCli: true,
        model,
        thinking,
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
      model,
      "-c",
      `model_reasoning_effort="${thinking}"`,
    ]);
    expect(runner.buildAgentArgs(config, "PROMPT", { promptVia: "arg" })).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--model",
      model,
      "-c",
      `model_reasoning_effort="${thinking}"`,
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

  it("never writes provider credentials into the sanitized run record", async () => {
    const runner = await loadRunner();
    const dir = makeRepo();
    const sentinel = "ds-key-must-not-be-recorded";
    const result = await runner.runTask({
      repoRoot: dir,
      resolvedTask: fakeTask(),
      runnerConfig: fakeConfig(),
      runtimeContext: { mode: "test" },
      testMode: true,
      // testEnvironment 里带上 provider 凭据：它必须被透传给子进程，但绝不能落盘。
      testEnvironment: {
        FAKE_AGENT_TOUCH: "docs/new.md",
        DEEPSEEK_API_KEY: sentinel,
      },
      testValidationExit: 0,
    });
    expect(result.status).toBe(2);
    expect(result.runRecordPath).toBeTruthy();
    const recordPath = result.runRecordPath as string;
    expect(recordPath).toContain(path.join(".scratch", "llm-runs"));
    const record = readFileSync(recordPath, "utf8");
    expect(record).not.toContain(sentinel);
    expect(record).toContain("fake-model");
  });
});

// Windows 命令选择必须保持 fail-closed：shim-only 安装不退回 shell 派生。
describe.skipIf(process.platform !== "win32")("resolveWindowsAgentCommand (win32)", () => {
  it("fails closed on shim-only installs instead of shelling out", async () => {
    const runner = await loadRunner();
    const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-agent-resolve-"));
    cleanups.push(dir);
    writeFileSync(path.join(dir, "codex.cmd"), "@echo off\r\n");
    expect(() => runner.resolveWindowsAgentCommand("codex", { ...process.env, PATH: dir })).toThrow(
      /CVE-2024-27980/,
    );
  });
});
