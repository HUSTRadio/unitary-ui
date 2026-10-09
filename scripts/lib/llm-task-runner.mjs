import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { renderTaskPrompt } from "./llm-task-contract.mjs";
import { leasePackageLockProcess, withPackageLock } from "./package-script-lock.mjs";

const VP = process.platform === "win32" ? "vp.exe" : "vp";
// 生产生成方：Codex CLI。
// Windows 上不能无 shell spawn .cmd/.bat shim：Node ≥ 20.12.2（CVE-2024-27980）对
// 该形态一律抛 EINVAL，而 shell:true 又会打开 cmd 元字符注入面。生产路径统一先经
// resolveWindowsAgentCommand() 解析出原生可执行文件再 spawn，解析失败 fail-closed。
const AGENT_COMMAND = "codex";

const AGENT_PROBE_ENV_NAMES = [
  "PATH",
  "PATHEXT",
  "SYSTEMROOT",
  "SystemRoot",
  "COMSPEC",
  "ComSpec",
  "TEMP",
  "TMP",
];

/**
 * 在 Windows 上把裸命令名解析为原生可执行文件（.exe/.com）。
 * CreateProcess 对裸命令名自动补 .exe，但不会执行 .cmd/.bat shim。用 where 解析，
 * 仅命中 shim 时抛错并 fail-closed，而不是退回 shell 派生。`sourceEnv` 只取定位
 * 所需的少量变量；测试可注入受控 PATH。非 Windows 平台不得调用本函数。
 */
export function resolveWindowsAgentCommand(command, sourceEnv = process.env) {
  const env = {};
  for (const name of AGENT_PROBE_ENV_NAMES) {
    if (sourceEnv[name] !== undefined) env[name] = sourceEnv[name];
  }
  const systemRoot = env.SystemRoot ?? env.SYSTEMROOT ?? "C:\\Windows";
  const where = path.join(systemRoot, "System32", "where.exe");
  const result = spawnSync(where, [command], { encoding: "utf8", env });
  if (result.status !== 0) return command;
  const candidates = result.stdout
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const executable = candidates.find((entry) => /\.(exe|com)$/i.test(entry));
  if (!executable) {
    throw new Error(
      `${command} 在 PATH 上只有 .cmd/.bat shim；Node ≥ 20.12.2 禁止无 shell spawn ` +
        "（CVE-2024-27980），且不能为绕过限制引入 shell 注入面。" +
        `请安装原生 ${command} 可执行文件，或显式设置 UNITARY_DOCS_HOOK_SKIP=1 紧急跳过。`,
    );
  }
  return executable;
}

export const VALIDATORS = Object.freeze({
  "docs-corpus": Object.freeze([[VP, "run", "docs:llm:check"]]),
  "docs-contracts": Object.freeze([
    [
      VP,
      "run",
      "test",
      "tests/component-api-registry.test.ts",
      "tests/component-doc-completeness.test.ts",
      "tests/changelog-contract.test.ts",
      "tests/docs-i18n-parity.test.ts",
      "tests/llm-docs-export.test.ts",
      "tests/ai-docs-prompt-contract.test.ts",
    ],
  ]),
  "styleguide-screenshots": Object.freeze([
    [VP, "run", "docs:readme:screenshots:check"],
  ]),
});

export const CONTEXT_PROVIDER_IDS = Object.freeze(["docs-push"]);

/**
 * Windows CreateProcess caps the whole command line near 32k characters. A
 * first branch push renders the entire tree into the runtime context (~55k
 * bytes here), which used to overflow argv and fail `spawn codex` with
 * ENAMETOOLONG. Prompts above this threshold are delivered via stdin instead.
 */
export const PROMPT_STDIN_THRESHOLD = 8000;

export function promptViaStdin(prompt) {
  return prompt.length > PROMPT_STDIN_THRESHOLD;
}

function git(repoRoot, args, options = {}) {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", ...options });
  if (result.error) throw result.error;
  return result;
}

function gitOrThrow(repoRoot, args, options) {
  const result = git(repoRoot, args, options);
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

export function globToRegExp(glob) {
  const normalized = glob.replaceAll("\\", "/");
  const pattern = normalized
    .split("/")
    .map((segment) => {
      if (segment === "**") return "(?:.+?)";
      return segment.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
    })
    .join("/");
  return new RegExp(`^${pattern}$`);
}

export function matchesAny(filePath, globs) {
  const normalized = filePath.replaceAll("\\", "/");
  return globs.some((glob) => {
    if (glob.endsWith("/**")) {
      const prefix = glob.slice(0, -3);
      if (normalized.startsWith(`${prefix}/`)) return true;
    }
    return globToRegExp(glob).test(normalized);
  });
}

function statusEntries(repoRoot, options = {}) {
  const { includeUntracked = false } = options;
  const args = ["status", "--porcelain=v1", "-z", "--no-renames"];
  if (includeUntracked) args.push("--untracked-files=all");
  const output = gitOrThrow(repoRoot, args);
  const entries = [];
  for (const record of output.split("\0")) {
    if (!record) continue;
    const xy = record.slice(0, 2);
    const file = record.slice(3);
    if (xy === "??" && !includeUntracked) continue;
    if (xy.trim()) entries.push({ xy, file });
  }
  return entries;
}

function hashFile(filePath) {
  if (!existsSync(filePath)) return null;
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function snapshotUntrackedFiles(repoRoot) {
  const snapshot = new Map();
  for (const entry of statusEntries(repoRoot, { includeUntracked: true })) {
    if (entry.xy === "??") snapshot.set(entry.file, hashFile(path.join(repoRoot, entry.file)));
  }
  return snapshot;
}

function changedWorktreePaths(repoRoot, beforeUntracked) {
  const afterEntries = statusEntries(repoRoot, { includeUntracked: true });
  const changed = new Set();
  const afterUntracked = new Set();
  for (const entry of afterEntries) {
    if (entry.xy !== "??") {
      changed.add(entry.file);
      continue;
    }
    afterUntracked.add(entry.file);
    const currentHash = hashFile(path.join(repoRoot, entry.file));
    if (!beforeUntracked.has(entry.file) || beforeUntracked.get(entry.file) !== currentHash) {
      changed.add(entry.file);
    }
  }
  for (const file of beforeUntracked.keys()) {
    if (!afterUntracked.has(file)) changed.add(file);
  }
  return [...changed].sort();
}

function snapshotGitMetadata(repoRoot) {
  const gitPaths = ["config", "packed-refs"].map((name) =>
    gitOrThrow(repoRoot, ["rev-parse", "--git-path", name]).trim(),
  );
  return {
    head: gitOrThrow(repoRoot, ["rev-parse", "HEAD"]).trim(),
    refs: gitOrThrow(repoRoot, ["for-each-ref", "--format=%(refname) %(objectname)"]),
    index: gitOrThrow(repoRoot, ["ls-files", "--stage", "-v", "-z"]),
    files: gitPaths.map((file) => [file, hashFile(path.resolve(repoRoot, file))]),
  };
}

function gitMetadataChanged(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

export function validateTaskCapabilities(task) {
  for (const validatorId of task.validators ?? []) {
    if (!Object.hasOwn(VALIDATORS, validatorId)) {
      throw new Error(`unknown validator: ${validatorId}`);
    }
  }
}

function assertProductionAgentTemplate(config) {
  const agent = config.agent;
  const valid = agent.command === "codex" && agent.codexCli === true && agent.ephemeral === true;
  if (!valid) {
    throw new Error(
      "production execution requires the fixed Codex exec template with non-interactive and ephemeral mode",
    );
  }
}

/**
 * 共享的 Codex exec 参数构造：生产分支与 testMode 分支必须逐字节一致，避免两份副本漂移。
 * - workspace-write：任务允许写 allowlist 内文件（docs/** 等）
 * - --color never：stdout 被 runner 捕获，禁用 ANSI 防污染
 * - reasoning effort 经 -c model_reasoning_effort 覆盖（Codex 无 --thinking 旗标）
 * - provider：-c model_provider 选择 provider；当配置同时给出 baseUrl 与 apiKeyEnv 时，
 *   再用一组 -c 覆盖完整描述该 provider（name/base_url/env_key/wire_api），使 Codex 不依赖
 *   用户级 config.toml 也能路由。codex-cli 0.153.0 已移除 chat wire_api，仅支持
 *   responses（实测 wire_api="chat" 在加载 config 阶段直接报错），故显式写 responses。
 * - prompt：arg 模式作位置参数；stdin 模式不传位置参数——codex exec 无位置参数时自动从
 *   stdin 读取，与 PROMPT_STDIN_THRESHOLD 机制天然兼容
 */
function buildCodexArgs(agent, prompt, promptVia) {
  const args = ["exec", "--sandbox", "workspace-write", "--skip-git-repo-check", "--color", "never"];
  if (agent.provider) {
    args.push("-c", `model_provider="${agent.provider}"`);
    if (agent.baseUrl && agent.apiKeyEnv) {
      const prefix = `model_providers.${agent.provider}`;
      args.push("-c", `${prefix}.name="${agent.provider}"`);
      args.push("-c", `${prefix}.base_url="${agent.baseUrl}"`);
      args.push("-c", `${prefix}.env_key="${agent.apiKeyEnv}"`);
      args.push("-c", `${prefix}.wire_api="responses"`);
    }
  }
  args.push("--model", agent.model);
  if (agent.thinking) {
    args.push("-c", `model_reasoning_effort="${agent.thinking}"`);
  }
  if (promptVia === "arg") args.push(prompt);
  return args;
}

export function buildAgentArgs(config, prompt, options = {}) {
  const { testMode = false, promptVia = "arg" } = options;
  const agent = config.agent;
  if (!testMode) {
    assertProductionAgentTemplate(config);
    return buildCodexArgs(agent, prompt, promptVia);
  }

  if (agent.codexCli) {
    return buildCodexArgs(agent, prompt, promptVia);
  }
  const args = [...(agent.subcommand ?? [])];
  if (promptVia === "arg") args.push(prompt);
  return args;
}

/**
 * 允许透传给 agent 子进程的环境变量白名单。
 * 逐项显式列出，禁止通配或按 `*_API_KEY` 后缀批量放行——只放行当前 provider 所需的
 * 凭据变量（当前为 DeepSeek 的 DEEPSEEK_API_KEY，见 .agents/runner.config.json 的
 * agent.apiKeyEnv）。父进程其它密钥（GITHUB_TOKEN、AWS_SECRET_ACCESS_KEY 等）必须被剥离。
 */
export const AGENT_ENV_ALLOWLIST = Object.freeze([
  "PATH",
  "PATHEXT",
  "SYSTEMROOT",
  "SystemRoot",
  "WINDIR",
  "COMSPEC",
  "ComSpec",
  "HOME",
  "USERPROFILE",
  "LOCALAPPDATA",
  "APPDATA",
  "TEMP",
  "TMP",
  "LANG",
  "LC_ALL",
  "TERM",
  "NO_COLOR",
  "FORCE_COLOR",
  // MCP servers may need the user's configured outbound proxy. These are
  // transport settings, not credentials, and must reach the isolated agent.
  "ALL_PROXY",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "NO_PROXY",
  "all_proxy",
  "http_proxy",
  "https_proxy",
  "no_proxy",
  "DEEPSEEK_API_KEY",
]);

export function buildAgentEnvironment(sourceEnv = process.env, options = {}) {
  const env = {};
  for (const name of AGENT_ENV_ALLOWLIST) {
    if (sourceEnv[name] !== undefined) env[name] = sourceEnv[name];
  }
  if (options.testMode) {
    for (const [name, value] of Object.entries(sourceEnv)) {
      if (name.startsWith("FAKE_AGENT_") && value !== undefined) env[name] = value;
    }
  }
  env.GIT_TERMINAL_PROMPT = "0";
  env.GCM_INTERACTIVE = "never";
  return env;
}

export function waitForAgentExit(child, timeoutMs, getOutput) {
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill("SIGKILL");
  }, timeoutMs);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.stdout.destroy();
      child.stderr.destroy();
      resolve(result);
    };

    child.once("error", (error) => {
      const { stdout, stderr } = getOutput();
      finish({ ok: false, code: null, error, stdout, stderr, timedOut });
    });
    // `close` waits for every process that inherited stdout/stderr. The agent
    // CLI can leave a helper holding those pipes after it has exited, which
    // makes pre-push wait until the outer timeout. The agent's own `exit` is the
    // execution boundary; destroy our pipe readers once that process is done.
    child.once("exit", (code) => {
      const { stdout, stderr } = getOutput();
      finish({ ok: code === 0 && !timedOut, code, error: null, stdout, stderr, timedOut });
    });
  });
}

async function runAgent({ repoRoot, runnerConfig, prompt, testMode, testEnvironment }) {
  const agent = runnerConfig.agent;
  const viaStdin = promptViaStdin(prompt);
  const args = buildAgentArgs(runnerConfig, prompt, {
    testMode,
    promptVia: viaStdin ? "stdin" : "arg",
  });
  const sourceEnv = { ...process.env, ...(testEnvironment ?? {}) };
  const agentExecutable = testMode
    ? agent.command
    : process.platform === "win32"
      ? resolveWindowsAgentCommand(AGENT_COMMAND, sourceEnv)
      : AGENT_COMMAND;
  const child = spawn(agentExecutable, args, {
    cwd: repoRoot,
    stdio: [viaStdin ? "pipe" : "ignore", "pipe", "pipe"],
    env: buildAgentEnvironment(sourceEnv, { testMode }),
  });
  const release = child.pid ? leasePackageLockProcess(child.pid) : () => {};

  if (viaStdin) {
    child.stdin.write(prompt);
    child.stdin.end();
  }

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const interrupt = () => child.kill("SIGINT");
  const terminate = () => child.kill("SIGTERM");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", terminate);
  try {
    return await waitForAgentExit(child, agent.timeoutMs ?? 1800000, () => ({ stdout, stderr }));
  } finally {
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", terminate);
    release();
  }
}

function runValidators(repoRoot, validatorIds, options = {}) {
  if (options.testMode) {
    if (Number(options.testValidationExit ?? 0) !== 0) {
      throw new Error(
        `deterministic validation failed with test status ${options.testValidationExit}`,
      );
    }
    return validatorIds.map((id) => ({ id, status: 0 }));
  }

  const results = [];
  for (const validatorId of validatorIds) {
    for (const command of VALIDATORS[validatorId]) {
      const [executable, ...args] = command;
      const result = spawnSync(executable, args, {
        cwd: repoRoot,
        encoding: "utf8",
        env: process.env,
      });
      if (result.status !== 0) {
        throw new Error(
          `deterministic validator ${validatorId} failed with status ${result.status ?? "error"}`,
        );
      }
    }
    results.push({ id: validatorId, status: 0 });
  }
  return results;
}

function writeSanitizedRunRecord(repoRoot, record) {
  const directory = path.join(repoRoot, ".scratch", "llm-runs", record.task);
  mkdirSync(directory, { recursive: true });
  const runId = `${new Date().toISOString().replaceAll(":", "-")}-${process.pid}`;
  const filePath = path.join(directory, `${runId}.json`);
  writeFileSync(filePath, `${JSON.stringify({ schemaVersion: 1, ...record }, null, 2)}\n`);
  return filePath;
}

export async function runTask(options) {
  return withPackageLock(options.repoRoot, "docs-agent", () => runTaskExclusively(options));
}

async function runTaskExclusively(options) {
  const {
    repoRoot,
    resolvedTask,
    runnerConfig,
    runtimeContext,
    testMode = false,
    testEnvironment,
    testValidationExit,
    writeRunRecord = true,
  } = options;

  validateTaskCapabilities(resolvedTask);
  if (!runnerConfig.enabled) throw new Error("LLM runner is disabled");
  if (!testMode) assertProductionAgentTemplate(runnerConfig);

  const dirtyTracked = statusEntries(repoRoot).map((entry) => entry.file);
  if (dirtyTracked.length > 0) {
    throw new Error(`worktree has tracked changes: ${dirtyTracked.join(", ")}`);
  }

  const rendered = renderTaskPrompt(repoRoot, resolvedTask, runtimeContext);
  const baselineUntracked = snapshotUntrackedFiles(repoRoot);
  const baselineMetadata = snapshotGitMetadata(repoRoot);
  const agentResult = await runAgent({
    repoRoot,
    runnerConfig,
    prompt: rendered.text,
    testMode,
    testEnvironment,
  });

  if (!agentResult.ok) {
    if (agentResult.timedOut) throw new Error("agent timed out");
    throw new Error(
      `agent exited with status ${agentResult.code ?? "error"}; raw output suppressed`,
    );
  }

  if (gitMetadataChanged(baselineMetadata, snapshotGitMetadata(repoRoot))) {
    throw new Error("agent modified HEAD, refs, index, or repository configuration");
  }

  const changedPaths = changedWorktreePaths(repoRoot, baselineUntracked);
  const unauthorized = changedPaths.filter(
    (file) => !matchesAny(file, resolvedTask.allowedWriteGlobs),
  );
  if (unauthorized.length > 0) {
    throw new Error(`agent modified paths outside the allowlist: ${unauthorized.join(", ")}`);
  }

  const validation = runValidators(repoRoot, resolvedTask.validators, {
    testMode,
    testValidationExit,
  });
  const status = changedPaths.length > 0 ? 2 : 0;
  let runRecordPath = null;
  if (writeRunRecord) {
    runRecordPath = writeSanitizedRunRecord(repoRoot, {
      task: resolvedTask.id,
      taskVersion: resolvedTask.version,
      model: runnerConfig.agent.model,
      promptBundleHash: rendered.promptBundleHash,
      renderedPromptHash: rendered.renderedPromptHash,
      mode: runtimeContext.mode,
      validatorIds: [...resolvedTask.validators],
      result: status === 2 ? "changed" : "passed",
    });
  }

  return { status, changedPaths, validation, runRecordPath };
}
