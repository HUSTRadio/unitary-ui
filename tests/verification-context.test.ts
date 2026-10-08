// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, renameSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseChangedPaths,
  verificationContext,
  verificationFingerprint,
} from "../scripts/lib/verification-context.mjs";

const roots: string[] = [];
const env = {
  ...process.env,
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_AUTHOR_NAME: "verification",
  GIT_AUTHOR_EMAIL: "verify@example.test",
  GIT_COMMITTER_NAME: "verification",
  GIT_COMMITTER_EMAIL: "verify@example.test",
};
const git = (root: string, ...args: string[]) =>
  execFileSync("git", ["-c", "commit.gpgsign=false", ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...env, GIT_CONFIG_GLOBAL: path.join(root, ".git/no-global-config") },
  });
function repo() {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-context-"));
  roots.push(root);
  git(root, "init", "-q");
  mkdirSync(path.join(root, "src"));
  writeFileSync(path.join(root, "src/one.ts"), "initial one\n");
  writeFileSync(path.join(root, "src/two.ts"), "initial two\n");
  writeFileSync(path.join(root, ".gitignore"), ".scratch/\n");
  git(root, "add", ".");
  git(root, "commit", "-qm", "initial");
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("verification Git inputs", () => {
  it("collects staged, unstaged and untracked changes without splitting special filenames", () => {
    const root = repo();
    const special = "src/中文 space & literal.ts";
    writeFileSync(path.join(root, "src/one.ts"), "staged\n");
    git(root, "add", "src/one.ts");
    writeFileSync(path.join(root, "src/two.ts"), "unstaged\n");
    writeFileSync(path.join(root, special), "untracked\n");
    expect(verificationContext(root).paths).toEqual(["src/one.ts", "src/two.ts", special].sort());
    expect(verificationContext(root).changes).toContainEqual({ status: "A", file: special });
  });

  it("uses merge-base for a supplied ref and includes later working changes", () => {
    const root = repo();
    git(root, "branch", "base");
    writeFileSync(path.join(root, "src/one.ts"), "committed\n");
    git(root, "add", "src/one.ts");
    git(root, "commit", "-qm", "later");
    writeFileSync(path.join(root, "src/two.ts"), "working\n");
    expect(verificationContext(root, "base").paths).toEqual(["src/one.ts", "src/two.ts"]);
    expect(verificationContext(root).paths).toEqual(["src/two.ts"]);
    expect(() => verificationContext(root, "--help")).toThrow("git rev-parse failed");
  });

  it("retains both rename paths and distinguishes deletion from a clean checkout", () => {
    const root = repo();
    expect(verificationContext(root).paths).toEqual([]);
    renameSync(path.join(root, "src/one.ts"), path.join(root, "src/renamed.ts"));
    git(root, "add", "src/one.ts", "src/renamed.ts");
    rmSync(path.join(root, "src/two.ts"));
    const context = verificationContext(root);
    expect(context.changes).toContainEqual({
      status: "R",
      file: "src/one.ts",
      next: "src/renamed.ts",
    });
    expect(context.changes).toContainEqual({ status: "D", file: "src/two.ts" });
  });

  it("fails on invalid Git state and malformed NUL records instead of reporting no changes", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "unitary-verify-not-git-"));
    roots.push(root);
    expect(() => verificationContext(root)).toThrow("git rev-parse failed");
    expect(() => parseChangedPaths("R100\0old\0")).toThrow("Missing Git rename");
    expect(parseChangedPaths("M\0line\nbreak.ts\0")).toEqual([
      { status: "M", file: "line\nbreak.ts" },
    ]);
    expect(() => parseChangedPaths("bad\0file\0")).toThrow("Malformed Git change status");
  });

  it("detects same-size edits, file additions and HEAD changes while ignoring reports", () => {
    const root = repo();
    const initial = verificationFingerprint(root);
    mkdirSync(path.join(root, ".scratch"));
    writeFileSync(path.join(root, ".scratch/report.json"), "{}");
    expect(verificationFingerprint(root)).toBe(initial);
    writeFileSync(path.join(root, "src/one.ts"), "INITIAL ONE\n");
    expect(verificationFingerprint(root)).not.toBe(initial);
    writeFileSync(path.join(root, "src/one.ts"), "initial one\n");
    expect(verificationFingerprint(root)).toBe(initial);
    writeFileSync(path.join(root, "src/new.ts"), "new");
    const withNewFile = verificationFingerprint(root);
    expect(withNewFile).not.toBe(initial);
    git(root, "add", "src/new.ts");
    git(root, "commit", "-qm", "new file");
    expect(verificationFingerprint(root)).not.toBe(withNewFile);
  });
});
