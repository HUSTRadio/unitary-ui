#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOCKED_PACKAGE_SCRIPTS } from "./lib/locked-package-scripts.mjs";
import {
  leasePackageLockProcess,
  packageLockEnvironment,
  withPackageLock,
} from "./lib/package-script-lock.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function commandFor(step) {
  const [kind, ...args] = step;
  if (kind === "node") return args;
  if (kind === "script") return [fileURLToPath(import.meta.url), ...args];
  const [pkg, name, ...flags] = args;
  const directory = path.join(ROOT, "node_modules", pkg);
  const manifest = JSON.parse(readFileSync(path.join(directory, "package.json"), "utf8"));
  const executable = typeof manifest.bin === "string" ? manifest.bin : manifest.bin?.[name];
  if (!executable) throw new Error(`Missing package executable: ${pkg}/${name}`);
  return [path.join(directory, executable), ...flags];
}

async function runStep(step, forwarded) {
  const child = spawn(process.execPath, [...commandFor(step), ...forwarded], {
    cwd: ROOT,
    stdio: "inherit",
    env: packageLockEnvironment(),
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

async function main() {
  const [name, ...forwarded] = process.argv.slice(2);
  if (forwarded[0] === "--") forwarded.shift();
  const task = Object.hasOwn(LOCKED_PACKAGE_SCRIPTS, name) && LOCKED_PACKAGE_SCRIPTS[name];
  if (!task) throw new Error(`Unknown locked package script: ${name}`);
  return withPackageLock(ROOT, task.resource, async () => {
    for (let index = 0; index < task.steps.length; index++) {
      // Package managers append extra arguments to the final command in an && chain.
      const status = await runStep(
        task.steps[index],
        index === task.steps.length - 1 ? forwarded : [],
      );
      if (status !== 0) return status;
    }
    return 0;
  });
}

main()
  .then((status) => {
    process.exitCode = status;
  })
  .catch((error) => {
    console.error(`[package-lock] ${error.message}`);
    process.exitCode = 1;
  });
