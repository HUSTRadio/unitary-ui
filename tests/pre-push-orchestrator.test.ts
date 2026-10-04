// @vitest-environment node
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.setConfig({ testTimeout: 60_000 });

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
    `import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const update = process.argv.includes("--update-on-drift");
writeFileSync(process.env.FAKE_SCREENSHOT_CALLED, "called");
if (update && process.env.FAKE_SCREENSHOT_CHECK === "2" && process.env.FAKE_SCREENSHOT_WRITE !== "0") {
  mkdirSync(path.dirname(process.env.FAKE_SCREENSHOT_MARKER), { recursive: true });
  writeFileSync(process.env.FAKE_SCREENSHOT_MARKER, "generated");
}
process.exit(Number(update ? process.env.FAKE_SCREENSHOT_CHECK : process.env.FAKE_SCREENSHOT_VERIFY));
`,
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
  verifyStatus = checkStatus,
  writeScreenshot = true,
  skip = false,
}: {
  dir: string;
  remoteSha: string;
  localSha: string;
  checkStatus: number;
  docsStatus?: number;
  input?: string;
  verifyStatus?: number;
  writeScreenshot?: boolean;
  skip?: boolean;
}) {
  const { screenshot, docs } = makeFakeScripts(dir);
  const screenshotMarker = path.join(dir, "images", "styleguide", "capture.png");
  const screenshotCalled = path.join(dir, "screenshot-called.txt");
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
      FAKE_SCREENSHOT_VERIFY: String(verifyStatus),
      FAKE_SCREENSHOT_WRITE: writeScreenshot ? "1" : "0",
      FAKE_SCREENSHOT_CALLED: screenshotCalled,
      UNITARY_DOCS_HOOK_SKIP: skip ? "1" : "0",
      FAKE_DOCS_EXIT: String(docsStatus),
      FAKE_SCREENSHOT_MARKER: screenshotMarker,
      FAKE_DOCS_MARKER: docsMarker,
    },
  });
  return { result, screenshotMarker, screenshotCalled, docsMarker };
}

afterEach(() => {
  while (cleanups.length) rmSync(cleanups.pop()!, { recursive: true, force: true });
});

describe("统一 pre-push 编排", () => {
  it("并发 hooks 等待完整检查链完成，并保留各自的 stdin", async () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): concurrent gates");
    const screenshot = path.join(dir, "serialized-screenshot.mjs");
    const docs = path.join(dir, "serialized-docs.mjs");
    writeFileSync(
      screenshot,
      `
import { appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
appendFileSync('gates.txt', 'screenshot:' + process.env.GATE_NAME + '\\n');
writeFileSync(process.env.GATE_NAME + '.ready', 'ready');
while (process.env.GATE_NAME === 'first' && !existsSync('release.txt')) await delay(25);
`,
    );
    writeFileSync(
      docs,
      `
import { appendFileSync, readFileSync } from 'node:fs';
appendFileSync('gates.txt', 'docs:' + process.env.GATE_NAME + ':' + readFileSync(0, 'utf8'));
`,
    );
    const input = `refs/heads/main ${localSha} refs/heads/main ${remoteSha}\n`;
    const start = (name: string) => {
      const child = spawn(process.execPath, [RUNNER, "origin", "(redacted)"], {
        cwd: dir,
        env: {
          ...process.env,
          NODE_ENV: "test",
          UNITARY_PRE_PUSH_TEST_MODE: "1",
          UNITARY_PRE_PUSH_SCREENSHOT_SCRIPT: screenshot,
          UNITARY_PRE_PUSH_DOCS_ADAPTER: docs,
          GATE_NAME: name,
        },
        stdio: ["pipe", "ignore", "pipe"],
      });
      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.stdin.end(input);
      const done = new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", resolve);
      });
      return { child, done, stderr: () => stderr };
    };
    const wait = async (predicate: () => boolean) => {
      const deadline = Date.now() + 10_000;
      while (!predicate()) {
        if (Date.now() > deadline) throw new Error("Timed out waiting for concurrent hook");
        await delay(25);
      }
    };
    const first = start("first");
    let second: ReturnType<typeof start> | undefined;
    try {
      await wait(() => existsSync(path.join(dir, "first.ready")));
      second = start("second");
      await wait(() => second!.stderr().includes("waiting for pre-push"));
      expect(existsSync(path.join(dir, "second.ready"))).toBe(false);
      writeFileSync(path.join(dir, "release.txt"), "release");
      expect(await first.done).toBe(0);
      expect(await second.done).toBe(0);
      expect(readFileSync(path.join(dir, "gates.txt"), "utf8")).toBe(
        `screenshot:first\ndocs:first:${input}screenshot:second\ndocs:second:${input}`,
      );
    } finally {
      writeFileSync(path.join(dir, "release.txt"), "release");
      for (const entry of [first, second]) {
        if (entry && entry.child.exitCode === null && entry.child.signalCode === null) {
          entry.child.kill("SIGKILL");
          await entry.done;
        }
      }
    }
  });

  it("漂移更新无改动且只读复核通过时继续推送，不要求空提交", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    const { result, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
      verifyStatus: 0,
      writeScreenshot: false,
    });
    expect(result.status).toBe(0);
    expect(existsSync(docsMarker)).toBe(true);
    expect(result.stderr).toContain("无实际改动");
    expect(result.stderr).not.toContain("git commit");
  });

  it("漂移更新无改动且复核仍漂移时明确报告不稳定，不要求空提交", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    const { result, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
      writeScreenshot: false,
    });
    expect(result.status).toBe(1);
    expect(existsSync(docsMarker)).toBe(false);
    expect(result.stderr).toContain("当前没有可提交的截图变更");
    expect(result.stderr).not.toContain("git commit");
  });

  it("在截图更新前拒绝未提交的已跟踪文件，保留用户修改", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    writeFileSync(path.join(dir, "README.md"), "user edits\n");
    const { result, screenshotCalled, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("worktree has tracked changes");
    expect(existsSync(screenshotCalled)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
    expect(git(dir, ["diff", "--", "README.md"])).toContain("user edits");
  });

  it("在任一 gate 前拒绝会被读取的未跟踪输入文件", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    mkdirSync(path.join(dir, "public"));
    writeFileSync(path.join(dir, "public", "gallery.svg"), "uncommitted image");
    const { result, screenshotCalled, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("public/gallery.svg");
    expect(existsSync(screenshotCalled)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
  });

  it("待推送提交与 HEAD 不一致时拒绝用当前工作区验证", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): first page");
    addCommit(dir, "src/App.tsx", "fix(ui): another page");
    const { result, screenshotCalled, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("pushed commit does not match HEAD");
    expect(existsSync(screenshotCalled)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
  });

  it("拒绝包含不同受影响提交的多 ref push", () => {
    const { dir, remoteSha } = makeRepo();
    const otherSha = addCommit(dir, "src/App.tsx", "fix(ui): first page");
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): another page");
    const { result, screenshotCalled } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 0,
      input: `refs/heads/main ${localSha} refs/heads/main ${remoteSha}\nrefs/heads/other ${otherSha} refs/heads/other ${remoteSha}\n`,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("refs/heads/other");
    expect(existsSync(screenshotCalled)).toBe(false);
  });

  it("显式跳过时不调用 gate，且不宣称验证通过", () => {
    const { dir, remoteSha } = makeRepo();
    const localSha = addCommit(dir, "src/App.tsx", "fix(ui): adjust page");
    const { result, screenshotCalled, docsMarker } = runHook({
      dir,
      remoteSha,
      localSha,
      checkStatus: 2,
      skip: true,
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toContain("这不代表验证通过");
    expect(existsSync(screenshotCalled)).toBe(false);
    expect(existsSync(docsMarker)).toBe(false);
  });

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
