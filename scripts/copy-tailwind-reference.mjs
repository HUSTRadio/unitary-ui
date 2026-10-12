import { copyFileSync, mkdirSync, realpathSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Publish the canonical theme as a reference, without maintaining another CSS source. */
export function copyTailwindReference(repoRoot) {
  const root = realpathSync(repoRoot);
  const dist = path.join(root, "dist");
  mkdirSync(dist, { recursive: true });
  if (realpathSync(dist) !== dist) throw new Error("Refusing to write through a linked library output directory");
  copyFileSync(path.join(root, "src/styles/index.css"), path.join(dist, "tailwind-reference.css"));
  copyFileSync(path.join(root, "src/styles/color-schemes.css"), path.join(dist, "color-schemes.css"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  copyTailwindReference(path.resolve(import.meta.dirname, ".."));
}
