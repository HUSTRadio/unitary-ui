#!/usr/bin/env node
/**
 * install-git-hooks.mjs —— 显式安装仓库版本化 git hooks。
 *
 * 行为合同：
 * - 只设置当前仓库的 core.hooksPath=.githooks，绝不修改全局配置；
 * - 若已有其他 hooksPath 值且未传 --force，拒绝安装；
 * - .githooks/pre-push 必须存在且引用 runner，否则拒绝安装；
 * - 不通过 postinstall 静默执行，仅由开发者显式运行。
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEST_MODE =
  process.env.NODE_ENV === "test" && process.env.UNITARY_INSTALL_HOOKS_TEST_MODE === "1";
const rootOverride = process.env.UNITARY_INSTALL_HOOKS_REPO_ROOT;
if (rootOverride && !TEST_MODE) {
  console.error("[install-git-hooks] UNITARY_INSTALL_HOOKS_REPO_ROOT is test-only.");
  process.exit(1);
}
const repoRoot =
  TEST_MODE && rootOverride
    ? path.resolve(rootOverride)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const prePush = path.join(repoRoot, ".githooks", "pre-push");

function fail(code, message) {
  console.error(`[install-git-hooks] ${message}`);
  process.exit(code);
}

if (!existsSync(prePush)) {
  fail(1, "缺少 .githooks/pre-push，拒绝安装。");
}
const content = readFileSync(prePush, "utf8");
if (!content.includes("scripts/pre-push.mjs")) {
  fail(1, ".githooks/pre-push 内容不符合预期（未引用统一 runner），拒绝安装。");
}

const probe = spawnSync("git", ["-C", repoRoot, "config", "--local", "--get", "core.hooksPath"], {
  encoding: "utf8",
});
const current = probe.status === 0 ? probe.stdout.trim().replaceAll("\\", "/") : "";

const force = process.argv.includes("--force");
if (current && current !== ".githooks" && !force) {
  fail(
    1,
    `core.hooksPath 当前为 "${current}"，为避免覆盖你的配置，拒绝自动安装。确认后使用 --force。`,
  );
}

const result = spawnSync(
  "git",
  ["-C", repoRoot, "config", "--local", "core.hooksPath", ".githooks"],
  {
    stdio: "inherit",
  },
);
if (result.status !== 0) {
  fail(result.status ?? 1, "设置 core.hooksPath 失败。");
}
console.log("[install-git-hooks] 已设置 core.hooksPath=.githooks");
