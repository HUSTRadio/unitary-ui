import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { readPackument, validateArtifact, validateProvenance, validatePublished, validateRelease } from "./lib/npm-release.mjs";
import { PACKAGE_NAME, validatePackageFiles } from "./lib/package-artifact.mjs";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".scratch/npm-release");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const command = process.argv[2];
function git(...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Release git check failed: ${args[0]}`);
  return result.stdout.trim();
}
function receipt() {
  const summary = JSON.parse(readFileSync(path.join(output, "summary.json"), "utf8"));
  // Validate the filename before reading any caller-controlled path.
  assert.equal(summary.filename, `hustradio-unitary-ui-${manifest.version}.tgz`);
  const bytes = readFileSync(path.join(output, summary.filename));
  validateArtifact(summary, bytes, manifest);
  assert.equal(summary.sha256, createHash("sha256").update(bytes).digest("hex"));
  const files = JSON.parse(readFileSync(path.join(output, "files.json"), "utf8"));
  assert.deepEqual(files, summary.files);
  validatePackageFiles(files, manifest);
  return summary;
}
async function preflight() {
  assert.equal(process.env.GITHUB_REPOSITORY, "HUSTRadio/unitary-ui", "Unexpected publishing repository");
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  // Validate syntax before passing a tag to git, even though spawn has no shell.
  assert.equal(event.release?.tag_name, `v${manifest.version}`);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  const sha = git("rev-parse", "HEAD");
  assert.equal(sha, process.env.GITHUB_SHA, "Checkout differs from Release event commit");
  assert.equal(git("rev-parse", `refs/tags/v${manifest.version}^{commit}`), sha, "Release tag moved");
  const ancestor = spawnSync("git", ["merge-base", "--is-ancestor", sha, "refs/remotes/origin/master"], { cwd: root });
  const packument = await readPackument();
  const mode = validateRelease({ event, manifest, onMaster: ancestor.status === 0, packument });
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `mode=${mode}\nsha=${sha}\nfilename=hustradio-unitary-ui-${manifest.version}.tgz\n`);
  console.log(`Release preflight passed: ${manifest.name}@${manifest.version} (${mode})`);
}

try {
  if (command === "preflight") await preflight();
  else if (command === "check-artifact") { receipt(); await preflight(); }
  else if (command === "verify") {
    const summary = receipt();
    let lastError;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const packument = await readPackument();
        assert.ok(packument, "Published package is missing");
        const url = validatePublished(packument, summary);
        const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
        assert.ok(response.ok, `Provenance query failed: HTTP ${response.status}`);
        const data = await response.json();
        validateProvenance(data, summary, process.env.GITHUB_SHA);
        writeFileSync(path.join(output, "published.json"), JSON.stringify({
          name: PACKAGE_NAME, version: summary.version, access: "public", latest: summary.version,
          integrity: summary.integrity, provenance: url, commit: process.env.GITHUB_SHA,
        }, null, 2) + "\n");
        console.log(`Verified npm publication: ${PACKAGE_NAME}@${summary.version}`);
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < 5) await new Promise(resolve => setTimeout(resolve, 10_000));
      }
    }
    if (lastError) throw lastError;
  } else throw new Error("Usage: node scripts/npm-release.mjs preflight|check-artifact|verify");
} catch (error) {
  console.error(`[npm-release] ${error.message}`);
  if (command === "verify") console.error("Publication may already have succeeded. Inspect npm and this run's artifact; do not republish the same version. Follow docs/guides/npm-release.md recovery instructions.");
  process.exitCode = 1;
}
