#!/usr/bin/env node
import assert from "node:assert/strict";
import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { assertDocsRegistryReleaseUnchanged, buildDocsConsumer, checkDocsConsumer, fetchDocsRegistryArtifact, parseDocsRegistryArgs, readDocsRegistryRelease } from "./lib/docs-package-consumer.mjs";
import { runPackageStep } from "./lib/package-command.mjs";

const toolingRoot = path.resolve(import.meta.dirname, "..");
const options = parseDocsRegistryArgs(process.argv.slice(2));
const tempParent = realpathSync(os.tmpdir());
const consumerRoot = mkdtempSync(path.join(tempParent, "unitary-docs-registry-"));
try {
  const release = readDocsRegistryRelease(toolingRoot, options);
  const { root, output, manifest, summary, receipt } = release;
  const { bytes } = await fetchDocsRegistryArtifact(receipt);
  const evidenceDirectory = path.join(output, "docs-registry");
  const { docs, evidence } = await buildDocsConsumer({ root, consumerRoot, libraryManifest: manifest, bytes, evidenceDirectory, mode: "registry", receipt });
  assert.equal(evidence.dependencyTreeSha256, summary.docs.dependencyTreeSha256, "Registry docs dependencies differ from the frozen candidate consumer");
  const packageChecks = await checkDocsConsumer(root, consumerRoot, evidenceDirectory);
  assert.equal(await runPackageStep(docs, ["bin", "vite", "vite", "build", "--config", "vite.config.ts"], [], {
    UNITARY_DOCS_MODE: "package", UNITARY_DOCS_TEST_FIXTURES: "0",
  }), 0, "Final docs artifact build failed");
  const productionChecks = await checkDocsConsumer(root, consumerRoot, path.join(evidenceDirectory, "production"), { corpusOnly: true });
  const buildManifest = JSON.parse(readFileSync(path.join(docs, "dist/.vite/manifest.json"), "utf8"));
  assert.ok(!Object.values(buildManifest).some(chunk => chunk.src === "site/build/browser-fixtures.ts"), "Production docs include a browser test fixture");
  assertDocsRegistryReleaseUnchanged(toolingRoot, options, release);
  const destination = path.join(output, "docs-static");
  assert.equal(path.dirname(destination), output);
  assert.ok(realpathSync(output).startsWith(realpathSync(root) + path.sep), "Static artifact output must stay inside the release checkout");
  if (existsSync(destination)) {
    assert.ok(!lstatSync(destination).isSymbolicLink(), "Static artifact destination must not be linked");
    rmSync(destination, { recursive: true });
  }
  cpSync(path.join(docs, "dist"), destination, { recursive: true });
  writeFileSync(path.join(destination, "build-metadata.json"), JSON.stringify({
    ...evidence, provenance: receipt.provenance, candidateSha256: summary.sha256,
    toolingCommit: release.toolingCommit, toolingCleanCheckout: release.toolingCleanCheckout,
    verification: { package: packageChecks, production: productionChecks }, fixturesIncluded: false,
    builtAt: new Date().toISOString(),
  }, null, 2) + "\n");
  console.log(`Verified registry docs artifact: .scratch/npm-release/docs-static (${manifest.name}@${receipt.version})`);
} catch (error) {
  console.error(`[docs-registry] ${error.message}`);
  console.error("The published package remains published. Recover this artifact build using the same release checkout and publication receipt; do not republish the version.");
  process.exitCode = 1;
} finally {
  assert.equal(path.dirname(consumerRoot), tempParent);
  assert.ok(path.basename(consumerRoot).startsWith("unitary-docs-registry-"));
  rmSync(consumerRoot, { recursive: true, force: true });
}
