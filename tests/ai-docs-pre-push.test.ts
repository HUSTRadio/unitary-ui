// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.setConfig({ testTimeout: 15_000 });

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNNER = path.join(repoRoot, "scripts", "ai-docs-pre-push.mjs");
const SCHEMA = JSON.parse(readFileSync(path.join(repoRoot, "docs-agent.schema.json"), "utf8"));
const FAKE_AGENT = path.join(repoRoot, "tests", "fixtures", "fake-doc-agent.mjs");
const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile(SCHEMA);

const cleanups: string[] = [];

afterEach(() => {
  while (cleanups.length) {
    rmSync(cleanups.pop()!, { recursive: true, force: true });
  }
});

function makeRepo(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-hook-"));
  cleanups.push(dir);
  const git = (args: string[], input?: string) =>
    spawnSync("git", args, {
      cwd: dir,
      encoding: "utf8",
      input,
      env: {
        ...process.env,
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_AUTHOR_NAME: "hooktest",
        GIT_AUTHOR_EMAIL: "hooktest@example.com",
        GIT_COMMITTER_NAME: "hooktest",
        GIT_COMMITTER_EMAIL: "hooktest@example.com",
      },
    });
  const steps: Array<[string[], string]> = [
    [["init", "-q", "-b", "main"], "init"],
    [["config", "user.email", "hooktest@example.com"], "email"],
    [["config", "user.name", "hooktest"], "name"],
    [["config", "commit.gpgsign", "false"], "gpg"],
  ];
  for (const [args, label] of steps) {
    const r = git(args);
    if (r.status !== 0) throw new Error(`git ${label} failed: ${r.stderr}`);
  }
  const srcPath = path.join(dir, "src");
  mkdirSync(srcPath, { recursive: true });
  writeFileSync(path.join(srcPath, "app.txt"), "src content\n");
  const add = git(["add", "src/app.txt"]);
  if (add.status !== 0) throw new Error(`git add failed: ${add.stderr}`);
  const r = git(["commit", "-q", "--no-gpg-sign", "-m", "init"]);
  if (r.status !== 0) throw new Error(`git commit failed: ${r.stderr}`);
  // 第二个提交确保 root..HEAD 的 diff 包含 src/app.txt（模拟真实 push 的变更路径）。
  writeFileSync(path.join(srcPath, "app.txt"), "src content v2\n");
  const r2 = git(["commit", "-q", "--no-gpg-sign", "-am", "update src"]);
  if (r2.status !== 0) throw new Error(`git commit 2 failed: ${r2.stderr}`);
  return dir;
}

function scratchDir(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-hook-scratch-"));
  cleanups.push(dir);
  return dir;
}

interface RunnerOptions {
  cwd: string;
  configPath: string;
  input?: string;
  env?: Record<string, string>;
}

function runRunner(options: RunnerOptions) {
  return spawnSync(process.execPath, [RUNNER], {
    cwd: options.cwd,
    encoding: "utf8",
    input: options.input ?? "",
    timeout: 90_000,
    env: {
      ...process.env,
      UNITARY_DOCS_HOOK_REPO_ROOT: options.cwd,
      UNITARY_DOCS_AGENT_CONFIG: options.configPath,
      ...options.env,
    },
  });
}

function writeConfig(dir: string, overrides: Record<string, unknown> = {}): string {
  const agentDefaults = {
    command: "node",
    codexCli: false,
    subcommand: [FAKE_AGENT],
    model: "fake-model",
    timeoutMs: 30_000,
  };
  const config = {
    enabled: true,
    agent: agentDefaults,
    impactGlobs: ["src/**"],
    allowedWriteGlobs: ["docs/**"],
    ...overrides,
  };
  if (overrides.agent) {
    config.agent = { ...agentDefaults, ...(overrides.agent as Record<string, unknown>) };
  }
  const configPath = path.join(dir, "agent.config.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

describe("docs-agent.schema.json", () => {
  it("接受默认仓库配置", () => {
    const config = JSON.parse(readFileSync(path.join(repoRoot, "docs-agent.config.json"), "utf8"));
    expect(validate(config)).toBe(true);
  });

  it("接受最小合法配置", () => {
    expect(
      validate({
        enabled: true,
        agent: { command: "codex", model: "gpt-5.6-terra" },
        impactGlobs: ["src/**"],
        allowedWriteGlobs: ["docs/**"],
      }),
    ).toBe(true);
  });

  it("拒绝未知字段", () => {
    expect(
      validate({
        enabled: true,
        agent: { command: "codex", model: "m" },
        impactGlobs: ["src/**"],
        allowedWriteGlobs: ["docs/**"],
        evil: true,
      }),
    ).toBe(false);
  });

  it("拒绝空 command", () => {
    expect(
      validate({
        enabled: true,
        agent: { command: "", model: "m" },
        impactGlobs: ["src/**"],
        allowedWriteGlobs: ["docs/**"],
      }),
    ).toBe(false);
  });

  it("拒绝 command 中的路径分隔符与元字符", () => {
    for (const bad of ["../codex", "codex;rm", "codex -x"]) {
      expect(
        validate({
          enabled: true,
          agent: { command: bad, model: "m" },
          impactGlobs: ["src/**"],
          allowedWriteGlobs: ["docs/**"],
        }),
        `command=${bad}`,
      ).toBe(false);
    }
  });

  it("拒绝绕过沙箱的模式", () => {
    expect(
      validate({
        enabled: true,
        agent: { command: "codex", model: "m", sandbox: "danger-full-access" },
        impactGlobs: ["src/**"],
        allowedWriteGlobs: ["docs/**"],
      }),
    ).toBe(false);
  });

  it("拒绝超时越界值", () => {
    expect(
      validate({
        enabled: true,
        agent: { command: "codex", model: "m", timeoutMs: 1 },
        impactGlobs: ["src/**"],
        allowedWriteGlobs: ["docs/**"],
      }),
    ).toBe(false);
  });
});

describe("ai-docs-pre-push.mjs 配置互斥", () => {
  it("agent.sandbox 与 agent.approvalMode 同时出现时拒绝运行", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, {
      agent: {
        command: "node",
        codexCli: false,
        subcommand: [FAKE_AGENT],
        model: "fake-model",
        sandbox: "read-only",
        approvalMode: "approve-for-me",
      },
    });
    const result = runRunner({ cwd: dir, configPath, args: ["--manual"] });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("互斥");
  });
});

describe("ai-docs-pre-push.mjs", () => {
  it("跟踪文件有未提交改动时拒绝运行", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir);
    writeFileSync(path.join(dir, "src", "app.txt"), "dirty\n");
    const result = runRunner({ cwd: dir, configPath });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("工作区不干净");
  });

  it("无文档影响路径时快速放行且不调用 agent", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, { impactGlobs: ["never-matches/**"] });
    const marker = path.join(scratchDir(), "marker.txt");
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(0);
    expect(existsSync(marker)).toBe(false);
  });

  it("Agent 无写入且校验通过时 exit 0", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, {
      validationCommands: [[process.execPath, "-e", "process.exit(0)"]],
    });
    const marker = path.join(scratchDir(), "marker.txt");
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(0);
    expect(existsSync(marker)).toBe(true);
  });

  it("Agent 写入允许范围外路径时失败并列名", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, { allowedWriteGlobs: ["docs/**"] });
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_TOUCH: "evil.txt" },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("evil.txt");
  }, 15_000);

  it("Agent 合法更新文档时以 exit 2 中止并提示人工审查", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir);
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_TOUCH: "docs/new.md" },
    });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("docs/new.md");
    // runner 绝不自动提交。
    const log = spawnSync("git", ["log", "--oneline"], { cwd: dir, encoding: "utf8" }).stdout;
    expect(log.trim().split("\n")).toHaveLength(2);
  });

  it("确定性校验命令失败时拒绝放行", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, {
      validationCommands: [[process.execPath, "-e", "process.exit(7)"]],
    });
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("确定性校验失败");
  });

  it("UNITARY_DOCS_HOOK_SKIP=1 时以 exit 3 跳过并打印警告", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir);
    const marker = path.join(scratchDir(), "marker.txt");
    const result = runRunner({
      cwd: dir,
      configPath,
      env: { UNITARY_DOCS_HOOK_SKIP: "1", FAKE_AGENT_MARKER: marker },
    });
    expect(result.status).toBe(3);
    expect(result.stderr).toContain("UNITARY_DOCS_HOOK_SKIP");
    expect(existsSync(marker)).toBe(false);
  });

  it("Agent 非零退出时整体失败", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir);
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_EXIT: "9" },
    });
    expect(result.status).toBe(1);
  });

  it("Agent 超时时强制终止并失败", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir, {
      agent: {
        command: "node",
        codexCli: false,
        subcommand: [FAKE_AGENT],
        model: "fake-model",
        timeoutMs: 1000,
      },
    });
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_SLEEP_MS: "15000" },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("超时");
  });

  it("把固定 prompt 与动态上下文作为最后一个参数传给 Agent", () => {
    const dir = makeRepo();
    const configPath = writeConfig(dir);
    const promptOut = path.join(scratchDir(), "prompt.txt");
    const sha = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).stdout.trim();
    const result = runRunner({
      cwd: dir,
      configPath,
      input: `refs/heads/main ${sha} refs/heads/main 0000000000000000000000000000000000000000\n`,
      env: { FAKE_AGENT_PROMPT_OUT: promptOut },
    });
    expect(result.status).toBe(0);
    const prompt = readFileSync(promptOut, "utf8");
    const fixed = readFileSync(path.join(repoRoot, "docs", "llm", "update-prompt.md"), "utf8");
    expect(prompt.startsWith(fixed)).toBe(true);
    expect(prompt).toContain("src/app.txt");
    expect(prompt).toContain(sha);
    expect(prompt).toContain("REMOTE URL (redacted)");
  });
});

describe(".githooks/pre-push", () => {
  it("存在、引用 runner 并使用 POSIX 换行", () => {
    const hookPath = path.join(repoRoot, ".githooks", "pre-push");
    const content = readFileSync(hookPath, "utf8");
    expect(content).toContain("ai-docs-pre-push.mjs");
    expect(content).not.toContain("\r\n");
    expect(content.includes("$@") || content.includes("${1:0}")).toBe(true);
  });
});

describe("install-git-hooks.mjs", () => {
  it("只设置本地 core.hooksPath，不动全局配置", () => {
    const dir = makeRepo();
    const hooksDir = path.join(dir, ".githooks");
    rmSync(hooksDir, { recursive: true, force: true });
    // 复制真实 hook 到沙箱。
    const hookContent = readFileSync(path.join(repoRoot, ".githooks", "pre-push"), "utf8");
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(path.join(hooksDir, "pre-push"), hookContent);

    const beforeGlobal = spawnSync("git", ["config", "--global", "--get", "core.hooksPath"], {
      encoding: "utf8",
    });
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
    const local = spawnSync("git", ["-C", dir, "config", "--local", "--get", "core.hooksPath"], {
      encoding: "utf8",
    });
    expect(local.stdout.trim().replaceAll("\\", "/")).toBe(".githooks");
    const afterGlobal = spawnSync("git", ["config", "--global", "--get", "core.hooksPath"], {
      encoding: "utf8",
    });
    expect(afterGlobal.stdout).toBe(beforeGlobal.stdout);
  });

  it("已有其他 hooksPath 且未指定 --force 时拒绝安装", () => {
    const dir = makeRepo();
    const hooksDir = path.join(dir, ".githooks");
    mkdirSync(hooksDir, { recursive: true });
    writeFileSync(
      path.join(hooksDir, "pre-push"),
      readFileSync(path.join(repoRoot, ".githooks", "pre-push"), "utf8"),
    );
    spawnSync("git", ["-C", dir, "config", "--local", "core.hooksPath", ".other-hooks"], {
      encoding: "utf8",
    });
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
