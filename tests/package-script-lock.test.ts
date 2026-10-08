// @vitest-environment node
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { afterEach, describe, expect, it } from "vitest";
import { LOCKED_PACKAGE_SCRIPTS } from "../scripts/lib/locked-package-scripts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = path.join(ROOT, "tests/fixtures/package-lock-worker.mjs");
const roots: string[] = [];
const children: ChildProcess[] = [];
const adopted: number[] = [];

function temporaryRepo() {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), "unitary-lock-test-")));
  roots.push(root);
  return root;
}

function lockDirectory(root: string, resource = "checks") {
  const digest = createHash("sha256").update(root).digest("hex");
  return path.join(os.tmpdir(), "unitary-ui-package-locks", digest, `${resource}.lock`);
}

function worker(root: string, name: string, mode = "work", resource = "checks", extraEnv = {}) {
  const child = spawn(process.execPath, [WORKER, root, resource, name, mode], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...extraEnv },
  });
  children.push(child);
  let stderr = "";
  child.stderr!.on("data", (chunk) => {
    stderr += chunk;
  });
  const completed = new Promise<number | null>((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  return { child, completed, stderr: () => stderr };
}

async function until(predicate: () => boolean) {
  const deadline = Date.now() + 10_000;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error("Timed out waiting for lock fixture");
    await delay(25);
  }
}

function release(root: string, name: string) {
  writeFileSync(path.join(root, `${name}.release`), "release");
}

function events(root: string) {
  return readFileSync(path.join(root, "events.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as { name: string; event: string });
}

afterEach(async () => {
  for (const child of children.splice(0)) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await new Promise((resolve) => child.once("exit", resolve));
    }
  }
  for (const pid of adopted.splice(0)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      /* already exited */
    }
  }
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("package script process locks", () => {
  it("blocks a contender until a live owner completes, even with an old lock timestamp", async () => {
    const root = temporaryRepo();
    const first = worker(root, "first", "hold");
    await until(() => existsSync(path.join(root, "first.ready")));
    const old = new Date(0);
    utimesSync(lockDirectory(root), old, old);
    const second = worker(root, "second");
    await until(() => second.stderr().includes("waiting for checks"));
    expect(second.child.exitCode).toBeNull();
    expect(existsSync(path.join(root, "second.ready"))).toBe(false);
    release(root, "first");
    expect(await first.completed).toBe(0);
    expect(await second.completed).toBe(0);
    expect(events(root).map(({ name, event }) => `${name}:${event}`)).toEqual([
      "first:start",
      "first:end",
      "second:start",
      "second:end",
    ]);
    expect(existsSync(lockDirectory(root))).toBe(false);
  });

  it("serializes simultaneous processes and simultaneous stale-lock recovery", async () => {
    const root = temporaryRepo();
    const dead = worker(root, "dead", "hold");
    await until(() => existsSync(path.join(root, "dead.ready")));
    dead.child.kill("SIGKILL");
    await dead.completed;
    const contenders = Array.from({ length: 6 }, (_, index) => worker(root, `run-${index}`));
    const statuses = await Promise.all(contenders.map(({ completed }) => completed));
    expect(statuses, contenders.map(({ stderr }) => stderr()).join("\n")).toEqual([
      0, 0, 0, 0, 0, 0,
    ]);
    const runs = events(root).filter(({ name }) => name !== "dead");
    for (let index = 0; index < runs.length; index += 2) {
      expect(runs[index].event).toBe("start");
      expect(runs[index + 1]).toEqual({ name: runs[index].name, event: "end" });
    }
  });

  it("keeps independent checkouts and resources independent", async () => {
    const root = temporaryRepo();
    const other = temporaryRepo();
    const workers = [
      worker(root, "first", "hold"),
      worker(root, "other", "hold", "other"),
      worker(other, "checkout", "hold"),
    ];
    await until(
      () =>
        existsSync(path.join(root, "first.ready")) &&
        existsSync(path.join(root, "other.ready")) &&
        existsSync(path.join(other, "checkout.ready")),
    );
    release(root, "first");
    release(root, "other");
    release(other, "checkout");
    expect(await Promise.all(workers.map(({ completed }) => completed))).toEqual([0, 0, 0]);
  });

  it("supports in-process and child-process reentrancy without self-deadlock", async () => {
    const root = temporaryRepo();
    const nested = worker(root, "nested", "nested");
    expect(await nested.completed).toBe(0);
    expect(nested.stderr()).not.toContain("waiting");
    expect(events(root).map(({ event }) => event)).toEqual(["start", "start", "end", "end"]);
  });

  it("does not reclaim a killed wrapper's lock while its child is alive", async () => {
    const root = temporaryRepo();
    const parent = worker(root, "parent", "parent");
    await until(() => existsSync(path.join(root, "parent.child-ready")));
    adopted.push(Number(readFileSync(path.join(root, "parent.child-ready"), "utf8")));
    parent.child.kill("SIGKILL");
    await parent.completed;
    const contender = worker(root, "contender");
    await until(() => contender.stderr().includes("waiting"));
    expect(existsSync(path.join(root, "contender.ready"))).toBe(false);
    release(root, "parent-child");
    expect(await contender.completed).toBe(0);
    const log = events(root);
    expect(
      log.findIndex(({ name, event }) => name === "parent-child" && event === "end"),
    ).toBeLessThan(log.findIndex(({ name }) => name === "contender"));
  });

  it("ignores forged or stale inherited lock tokens", async () => {
    const root = temporaryRepo();
    const first = worker(root, "first", "hold");
    await until(() => existsSync(path.join(root, "first.ready")));
    const second = worker(root, "second", "work", "checks", {
      UNITARY_PACKAGE_LOCKS: JSON.stringify([{ root, resource: "checks", token: "forged" }]),
    });
    await until(() => second.stderr().includes("waiting"));
    expect(existsSync(path.join(root, "second.ready"))).toBe(false);
    release(root, "first");
    expect(await first.completed).toBe(0);
    expect(await second.completed).toBe(0);
  });

  it("releases after failure and refuses malformed lock metadata without deleting it", async () => {
    const root = temporaryRepo();
    expect(await worker(root, "fail", "fail").completed).toBe(1);
    expect(await worker(root, "next").completed).toBe(0);
    const directory = lockDirectory(root);
    mkdirSync(directory);
    writeFileSync(path.join(directory, "unknown.txt"), "keep");
    const invalid = worker(root, "invalid");
    expect(await invalid.completed).toBe(1);
    expect(invalid.stderr()).toContain("Invalid package lock member");
    expect(readFileSync(path.join(directory, "unknown.txt"), "utf8")).toBe("keep");
    rmSync(directory, { recursive: true });
  });
});

describe("locked package command entrypoints", () => {
  it("routes every registered command through the lock runner", () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
    for (const name of Object.keys(LOCKED_PACKAGE_SCRIPTS)) {
      expect(pkg.scripts[name]).toBe(`node scripts/run-locked-script.mjs ${name}`);
    }
  });

  it("preserves nested command ordering, literal argv, and the failing tool's exit code", () => {
    const root = temporaryRepo();
    mkdirSync(path.join(root, "scripts/lib"), { recursive: true });
    for (const file of [
      "run-locked-script.mjs",
      "lib/locked-package-scripts.mjs",
      "lib/package-script-lock.mjs",
      "lib/package-command.mjs",
    ]) {
      cpSync(path.join(ROOT, "scripts", file), path.join(root, "scripts", file));
    }
    writeFileSync(
      path.join(root, "scripts/generate-token-catalog.mjs"),
      `import { appendFileSync } from 'node:fs'; appendFileSync('steps.txt', 'tokens\\n');`,
    );
    mkdirSync(path.join(root, "node_modules/typescript"), { recursive: true });
    writeFileSync(
      path.join(root, "node_modules/typescript/package.json"),
      JSON.stringify({ bin: { tsc: "cli.mjs" } }),
    );
    writeFileSync(
      path.join(root, "node_modules/typescript/cli.mjs"),
      `import { writeFileSync } from 'node:fs'; writeFileSync('args.json', JSON.stringify(process.argv.slice(2))); process.exit(7);`,
    );
    const args = ["with spaces", "a&b", "$(literal)", 'quote"value'];
    const result = spawnSync(
      process.execPath,
      [path.join(root, "scripts/run-locked-script.mjs"), "typecheck", "--", ...args],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    expect(result.status, result.stderr).toBe(7);
    expect(readFileSync(path.join(root, "steps.txt"), "utf8")).toBe("tokens\n");
    expect(JSON.parse(readFileSync(path.join(root, "args.json"), "utf8"))).toEqual(["-b", ...args]);
    expect(existsSync(lockDirectory(root, "workspace-checks"))).toBe(false);
  });
});
