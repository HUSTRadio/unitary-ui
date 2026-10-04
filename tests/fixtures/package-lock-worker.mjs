import { spawn } from "node:child_process";
import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import {
  leasePackageLockProcess,
  packageLockEnvironment,
  withPackageLock,
} from "../../scripts/lib/package-script-lock.mjs";

const [root, resource, name, mode = "work"] = process.argv.slice(2);
const log = (event) =>
  appendFileSync(path.join(root, "events.jsonl"), `${JSON.stringify({ name, event })}\n`);
const waitForRelease = async () => {
  while (!existsSync(path.join(root, `${name}.release`))) await delay(25);
};

withPackageLock(root, resource, async () => {
  log("start");
  writeFileSync(path.join(root, `${name}.ready`), String(process.pid));
  if (mode === "hold") await waitForRelease();
  else if (mode === "fail") throw new Error("fixture failure");
  else if (mode === "nested" || mode === "parent") {
    await withPackageLock(root, resource, async () => {
      const child = spawn(
        process.execPath,
        [
          fileURLToPath(import.meta.url),
          root,
          resource,
          `${name}-child`,
          mode === "parent" ? "hold" : "work",
        ],
        {
          stdio: "ignore",
          env: packageLockEnvironment(),
        },
      );
      const release = leasePackageLockProcess(child.pid);
      if (mode === "parent") {
        while (!existsSync(path.join(root, `${name}-child.ready`))) await delay(25);
        writeFileSync(path.join(root, `${name}.child-ready`), String(child.pid));
        await waitForRelease();
      }
      await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (code) =>
          code === 0 ? resolve() : reject(new Error(`child status ${code}`)),
        );
      });
      release();
    });
  } else await delay(75);
  log("end");
}).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
