#!/usr/bin/env node
/**
 * fake-doc-agent.mjs —— 测试用假 agent（模拟 pi print 的参数形态）。
 * 通过环境变量控制行为：
 *   FAKE_AGENT_EXIT        进程退出码（默认 0）
 *   FAKE_AGENT_TOUCH       逗号分隔的相对路径列表；对每个路径执行追加写入
 *   FAKE_AGENT_REFRESH_INDEX  只刷新指定跟踪文件的 index stat 缓存
 *   FAKE_AGENT_STAGE       修改并暂存指定跟踪文件
 *   FAKE_AGENT_SLEEP_MS    运行前等待毫秒（用于超时测试）
 *   FAKE_AGENT_DUMP_TOKEN  若为 1，向 stdout 打印伪造凭据（用于泄露检测）
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, statSync, utimesSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sleepMs = Number(process.env.FAKE_AGENT_SLEEP_MS ?? 0);
if (sleepMs > 0) {
  await new Promise((resolve) => setTimeout(resolve, sleepMs));
}

if (process.env.FAKE_AGENT_ASSERT_ENV_ABSENT) {
  const variable = process.env.FAKE_AGENT_ASSERT_ENV_ABSENT;
  if (process.env[variable] !== undefined) {
    process.stderr.write(`unexpected inherited env: ${variable}\n`);
    process.exit(11);
  }
}

if (process.env.FAKE_AGENT_STDERR) {
  process.stderr.write(`${process.env.FAKE_AGENT_STDERR}\n`);
}

if (process.env.FAKE_AGENT_DUMP_TOKEN === "1") {
  process.stdout.write("sk-fake-token-1234567890abcdef\n");
}

if (process.env.FAKE_AGENT_MARKER) {
  appendFileSync(process.env.FAKE_AGENT_MARKER, `invoked ${process.pid}\n`);
}

if (process.env.FAKE_AGENT_PROMPT_OUT) {
  // piCli=false 时，固定 prompt + 动态上下文作为最后一个参数传入；
  // FAKE_AGENT_PROMPT_STDIN=1 时改为从 stdin 读取（模拟超大 prompt 走 stdin）。
  if (process.env.FAKE_AGENT_PROMPT_STDIN === "1") {
    const stdin = await new Promise((resolve) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => {
        data += chunk;
      });
      process.stdin.on("end", () => resolve(data));
    });
    mkdirSync(path.dirname(process.env.FAKE_AGENT_PROMPT_OUT), { recursive: true });
    appendFileSync(process.env.FAKE_AGENT_PROMPT_OUT, stdin);
  } else {
    const prompt = process.argv[process.argv.length - 1] ?? "";
    mkdirSync(path.dirname(process.env.FAKE_AGENT_PROMPT_OUT), { recursive: true });
    appendFileSync(process.env.FAKE_AGENT_PROMPT_OUT, prompt);
  }
}

if (process.env.FAKE_AGENT_REFRESH_INDEX) {
  const target = path.join(root, process.env.FAKE_AGENT_REFRESH_INDEX);
  const { atime } = statSync(target);
  utimesSync(target, atime, new Date(Date.now() + 60_000));
  const refreshed = spawnSync("git", ["status", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
  });
  if (refreshed.status !== 0) {
    process.stderr.write(refreshed.stderr);
    process.exit(refreshed.status ?? 12);
  }
}

const touchList = (process.env.FAKE_AGENT_TOUCH ?? "")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

for (const target of touchList) {
  const filePath = path.join(root, target);
  mkdirSync(path.dirname(filePath), { recursive: true });
  appendFileSync(filePath, `fake agent edit ${new Date().toISOString()}\n`);
}

if (process.env.FAKE_AGENT_STAGE) {
  const target = process.env.FAKE_AGENT_STAGE;
  appendFileSync(path.join(root, target), "fake staged edit\n");
  const staged = spawnSync("git", ["add", "--", target], { cwd: root, encoding: "utf8" });
  if (staged.status !== 0) {
    process.stderr.write(staged.stderr);
    process.exit(staged.status ?? 13);
  }
}

process.stderr.write(`fake-doc-agent touched ${touchList.length} path(s)\n`);
process.exit(Number(process.env.FAKE_AGENT_EXIT ?? 0));
