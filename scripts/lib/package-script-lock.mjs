import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const ENV = "UNITARY_PACKAGE_LOCKS";
const heldLocks = new AsyncLocalStorage();
const vanished = (error) => error.code === "ENOENT";

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") return false;
    if (error.code === "EPERM") return true;
    throw error;
  }
}

function members(directory, root) {
  let files;
  try {
    files = readdirSync(directory);
  } catch (error) {
    // Pending deletion on Windows can be reported as EPERM/EACCES instead of
    // ENOENT. Treat it as an unreadable snapshot and retry acquisition; the
    // nonempty destination still prevents ownership from being overwritten.
    if (["ENOENT", "EPERM", "EACCES"].includes(error.code)) return [];
    throw error;
  }
  return files.flatMap((file) => {
    // Unknown/corrupt locks fail closed; never remove arbitrary files.
    if (!/^(?:owner|lease)-[0-9a-f-]{36}\.json$/.test(file)) {
      throw new Error(`Invalid package lock member: ${directory}`);
    }
    let member;
    try {
      member = JSON.parse(readFileSync(path.join(directory, file), "utf8"));
    } catch (error) {
      if (["ENOENT", "EPERM", "EACCES"].includes(error.code)) return [];
      throw error;
    }
    if (
      member.root !== root ||
      member.host !== os.hostname() ||
      !Number.isSafeInteger(member.pid) ||
      member.pid <= 0 ||
      !/^[0-9a-f-]{36}$/.test(member.token)
    ) {
      throw new Error(`Invalid package lock owner: ${directory}`);
    }
    return [{ ...member, file }];
  });
}

function removeMember(directory, file) {
  try {
    unlinkSync(path.join(directory, file));
  } catch (error) {
    if (!vanished(error)) throw error;
  }
  try {
    // Never recursively delete a lock. A new owner always publishes a populated
    // directory, so a delayed stale-owner cleanup cannot delete its lock.
    rmdirSync(directory);
  } catch (error) {
    // Windows can report EPERM/EACCES when a competing process has already
    // published the next nonempty directory or still has a directory handle.
    // Leaving an empty directory is safe; acquisition retries/reclaims it.
    if (!["ENOENT", "ENOTEMPTY", "EEXIST", "EPERM", "EACCES"].includes(error.code)) throw error;
  }
}

function addMember(lock, pid) {
  const file = `lease-${randomUUID()}.json`;
  const record = { root: lock.root, host: os.hostname(), pid, token: lock.token };
  // Publish each lease atomically, just like the initial owner directory.
  const temporary = path.join(path.dirname(lock.directory), `${file}.tmp`);
  writeFileSync(temporary, JSON.stringify(record), { flag: "wx" });
  try {
    renameSync(temporary, path.join(lock.directory, file));
  } catch (error) {
    try {
      unlinkSync(temporary);
    } catch (cleanupError) {
      if (!vanished(cleanupError))
        throw new AggregateError([error, cleanupError], "Cannot publish package lock lease");
    }
    throw error;
  }
  return () => removeMember(lock.directory, file);
}

/** Forward only verified lock identities to child scripts, without mutating process.env. */
export function packageLockEnvironment() {
  const locks = heldLocks.getStore();
  return {
    ...process.env,
    ...(locks
      ? {
          [ENV]: JSON.stringify(
            [...locks.values()].map(({ root, resource, token }) => ({ root, resource, token })),
          ),
        }
      : {}),
  };
}

/** Keep a lock held if a wrapper dies while its tool process is still working. */
export function leasePackageLockProcess(pid) {
  const releases = [...(heldLocks.getStore()?.values() ?? [])].map((lock) => addMember(lock, pid));
  return () => {
    for (const release of releases) release();
  };
}

/** Exclusive per-checkout resource lock. Contenders wait; live owners never expire. */
export async function withPackageLock(repoRoot, resource, operation) {
  if (!/^[a-z][a-z0-9-]*$/.test(resource)) throw new Error("Invalid package lock resource");
  const root = realpathSync(repoRoot);
  const key = `${root}\0${resource}`;
  const local = heldLocks.getStore();
  if (local?.has(key)) return operation();
  const digest = createHash("sha256").update(root).digest("hex");
  const parent = path.join(os.tmpdir(), "unitary-ui-package-locks", digest);
  const directory = path.join(parent, `${resource}.lock`);
  mkdirSync(parent, { recursive: true });

  let inherited = [];
  try {
    inherited = JSON.parse(process.env[ENV] ?? "[]");
  } catch {
    /* stale/invalid env is not a bypass */
  }
  const identity = Array.isArray(inherited)
    ? inherited.find((entry) => entry?.root === root && entry?.resource === resource)
    : undefined;
  const current = identity ? members(directory, root) : [];
  let lock;
  let release;
  if (identity && current.some((entry) => entry.token === identity.token && alive(entry.pid))) {
    lock = { root, resource, directory, token: identity.token };
    release = addMember(lock, process.pid);
  } else {
    const token = randomUUID();
    const candidate = mkdtempSync(path.join(parent, `${resource}.candidate-`));
    const file = `owner-${token}.json`;
    writeFileSync(
      path.join(candidate, file),
      JSON.stringify({ root, host: os.hostname(), pid: process.pid, token }),
    );
    const cleanupCandidate = () => removeMember(candidate, file);
    process.once("exit", cleanupCandidate);
    let waiting = false;
    let missingTargetFailures = 0;
    try {
      for (;;) {
        try {
          // Atomic rename publishes a COMPLETE, nonempty directory. There is no
          // mkdir/owner-write gap for another contender to reclaim incorrectly.
          renameSync(candidate, directory);
          lock = { root, resource, directory, token };
          release = () => removeMember(directory, file);
          if (waiting) process.stderr.write(`[package-lock] acquired ${resource}; continuing\n`);
          break;
        } catch (error) {
          if (!["EEXIST", "ENOTEMPTY", "EPERM", "EACCES"].includes(error.code)) throw error;
          const owners = members(directory, root);
          if (owners.length === 0) {
            // An empty directory can remain after an interrupted release.
            try {
              rmdirSync(directory);
            } catch (cleanupError) {
              if (!["ENOENT", "ENOTEMPTY", "EEXIST", "EPERM", "EACCES"].includes(cleanupError.code))
                throw cleanupError;
            }
            if (["EPERM", "EACCES"].includes(error.code)) {
              // Windows reports EPERM for an occupied destination. The owner
              // may release it before members() reads it; retry the rename,
              // rather than treating that normal race as a permission failure.
              // Repeated failures WITHOUT an owner still fail closed.
              missingTargetFailures += 1;
              if (missingTargetFailures >= 20) throw error;
            }
          } else {
            missingTargetFailures = 0;
            if (!owners.some((owner) => alive(owner.pid))) {
              for (const owner of owners) removeMember(directory, owner.file);
            }
          }
          if (!waiting) {
            process.stderr.write(
              `[package-lock] waiting for ${resource}; another process owns the lock\n`,
            );
            waiting = true;
          }
          await delay(100);
        }
      }
    } finally {
      process.removeListener("exit", cleanupCandidate);
      cleanupCandidate();
    }
  }
  const locks = new Map(local ?? []);
  locks.set(key, lock);
  process.once("exit", release);
  try {
    return await heldLocks.run(locks, operation);
  } finally {
    process.removeListener("exit", release);
    release();
  }
}
