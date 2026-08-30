#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { classifyScreenshotImpact } from "./lib/pre-push-classifier.mjs";

const ROOT = process.cwd();
const SCRIPT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZERO_SHA = /^0+$/;
const SKIP_ENV = "UNITARY_DOCS_HOOK_SKIP";
const TEST_MODE = process.env.NODE_ENV === "test" && process.env.UNITARY_PRE_PUSH_TEST_MODE === "1";
const SCREENSHOT_SCRIPT =
  TEST_MODE && process.env.UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT
    ? path.resolve(process.env.UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT)
    : path.join(SCRIPT_ROOT, "scripts", "capture-readme-screenshots.mjs");
const DOCS_ADAPTER =
  TEST_MODE && process.env.UNITARY_PRE_PUSH_DOCS_ADAPTER
    ? path.resolve(process.env.UNITARY_PRE_PUSH_DOCS_ADAPTER)
    : path.join(SCRIPT_ROOT, "scripts", "ai-docs-pre-push.mjs");

function printRecovery(missing, steps) {
  process.stderr.write(
    [
      `[pre-push] 未完成：${missing}`,
      "[pre-push] 要继续推送，请执行：",
      ...steps.map((step, index) => `  ${index + 1}. ${step}`),
      "",
    ].join("\n"),
  );
}

function fail(message, options = {}) {
  const {
    status = 1,
    missing = "pre-push 自动检查没有完成",
    steps = [
      "阅读上方错误并修复对应问题",
      "pnpm run docs:readme:screenshots:check",
      "pnpm run llm -- check",
      "修复后重新执行 git push",
    ],
  } = options;
  process.stderr.write(`[pre-push] ${message}\n`);
  printRecovery(missing, steps);
  process.exit(status);
}

function git(args) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed with status ${result.status ?? "error"}`);
  }
  return result.stdout;
}

function parseRefs(input) {
  const refs = [];
  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts.length !== 4) {
      throw new Error(`malformed pre-push ref record: ${line}`);
    }
    const [localRef, localSha, remoteRef, remoteSha] = parts;
    if (!/^[0-9a-f]{40,64}$/i.test(localSha) || !/^[0-9a-f]{40,64}$/i.test(remoteSha)) {
      throw new Error(`invalid object id in pre-push ref record: ${line}`);
    }
    refs.push({ localRef, localSha, remoteRef, remoteSha });
  }
  return refs;
}

function changedPaths(ref) {
  if (ZERO_SHA.test(ref.localSha)) return [];
  const args = ZERO_SHA.test(ref.remoteSha)
    ? [
        "diff",
        "--no-renames",
        "--name-only",
        "-z",
        "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
        ref.localSha,
      ]
    : ["diff", "--no-renames", "--name-only", "-z", ref.remoteSha, ref.localSha];
  return git(args).split("\0").filter(Boolean);
}

function commitMessages(ref) {
  if (ZERO_SHA.test(ref.localSha)) return [];
  const range = ZERO_SHA.test(ref.remoteSha) ? ref.localSha : `${ref.remoteSha}..${ref.localSha}`;
  return git(["log", "--format=%B%x1e", range])
    .split("\x1e")
    .map((message) => message.trim())
    .filter(Boolean);
}

function runNode(script, args, options = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: ROOT,
    encoding: "utf8",
    ...options,
  });
}

function runScreenshotGate(context) {
  const decision = classifyScreenshotImpact(context);
  if (!decision.required) {
    const detail = decision.commitMatch ? "（检测到视觉 commit 信号，但无权威影响路径）" : "";
    process.stderr.write(`[pre-push] README 截图无影响，跳过浏览器检查${detail}。\n`);
    return;
  }

  process.stderr.write(
    `[pre-push] README 截图检查已触发（路径=${decision.pathMatch ? "yes" : "no"}, commit=${decision.commitMatch ? "yes" : "no"}）。\n`,
  );
  const check = runNode(SCREENSHOT_SCRIPT, ["--check"]);
  if (check.stdout) process.stderr.write(check.stdout);
  if (check.status === 0) return;
  if (check.status !== 2) {
    if (check.stderr) process.stderr.write(check.stderr);
    fail(`截图检查失败，状态 ${check.status ?? "error"}`, {
      missing: "README 截图漂移检查没有完成",
      steps: [
        "pnpm run docs:readme:screenshots:check",
        "根据检查输出修复页面、浏览器或截图生成问题",
        "修复后重新执行 git push",
      ],
    });
  }

  if (check.stderr) process.stderr.write(check.stderr);
  process.stderr.write("[pre-push] 检测到截图漂移，正在重新生成受管文件。\n");
  const generate = runNode(SCREENSHOT_SCRIPT, []);
  if (generate.stdout) process.stderr.write(generate.stdout);
  if (generate.status !== 0) {
    if (generate.stderr) process.stderr.write(generate.stderr);
    fail(`截图生成失败，状态 ${generate.status ?? "error"}`, {
      missing: "README 截图没有生成完成",
      steps: [
        "pnpm run docs:readme:screenshots",
        "根据生成输出修复问题并确认 images/styleguide 与 README 受管区块完整",
        "修复后重新执行 git push",
      ],
    });
  }

  process.stderr.write("[pre-push] README 截图已更新，本次 push 已中止。\n");
  printRecovery("生成后的 README 截图尚未提交", [
    "git status --short",
    "git add README.md README.en.md images/styleguide",
    'git commit -m "docs: 更新 README 示例截图"',
    "提交后重新执行 git push",
  ]);
  process.exit(2);
}

function runDocsGate(input) {
  const result = runNode(DOCS_ADAPTER, process.argv.slice(2), {
    input,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (result.error) throw result.error;
  if (result.status === 0) process.exit(0);
  if (result.status === 2) {
    printRecovery("LLM 生成的文档变更尚未审查和提交", [
      "git status --short",
      "审查上方列出的文档变更，并只暂存确认无误的文件",
      "git add <上方列出的文档文件>",
      'git commit -m "docs: 同步组件文档"',
      "提交后重新执行 git push",
    ]);
    process.exit(2);
  }
  printRecovery("文档同步与确定性校验没有完成", [
    "阅读上方 ai-docs-pre-push 错误并修复对应问题",
    "pnpm run llm -- check",
    "如需重新生成文档，执行 pnpm run llm -- docs-update --manual",
    "审查并提交生成的文档",
    "修复并提交后重新执行 git push",
  ]);
  process.exit(result.status ?? 1);
}

function main() {
  if (
    !TEST_MODE &&
    (process.env.UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT || process.env.UNITARY_PRE_PUSH_DOCS_ADAPTER)
  ) {
    fail("runner overrides are test-only", {
      missing: "测试专用 runner override 尚未移除",
      steps: [
        "清除 UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT 与 UNITARY_PRE_PUSH_DOCS_ADAPTER",
        "重新执行 git push",
      ],
    });
  }
  if (process.env[SKIP_ENV] === "1") {
    process.stderr.write(
      "[pre-push] ⚠️ UNITARY_DOCS_HOOK_SKIP=1：已跳过截图与文档检查；这不代表验证通过。\n",
    );
    return;
  }

  const input = readFileSync(0, "utf8");
  const refs = parseRefs(input);
  if (refs.length === 0) {
    process.stderr.write("[pre-push] 没有待推送的 ref，跳过检查。\n");
    return;
  }

  const paths = new Set();
  const commits = [];
  for (const ref of refs) {
    for (const file of changedPaths(ref)) paths.add(file);
    commits.push(...commitMessages(ref));
  }

  runScreenshotGate({ changedPaths: [...paths].sort(), commits });
  runDocsGate(input);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const refInputError = /(?:ref record|object id|ref 更新记录)/i.test(message);
  fail(message, {
    missing: "pre-push 自动检查没有完成",
    steps: refInputError
      ? [
          "通过 git push 触发 hook，不要手动构造 ref 输入",
          "如果正常 git push 仍出现该错误，执行 pnpm run hooks:install 后重试",
        ]
      : [
          "阅读上方错误并修复对应问题",
          "pnpm run docs:readme:screenshots:check",
          "pnpm run llm -- check",
          "修复后重新执行 git push",
        ],
  });
}
