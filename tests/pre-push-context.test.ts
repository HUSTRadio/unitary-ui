// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertPushedCheckout,
  parsePushedRefs,
  pushedPaths,
} from "../scripts/lib/pre-push-context.mjs";

const cleanups: string[] = [];
afterEach(() => {
  while (cleanups.length) rmSync(cleanups.pop()!, { recursive: true, force: true });
});

function git(dir: string, args: string[]) {
  const result = spawnSync("git", ["-c", "commit.gpgsign=false", ...args], {
    cwd: dir,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "test",
      GIT_AUTHOR_EMAIL: "test@example.com",
      GIT_COMMITTER_NAME: "test",
      GIT_COMMITTER_EMAIL: "test@example.com",
    },
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

describe("pre-push Git context", () => {
  for (const format of ["sha1", "sha256"]) {
    it(`discovers root files and accepts annotated tags in a ${format} repository`, () => {
      const dir = mkdtempSync(path.join(os.tmpdir(), "unitary-push-context-"));
      cleanups.push(dir);
      git(dir, ["init", "-q", `--object-format=${format}`]);
      writeFileSync(path.join(dir, "input.txt"), "root file");
      git(dir, ["add", "input.txt"]);
      git(dir, ["commit", "-q", "-m", "initial"]);
      git(dir, ["-c", "tag.gpgsign=false", "tag", "-a", "v1", "-m", "v1"]);
      const localSha = git(dir, ["rev-parse", "refs/tags/v1"]);
      const [ref] = parsePushedRefs(
        `refs/tags/v1 ${localSha} refs/tags/v1 ${"0".repeat(localSha.length)}\n`,
      );
      expect(pushedPaths(dir, ref)).toEqual(["input.txt"]);
      expect(() => assertPushedCheckout(dir, [ref], () => true)).not.toThrow();
      expect(pushedPaths(dir, { ...ref, localSha: "0".repeat(localSha.length) })).toEqual([]);
    });
  }

  it("rejects object IDs with intermediate lengths", () => {
    for (const length of [39, 41, 63, 65]) {
      expect(() =>
        parsePushedRefs(`refs/heads/main ${"a".repeat(length)} refs/heads/main ${"0".repeat(40)}`),
      ).toThrow(/invalid object id/);
    }
  });
});
