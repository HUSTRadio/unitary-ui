// @vitest-environment node
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { stringify } from "yaml";
import {
  CONSUMER_TARBALL, DOCS_PUBLIC_ASSETS, createDocsConsumerLock, docsApplicationLock,
  docsDependencyTreeDigest, docsSourceDigest, fetchDocsRegistryArtifact,
  runConsumerCommand, stageDocsApplication, validateDocsRegistryReceipt,
} from "../scripts/lib/docs-package-consumer.mjs";
import { withPackageLock } from "../scripts/lib/package-script-lock.mjs";
import { PACKAGE_NAME, packageIntegrity, readValidatedPackageArtifact } from "../scripts/lib/package-artifact.mjs";

const directories: string[] = [];
const temp = () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "unitary-docs-package-test-"));
  directories.push(directory);
  return directory;
};
afterEach(() => { for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true }); });

const docsManifest = {
  name: "@hustradio/unitary-ui-docs", private: true, type: "module", scripts: { build: "vite build" },
  dependencies: { [PACKAGE_NAME]: "workspace:*", react: "^19.0.0", "react-dom": "^19.0.0" },
  devDependencies: { vite: "^8.0.0" },
};
const libraryManifest = {
  name: PACKAGE_NAME, version: "0.1.0-beta.1", dependencies: { clsx: "^2.1.1" },
  peerDependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
};
const lock = () => ({
  lockfileVersion: "9.0", settings: { autoInstallPeers: true },
  importers: {
    ".": { dependencies: { clsx: { specifier: "^2.1.1", version: "2.1.1" } } },
    docs: {
      dependencies: {
        [PACKAGE_NAME]: { specifier: "workspace:*", version: "link:.." },
        react: { specifier: "^19.0.0", version: "19.2.0" },
        "react-dom": { specifier: "^19.0.0", version: "19.2.0(react@19.2.0)" },
      },
      devDependencies: { vite: { specifier: "^8.0.0", version: "8.0.0" } },
    },
  },
  packages: {
    "clsx@2.1.1": { resolution: { integrity: "sha512-clsx" } },
    "react@19.2.0": { resolution: { integrity: "sha512-react" } },
    "react-dom@19.2.0": { resolution: { integrity: "sha512-dom" }, peerDependencies: { react: "^19.2.0" } },
    "vite@8.0.0": { resolution: { integrity: "sha512-vite" } },
  },
  snapshots: {
    "clsx@2.1.1": {}, "react@19.2.0": {},
    "react-dom@19.2.0(react@19.2.0)": { dependencies: { react: "19.2.0" } },
    "vite@8.0.0": {},
  },
});

describe("standalone documentation consumer", () => {
  it("selects the app document in pnpm 11's multiple-document lock", () => {
    const text = `---\n${stringify({ lockfileVersion: "9.0", importers: { ".": { packageManagerDependencies: {} } } })}\n---\n${stringify(lock())}`;
    expect(docsApplicationLock(text).importers.docs).toEqual(lock().importers.docs);
    expect(() => docsApplicationLock(stringify({ importers: { ".": {} } }))).toThrow("docs importer");
    expect(() => docsApplicationLock(`${text}\n---\n${stringify(lock())}`)).toThrow("exactly one");
  });

  it("replaces only the workspace library with a stable tarball and preserves pinned peers and transitive dependencies", () => {
    const original = lock();
    const result = createDocsConsumerLock(stringify(original), docsManifest, libraryManifest, "sha512-candidate");
    expect(Object.keys(result.lock.importers)).toEqual(["."]);
    expect(result.manifest.dependencies[PACKAGE_NAME]).toBe(`file:${CONSUMER_TARBALL}`);
    expect(result.manifest).not.toHaveProperty("scripts");
    const reference = result.lock.importers["."].dependencies[PACKAGE_NAME].version;
    expect(reference).toBe("file:unitary-ui.tgz(react-dom@19.2.0(react@19.2.0))(react@19.2.0)");
    expect(result.lock.packages[`${PACKAGE_NAME}@file:unitary-ui.tgz`]).toMatchObject({
      version: libraryManifest.version, resolution: { integrity: "sha512-candidate", tarball: "file:unitary-ui.tgz" },
    });
    expect(result.lock.snapshots[`${PACKAGE_NAME}@${reference}`].dependencies).toEqual({
      clsx: "2.1.1", react: "19.2.0", "react-dom": "19.2.0(react@19.2.0)",
    });
    expect(result.lock.packages["clsx@2.1.1"]).toEqual(original.packages["clsx@2.1.1"]);
    expect(original.importers.docs.dependencies[PACKAGE_NAME].version).toBe("link:..");
    expect(result.text).not.toContain("link:");
  });

  it("changes the library identity to an exact registry version without changing the external dependency tree", () => {
    const candidate = createDocsConsumerLock(stringify(lock()), docsManifest, libraryManifest, "sha512-candidate");
    const registry = createDocsConsumerLock(stringify(lock()), docsManifest, libraryManifest, "sha512-candidate", "registry");
    expect(registry.manifest.dependencies[PACKAGE_NAME]).toBe(libraryManifest.version);
    expect(registry.lock.packages[`${PACKAGE_NAME}@${libraryManifest.version}`].resolution).toEqual({ integrity: "sha512-candidate" });
    expect(docsDependencyTreeDigest(registry.lock)).toBe(docsDependencyTreeDigest(candidate.lock));
    registry.lock.packages["clsx@2.1.1"].resolution.integrity = "sha512-changed";
    expect(docsDependencyTreeDigest(registry.lock)).not.toBe(docsDependencyTreeDigest(candidate.lock));
  });

  it("rejects missing locks, stale manifest specifiers and other linked dependencies", () => {
    expect(() => createDocsConsumerLock(stringify(lock()), { ...docsManifest, private: false }, libraryManifest, "sha512-x")).toThrow("private");
    expect(() => createDocsConsumerLock(stringify(lock()), { ...docsManifest, dependencies: { ...docsManifest.dependencies, react: "^20.0.0" } }, libraryManifest, "sha512-x")).toThrow("not locked");
    const linked = lock();
    linked.importers.docs.devDependencies.vite.version = "link:../vite";
    expect(() => createDocsConsumerLock(stringify(linked), docsManifest, libraryManifest, "sha512-x")).toThrow("Linked docs");
    const missing = lock();
    delete (missing.importers["."].dependencies as Record<string, unknown>).clsx;
    expect(() => createDocsConsumerLock(stringify(missing), docsManifest, libraryManifest, "sha512-x")).toThrow("independently locked");
  });

  it("copies app/config/assets without repository implementation, corpus, fonts or source-mode configuration", () => {
    const root = temp();
    const consumer = temp();
    const write = (file: string, text: string) => {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), text);
    };
    for (const file of ["docs/index.html", "docs/vite.config.ts", "docs/site/src/main.tsx", "docs/site/build/plugin.ts", "docs/site/tsconfig.json"])
      write(file, file);
    for (const file of DOCS_PUBLIC_ASSETS) write(`public/${file}`, file);
    for (const file of ["docs/llm/index.json", "docs/site/tsconfig.source.json", "docs/site/src/__tests__/private.test.ts", "src/lib/index.ts", "public/fonts/font.woff2"])
      write(file, "must not copy");
    const docs = stageDocsApplication(root, consumer);
    expect(readdirSync(consumer).sort()).toEqual(["docs", "public"]);
    expect(readdirSync(path.join(consumer, "public")).sort()).toEqual([...DOCS_PUBLIC_ASSETS].sort());
    expect(readdirSync(path.join(docs, "site"))).toEqual(["build", "src", "tsconfig.json"]);
    expect(readdirSync(path.join(docs, "site/src"))).toEqual(["main.tsx"]);
    expect(docsSourceDigest(docs)).toBe(docsSourceDigest(path.join(root, "docs")));
    write("docs/site/src/main.tsx", "changed application");
    expect(docsSourceDigest(docs)).not.toBe(docsSourceDigest(path.join(root, "docs")));
  });

  it("passes verified package-lock identities to child commands and reports failed commands", async () => {
    const root = temp();
    await withPackageLock(root, "workspace-checks", async () => {
      const output = await runConsumerCommand(process.execPath, ["-e", "process.stdout.write(process.env.UNITARY_PACKAGE_LOCKS)"], root);
      expect(JSON.parse(output)).toEqual([expect.objectContaining({ resource: "workspace-checks" })]);
      await expect(runConsumerCommand(process.execPath, ["-e", "console.error('fixture failure');process.exit(7)"], root)).rejects.toThrow("fixture failure");
    });
  });
});

describe("published-package documentation receipts", () => {
  const valid = () => ({
    receipt: { name: PACKAGE_NAME, version: libraryManifest.version, integrity: "sha512-candidate", commit: "a".repeat(40) },
    summary: { version: libraryManifest.version, integrity: "sha512-candidate", commit: "a".repeat(40) },
    manifest: libraryManifest, commit: "a".repeat(40), cleanCheckout: true,
    candidate: { commit: "a".repeat(40), cleanCheckout: true, version: libraryManifest.version, integrity: "sha512-candidate", workspaceLockSha256: "lock", sourceSha256: "app", checks: [{ name: "corpus", exitCode: 0 }, { name: "browser", exitCode: 0 }] },
    workspaceLockSha256: "lock", sourceSha256: "app",
  });

  it("accepts only the same clean release SHA, candidate identity, docs source and workspace lock", () => {
    expect(() => validateDocsRegistryReceipt(valid())).not.toThrow();
    for (const changed of [
      { commit: "b".repeat(40) }, { cleanCheckout: false },
      { workspaceLockSha256: "changed-lock" }, { sourceSha256: "changed-app" },
      { candidate: { ...valid().candidate, cleanCheckout: false } },
      { candidate: { ...valid().candidate, checks: [{ name: "corpus", exitCode: 0 }] } },
      { summary: { ...valid().summary, commit: "b".repeat(40) } },
      { receipt: { ...valid().receipt, version: "beta" } },
      { receipt: { ...valid().receipt, integrity: "sha512-other" } },
    ]) expect(() => validateDocsRegistryReceipt({ ...valid(), ...changed })).toThrow();
  });

  it("downloads the exact version and validates bytes without consulting a dist-tag", async () => {
    const bytes = Buffer.from("published candidate");
    const receipt = { ...valid().receipt, integrity: packageIntegrity(bytes) };
    const requests: string[] = [];
    const result = await fetchDocsRegistryArtifact(receipt, async url => {
      requests.push(String(url));
      if (requests.length === 1) return new Response(JSON.stringify({
        name: PACKAGE_NAME, version: receipt.version, dist: { integrity: receipt.integrity, tarball: "https://registry.npmjs.org/unitary-ui.tgz" },
      }));
      return new Response(bytes);
    });
    expect(requests).toEqual([`https://registry.npmjs.org/${encodeURIComponent(PACKAGE_NAME)}/${receipt.version}`, "https://registry.npmjs.org/unitary-ui.tgz"]);
    expect(result.bytes).toEqual(bytes);
  });

  it("fails closed for network errors, wrong package metadata, foreign tarball hosts and altered bytes", async () => {
    const bytes = Buffer.from("published candidate");
    const receipt = { ...valid().receipt, integrity: packageIntegrity(bytes) };
    await expect(fetchDocsRegistryArtifact(receipt, async () => new Response("unavailable", { status: 404 }))).rejects.toThrow("HTTP 404");
    await expect(fetchDocsRegistryArtifact(receipt, async () => { throw new Error("offline"); })).rejects.toThrow("offline");
    for (const metadata of [
      { name: PACKAGE_NAME, version: "0.1.0-beta.0", dist: {} },
      { name: PACKAGE_NAME, version: receipt.version, dist: { integrity: "sha512-other" } },
      { name: PACKAGE_NAME, version: receipt.version, dist: { integrity: receipt.integrity, tarball: "https://example.com/private.tgz" } },
    ]) await expect(fetchDocsRegistryArtifact(receipt, async () => new Response(JSON.stringify(metadata)))).rejects.toThrow();
    let calls = 0;
    await expect(fetchDocsRegistryArtifact(receipt, async () => ++calls === 1 ? new Response(JSON.stringify({
      name: PACKAGE_NAME, version: receipt.version, dist: { integrity: receipt.integrity, tarball: "https://registry.npmjs.org/unitary-ui.tgz" },
    })) : new Response("changed bytes"))).rejects.toThrow("Downloaded registry bytes");
  });

  it("rejects an artifact filename before following a supplied path", () => {
    const root = temp();
    mkdirSync(path.join(root, ".scratch/npm-release"), { recursive: true });
    writeFileSync(path.join(root, "package.json"), JSON.stringify(libraryManifest));
    writeFileSync(path.join(root, ".scratch/npm-release/summary.json"), JSON.stringify({
      name: PACKAGE_NAME, version: libraryManifest.version, filename: "../../private",
    }));
    expect(() => readValidatedPackageArtifact(root)).toThrow();
    expect(readFileSync(path.join(root, ".scratch/npm-release/summary.json"), "utf8")).toContain("../../private");
  });
});
