#!/usr/bin/env node
/**
 * ai-docs-pre-push.mjs —— 可配置 AI 文档更新 runner。
 *
 * 安全合同（不可由配置覆盖）：
 * - prompt 固定读取 tracked 文件 docs/llm/update-prompt.md，配置无法替换；
 * - 使用 spawn 参数数组，绝不拼接 shell 字符串；
 * - 不读取、不传递、不打印任何凭据；
 * - Agent 执行前后比较 `git status --porcelain=v1 -z`，越权写入立即失败；
 * - 合法文档产生 diff 时以非零退出中止 push，绝不自动 commit / push；
 * - 超时强制终止。
 *
 * 退出码：
 *   0  无需更新或文档已同步且校验通过；
 *   1  配置/环境错误、越权写入、校验失败；
 *   2  Agent 产生合法文档改动，需人工审查后重新推送。
 * 紧急跳过显式打印警告并返回 0，确保 Git 的 skip 通道语义可用。
 */

import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
// 安全合同：schema 与固定 prompt 与版本化仓库绑定（脚本目录推导），
// 不接受环境变量替换工作根或安全指令。
const SCRIPT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "docs-agent.config.json");
const SCHEMA_PATH = path.join(SCRIPT_REPO_ROOT, "docs-agent.schema.json");
const PROMPT_PATH = path.join(SCRIPT_REPO_ROOT, "docs/llm/update-prompt.md");
const CONFIG_OVERRIDE_ENV = "UNITARY_DOCS_AGENT_CONFIG";
const SKIP_ENV = "UNITARY_DOCS_HOOK_SKIP";
const TEST_MODE =
  process.env.NODE_ENV === "test" && process.env.UNITARY_DOCS_AGENT_TEST_MODE === "1";
const VP_COMMAND = process.platform === "win32" ? "vp.exe" : "vp";
const FIXED_VALIDATION_COMMANDS = [
  [VP_COMMAND, "run", "docs:llm:check"],
  [
    VP_COMMAND,
    "exec",
    "vitest",
    "run",
    "tests/component-api-registry.test.ts",
    "tests/component-doc-completeness.test.ts",
    "tests/changelog-contract.test.ts",
    "tests/docs-i18n-parity.test.ts",
    "tests/llm-docs-export.test.ts",
    "tests/ai-docs-prompt-contract.test.ts",
  ],
];

function fail(code, message) {
  process.stderr.write(`[ai-docs-pre-push] ${message}\n`);
  process.exit(code);
}

function git(args, options = {}) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", ...options });
  if (result.error) throw result.error;
  return result;
}

function gitOrThrow(args, options) {
  const result = git(args, options);
  if (result.status !== 0) {
    fail(1, `git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

async function loadConfig() {
  if (!TEST_MODE && process.env[CONFIG_OVERRIDE_ENV]) {
    fail(1, `${CONFIG_OVERRIDE_ENV} 仅允许测试使用；生产 hook 固定读取仓库配置。`);
  }
  const configPath = TEST_MODE ? (process.env[CONFIG_OVERRIDE_ENV] ?? CONFIG_PATH) : CONFIG_PATH;
  if (!existsSync(configPath)) {
    fail(1, `配置文件不存在: ${configPath}`);
  }
  let config;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    fail(1, `配置 JSON 解析失败: ${error.message}`);
  }

  // 使用仓库内置 ajv 校验；禁止未知字段、空 command、危险模式。
  const AjvModule = await import("ajv").catch(() => null);
  if (!AjvModule) {
    fail(1, "无法加载 ajv，配置校验不可用（拒绝继续）。");
  }
  const Ajv = AjvModule.default ?? AjvModule;
  const ajv = new Ajv({ allErrors: true, strict: true });
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
  const validate = ajv.compile(schema);
  if (!validate(config)) {
    const details = validate.errors
      .map((error) => `${error.instancePath || "/"} ${error.message}`)
      .join("; ");
    fail(1, `配置不符合 docs-agent.schema.json: ${details}`);
  }
  // --sandbox 与 --approve-for-me 互斥（approve-for-me 隐含 workspace-write 沙箱）。
  // ajv strict 模式不允许在 not 中写 required，故在代码层校验。
  if (config.agent?.sandbox && config.agent?.approvalMode) {
    fail(
      1,
      "配置错误: agent.sandbox 与 agent.approvalMode 互斥（--approve-for-me 已隐含 workspace-write 沙箱），只能配置其一。",
    );
  }
  if (!TEST_MODE) {
    const agent = config.agent;
    const productionTemplateValid =
      agent.command === "codex" &&
      agent.codexCli === true &&
      JSON.stringify(agent.subcommand ?? ["exec"]) === JSON.stringify(["exec"]) &&
      agent.sandbox === undefined &&
      agent.approvalMode === "approve-for-me" &&
      agent.ephemeral === true;
    if (!productionTemplateValid) {
      fail(
        1,
        "生产 hook 只允许固定 Codex exec 模板（codexCli、approve-for-me、ephemeral）；拒绝任意 executable 或参数模板。",
      );
    }
  }
  return config;
}

function readPushedRefsFromStdin() {
  // pre-push stdin: "<local ref> <local sha> <remote ref> <remote sha>\n" 每行一条。
  const refs = [];
  const data = readFileSync(0, "utf8");
  for (const line of data.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length === 4) {
      refs.push({
        localRef: parts[0],
        localSha: parts[1],
        remoteRef: parts[2],
        remoteSha: parts[3],
      });
    }
  }
  return refs;
}

function changedPathsBetween(remoteSha, localSha) {
  const base = /^0+$/.test(remoteSha)
    ? gitOrThrow(["rev-list", "--max-parents=0", localSha]).trim()
    : remoteSha;
  return gitOrThrow(["diff", "--name-only", "-z", base, localSha]).split("\0").filter(Boolean);
}

function globToRegExp(glob) {
  // 支持 ** 与 *；路径分隔符统一为 /。
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

function matchesAny(filePath, globs) {
  const normalized = filePath.replaceAll("\\", "/");
  return globs.some((glob) => {
    const re = globToRegExp(glob);
    // ** 结尾目录形式（如 docs/llm/pages/**）允许匹配前缀
    if (glob.endsWith("/**")) {
      const prefix = glob.slice(0, -3);
      if (normalized.startsWith(prefix + "/")) return true;
    }
    return re.test(normalized);
  });
}

function statusEntries(options = {}) {
  const { includeUntracked = false } = options;
  const args = ["status", "--porcelain=v1", "-z", "--no-renames"];
  if (includeUntracked) args.push("--untracked-files=all");
  const output = gitOrThrow(args);
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

function porcelainStatus(options = {}) {
  return statusEntries(options).map((entry) => entry.file);
}

function hashFile(filePath) {
  if (!existsSync(filePath)) return null;
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function snapshotUntrackedFiles() {
  const snapshot = new Map();
  for (const entry of statusEntries({ includeUntracked: true })) {
    if (entry.xy === "??") snapshot.set(entry.file, hashFile(path.join(ROOT, entry.file)));
  }
  return snapshot;
}

function changedWorktreePaths(beforeUntracked) {
  const afterEntries = statusEntries({ includeUntracked: true });
  const changed = new Set();
  const afterUntracked = new Set();
  for (const entry of afterEntries) {
    if (entry.xy !== "??") {
      changed.add(entry.file);
      continue;
    }
    afterUntracked.add(entry.file);
    const currentHash = hashFile(path.join(ROOT, entry.file));
    if (!beforeUntracked.has(entry.file) || beforeUntracked.get(entry.file) !== currentHash) {
      changed.add(entry.file);
    }
  }
  for (const file of beforeUntracked.keys()) {
    if (!afterUntracked.has(file)) changed.add(file);
  }
  return [...changed];
}

function snapshotGitMetadata() {
  const gitPaths = ["config", "index", "packed-refs"].map((name) =>
    gitOrThrow(["rev-parse", "--git-path", name]).trim(),
  );
  return {
    head: gitOrThrow(["rev-parse", "HEAD"]).trim(),
    refs: gitOrThrow(["for-each-ref", "--format=%(refname) %(objectname)"]),
    files: gitPaths.map((file) => [file, hashFile(path.resolve(ROOT, file))]),
  };
}

function gitMetadataChanged(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

function buildAgentArgs(config, promptWithRefs) {
  const agent = config.agent;
  if (!TEST_MODE) {
    const args = ["exec", "-m", agent.model];
    if (agent.reasoningEffort) args.push("-c", `model_reasoning_effort="${agent.reasoningEffort}"`);
    args.push("--approve-for-me", "--ephemeral", "-C", ".", promptWithRefs);
    return args;
  }
  if (agent.codexCli) {
    const args = [...(agent.subcommand ?? ["exec"])];
    args.push("-m", agent.model);
    if (agent.reasoningEffort) args.push("-c", `model_reasoning_effort="${agent.reasoningEffort}"`);
    // --approve-for-me 自身隐含 workspace-write 沙箱，与 --sandbox 互斥；
    // 配置同时给出两者会被 schema 拒绝，这里仍做防御。
    if (agent.sandbox && !agent.approvalMode) args.push("--sandbox", agent.sandbox);
    if (agent.approvalMode) args.push("--approve-for-me");
    if (agent.ephemeral) args.push("--ephemeral");
    args.push("-C", ".");
    args.push(promptWithRefs);
    return args;
  }
  return [...(agent.subcommand ?? []), promptWithRefs];
}

function buildAgentEnvironment() {
  const allowed = [
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
  ];
  const env = {};
  for (const name of allowed) {
    if (process.env[name] !== undefined) env[name] = process.env[name];
  }
  if (TEST_MODE) {
    for (const [name, value] of Object.entries(process.env)) {
      if (name.startsWith("FAKE_AGENT_") && value !== undefined) env[name] = value;
    }
  }
  env.GIT_TERMINAL_PROMPT = "0";
  env.GCM_INTERACTIVE = "never";
  return env;
}

function runAgent(config, promptWithRefs) {
  const agent = config.agent;
  const args = buildAgentArgs(config, promptWithRefs);
  const child = spawn(TEST_MODE ? agent.command : "codex", args, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: buildAgentEnvironment(),
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const timeoutMs = agent.timeoutMs ?? 1800000;
  const timer = setTimeout(() => {
    process.stderr.write(`[ai-docs-pre-push] Agent 超时（${timeoutMs}ms），强制终止。\n`);
    child.kill("SIGKILL");
  }, timeoutMs);

  return new Promise((resolve) => {
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ ok: false, code: null, error, stdout, stderr });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, code, error: null, stdout, stderr });
    });
  });
}

function runValidationCommands() {
  if (TEST_MODE) {
    const status = Number(process.env.UNITARY_DOCS_AGENT_TEST_VALIDATION_EXIT ?? 0);
    if (status !== 0) fail(1, `固定确定性校验失败（测试退出码 ${status}）。`);
    return;
  }
  for (const command of FIXED_VALIDATION_COMMANDS) {
    const [cmd, ...args] = command;
    const result = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", env: process.env });
    if (result.status !== 0) {
      fail(1, `固定确定性校验失败: ${command.join(" ")}（退出码 ${result.status ?? "error"}）。`);
    }
  }
}

async function main() {
  const manual = process.argv.includes("--manual");

  if (process.env[SKIP_ENV] === "1") {
    process.stderr.write(
      "[ai-docs-pre-push] ⚠️ 警告：UNITARY_DOCS_HOOK_SKIP=1 已设置，跳过 AI 文档同步。" +
        "这不代表验证通过；仅用于 Agent 服务中断的紧急通道。\n",
    );
    process.exit(0);
  }

  const config = await loadConfig();
  if (!config.enabled && !manual) {
    process.stderr.write(
      "[ai-docs-pre-push] 配置 enabled=false，跳过（仅 --manual 模式可强制执行）。\n",
    );
    process.exit(0);
  }

  // 读取固定英文 prompt；配置不能替换。
  if (!existsSync(PROMPT_PATH)) {
    fail(1, `固定 prompt 缺失: ${PROMPT_PATH}`);
  }
  const fixedPrompt = readFileSync(PROMPT_PATH, "utf8");

  // 干净工作区要求（允许 .hermes/ 等 ignored 报告）。
  const dirty = porcelainStatus();
  if (dirty.length > 0) {
    fail(1, `工作区不干净，请先提交或暂存改动:\n${dirty.map((f) => `  ${f}`).join("\n")}`);
  }

  let dynamicContext = "";
  if (!manual) {
    const refs = readPushedRefsFromStdin();
    if (refs.length === 0) {
      fail(1, "pre-push 未提供 ref 更新记录，拒绝在未知推送范围下运行。");
    }
    const contextBlocks = [];
    for (const ref of refs) {
      const changed = changedPathsBetween(ref.remoteSha, ref.localSha);
      const impact = changed.filter((file) => matchesAny(file, config.impactGlobs));
      if (impact.length === 0) {
        process.stderr.write(`[ai-docs-pre-push] ${ref.localRef}: 无文档影响路径，快速通过。\n`);
        continue;
      }
      contextBlocks.push(
        [
          `REMOTE NAME: origin`,
          `REMOTE URL (redacted): (omitted)`,
          `LOCAL REF / LOCAL SHA: ${ref.localRef} / ${ref.localSha}`,
          `REMOTE REF / REMOTE SHA: ${ref.remoteRef} / ${ref.remoteSha}`,
          `CHANGED PATHS:\n${changed.map((f) => `  ${f}`).join("\n") || "  (none)"}`,
          `IMPACT PATHS (match impactGlobs):\n${impact.map((f) => `  ${f}`).join("\n") || "  (none)"}`,
        ].join("\n"),
      );
    }
    if (contextBlocks.length === 0) {
      process.exit(0);
    }
    dynamicContext = `\n\n---\n\n${contextBlocks.join("\n\n")}\n`;
  } else {
    dynamicContext =
      "\n\n---\n\nMANUAL MODE: no push context; review the documentation tree for drift.\n";
  }

  const promptWithRefs = fixedPrompt + dynamicContext;

  // Agent 执行前同时固定未跟踪文件内容和 Git 元数据。
  const baselineUntracked = snapshotUntrackedFiles();
  const baselineGitMetadata = snapshotGitMetadata();

  const result = await runAgent(config, promptWithRefs);
  if (!result.ok) {
    fail(1, `Agent 退出码非零 (${result.code ?? "error"})；原始输出已抑制，避免泄露凭据。`);
  }

  if (gitMetadataChanged(baselineGitMetadata, snapshotGitMetadata())) {
    fail(1, "Agent 修改了 HEAD、refs、index 或仓库配置；拒绝自动提交/推送链路。 ");
  }

  // Agent 执行后比较 tracked 与既存/新增未跟踪文件内容。
  const changedByAgent = changedWorktreePaths(baselineUntracked);
  const unauthorized = changedByAgent.filter((file) => !matchesAny(file, config.allowedWriteGlobs));
  if (unauthorized.length > 0) {
    fail(1, `Agent 越权修改允许范围之外的路径:\n${unauthorized.map((f) => `  ${f}`).join("\n")}`);
  }

  if (changedByAgent.length > 0) {
    runValidationCommands();
    process.stderr.write(
      `[ai-docs-pre-push] Agent 更新了以下文档，请审查并提交后重新推送:\n${changedByAgent
        .map((f) => `  ${f}`)
        .join("\n")}\n` + "本次 push 已中止；不会自动提交，也不会自动再次推送。\n",
    );
    process.exit(2);
  }

  runValidationCommands();
  process.stderr.write("[ai-docs-pre-push] 文档已同步，校验通过，放行。\n");
  process.exit(0);
}

main().catch((error) => fail(1, `未预期错误: ${error.stack ?? error.message}`));
