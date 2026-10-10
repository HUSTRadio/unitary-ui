import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { packageCommand } from "./package-command.mjs";
import { leasePackageLockProcess, packageLockEnvironment } from "./package-script-lock.mjs";

const PREFIX = "unitary-readme-preview-";
const ownedDirectories = new Map();
const OUTPUT_LIMIT = 64 * 1024;

/** Remove only this process's fresh build directories, never a caller-selected output. */
export async function cleanupReadmePreview(directory) {
  if (typeof directory !== "string" || !path.isAbsolute(directory)) {
    throw new Error("README preview cleanup requires an owned absolute temporary directory");
  }
  const target = path.resolve(directory);
  const owner = ownedDirectories.get(target);
  if (
    !owner ||
    path.dirname(target) !== owner.parent ||
    !path.basename(target).startsWith(PREFIX)
  ) {
    throw new Error(`Refusing to remove an unowned README preview directory: ${target}`);
  }
  if (owner.cleaned) return;
  let current;
  try {
    current = await fs.lstat(target);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    owner.cleaned = true;
    return;
  }
  if (
    current.isSymbolicLink() ||
    !current.isDirectory() ||
    current.dev !== owner.dev ||
    current.ino !== owner.ino ||
    (await fs.realpath(target)) !== target
  ) {
    throw new Error(`Refusing to remove a replaced README preview directory: ${target}`);
  }
  await fs.rm(target, { recursive: true, force: true });
  owner.cleaned = true;
}

async function build(root, directory) {
  const child = spawn(
    process.execPath,
    packageCommand(root, ["bin", "vite-plus", "vp", "build", "--outDir", directory]),
    {
      cwd: root,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      env: packageLockEnvironment(),
    },
  );
  const release = child.pid ? leasePackageLockProcess(child.pid) : () => {};
  let output = "";
  const collect = (chunk) => {
    output = (output + chunk.toString()).slice(-OUTPUT_LIMIT);
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  const interrupt = () => child.kill("SIGINT");
  const terminate = () => child.kill("SIGTERM");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", terminate);
  try {
    const result = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code, signal) => resolve({ code, signal }));
    });
    if (result.code !== 0) {
      const status = result.signal ? `signal ${result.signal}` : `exit ${result.code}`;
      throw new Error(`README preview build failed (${status})${output ? `:\n${output.trim()}` : ""}`);
    }
  } catch (error) {
    if (error.message.startsWith("README preview build failed")) throw error;
    throw new Error(`Cannot run README preview build: ${error.message}`, { cause: error });
  } finally {
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", terminate);
    release();
  }
}

/** Build the living styleguide afresh without touching app or library distribution output. */
export async function buildReadmePreview(root) {
  if (typeof root !== "string" || !path.isAbsolute(root)) {
    throw new Error("README preview build requires an absolute repository root");
  }
  const parent = await fs.realpath(os.tmpdir());
  const directory = await fs.mkdtemp(path.join(parent, PREFIX));
  const identity = await fs.lstat(directory);
  ownedDirectories.set(directory, { parent, dev: identity.dev, ino: identity.ino, cleaned: false });
  try {
    await build(root, directory);
    const entry = await fs.stat(path.join(directory, "index.html"));
    if (!entry.isFile()) throw new Error("README preview build did not produce index.html");
    return directory;
  } catch (error) {
    try {
      await cleanupReadmePreview(directory);
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "README preview build failed and cleanup failed");
    }
    throw error;
  }
}
