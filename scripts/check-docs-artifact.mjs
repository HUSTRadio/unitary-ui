#!/usr/bin/env node
import path from "node:path";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runPackageStep } from "./lib/package-command.mjs";
import { verificationBrowserEvidence } from "./lib/verification.mjs";
import { verificationFiles } from "./lib/verification-context.mjs";
import { isBrowserSpec } from "./lib/verification-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const value = (name) => {
  const index = process.argv.indexOf(name);
  if (index < 0 || !process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
    throw new Error(`Missing ${name}`);
  }
  return path.resolve(process.argv[index + 1]);
};
const consumer = value("--consumer");
const corpus = value("--corpus");
const output = value("--output");
const artifact = path.join(consumer, "docs/dist");
if (!statSync(path.join(artifact, "index.html")).isFile()) throw new Error("Missing built docs artifact");
mkdirSync(output, { recursive: true });
const checks = [];
async function check(name, step, environment = {}) {
  const status = await runPackageStep(root, step, [], environment);
  if (name === "browser" && status === 0) {
    const evidence = verificationBrowserEvidence(root,
      JSON.parse(readFileSync(path.join(output, "browser.json"), "utf8")),
      verificationFiles(root).filter(isBrowserSpec));
    if (evidence.missingFiles.length || evidence.notCompleted.length || evidence.errors.length) {
      throw new Error("Built docs browser report does not prove complete coverage");
    }
  }
  checks.push({ name, exitCode: status });
  writeFileSync(path.join(output, "checks.json"), `${JSON.stringify({ artifact: "docs/dist", checks }, null, 2)}\n`);
  if (status !== 0) throw new Error(`Built docs ${name} failed (exit ${status})`);
}
await check("corpus", ["bin", "tsx", "tsx", "scripts/generate-llm-docs.ts", "--built-dir", artifact,
  "--check", "--compare", corpus, "--output", path.join(output, "corpus")]);
if (!process.argv.includes("--corpus-only")) {
  await check("browser", ["bin", "@playwright/test", "playwright", "test", "-c", "playwright.config.ts",
    "--output", path.join(output, "browser-results"), "--max-failures=1", "--reporter=list,json"], {
      UNITARY_DOCS_ARTIFACT: artifact,
      UNITARY_VERIFY_ROUTES: undefined,
      PW_REUSE_SERVER: "0",
      PLAYWRIGHT_JSON_OUTPUT_FILE: path.join(output, "browser.json"),
    });
}
