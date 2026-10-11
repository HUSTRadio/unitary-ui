import { lstatSync, realpathSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function cleanLibraryOutput(root) {
  const workspace = realpathSync(root);
  const target = path.join(workspace, "dist");
  try {
    const stat = lstatSync(target);
    if (stat.isSymbolicLink() || !stat.isDirectory() || realpathSync(target) !== target) {
      throw new Error("Refusing to clean a replaced or linked library output directory");
    }
    rmSync(target, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  cleanLibraryOutput(path.resolve(import.meta.dirname, ".."));
}
