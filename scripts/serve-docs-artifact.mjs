#!/usr/bin/env node
import { startDocsPreview } from "./lib/docs-preview.mjs";

const directory = process.env.UNITARY_DOCS_ARTIFACT;
if (!directory) throw new Error("UNITARY_DOCS_ARTIFACT must name a built docs directory");
const args = process.argv.slice(2);
const port = args.length ? Number(args[1]) : 5211;
if (args.length && (args.length !== 2 || args[0] !== "--port"
  || !Number.isInteger(port) || port < 1 || port > 65535)) throw Error("Expected --port <1..65535>");
const preview = await startDocsPreview(directory, port);
console.log(`[docs-artifact] ${preview.url}`);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => { await preview.close(); process.exit(0); });
}
