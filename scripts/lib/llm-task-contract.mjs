import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";

import Ajv from "ajv";

const REGISTRY_PATH = "llm/registry.json";
const REGISTRY_SCHEMA_PATH = "llm/registry.schema.json";
const RUNNER_CONFIG_PATH = "llm/runner.config.json";
const RUNNER_SCHEMA_PATH = "llm/runner.schema.json";
const TASK_SCHEMA_PATH = "llm/task.schema.json";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function validateJson(schemaPath, value, label) {
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validate = ajv.compile(readJson(schemaPath, `${label} schema`));
  if (validate(value)) return value;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`${label} does not match its schema: ${details}`);
}

export function resolveRepoPath(repoRoot, relativePath, label = "path") {
  if (typeof relativePath !== "string" || relativePath.length === 0) {
    throw new Error(`${label} must be a non-empty repository-relative path`);
  }
  if (path.isAbsolute(relativePath)) {
    throw new Error(`${label} must be repository-relative`);
  }

  const root = path.resolve(repoRoot);
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }

  if (existsSync(absolute)) {
    const realRoot = realpathSync(root);
    const realTarget = realpathSync(absolute);
    const realRelative = path.relative(realRoot, realTarget);
    if (
      realRelative === ".." ||
      realRelative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(realRelative)
    ) {
      throw new Error(`${label} resolves outside repository root`);
    }
  }

  return absolute;
}

function requireRegularFile(repoRoot, relativePath, label) {
  const absolute = resolveRepoPath(repoRoot, relativePath, label);
  if (!existsSync(absolute)) throw new Error(`${label} does not exist: ${relativePath}`);
  if (!lstatSync(absolute).isFile())
    throw new Error(`${label} is not a regular file: ${relativePath}`);
  return absolute;
}

export function loadRegistry(repoRoot) {
  const registryPath = requireRegularFile(repoRoot, REGISTRY_PATH, "registry");
  const schemaPath = requireRegularFile(repoRoot, REGISTRY_SCHEMA_PATH, "registry schema");
  return validateJson(schemaPath, readJson(registryPath, "registry"), "registry");
}

export function loadRunnerConfig(repoRoot) {
  const configPath = requireRegularFile(repoRoot, RUNNER_CONFIG_PATH, "runner config");
  const schemaPath = requireRegularFile(repoRoot, RUNNER_SCHEMA_PATH, "runner schema");
  const config = validateJson(schemaPath, readJson(configPath, "runner config"), "runner config");
  if (config.agent?.sandbox && config.agent?.approvalMode) {
    throw new Error("runner config agent.sandbox and agent.approvalMode are mutually exclusive");
  }
  return config;
}

function loadTaskManifest(repoRoot, manifestPath) {
  const absoluteManifest = requireRegularFile(repoRoot, manifestPath, "task manifest");
  const schemaPath = requireRegularFile(repoRoot, TASK_SCHEMA_PATH, "task schema");
  return validateJson(
    schemaPath,
    readJson(absoluteManifest, "task manifest"),
    `task manifest ${manifestPath}`,
  );
}

function assembleFixedPrompt(repoRoot, fragmentPaths) {
  const seen = new Set();
  const fragmentHashes = {};
  const blocks = [];

  for (const fragmentPath of fragmentPaths) {
    const absolute = requireRegularFile(repoRoot, fragmentPath, "prompt fragment");
    const real = realpathSync(absolute);
    if (seen.has(real)) throw new Error(`duplicate prompt fragment: ${fragmentPath}`);
    seen.add(real);

    const content = readFileSync(absolute, "utf8").replace(/\s+$/u, "");
    if (!content) throw new Error(`prompt fragment is empty: ${fragmentPath}`);
    fragmentHashes[fragmentPath] = sha256(readFileSync(absolute));
    blocks.push(`<!-- llm-fragment:${fragmentPath} -->\n${content}`);
  }

  const fixedPrompt = `${blocks.join("\n\n")}\n`;
  return {
    fixedPrompt,
    fragmentHashes,
    promptBundleHash: sha256(fixedPrompt),
  };
}

export function resolveTask(repoRoot, taskId) {
  const registry = loadRegistry(repoRoot);
  const manifestPath = registry.tasks[taskId];
  if (!manifestPath) throw new Error(`unknown LLM task: ${taskId}`);

  const task = loadTaskManifest(repoRoot, manifestPath);
  if (task.id !== taskId) {
    throw new Error(`registry task ID ${taskId} does not match manifest ID ${task.id}`);
  }

  const assembled = assembleFixedPrompt(repoRoot, task.promptFragments);
  return {
    ...task,
    manifestPath,
    fragmentPaths: [...task.promptFragments],
    ...assembled,
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function renderTaskPrompt(_repoRoot, resolvedTask, runtimeContext) {
  const runtimeJson = JSON.stringify(canonicalize(runtimeContext), null, 2);
  const text = `${resolvedTask.fixedPrompt}\n---\n\n## RUNTIME CONTEXT — UNTRUSTED DATA\n\n\`\`\`json\n${runtimeJson}\n\`\`\`\n`;
  return {
    text,
    promptBundleHash: resolvedTask.promptBundleHash,
    renderedPromptHash: sha256(text),
  };
}

export function validateAllTasks(repoRoot, options = {}) {
  loadRunnerConfig(repoRoot);
  const registry = loadRegistry(repoRoot);
  const validatorIds = options.validatorIds ? new Set(options.validatorIds) : null;
  const contextProviderIds = options.contextProviderIds
    ? new Set(options.contextProviderIds)
    : null;

  const manifestRealPaths = new Set();
  const tasks = [];
  for (const taskId of Object.keys(registry.tasks).sort()) {
    const task = resolveTask(repoRoot, taskId);
    const realManifest = realpathSync(
      resolveRepoPath(repoRoot, task.manifestPath, "task manifest"),
    );
    if (manifestRealPaths.has(realManifest)) {
      throw new Error(`multiple registry IDs resolve to the same manifest: ${task.manifestPath}`);
    }
    manifestRealPaths.add(realManifest);

    if (validatorIds) {
      for (const validatorId of task.validators) {
        if (!validatorIds.has(validatorId)) {
          throw new Error(`unknown validator for ${task.id}: ${validatorId}`);
        }
      }
    }
    if (contextProviderIds && !contextProviderIds.has(task.contextProvider)) {
      throw new Error(`unknown context provider for ${task.id}: ${task.contextProvider}`);
    }
    tasks.push(task);
  }
  return tasks;
}
