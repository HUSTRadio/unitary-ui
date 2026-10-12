import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseAllDocuments, stringify } from "yaml";
import { runPackageStep } from "./package-command.mjs";
import { leasePackageLockProcess, packageLockEnvironment } from "./package-script-lock.mjs";
import { PACKAGE_NAME, REGISTRY, packageIntegrity, readValidatedPackageArtifact, validateInstalledPackage } from "./package-artifact.mjs";

export const DOCS_WORKSPACE_NAME = "@hustradio/unitary-ui-docs";
export const CONSUMER_TARBALL = "unitary-ui.tgz";
export const DOCS_PUBLIC_ASSETS = ["demo-poster.png", "demo.mp4", "gallery-coast.svg", "gallery-desert.svg", "gallery-forest.svg", "prefetch-preview.json"];
const dependencyKinds = ["dependencies", "devDependencies", "optionalDependencies"];
const hash = value => createHash("sha256").update(value).digest("hex");

export function docsApplicationLock(lockText) {
  const documents = parseAllDocuments(lockText);
  assert.ok(documents.every(document => document.errors.length === 0), "Invalid workspace lockfile");
  const matches = documents.map(document => document.toJS()).filter(lock => lock?.importers?.docs);
  assert.equal(matches.length, 1, "Workspace lockfile must contain exactly one docs importer");
  const lock = matches[0];
  assert.equal(String(lock.lockfileVersion), "9.0", "Unsupported docs lockfile version");
  return lock;
}

function checkManifestLock(manifest, importer) {
  for (const kind of dependencyKinds) {
    for (const [name, specifier] of Object.entries(manifest[kind] ?? {})) {
      assert.equal(importer[kind]?.[name]?.specifier, specifier, `Docs dependency is not locked: ${name}`);
      if (name !== PACKAGE_NAME) assert.ok(!/^(?:link:|workspace:)/.test(importer[kind][name].version), `Linked docs dependency: ${name}`);
    }
  }
}

/** Preserve every locked external dependency; replace only the library's artifact identity. */
export function createDocsConsumerLock(lockText, docsManifest, libraryManifest, integrity, mode = "tarball") {
  assert.ok(["tarball", "registry"].includes(mode), "Unknown docs package mode");
  assert.equal(docsManifest.name, DOCS_WORKSPACE_NAME);
  assert.equal(docsManifest.private, true, "Docs workspace must remain private");
  assert.equal(libraryManifest.name, PACKAGE_NAME);
  assert.match(libraryManifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  const lock = structuredClone(docsApplicationLock(lockText));
  const importer = lock.importers.docs;
  checkManifestLock(docsManifest, importer);
  const declared = importer.dependencies?.[PACKAGE_NAME];
  assert.ok(declared, "Docs must declare the library as a direct dependency");
  const peers = Object.keys(libraryManifest.peerDependencies ?? {}).map(name => {
    const resolved = dependencyKinds.map(kind => importer[kind]?.[name]).find(Boolean);
    if (!resolved && libraryManifest.peerDependenciesMeta?.[name]?.optional) return "";
    assert.ok(resolved, `Docs does not provide library peer: ${name}`);
    return `(${name}@${resolved.version})`;
  }).sort().join("");
  const reference = mode === "tarball" ? `file:${CONSUMER_TARBALL}` : libraryManifest.version;
  const packageKey = `${PACKAGE_NAME}@${reference}`;
  const snapshot = { dependencies: {} };
  for (const kind of ["dependencies", "optionalDependencies"]) {
    for (const name of Object.keys(libraryManifest[kind] ?? {})) {
      const resolved = lock.importers["."]?.[kind]?.[name];
      assert.ok(resolved && !/^(?:workspace:|link:)/.test(resolved.version), `Library dependency is not independently locked: ${name}`);
      (snapshot[kind] ??= {})[name] = resolved.version;
    }
  }
  for (const name of Object.keys(libraryManifest.peerDependencies ?? {})) {
    const resolved = dependencyKinds.map(kind => importer[kind]?.[name]).find(Boolean);
    if (!resolved && libraryManifest.peerDependenciesMeta?.[name]?.optional) continue;
    assert.ok(resolved, `Docs does not provide library peer: ${name}`);
    snapshot.dependencies[name] = resolved.version;
  }
  const metadata = { resolution: { integrity, ...(mode === "tarball" ? { tarball: reference } : {}) } };
  if (mode === "tarball") metadata.version = libraryManifest.version;
  for (const key of ["engines", "peerDependencies", "peerDependenciesMeta", "os", "cpu", "libc"])
    if (libraryManifest[key]) metadata[key] = libraryManifest[key];
  lock.packages[packageKey] = metadata;
  lock.snapshots[`${packageKey}${peers}`] = snapshot;
  importer.dependencies[PACKAGE_NAME] = { specifier: reference, version: `${reference}${peers}` };
  lock.importers = { ".": importer };
  // A copied lock is intentionally standalone, never a workspace shortcut.
  for (const [key, entry] of Object.entries(lock.snapshots)) {
    for (const kind of ["dependencies", "optionalDependencies"])
      for (const [name, value] of Object.entries(entry[kind] ?? {}))
        assert.ok(!/^(?:workspace:|link:)/.test(value), `Linked lockfile dependency: ${key}/${name}`);
  }
  const manifest = structuredClone(docsManifest);
  manifest.dependencies[PACKAGE_NAME] = reference;
  delete manifest.scripts;
  delete manifest.devEngines;
  delete manifest.packageManager;
  return { manifest, lock, text: stringify(lock, { lineWidth: 0 }) };
}

export function docsDependencyTreeDigest(lock) {
  const normalized = structuredClone(lock);
  const reference = normalized.importers["."].dependencies[PACKAGE_NAME].version;
  normalized.libraryDependencies = normalized.snapshots[`${PACKAGE_NAME}@${reference}`];
  delete normalized.importers["."].dependencies[PACKAGE_NAME];
  for (const section of ["packages", "snapshots"])
    for (const key of Object.keys(normalized[section]))
      if (key.startsWith(`${PACKAGE_NAME}@`)) delete normalized[section][key];
  return hash(JSON.stringify(normalized));
}

/** Do not copy the corpus, reference captures, caches, or repository implementation. */
export function stageDocsApplication(root, consumerRoot) {
  const docs = path.join(consumerRoot, "docs");
  mkdirSync(docs, { recursive: true });
  for (const name of ["index.html", "vite.config.ts"]) cpSync(path.join(root, "docs", name), path.join(docs, name));
  for (const name of ["src", "build"]) cpSync(path.join(root, "docs/site", name), path.join(docs, "site", name), {
    recursive: true,
    filter: source => {
      assert.ok(!lstatSync(source).isSymbolicLink(), `Linked docs input: ${source}`);
      return !["__tests__", "node_modules", ".vite", ".cache"].includes(path.basename(source));
    },
  });
  cpSync(path.join(root, "docs/site/tsconfig.json"), path.join(docs, "site/tsconfig.json"));
  mkdirSync(path.join(consumerRoot, "public"), { recursive: true });
  for (const name of DOCS_PUBLIC_ASSETS) cpSync(path.join(root, "public", name), path.join(consumerRoot, "public", name));
  return docs;
}

export function docsSourceDigest(directory) {
  const entries = [];
  const visit = current => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      if (["node_modules", "dist", "__tests__", ".vite", ".cache"].includes(entry.name)) continue;
      const target = path.join(current, entry.name);
      assert.ok(!lstatSync(target).isSymbolicLink(), `Linked docs digest input: ${target}`);
      if (entry.isDirectory()) visit(target);
      else entries.push([path.relative(directory, target).replaceAll("\\", "/"), hash(readFileSync(target))]);
    }
  };
  for (const input of ["index.html", "vite.config.ts", "site/src", "site/build", "site/tsconfig.json"]) {
    const target = path.join(directory, input);
    if (lstatSync(target).isDirectory()) visit(target);
    else entries.push([input, hash(readFileSync(target))]);
  }
  for (const name of DOCS_PUBLIC_ASSETS) entries.push([`../public/${name}`, hash(readFileSync(path.join(directory, "../public", name)))]);
  return hash(JSON.stringify(entries));
}

export function pnpmCommand() {
  const executable = process.env.npm_execpath;
  if (executable) return executable.endsWith(".exe") ? [executable] : [process.execPath, executable];
  for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
    const candidate = path.join(directory, process.platform === "win32" ? "pnpm.exe" : "pnpm");
    try { return [realpathSync(candidate)]; } catch { /* Continue to the next native executable. */ }
  }
  throw new Error("Cannot locate pnpm; run through a pnpm package script");
}

/** Captured subprocesses inherit verified lock identities and keep their owner's lease alive. */
export async function runConsumerCommand(command, args, cwd, environment = {}) {
  const child = spawn(command, args, {
    cwd, env: { ...packageLockEnvironment(), ...environment }, stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  const release = child.pid ? leasePackageLockProcess(child.pid) : () => {};
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", data => { stdout += data; if (stdout.length > 16 * 1024 * 1024) child.kill(); });
  child.stderr.on("data", data => { stderr += data; if (stderr.length > 16 * 1024 * 1024) child.kill(); });
  const forward = signal => {
    if (!child.pid) return;
    try {
      if (process.platform === "win32") child.kill(signal);
      else process.kill(-child.pid, signal);
    } catch (error) { if (error.code !== "ESRCH") throw error; }
  };
  const interrupt = () => forward("SIGINT");
  const terminate = () => forward("SIGTERM");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", terminate);
  const timer = setTimeout(terminate, 600_000);
  try {
    await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code, signal) => code === 0 ? resolve() : reject(new Error(
        `Docs package command failed (${code ?? signal}): ${[command, ...args].join(" ")}\n${stdout}\n${stderr}`,
      )));
    });
    return stdout;
  } finally {
    clearTimeout(timer);
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", terminate);
    release();
  }
}

export function checkoutCommit(root) {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, "Cannot determine docs release commit");
  const commit = result.stdout.trim();
  assert.match(commit, /^[0-9a-f]{40,64}$/);
  return commit;
}

export function checkoutIsClean(root) {
  const result = spawnSync("git", ["status", "--porcelain=v1", "--untracked-files=normal"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, "Cannot determine docs checkout state");
  return result.stdout.trim() === "";
}

/**
 * @param {{ mode?: "tarball" | "registry", libraryManifest: { name: string, version: string }, bytes: Uint8Array, receipt?: { name: string, version: string, integrity: string } }} options
 */
export function docsConsumerInstallOptions({ mode = "tarball", libraryManifest, bytes, receipt = undefined }) {
  assert.ok(["tarball", "registry"].includes(mode), "Unknown docs package mode");
  const args = ["install", "--ignore-scripts", "--frozen-lockfile", "--prefer-offline", `--config.registry=${REGISTRY}`, "--config.manage-package-manager-versions=false"];
  if (mode === "tarball") return { args: [args[0], "--ignore-workspace", ...args.slice(1)] };
  assert.ok(receipt, "Registry docs installation requires the validated publication receipt");
  assert.equal(libraryManifest.name, PACKAGE_NAME);
  assert.equal(receipt.name, PACKAGE_NAME);
  assert.match(receipt.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.equal(receipt.version, libraryManifest.version, "Registry age exception differs from the published version");
  assert.equal(receipt.integrity, packageIntegrity(bytes), "Registry age exception differs from the verified bytes");
  // pnpm 11 ignores even a local workspace policy under --ignore-workspace.
  // This private workspace anchors the consumer and exempts only verified bytes.
  return { args, workspace: { packages: ["."], minimumReleaseAgeExclude: [`${PACKAGE_NAME}@${receipt.version}`] } };
}

export function parseDocsRegistryArgs(args, cwd = process.cwd()) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    assert.ok(["--release-root", "--receipt"].includes(flag), `Unknown docs registry argument: ${flag}`);
    assert.ok(!Object.hasOwn(options, flag), `Duplicate docs registry argument: ${flag}`);
    assert.ok(args[index + 1] && !args[index + 1].startsWith("--"), `Missing value for ${flag}`);
    options[flag] = path.resolve(cwd, args[index + 1]);
  }
  return { releaseRoot: options["--release-root"], receiptPath: options["--receipt"] };
}

export function readDocsRegistryRelease(toolingRoot, { releaseRoot = toolingRoot, receiptPath } = {}) {
  toolingRoot = realpathSync(toolingRoot);
  const root = realpathSync(releaseRoot);
  const toolingCommit = checkoutCommit(toolingRoot);
  const toolingCleanCheckout = checkoutIsClean(toolingRoot);
  assert.equal(toolingCleanCheckout, true, "Registry docs require a clean tooling checkout");
  const { output, manifest, summary } = readValidatedPackageArtifact(root);
  const receipt = JSON.parse(readFileSync(receiptPath ?? path.join(output, "published.json"), "utf8"));
  assert.ok(summary.docs, "Candidate artifact has no complete docs verification");
  validateDocsRegistryReceipt({
    receipt, summary, manifest, commit: checkoutCommit(root), cleanCheckout: checkoutIsClean(root), candidate: summary.docs,
    workspaceLockSha256: hash(readFileSync(path.join(root, "pnpm-lock.yaml"))), sourceSha256: docsSourceDigest(path.join(root, "docs")),
  });
  return { root, output, manifest, summary, receipt, toolingCommit, toolingCleanCheckout };
}

export function assertDocsRegistryReleaseUnchanged(toolingRoot, options, initial) {
  const current = readDocsRegistryRelease(toolingRoot, options);
  for (const key of ["root", "toolingCommit", "toolingCleanCheckout", "summary", "receipt"])
    assert.deepEqual(current[key], initial[key], `Docs registry ${key} changed during verification`);
}

export async function buildDocsConsumer({ root, consumerRoot, libraryManifest, bytes, evidenceDirectory, mode = "tarball", lockText, receipt }) {
  const installationOptions = docsConsumerInstallOptions({ mode, libraryManifest, bytes, receipt });
  const docs = stageDocsApplication(root, consumerRoot);
  const docsManifest = JSON.parse(readFileSync(path.join(root, "docs/package.json"), "utf8"));
  const integrity = packageIntegrity(bytes);
  const consumer = createDocsConsumerLock(lockText ?? readFileSync(path.join(root, "pnpm-lock.yaml"), "utf8"), docsManifest, libraryManifest, integrity, mode);
  writeFileSync(path.join(docs, "package.json"), JSON.stringify(consumer.manifest, null, 2) + "\n");
  writeFileSync(path.join(docs, "pnpm-lock.yaml"), consumer.text);
  if (mode === "tarball") writeFileSync(path.join(docs, CONSUMER_TARBALL), bytes);
  mkdirSync(evidenceDirectory, { recursive: true });
  writeFileSync(path.join(evidenceDirectory, "package.json"), JSON.stringify(consumer.manifest, null, 2) + "\n");
  writeFileSync(path.join(evidenceDirectory, "pnpm-lock.yaml"), consumer.text);
  if (installationOptions.workspace) {
    const policy = stringify(installationOptions.workspace, { lineWidth: 0 });
    writeFileSync(path.join(docs, "pnpm-workspace.yaml"), policy);
    writeFileSync(path.join(evidenceDirectory, "pnpm-workspace.yaml"), policy);
  }
  const pnpm = pnpmCommand();
  try {
    const installation = await runConsumerCommand(pnpm[0], [...pnpm.slice(1), ...installationOptions.args], docs);
    writeFileSync(path.join(evidenceDirectory, "install.log"), installation);
  } catch (error) {
    writeFileSync(path.join(evidenceDirectory, "install.log"), error.message + "\n");
    throw error;
  }
  assert.equal(readFileSync(path.join(docs, "pnpm-lock.yaml"), "utf8"), consumer.text, "Frozen docs installation changed the lockfile");
  const installed = realpathSync(path.join(docs, "node_modules", PACKAGE_NAME));
  assert.ok(installed.startsWith(realpathSync(docs) + path.sep), "Docs resolved a package outside its independent consumer");
  const actual = JSON.parse(readFileSync(path.join(installed, "package.json"), "utf8"));
  assert.equal(actual.version, libraryManifest.version);
  assert.deepEqual(actual.exports, libraryManifest.exports, "Docs package exports differ from the validated artifact");
  validateInstalledPackage(installed, readdirSync(path.join(root, "public/fonts")));
  const environment = { UNITARY_DOCS_MODE: "package", UNITARY_DOCS_TEST_FIXTURES: "1" };
  for (const step of [
    ["bin", "typescript", "tsc", "-p", "site/tsconfig.json"],
    ["bin", "vite", "vite", "build", "--config", "vite.config.ts"],
  ]) assert.equal(await runPackageStep(docs, step, [], environment), 0, `Docs ${step[2]} failed`);
  assert.ok(existsSync(path.join(docs, "dist/index.html")), "Docs build did not produce a static application");
  const evidence = {
    name: PACKAGE_NAME, version: actual.version, integrity, mode, commit: checkoutCommit(root), cleanCheckout: checkoutIsClean(root),
    lockSha256: hash(consumer.text), sourceSha256: docsSourceDigest(docs),
    dependencyTreeSha256: docsDependencyTreeDigest(consumer.lock),
    workspaceLockSha256: hash(readFileSync(path.join(root, "pnpm-lock.yaml"))),
  };
  writeFileSync(path.join(evidenceDirectory, "build.json"), JSON.stringify(evidence, null, 2) + "\n");
  return { docs, installed, evidence };
}

export async function checkDocsConsumer(root, consumerRoot, evidenceDirectory, { corpusOnly = false } = {}) {
  assert.equal(await runPackageStep(root, ["node", "scripts/check-docs-artifact.mjs", "--consumer", consumerRoot,
    "--corpus", path.join(root, "docs/llm"), "--output", evidenceDirectory, ...(corpusOnly ? ["--corpus-only"] : [])], [], { UNITARY_DOCS_MODE: "package" }), 0,
  "Built docs corpus/browser verification failed");
  const receipt = JSON.parse(readFileSync(path.join(evidenceDirectory, "checks.json"), "utf8"));
  assert.equal(receipt.artifact, "docs/dist");
  assert.deepEqual(receipt.checks.map(check => [check.name, check.exitCode]), corpusOnly ? [["corpus", 0]] : [["corpus", 0], ["browser", 0]],
    "Built docs verification receipt is incomplete");
  return receipt.checks;
}

export function validateDocsRegistryReceipt({ receipt, summary, manifest, commit, cleanCheckout, candidate, workspaceLockSha256, sourceSha256 }) {
  assert.equal(receipt.name, PACKAGE_NAME);
  assert.equal(receipt.version, summary.version);
  assert.equal(receipt.version, manifest.version);
  assert.equal(receipt.integrity, summary.integrity, "Published receipt differs from candidate tarball");
  assert.equal(receipt.commit, commit, "Published docs must use the release checkout");
  assert.equal(summary.commit, commit, "Package candidate belongs to another release commit");
  assert.equal(candidate.commit, commit, "Docs candidate belongs to another checkout");
  assert.equal(candidate.cleanCheckout, true, "Rebuild the docs candidate from a clean release checkout");
  assert.equal(cleanCheckout, true, "Registry docs require a clean release checkout");
  assert.equal(candidate.version, receipt.version);
  assert.equal(candidate.integrity, receipt.integrity);
  assert.deepEqual(candidate.checks?.map(check => [check.name, check.exitCode]), [["corpus", 0], ["browser", 0]], "Docs candidate lacks complete built artifact verification");
  assert.equal(candidate.workspaceLockSha256, workspaceLockSha256, "Workspace lock differs from validated docs candidate");
  assert.equal(candidate.sourceSha256, sourceSha256, "Docs application differs from validated release candidate");
}

export async function fetchDocsRegistryArtifact(receipt, fetcher = fetch) {
  assert.equal(receipt.name, PACKAGE_NAME);
  assert.match(receipt.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  const response = await fetcher(`${REGISTRY}${encodeURIComponent(PACKAGE_NAME)}/${receipt.version}`, { signal: AbortSignal.timeout(30_000) });
  assert.ok(response.ok, `Exact npm version is unavailable: HTTP ${response.status}`);
  const metadata = await response.json();
  assert.equal(metadata.name, PACKAGE_NAME);
  assert.equal(metadata.version, receipt.version);
  assert.equal(metadata.dist?.integrity, receipt.integrity, "Exact registry package differs from publication receipt");
  const tarball = new URL(metadata.dist.tarball);
  assert.equal(tarball.origin, new URL(REGISTRY).origin, "Unexpected package tarball registry");
  const artifact = await fetcher(tarball.href, { signal: AbortSignal.timeout(60_000) });
  assert.ok(artifact.ok, `Registry tarball download failed: HTTP ${artifact.status}`);
  const bytes = Buffer.from(await artifact.arrayBuffer());
  assert.equal(packageIntegrity(bytes), receipt.integrity, "Downloaded registry bytes differ from the validated candidate");
  return { metadata, bytes };
}
