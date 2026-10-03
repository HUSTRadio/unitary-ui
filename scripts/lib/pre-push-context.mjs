import { spawnSync } from "node:child_process";

const ZERO_SHA = /^0+$/;
const OBJECT_ID = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i;

export function pushGit(repoRoot, args, options = {}) {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed with status ${result.status ?? "error"}`);
  }
  return result.stdout;
}

export function parsePushedRefs(input) {
  const refs = [];
  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts.length !== 4) throw new Error(`malformed pre-push ref record: ${line}`);
    const [localRef, localSha, remoteRef, remoteSha] = parts;
    if (!OBJECT_ID.test(localSha) || !OBJECT_ID.test(remoteSha)) {
      throw new Error(`invalid object id in pre-push ref record: ${line}`);
    }
    refs.push({ localRef, localSha, remoteRef, remoteSha });
  }
  return refs;
}

export function pushedPaths(repoRoot, ref) {
  if (ZERO_SHA.test(ref.localSha)) return [];
  // 使用仓库自身的对象格式，兼容 SHA-1 和 SHA-256。 / Respect the repository object format.
  const base = ZERO_SHA.test(ref.remoteSha)
    ? pushGit(repoRoot, ["hash-object", "-t", "tree", "--stdin"], { input: "" }).trim()
    : ref.remoteSha;
  return pushGit(repoRoot, ["diff", "--no-renames", "--name-only", "-z", base, ref.localSha])
    .split("\0")
    .filter(Boolean)
    .sort();
}

export function worktreeChanges(repoRoot) {
  return pushGit(repoRoot, [
    "status",
    "--porcelain=v1",
    "-z",
    "--no-renames",
    "--untracked-files=all",
  ])
    .split("\0")
    .filter(Boolean)
    .map((record) => ({ status: record.slice(0, 2), file: record.slice(3) }));
}

export function assertPushedCheckout(repoRoot, refs, affectsPath) {
  if (refs.length === 0) return;
  const head = pushGit(repoRoot, ["rev-parse", "HEAD"]).trim();
  for (const ref of refs) {
    const commit = pushGit(repoRoot, ["rev-parse", `${ref.localSha}^{commit}`]).trim();
    if (commit !== head) {
      throw new Error(`pushed commit does not match HEAD: ${ref.localRef} (${commit})`);
    }
  }
  const dirty = worktreeChanges(repoRoot).filter(
    (entry) => entry.status !== "??" || affectsPath(entry.file),
  );
  if (dirty.length > 0) {
    throw new Error(
      `worktree has tracked changes or untracked input files: ${dirty.map((entry) => entry.file).join(", ")}`,
    );
  }
}
