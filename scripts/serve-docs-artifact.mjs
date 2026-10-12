#!/usr/bin/env node
import { startDocsPreview } from "./lib/docs-preview.mjs";

const directory = process.env.UNITARY_DOCS_ARTIFACT;
if (!directory) throw new Error("UNITARY_DOCS_ARTIFACT must name a built docs directory");
const preview = await startDocsPreview(directory, 5211);
console.log(`[docs-artifact] ${preview.url}`);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => { await preview.close(); process.exit(0); });
}
