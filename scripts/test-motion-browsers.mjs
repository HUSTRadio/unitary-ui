import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPackageLock } from "./lib/package-script-lock.mjs";
import { runMotionBrowsers } from "./lib/motion-browsers.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
withPackageLock(root, "workspace-checks", () => runMotionBrowsers(root))
  .then(code => { process.exitCode = code; })
  .catch(error => { console.error(error.message); process.exitCode = 1; });
