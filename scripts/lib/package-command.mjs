import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { leasePackageLockProcess, packageLockEnvironment } from "./package-script-lock.mjs";

/** Resolve code-owned argv without a shell, preserving literal arguments on Windows. */
export function packageCommand(root, step) {
  const [kind, ...args] = step;
  if (kind === "node") return args;
  if (kind === "script") return [path.join(root, "scripts/run-locked-script.mjs"), ...args];
  if (kind !== "bin") throw new Error(`Unknown package command kind: ${kind}`);
  const [pkg, name, ...flags] = args;
  const directory = path.join(root, "node_modules", pkg);
  const manifest = JSON.parse(readFileSync(path.join(directory, "package.json"), "utf8"));
  const executable = typeof manifest.bin === "string" ? manifest.bin : manifest.bin?.[name];
  if (!executable) throw new Error(`Missing package executable: ${pkg}/${name}`);
  return [path.join(directory, executable), ...flags];
}

export async function runPackageStep(root, step, forwarded = [], environment = {}) {
  const child = spawn(process.execPath, [...packageCommand(root, step), ...forwarded], {
    cwd: root,
    stdio: "inherit",
    env: { ...packageLockEnvironment(), ...environment },
    detached: process.platform !== "win32",
  });
  const release = child.pid ? leasePackageLockProcess(child.pid) : () => {};
  const forward = (signal) => {
    if (!child.pid) return;
    try {
      if (process.platform === "win32") child.kill(signal);
      else process.kill(-child.pid, signal);
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  };
  const interrupt = () => forward("SIGINT");
  const terminate = () => forward("SIGTERM");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", terminate);
  try {
    return await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code, signal) => resolve(code ?? (signal === "SIGINT" ? 130 : 143)));
    });
  } finally {
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", terminate);
    release();
  }
}
