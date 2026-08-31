// @vitest-environment node
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNNER = path.join(ROOT, "scripts", "pre-push.mjs");
const cleanups: string[] = [];

function git(cwd: string, args: string[]) {
  const result = spawnSync("git", ["-c", "commit.gpgsign=false", ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_AUTHOR_NAME: "pre-push-test",
      GIT_AUTHOR_EMAIL: "test@example.com",
      GIT_COMMITTER_NAME: "pre-push-test",
      GIT_COMMITTER_EMAIL: "test@example.com",
    },
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

function makeRepo() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-pre-push-"));
  cleanups.push(dir);
  git(dir, ["init", "-q", "-b", "main"]);
  writeFileSync(path.join(dir, "README.md"), "initial\n");
  git(dir, ["add", "README.md"]);
  git(dir, ["commit", "-q", "-m", "chore: initial"]);
  const remoteSha = git(dir, ["rev-parse", "HEAD"]);
  return { dir, remoteSha };
}

function addCommit(dir: string, rel: string, message: string) {
  const target = path.join(dir, rel);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${message}\n`);
  git(dir, ["add", rel]);
  git(dir, ["commit", "-q", "-m", message]);
  return git(dir, ["rev-parse", "HEAD"]);
}

function makeFakeScripts(dir: string) {
  const screenshot = path.join(dir, "fake-screenshot.mjs");
  const docs = path.join(dir, "fake-docs.mjs");
  writeFileSync(
    screenshot,
    `import { writeFileSync } from "node:fs";\nconst check = process.argv.includes("--check");\nif (check) process.exit(Number(process.env.FAKE_SCREENSHOT_CHECK ?? 0));\nwriteFileSync(process.env.FAKE_SCREENSHOT_MARKER, "generated");\n`,
  );
  writeFileSync(
    docs,
    `import { writeFileSync } from "node:fs";\nwriteFileSync(process.env.FAKE_DOCS_MARKER, "called");\nprocess.exit(Number(process.env.FAKE_DOCS_EXIT ?? 0));\n`,
  );
  return { screenshot, docs };
}

function runHook({
  dir,
  remoteSha,
  localSha,
  checkStatus,
  docsStatus = 0,
  input,
}: {
  dir: string;
  remoteSha: string;
  localSha: string;
  checkStatus: number;
  docsStatus?: number;
  input?: string;
}) {
  const { screenshot, docs } = makeFakeScripts(dir);
  const screenshotMarker = path.join(dir, "screenshot-generated.txt");
  const docsMarker = path.join(dir, "docs-called.txt");
  const result = spawnSync(process.execPath, [RUNNER, "origin", "(redacted)"], {
    cwd: dir,
    input: input ?? `refs/heads/main ${localSha} refs/heads/main ${remoteSha}\n`,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "test",
      UNITARY_PRE_PUSH_TEST_MODE: "1",
      UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT: screenshot,
      UNITARY_PRE_PUSH_DOCS_ADAPTER: docs,
      FAKE_SCREENSHOT_CHECK: String(checkStatus),
      FAKE_DOCS_EXIT: String(docsStatus),
      FAKE_SCREENSHOT_MARKER: screenshotMarker,
      FAKE_DOCS_MARKER: docsMarker,
    },
  });
  return { result, screenshotMarker, docsMarker };
}

afterEach(() => {
  while (cleanups.length) rmSync(cleanups.pop()!, { recursive: true, force: true });
});

describe("统一 pre-push 编排", () => {
  it("截图漂移时生成受管文件、给出固定提交信息，并阻止 LLM gate", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "feat(ui): add page");
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
    });

    expect(result.status).toBe(2);
    expect(existsSync(screenshotMarker)).toBe(true);
    expect(existsSync(docsMarker)).toBe(false);
    expect(result.stderr).toContain('git commit -m "docs: 更新 README 示例截图"');
    expect(result.stderr).toContain("未完成：生成后的 README 截图尚未提交");
  });

  it("截图检查异常时说明缺失步骤和恢复命令", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    const { result, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 7,
    });

    expect(result.status).toBe(1);
    expect(existsSync(docsMarker)).toBe(false);
    expect(result.stderr).toContain("未完成：README 截图漂移检查没有完成");
    expect(result.stderr).toContain("pnpm run docs:readme:screenshots:check");
    expect(result.stderr).toContain("修复后重新执行 git push");
  });

  it("截图无漂移时继续执行现有文档 gate", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(component): correct button");
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
    });

    expect(result.status).toBe(0);
    expect(existsSync(screenshotMarker)).toBe(false);
    expect(existsSync(docsMarker)).toBe(true);
  });

  it("文档 gate 失败时说明未完成的校验和恢复步骤", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(component): correct button");
    const { result, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
      docsStatus: 1,
    });

    expect(result.status).toBe(1);
    expect(existsSync(docsMarker)).toBe(true);
    expect(result.stderr).toContain("未完成：文档同步与确定性校验没有完成");
    expect(result.stderr).toContain("pnpm run llm -- check");
    expect(result.stderr).toContain("pnpm run docs:agent:update");
    expect(result.stderr).not.toContain("pnpm run llm -- docs-update --manual");
    expect(result.stderr).toContain("修复并提交后重新执行 git push");
  });

  it("文档 gate 生成变更时说明必须审查、提交并重推", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "feat(component): add state");
    const { result } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
      docsStatus: 2,
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("未完成：LLM 生成的文档变更尚未审查和提交");
    expect(result.stderr).toContain("git status --short");
    expect(result.stderr).toContain('git commit -m "docs: 同步组件文档"');
    expect(result.stderr).toContain("提交后重新执行 git push");
  });

  it("无视觉路径或 commit 信号时跳过截图并继续文档 gate", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "tests/parser.test.ts", "test(parser): add coverage");
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
    });

    expect(result.status).toBe(0);
    expect(existsSync(screenshotMarker)).toBe(false);
    expect(existsSync(docsMarker)).toBe(true);
    expect(result.stderr).toContain("跳过浏览器检查");
  });

  it("视觉 commit 信号不能覆盖无影响路径", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "tests/parser.test.ts", "feat(ui): test-only coverage");
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
    });

    expect(result.status).toBe(0);
    expect(existsSync(screenshotMarker)).toBe(false);
    expect(existsSync(docsMarker)).toBe(true);
    expect(result.stderr).toContain("无权威影响路径");
  });

  it("没有待推送 ref 时按 Git 的 no-op push 语义放行", () => {
    const { dir, remoteSha } = makeRepo();
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha: remoteSha,
      checkStatus: 0,
      input: "",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("没有待推送的 ref，跳过检查");
    expect(existsSync(screenshotMarker)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
  });

  it("在执行任一 gate 前拒绝格式错误的 ref 记录", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "feat(ui): add page");
    const { result, screenshotMarker, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
      input: `malformed record\nrefs/heads/main ${localSha} refs/heads/main ${remoteSha}\n`,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("malformed pre-push ref record");
    expect(result.stderr).toContain("未完成：pre-push 自动检查没有完成");
    expect(result.stderr).toContain("通过 git push 触发 hook，不要手动构造 ref 输入");
    expect(existsSync(screenshotMarker)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
  });
});
