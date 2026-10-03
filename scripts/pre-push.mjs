#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { affectsScreenshots, classifyScreenshotImpact } from "./lib/pre-push-classifier.mjs";
import {
  assertPushedCheckout,
  parsePushedRefs,
  pushedPaths,
  pushGit,
  worktreeChanges,
} from "./lib/pre-push-context.mjs";
import { resolveTask } from "./lib/llm-task-contract.mjs";
import { matchesAny } from "./lib/llm-task-runner.mjs";

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
  return pushGit(ROOT, args);
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
  const check = runNode(SCREENSHOT_SCRIPT, ["--check", "--update-on-drift"]);
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
  const managedChanges = worktreeChanges(ROOT).filter(({ file }) =>
    /^(?:README(?:\.en)?\.md|images\/styleguide\/.+\.png)$/.test(file),
  );
  if (managedChanges.length === 0) {
    // 没有实际改动时不能要求空提交；只读复核仍失败则报告不稳定。 / Never request an empty commit.
    process.stderr.write("[pre-push] 截图更新后无实际改动，正在只读复核。\n");
    const verify = runNode(SCREENSHOT_SCRIPT, ["--check"]);
    if (verify.stdout) process.stderr.write(verify.stdout);
    if (verify.stderr) process.stderr.write(verify.stderr);
    if (verify.status === 0) return;
    fail(`截图复核失败，状态 ${verify.status ?? "error"}`, {
      missing: "截图结果不稳定或复核没有完成，当前没有可提交的截图变更",
      steps: [
        "pnpm run docs:readme:screenshots:check",
        "根据输出检查图片加载、字体与页面渲染是否稳定",
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
    "如需同步文档与示例，执行 pnpm run docs:agent:update",
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
  const refs = parsePushedRefs(input);
  if (refs.length === 0) {
    process.stderr.write("[pre-push] 没有待推送的 ref，跳过检查。\n");
    return;
  }

  const paths = new Set();
  const commits = [];
  const task = resolveTask(SCRIPT_ROOT, "docs-update");
  const affectsInput = (file) =>
    affectsScreenshots(file) ||
    matchesAny(file, task.impactGlobs) ||
    matchesAny(file, task.allowedWriteGlobs);
  const affectedRefs = [];
  for (const ref of refs) {
    const changed = pushedPaths(ROOT, ref);
    for (const file of changed) paths.add(file);
    if (changed.some(affectsInput)) affectedRefs.push(ref);
    commits.push(...commitMessages(ref));
  }

  assertPushedCheckout(ROOT, affectedRefs, affectsInput);
  runScreenshotGate({ changedPaths: [...paths].sort(), commits });
  assertPushedCheckout(ROOT, affectedRefs, affectsInput);
  runDocsGate(input);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const refInputError = /(?:ref record|object id|ref 更新记录)/i.test(message);
  const checkoutError = /(?:pushed commit does not match HEAD|worktree has tracked changes)/.test(
    message,
  );
  fail(message, {
    missing: "pre-push 自动检查没有完成",
    steps: checkoutError
      ? [
          "git status --short",
          "保存或提交当前改动，确保检出的 HEAD 就是待推送的提交；不同提交的 refs 请分别推送",
          "切换到对应提交后重新执行 git push",
        ]
      : refInputError
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
