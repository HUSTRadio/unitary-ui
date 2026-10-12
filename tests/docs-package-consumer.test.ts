// @vitest-environment node
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { stringify } from "yaml";
import {
  CONSUMER_TARBALL, DOCS_PUBLIC_ASSETS, assertDocsRegistryReleaseUnchanged, createDocsConsumerLock, docsApplicationLock,
  docsConsumerInstallOptions, parseDocsRegistryArgs, readDocsRegistryRelease,
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

  it("exempts only the integrity-verified published version in the registry consumer's own workspace", () => {
    const bytes = Buffer.from("verified publication");
    const receipt = { name: PACKAGE_NAME, version: libraryManifest.version, integrity: packageIntegrity(bytes) };
    const options = docsConsumerInstallOptions({ mode: "registry", libraryManifest, bytes, receipt });
    expect(options.workspace).toEqual({ packages: ["."], minimumReleaseAgeExclude: [`${PACKAGE_NAME}@${libraryManifest.version}`] });
    expect(options.workspace).not.toHaveProperty("minimumReleaseAge");
    expect(options.args).not.toContain("--ignore-workspace");
    expect(options.args).toEqual(expect.arrayContaining(["--frozen-lockfile", "--ignore-scripts"]));
    expect(options.args.some((argument: string) => /minimum[-]?release[-]?age/i.test(argument))).toBe(false);
    const tarball = docsConsumerInstallOptions({ mode: "tarball", libraryManifest, bytes });
    expect(tarball.workspace).toBeUndefined();
    expect(tarball.args).toContain("--ignore-workspace");
    for (const changed of [
      undefined, { ...receipt, name: "other-package" }, { ...receipt, version: "0.1.0-beta.2" },
      { ...receipt, version: "*" }, { ...receipt, integrity: packageIntegrity(Buffer.from("other bytes")) },
    ]) expect(() => docsConsumerInstallOptions({ mode: "registry", libraryManifest, bytes, receipt: changed })).toThrow();
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
    expect(docsConsumerInstallOptions({ mode: "registry", libraryManifest, bytes: result.bytes, receipt }).workspace?.minimumReleaseAgeExclude)
      .toEqual([`${PACKAGE_NAME}@${receipt.version}`]);
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

describe("registry docs recovery from an original release checkout", () => {
  const write = (root: string, name: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  };
  const git = (root: string, ...args: string[]) => execFileSync("git", [
    "-c", "commit.gpgsign=false", "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid",
    "-c", `core.hooksPath=${path.join(root, "no-hooks")}`, ...args,
  ], { cwd: root, encoding: "utf8" }).trim();
  const releaseFixture = () => {
    const toolingRoot = temp();
    const releaseRoot = temp();
    const manifest = JSON.parse(readFileSync("package.json", "utf8"));
    for (const root of [toolingRoot, releaseRoot]) {
      write(root, ".gitignore", ".scratch/\n");
      write(root, "marker", root === toolingRoot ? "tooling" : "release");
      git(root, "init", "-q");
    }
    write(releaseRoot, "package.json", JSON.stringify(manifest));
    write(releaseRoot, "pnpm-lock.yaml", "original release lock");
    for (const name of ["index.html", "vite.config.ts", "site/src/main.tsx", "site/build/plugin.ts", "site/tsconfig.json"])
      write(releaseRoot, `docs/${name}`, `release ${name}`);
    for (const name of DOCS_PUBLIC_ASSETS) write(releaseRoot, `public/${name}`, name);
    for (const root of [toolingRoot, releaseRoot]) {
      git(root, "add", ".");
      git(root, "commit", "-qm", "fixture");
    }
    const commit = git(releaseRoot, "rev-parse", "HEAD");
    const bytes = Buffer.from("original validated artifact");
    const integrity = packageIntegrity(bytes);
    const documents = ["LICENSE", "LICENSE.zh-CN.md", "OFL-1.1.txt", "CREDITS.md", "CREDITS.en.md", "CHANGELOG.md", "CHANGELOG.en.md", "THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md", "README.md", "README.en.md"];
    const files = [...documents, "package.json", ...[manifest.main, manifest.module, manifest.types,
      manifest.exports["./styles.css"], manifest.exports["./tailwind-reference.css"]].map(target => target.replace(/^\.\//, ""))].sort();
    const receipt = { name: PACKAGE_NAME, version: manifest.version, integrity, commit };
    const summary = {
      ...receipt, filename: `hustradio-unitary-ui-${manifest.version}.tgz`,
      sha256: createHash("sha256").update(bytes).digest("hex"), files,
      docs: { ...receipt, cleanCheckout: true, sourceSha256: docsSourceDigest(path.join(releaseRoot, "docs")),
        workspaceLockSha256: createHash("sha256").update("original release lock").digest("hex"),
        checks: [{ name: "corpus", exitCode: 0 }, { name: "browser", exitCode: 0 }] },
    };
    const output = path.join(releaseRoot, ".scratch/npm-release");
    mkdirSync(output, { recursive: true });
    writeFileSync(path.join(output, summary.filename), bytes);
    writeFileSync(path.join(output, "summary.json"), JSON.stringify(summary));
    writeFileSync(path.join(output, "files.json"), JSON.stringify(files));
    writeFileSync(path.join(output, "published.json"), JSON.stringify(receipt));
    return { toolingRoot, releaseRoot, output, receipt, summary };
  };

  it("accepts either option order with literal paths and rejects missing, duplicate or unknown arguments", () => {
    const cwd = temp();
    const expected = { releaseRoot: path.join(cwd, "release checkout"), receiptPath: path.join(cwd, "publication.json") };
    expect(parseDocsRegistryArgs(["--release-root", "release checkout", "--receipt", "publication.json"], cwd)).toEqual(expected);
    expect(parseDocsRegistryArgs(["--receipt", "publication.json", "--release-root", "release checkout"], cwd)).toEqual(expected);
    expect(parseDocsRegistryArgs([], cwd)).toEqual({ releaseRoot: undefined, receiptPath: undefined });
    for (const args of [["--release-root"], ["--receipt"], ["--unknown", "value"], ["--receipt", "--release-root"], ["--release-root", "one", "--release-root", "two"]])
      expect(() => parseDocsRegistryArgs(args, cwd)).toThrow();
  });

  it("reads the original release's artifact, source, lock and default receipt while recording the distinct tooling commit", () => {
    const fixture = releaseFixture();
    const release = readDocsRegistryRelease(fixture.toolingRoot, { releaseRoot: fixture.releaseRoot });
    expect(release.root).toBe(fixture.releaseRoot);
    expect(release.output).toBe(fixture.output);
    expect(release.receipt).toEqual(fixture.receipt);
    expect(release.summary).toEqual(fixture.summary);
    expect(release.toolingCleanCheckout).toBe(true);
    expect(release.toolingCommit).toBe(git(fixture.toolingRoot, "rev-parse", "HEAD"));
    expect(release.toolingCommit).not.toBe(release.receipt.commit);
    expect(() => assertDocsRegistryReleaseUnchanged(fixture.toolingRoot, { releaseRoot: fixture.releaseRoot }, release)).not.toThrow();
    expect(() => readDocsRegistryRelease(fixture.toolingRoot)).toThrow();
  });

  it("requires both checkouts clean and rechecks source, lock, receipts and tooling identity after verification", () => {
    const fixture = releaseFixture();
    const options = { releaseRoot: fixture.releaseRoot };
    const initial = readDocsRegistryRelease(fixture.toolingRoot, options);
    write(fixture.toolingRoot, "marker", "dirty tooling");
    expect(() => readDocsRegistryRelease(fixture.toolingRoot, options)).toThrow("clean tooling checkout");
    write(fixture.toolingRoot, "marker", "tooling");
    write(fixture.releaseRoot, "docs/site/src/main.tsx", "changed source");
    expect(() => assertDocsRegistryReleaseUnchanged(fixture.toolingRoot, options, initial)).toThrow("clean release checkout");
    write(fixture.releaseRoot, "docs/site/src/main.tsx", "release site/src/main.tsx");
    writeFileSync(path.join(fixture.output, "summary.json"), JSON.stringify({ ...fixture.summary, docs: { ...fixture.summary.docs, sourceSha256: "other source" } }));
    expect(() => readDocsRegistryRelease(fixture.toolingRoot, options)).toThrow("application differs");
    writeFileSync(path.join(fixture.output, "summary.json"), JSON.stringify({ ...fixture.summary, docs: { ...fixture.summary.docs, workspaceLockSha256: "other lock" } }));
    expect(() => readDocsRegistryRelease(fixture.toolingRoot, options)).toThrow("Workspace lock differs");
    writeFileSync(path.join(fixture.output, "summary.json"), JSON.stringify(fixture.summary));
    writeFileSync(path.join(fixture.output, "published.json"), JSON.stringify({ ...fixture.receipt, provenance: "changed receipt" }));
    expect(() => assertDocsRegistryReleaseUnchanged(fixture.toolingRoot, options, initial)).toThrow("receipt changed");
    writeFileSync(path.join(fixture.output, "published.json"), JSON.stringify(fixture.receipt));
    write(fixture.toolingRoot, "marker", "new clean tooling commit");
    git(fixture.toolingRoot, "add", "marker");
    git(fixture.toolingRoot, "commit", "-qm", "later tooling");
    expect(() => assertDocsRegistryReleaseUnchanged(fixture.toolingRoot, options, initial)).toThrow("toolingCommit changed");
  });
});
