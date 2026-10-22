import path from "node:path";
import { runTemplateChecks } from "./lib/templates.mjs";

process.exitCode = await runTemplateChecks(
  path.resolve(import.meta.dirname, ".."),
  process.argv[2],
);
