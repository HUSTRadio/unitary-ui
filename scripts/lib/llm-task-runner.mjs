import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { renderTaskPrompt } from "./llm-task-contract.mjs";

const VP = process.platform === "win32" ? "vp.exe" : "vp";

export const VALIDATORS = Object.freeze({
  "docs-corpus": Object.freeze([[VP, "run", "docs:llm:check"]]),
  "docs-contracts": Object.freeze([
    [
      VP,
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
  ]),
});

export const CONTEXT_PROVIDER_IDS = Object.freeze(["docs-push"]);

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
  const gitPaths = ["config", "index", "packed-refs"].map((name) =>
    gitOrThrow(repoRoot, ["rev-parse", "--git-path", name]).trim(),
  );
  return {
    head: gitOrThrow(repoRoot, ["rev-parse", "HEAD"]).trim(),
    refs: gitOrThrow(repoRoot, ["for-each-ref", "--format=%(refname) %(objectname)"]),
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
  const valid =
    agent.command === "codex" &&
    agent.codexCli === true &&
    JSON.stringify(agent.subcommand ?? ["exec"]) === JSON.stringify(["exec"]) &&
    agent.sandbox === undefined &&
    agent.approvalMode === "approve-for-me" &&
    agent.ephemeral === true;
  if (!valid) {
    throw new Error(
      "production execution requires the fixed Codex exec template with approve-for-me and ephemeral mode",
    );
  }
}

export function buildAgentArgs(config, prompt, options = {}) {
  const { testMode = false } = options;
  const agent = config.agent;
  if (!testMode) {
    assertProductionAgentTemplate(config);
    const args = ["exec", "-m", agent.model];
    if (agent.reasoningEffort) {
      args.push("-c", `model_reasoning_effort=\"${agent.reasoningEffort}\"`);
    }
    args.push("--approve-for-me", "--ephemeral", "-C", ".", prompt);
    return args;
  }

  if (agent.codexCli) {
    const args = [...(agent.subcommand ?? ["exec"]), "-m", agent.model];
    if (agent.reasoningEffort) {
      args.push("-c", `model_reasoning_effort=\"${agent.reasoningEffort}\"`);
    }
    if (agent.sandbox && !agent.approvalMode) args.push("--sandbox", agent.sandbox);
    if (agent.approvalMode) args.push("--approve-for-me");
    if (agent.ephemeral) args.push("--ephemeral");
    args.push("-C", ".", prompt);
    return args;
  }
  return [...(agent.subcommand ?? []), prompt];
}

export function buildAgentEnvironment(sourceEnv = process.env, options = {}) {
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

function runAgent({ repoRoot, runnerConfig, prompt, testMode, testEnvironment }) {
  const agent = runnerConfig.agent;
  const args = buildAgentArgs(runnerConfig, prompt, { testMode });
  const sourceEnv = { ...process.env, ...(testEnvironment ?? {}) };
  const child = spawn(testMode ? agent.command : "codex", args, {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: buildAgentEnvironment(sourceEnv, { testMode }),
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
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill("SIGKILL");
  }, timeoutMs);

  return new Promise((resolve) => {
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ ok: false, code: null, error, stdout, stderr, timedOut });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0 && !timedOut, code, error: null, stdout, stderr, timedOut });
    });
  });
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
