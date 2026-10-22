import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readlinkSync } from "node:fs";
import path from "node:path";

export function verificationGit(root, args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`git ${args[0]} failed (exit ${result.status ?? "error"})`);
  return result.stdout;
}

const nul = (text) => text.split("\0").filter(Boolean);

/** --name-status -z has separate status/path records, including BOTH rename paths. */
export function parseChangedPaths(text) {
  const records = nul(text);
  const changes = [];
  for (let index = 0; index < records.length;) {
    const status = records[index++];
    if (!/^[ACDMRTUXB][0-9]*$/.test(status)) throw new Error("Malformed Git change status");
    const file = records[index++];
    if (!file) throw new Error("Missing Git change path");
    if (/^[RC]/.test(status)) {
      const next = records[index++];
      if (!next) throw new Error("Missing Git rename destination");
      changes.push({ status: status[0], file, next });
    } else changes.push({ status: status[0], file });
  }
  return changes;
}

export function verificationFiles(root) {
  return [
    ...new Set(
      nul(verificationGit(root, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])),
    ),
  ].sort();
}

export function verificationContext(root, base) {
  const head = verificationGit(root, ["rev-parse", "--verify", "HEAD^{commit}"]).trim();
  const ref = base
    ? verificationGit(root, [
        "rev-parse",
        "--verify",
        "--end-of-options",
        `${base}^{commit}`,
      ]).trim()
    : head;
  const comparison = base ? verificationGit(root, ["merge-base", head, ref]).trim() : head;
  const committed = parseChangedPaths(
    verificationGit(root, [
      "diff",
      "--name-status",
      "-z",
      "--find-renames",
      comparison,
      head,
      "--",
    ]),
  );
  const staged = parseChangedPaths(
    verificationGit(root, [
      "diff",
      "--cached",
      "--name-status",
      "-z",
      "--find-renames",
      head,
      "--",
    ]),
  );
  const unstaged = parseChangedPaths(
    verificationGit(root, ["diff", "--name-status", "-z", "--find-renames", "--"]),
  );
  const untracked = nul(
    verificationGit(root, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ).map((file) => ({ status: "A", file }));
  const changes = [...committed, ...staged, ...unstaged, ...untracked];
  return {
    head,
    comparison,
    changes,
    paths: [...new Set(changes.flatMap(({ file, next }) => (next ? [file, next] : [file])))].sort(),
  };
}

/** Select task-owned changes; preserve rename/copy pairs and report every excluded path. */
export function selectVerificationContext(context, requestedPaths = []) {
  if (!requestedPaths.length) return { ...context, excludedPaths: [] };
  const selected = new Set();
  for (const requested of requestedPaths) {
    const file = path.posix.normalize(requested.replaceAll("\\", "/"));
    if (!context.paths.includes(file))
      throw new Error(`Verification path is not changed in the selected comparison: ${JSON.stringify(requested)}`);
    if (selected.has(file)) throw new Error(`Repeated verification path: ${JSON.stringify(file)}`);
    selected.add(file);
  }
  let previousSize;
  do {
    previousSize = selected.size;
    for (const { file, next } of context.changes) {
      if (next && (selected.has(file) || selected.has(next))) {
        selected.add(file);
        selected.add(next);
      }
    }
  } while (selected.size !== previousSize);
  return {
    ...context,
    changes: context.changes.filter(({ file, next }) => selected.has(file) || selected.has(next)),
    paths: context.paths.filter((file) => selected.has(file)),
    excludedPaths: context.paths.filter((file) => !selected.has(file)),
  };
}

/** Hash contents, file identities and HEAD; ignored reports/caches never invalidate evidence. */
export function verificationFingerprint(root) {
  const hash = createHash("sha256");
  hash.update(verificationGit(root, ["rev-parse", "--verify", "HEAD^{commit}"]));
  for (const file of verificationFiles(root)) {
    hash.update(`${file}\0`);
    try {
      const absolute = path.join(root, file);
      const stat = lstatSync(absolute);
      hash.update(`${stat.mode}\0`);
      if (stat.isSymbolicLink()) hash.update(readlinkSync(absolute));
      else if (stat.isFile()) hash.update(readFileSync(absolute));
      else hash.update("directory");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      hash.update("missing");
    }
    hash.update("\0");
  }
  return hash.digest("hex");
}
