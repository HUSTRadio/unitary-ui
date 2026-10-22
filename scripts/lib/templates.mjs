import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { runPackageStep } from "./package-command.mjs";

/** Discover actual private workspace apps; adding a template does not require a second app list. */
export function templateApplications(root) {
  return readdirSync(path.join(root, "templates"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const directory = path.join(root, "templates", entry.name);
      const manifest = JSON.parse(readFileSync(path.join(directory, "package.json"), "utf8"));
      if (!manifest.private || manifest.dependencies?.["@hustradio/unitary-ui"] !== "workspace:*")
        throw new Error(`Template must be a private dynamic consumer: ${entry.name}`);
      return { id: entry.name, directory, manifest };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function runTemplateChecks(root, mode, run = runPackageStep) {
  if (!["typecheck", "build"].includes(mode)) throw new Error(`Unknown template check: ${mode}`);
  const apps = templateApplications(root);
  if (!apps.length) throw new Error("No template consumers discovered");
  for (const app of apps) {
    const config = path.join(
      app.directory,
      mode === "typecheck" ? "tsconfig.source.json" : "tsconfig.json",
    );
    const code = await run(root, ["bin", "typescript", "tsc", "-p", config]);
    if (code !== 0) return code;
    if (mode === "build") {
      const built = await run(root, [
        "bin",
        "vite",
        "vite",
        "build",
        "--config",
        path.join(app.directory, "vite.config.ts"),
      ]);
      if (built !== 0) return built;
    }
  }
  return 0;
}
