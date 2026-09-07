#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { loadRunnerConfig, resolveTask, validateAllTasks } from "./lib/llm-task-contract.mjs";
import { CONTEXT_PROVIDER_IDS, VALIDATORS, runTask } from "./lib/llm-task-runner.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VALIDATOR_IDS = Object.freeze(Object.keys(VALIDATORS));

function fail(message) {
  process.stderr.write(`[llm-task] ${message}\n`);
  process.exitCode = 1;
}

function validateRepositoryTasks() {
  return validateAllTasks(REPO_ROOT, {
    validatorIds: VALIDATOR_IDS,
    contextProviderIds: CONTEXT_PROVIDER_IDS,
  });
}

function dryRunMetadata(task, runnerConfig) {
  return {
    task: task.id,
    taskVersion: task.version,
    description: task.description,
    manifestPath: task.manifestPath,
    fragmentPaths: task.fragmentPaths,
    fragmentHashes: task.fragmentHashes,
    promptBundleHash: task.promptBundleHash,
    contextProvider: task.contextProvider,
    impactGlobs: task.impactGlobs,
    allowedWriteGlobs: task.allowedWriteGlobs,
    validators: task.validators,
    agent: {
      command: runnerConfig.agent.command,
      model: runnerConfig.agent.model,
      reasoningEffort: runnerConfig.agent.reasoningEffort,
    },
  };
}

async function main(argv) {
  if (argv.length === 1 && argv[0] === "list") {
    for (const task of validateRepositoryTasks()) {
      process.stdout.write(`${task.id}\tv${task.version}\t${task.description}\n`);
    }
    return;
  }

  if (argv.length === 1 && argv[0] === "check") {
    const tasks = validateRepositoryTasks();
    process.stdout.write(`validated ${tasks.length} LLM task${tasks.length === 1 ? "" : "s"}\n`);
    return;
  }

  if (argv.length !== 2) {
    throw new Error(
      "usage: run-llm-task.mjs list | check | <task-id> --dry-run | <task-id> --manual",
    );
  }

  const [taskId, mode] = argv;
  if (mode !== "--dry-run" && mode !== "--manual") {
    throw new Error(`unknown option for ${taskId}: ${mode}`);
  }

  validateRepositoryTasks();
  const task = resolveTask(REPO_ROOT, taskId);
  const runnerConfig = loadRunnerConfig(REPO_ROOT);

  if (mode === "--dry-run") {
    process.stdout.write(`${JSON.stringify(dryRunMetadata(task, runnerConfig), null, 2)}\n`);
    return;
  }

  const result = await runTask({
    repoRoot: REPO_ROOT,
    resolvedTask: task,
    runnerConfig,
    runtimeContext: {
      mode: "manual",
      note: "No push context is available. Review the documentation tree for drift.",
    },
  });
  if (result.status === 2) {
    process.stderr.write(
      `[llm-task] ${task.id} updated allowlisted files; review and commit them manually:\n${result.changedPaths
        .map((file) => `  ${file}`)
        .join("\n")}\n`,
    );
    process.exitCode = 2;
    return;
  }
  process.stderr.write(`[llm-task] ${task.id} completed with no documentation drift.\n`);
}

const rawArgs = process.argv.slice(2);
const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;

main(args).catch((error) => fail(error.message));
