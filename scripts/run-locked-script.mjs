#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOCKED_PACKAGE_SCRIPTS } from "./lib/locked-package-scripts.mjs";
import { withPackageLock } from "./lib/package-script-lock.mjs";
import { runPackageStep } from "./lib/package-command.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const [name, ...forwarded] = process.argv.slice(2);
  if (forwarded[0] === "--") forwarded.shift();
  const task = Object.hasOwn(LOCKED_PACKAGE_SCRIPTS, name) && LOCKED_PACKAGE_SCRIPTS[name];
  if (!task) throw new Error(`Unknown locked package script: ${name}`);
  return withPackageLock(ROOT, task.resource, async () => {
    for (let index = 0; index < task.steps.length; index++) {
      // Package managers append extra arguments to the final command in an && chain.
      const status = await runPackageStep(
        ROOT,
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
