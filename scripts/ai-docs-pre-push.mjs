#!/usr/bin/env node
/**
 * Thin pre-push adapter for the canonical `docs-update` LLM task.
 *
 * The versioned task package owns prompts, impact paths, write boundaries,
 * and validators. This adapter only converts Git pre-push stdin into bounded,
 * redacted runtime context and delegates execution to the generic runner.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { loadRunnerConfig, resolveTask } from "./lib/llm-task-contract.mjs";
import { matchesAny, runTask } from "./lib/llm-task-runner.mjs";
import { assertPushedCheckout, parsePushedRefs, pushedPaths } from "./lib/pre-push-context.mjs";

const SCRIPT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_ENV = "UNITARY_DOCS_HOOK_SKIP";
const CONFIG_OVERRIDE_ENV = "UNITARY_DOCS_AGENT_CONFIG";
const TEST_MODE =
  process.env.NODE_ENV === "test" && process.env.UNITARY_DOCS_AGENT_TEST_MODE === "1";
const ROOT = TEST_MODE
  ? path.resolve(process.env.UNITARY_DOCS_HOOK_REPO_ROOT ?? process.cwd())
  : process.cwd();

function fail(message) {
  process.stderr.write(`[ai-docs-pre-push] ${message}\n`);
  process.exitCode = 1;
}

function loadHookRunnerConfig() {
  if (!TEST_MODE && process.env[CONFIG_OVERRIDE_ENV]) {
    throw new Error(
      `${CONFIG_OVERRIDE_ENV} is test-only; production uses .agents/runner.config.json`,
    );
  }
  if (TEST_MODE && process.env[CONFIG_OVERRIDE_ENV]) {
    return JSON.parse(readFileSync(process.env[CONFIG_OVERRIDE_ENV], "utf8"));
  }
  return loadRunnerConfig(SCRIPT_REPO_ROOT);
}

function buildRuntimeContext(task, refs, remoteName) {
  const affectedRefs = [];
  for (const ref of refs) {
    const changedPaths = pushedPaths(ROOT, ref);
    const impactPaths = changedPaths.filter((file) => matchesAny(file, task.impactGlobs));
    if (impactPaths.length === 0) {
      process.stderr.write(`[ai-docs-pre-push] ${ref.localRef}: 无文档影响路径，快速通过。\n`);
      continue;
    }
    affectedRefs.push({ ...ref, changedPaths, impactPaths });
  }
  if (affectedRefs.length === 0) return null;
  return {
    mode: "pre-push",
    remote: { name: remoteName || "origin", url: "(redacted)" },
    refs: affectedRefs,
  };
}

async function main() {
  if (process.env[SKIP_ENV] === "1") {
    process.stderr.write(
      "[ai-docs-pre-push] ⚠️ UNITARY_DOCS_HOOK_SKIP=1：已跳过 AI 文档同步；这不代表验证通过。\n",
    );
    return;
  }

  const task = resolveTask(SCRIPT_REPO_ROOT, "docs-update");
  const refs = parsePushedRefs(readFileSync(0, "utf8"));
  if (refs.length === 0) {
    throw new Error("pre-push 未提供 ref 更新记录，拒绝在未知推送范围下运行");
  }
  const runtimeContext = buildRuntimeContext(task, refs, process.argv[2]);
  if (!runtimeContext) return;
  assertPushedCheckout(
    ROOT,
    runtimeContext.refs,
    (file) => matchesAny(file, task.impactGlobs) || matchesAny(file, task.allowedWriteGlobs),
  );

  const runnerConfig = loadHookRunnerConfig();
  if (!runnerConfig.enabled) {
    throw new Error(
      "LLM runner is disabled for an impacted push; use UNITARY_DOCS_HOOK_SKIP=1 only for an explicit emergency bypass",
    );
  }

  const result = await runTask({
    repoRoot: ROOT,
    resolvedTask: task,
    runnerConfig,
    runtimeContext,
    testMode: TEST_MODE,
    testEnvironment: TEST_MODE ? process.env : undefined,
    testValidationExit: TEST_MODE
      ? Number(process.env.UNITARY_DOCS_AGENT_TEST_VALIDATION_EXIT ?? 0)
      : undefined,
    writeRunRecord: !TEST_MODE,
  });

  if (result.status === 2) {
    process.stderr.write(
      `[ai-docs-pre-push] Agent 更新了以下文档，请审查并提交后重新推送:\n${result.changedPaths
        .map((file) => `  ${file}`)
        .join("\n")}\n本次 push 已中止；不会自动提交，也不会自动再次推送。\n`,
    );
    process.exitCode = 2;
    return;
  }
  process.stderr.write("[ai-docs-pre-push] 文档已同步，校验通过，放行。\n");
}

main().catch((error) => fail(error.message));
