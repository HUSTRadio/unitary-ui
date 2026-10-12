// @vitest-environment node
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseDocument } from "yaml";
import { cleanLibraryOutput } from "../scripts/clean-library-output.mjs";
import { packageIntegrity, validateInstalledPackage, validatePackageFiles } from "../scripts/lib/package-artifact.mjs";
import { PUBLICATION_WAIT_MS, readPackument, validateArtifact, validateBeta, validateProvenance, validatePublished, validateRelease, waitForPublishedVersion } from "../scripts/lib/npm-release.mjs";

const manifest = { ...JSON.parse(readFileSync("package.json", "utf8")), version: "0.1.0" };
const event = { action: "published", release: { draft: false, prerelease: false, tag_name: "v0.1.0" } };
const directories: string[] = [];
const fixture = () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "unitary-release-test-"));
  directories.push(root);
  return root;
};
afterEach(() => { for (const root of directories.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe("npm release validation", () => {
  const input = () => ({ event: structuredClone(event), manifest: structuredClone(manifest), onMaster: true, packument: null });
  it("allows the missing 0.1.0 package to bootstrap and existing packages to use OIDC", () => {
    expect(validateRelease(input())).toBe("bootstrap");
    expect(validateRelease({ ...input(), packument: { name: manifest.name, versions: {} } })).toBe("oidc");
  });
  it.each([
    { event: { ...event, action: "created" } },
    { event: { ...event, release: { ...event.release, draft: true } } },
    { event: { ...event, release: { ...event.release, prerelease: true } } },
    { event: { ...event, release: { ...event.release, tag_name: "v0.2.0" } } },
    { manifest: { ...manifest, version: "0.1.0-beta.0" } },
    { onMaster: false },
    { packument: { name: manifest.name, versions: { "0.1.0": {} } } },
    { manifest: { ...manifest, version: "0.2.0" }, event: { ...event, release: { ...event.release, tag_name: "v0.2.0" } } },
  ])("rejects invalid Release conditions %#", override => {
    expect(() => validateRelease({ ...input(), ...override })).toThrow();
  });
  it("treats only HTTP 404 as a missing package, failing closed on network/authentication errors", async () => {
    expect(await readPackument(async () => new Response("{}", { status: 404 }))).toBeNull();
    for (const status of [401, 403, 429, 500]) await expect(readPackument(async () => new Response("{}", { status }))).rejects.toThrow(`HTTP ${status}`);
    await expect(readPackument(async () => { throw new Error("network offline"); })).rejects.toThrow("network offline");
    await expect(readPackument(async () => new Response("{}"))).rejects.toThrow();
  });
  it("binds downloaded artifact bytes and filename to the validated release", () => {
    const bytes = Buffer.from("validated tarball");
    const summary = { name: manifest.name, version: "0.1.0", filename: "hustradio-unitary-ui-0.1.0.tgz", integrity: packageIntegrity(bytes) };
    expect(() => validateArtifact(summary, bytes, manifest)).not.toThrow();
    expect(() => validateArtifact(summary, Buffer.from("changed bytes"), manifest)).toThrow();
    expect(() => validateArtifact({ ...summary, filename: "../../secret" }, bytes, manifest)).toThrow();
  });
  it("waits through first-package scanning without repeating publication", async () => {
    let elapsed = 0;
    let reads = 0;
    const published = { versions: { "0.1.0-beta.0": {} } };
    const result = await waitForPublishedVersion("0.1.0-beta.0", {
      now: () => elapsed,
      sleep: async (ms: number) => { elapsed += ms; },
      read: async () => { reads++; return elapsed >= 5 * 60_000 ? published : null; },
    });
    expect(result).toBe(published);
    expect(elapsed).toBe(5 * 60_000);
    expect(reads).toBe(31);
  });
  it("bounds scanning waits and directs recovery without republishing", async () => {
    let elapsed = 0;
    await expect(waitForPublishedVersion("0.1.0-beta.0", {
      now: () => elapsed,
      sleep: async (ms: number) => { elapsed += ms; },
      read: async () => ({ versions: { "0.0.9": {} } }),
    })).rejects.toThrow("do not republish");
    expect(elapsed).toBe(PUBLICATION_WAIT_MS);
  });
  it("fails immediately on registry errors while waiting for scanning", async () => {
    let sleeps = 0;
    await expect(waitForPublishedVersion("0.1.0-beta.0", {
      read: async () => { throw new Error("npm registry query failed: HTTP 401"); },
      sleep: async () => { sleeps++; },
    })).rejects.toThrow("HTTP 401");
    expect(sleeps).toBe(0);
  });
  it("requires the published version, latest, public access, exact integrity and provenance", () => {
    const summary = { version: "0.1.0", integrity: "sha512-expected" };
    const published = { name: manifest.name, publishConfig: { access: "public" }, dist: {
      integrity: summary.integrity, attestations: { provenance: { predicateType: "https://slsa.dev/provenance/v1" }, url: "https://registry.npmjs.org/-/npm/v1/attestations/package" },
    } };
    const packument = { versions: { "0.1.0": published }, "dist-tags": { latest: "0.1.0" } };
    expect(validatePublished(packument, summary)).toContain("registry.npmjs.org");
    expect(() => validatePublished({ ...packument, "dist-tags": { latest: "0.2.0" } }, summary)).toThrow();
    for (const changed of [
      { ...published, publishConfig: { access: "restricted" } },
      { ...published, dist: { ...published.dist, integrity: "sha512-other" } },
      { ...published, dist: { integrity: summary.integrity } },
    ]) expect(() => validatePublished({ ...packument, versions: { "0.1.0": changed } }, summary)).toThrow();
  });
  it("matches the provenance subject, Release commit and publishing workflow", () => {
    const summary = { version: "0.1.0", integrity: packageIntegrity(Buffer.from("artifact")) };
    const sha = "a".repeat(40);
    const statement = { predicateType: "https://slsa.dev/provenance/v1", subject: [{ digest: {
      sha512: Buffer.from(summary.integrity.slice(7), "base64").toString("hex"),
    } }], predicate: { buildDefinition: {
      externalParameters: { workflow: { ref: "refs/tags/v0.1.0", repository: "https://github.com/HUSTRadio/unitary-ui", path: ".github/workflows/publish.yml" } },
      resolvedDependencies: [{ digest: { gitCommit: sha } }],
    }, runDetails: { builder: { id: "https://github.com/actions/runner/github-hosted" } } } };
    const data = { attestations: [{ predicateType: statement.predicateType, bundle: { dsseEnvelope: {
      payload: Buffer.from(JSON.stringify(statement)).toString("base64"), signatures: [{ sig: "registry-served-signature" }],
    } } }] };
    expect(() => validateProvenance(data, summary, sha)).not.toThrow();
    expect(() => validateProvenance(data, summary, "b".repeat(40))).toThrow("commit");
    expect(() => validateProvenance(data, { ...summary, integrity: packageIntegrity(Buffer.from("different")) }, sha)).toThrow("subject");
    expect(() => validateProvenance({ attestations: [] }, summary, sha)).toThrow("bundle");
    statement.predicate.buildDefinition.externalParameters.workflow.ref = "refs/heads/master";
    data.attestations[0].bundle.dsseEnvelope.payload = Buffer.from(JSON.stringify(statement)).toString("base64");
    expect(() => validateProvenance(data, summary, sha, "refs/heads/master")).not.toThrow();
    expect(() => validateProvenance(data, summary, sha)).toThrow("workflow");
  });
});

describe("manual beta publication", () => {
  const input = () => ({
    event: { inputs: { version: "0.1.0-beta.0" } },
    manifest: { ...manifest, version: "0.1.0-beta.0" },
    ref: "refs/heads/master",
    onMaster: true,
    packument: null,
  });
  it("bootstraps only the initial beta and uses OIDC once the package exists", () => {
    expect(validateBeta(input())).toBe("bootstrap");
    expect(
      validateBeta({
        ...input(),
        manifest: { ...manifest, version: "0.1.0-beta.1" },
        event: { inputs: { version: "0.1.0-beta.1" } },
        packument: { name: manifest.name, versions: {} },
      }),
    ).toBe("oidc");
  });
  it.each([
    { ref: "refs/heads/feature" },
    { ref: "refs/tags/v0.1.0-beta.0" },
    { onMaster: false },
    { event: { inputs: { version: "0.1.0-beta.1" } } },
    { event: {} },
    { manifest: { ...manifest, version: "0.1.0" } },
    { manifest: { ...manifest, version: "0.1.0-rc.0" } },
    {
      manifest: { ...manifest, version: "0.1.0-beta.1" },
      event: { inputs: { version: "0.1.0-beta.1" } },
    },
    { packument: { name: manifest.name, versions: { "0.1.0-beta.0": {} } } },
  ])("rejects an invalid beta request %#", (override) => {
    expect(() => validateBeta({ ...input(), ...override })).toThrow();
  });
  it("verifies the beta tag independently of latest", () => {
    const summary = { version: "0.1.0-beta.0", integrity: "sha512-expected" };
    const published = {
      name: manifest.name,
      publishConfig: { access: "public" },
      dist: {
        integrity: summary.integrity,
        attestations: {
          provenance: {},
          url: "https://registry.npmjs.org/-/npm/v1/attestations/package",
        },
      },
    };
    const packument = {
      versions: { [summary.version]: published },
      "dist-tags": { beta: summary.version, latest: "0.0.9" },
    };
    expect(() => validatePublished(packument, summary, "beta")).not.toThrow();
    // npm assigns latest on first publication even with --tag beta and rejects its removal.
    expect(() => validatePublished({ ...packument, "dist-tags": { beta: summary.version, latest: summary.version } }, summary, "beta")).not.toThrow();
    expect(() => validatePublished(packument, summary)).toThrow("latest");
    expect(() =>
      validatePublished({ ...packument, "dist-tags": { beta: "0.1.0-beta.1" } }, summary, "beta"),
    ).toThrow("beta");
  });
});

describe("release artifacts", () => {
  it("removes stale library files while preserving unrelated outputs and rejects linked dist", () => {
    const root = fixture();
    mkdirSync(path.join(root, "dist/types"), { recursive: true });
    writeFileSync(path.join(root, "dist/types/stale.d.ts"), "stale");
    writeFileSync(path.join(root, "keep.txt"), "keep");
    cleanLibraryOutput(root);
    expect(existsSync(path.join(root, "dist"))).toBe(false);
    expect(readFileSync(path.join(root, "keep.txt"), "utf8")).toBe("keep");
    const outside = fixture();
    symlinkSync(outside, path.join(root, "dist"), process.platform === "win32" ? "junction" : "dir");
    expect(() => cleanLibraryOutput(root)).toThrow("linked");
    expect(existsSync(outside)).toBe(true);
  });
  it("requires legal documents and entry points and rejects application and scratch output", () => {
    const documents = ["LICENSE", "LICENSE.zh-CN.md", "OFL-1.1.txt", "CREDITS.md", "CREDITS.en.md", "CHANGELOG.md", "CHANGELOG.en.md", "THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md", "README.md", "README.en.md", "package.json"];
    const files = [...documents, "dist/unitary-ui.es.js", "dist/unitary-ui.cjs", "dist/unitary-ui.css", "dist/tailwind-reference.css", "dist/types/lib/index.d.ts"];
    expect(validatePackageFiles(files, manifest)).toContain("dist/unitary-ui.css");
    for (const omitted of ["OFL-1.1.txt", "THIRD_PARTY_NOTICES.en.md", "dist/types/lib/index.d.ts", "dist/tailwind-reference.css"]) expect(() => validatePackageFiles(files.filter(file => file !== omitted), manifest)).toThrow("Missing");
    for (const extra of ["dist/assets/demo.js", "dist/unitary-ui.es.js.map", "scripts/release.mjs", "dist/.scratch/private.txt", "../private"]) expect(() => validatePackageFiles([...files, extra], manifest)).toThrow();
  });
  it("checks installed chunk, declaration and font references without repository resolution", () => {
    const root = fixture();
    const write = (file: string, text: string) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
    write("package.json", JSON.stringify(manifest));
    write("dist/unitary-ui.es.js", 'import("./motion.js");');
    write("dist/motion.js", "export {};");
    write("dist/types/lib/index.d.ts", 'export { Probe } from "./probe";');
    write("dist/types/lib/probe.d.ts", "export type Probe = string;");
    write("dist/unitary-ui.css", "@font-face{src:url(./fonts/test.woff2)}");
    write("dist/tailwind-reference.css", '@import "./color-schemes.css";');
    write("dist/color-schemes.css", ":root {}");
    write("dist/fonts/test.woff2", "font");
    const notice = "Maple Mono OPPO Sans HarmonyOS Sans Material Symbols Rounded Apache License";
    for (const name of ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.en.md"]) write(name, notice);
    expect(() => validateInstalledPackage(root, ["test.woff2"])).not.toThrow();
    rmSync(path.join(root, "dist/color-schemes.css"));
    expect(() => validateInstalledPackage(root, ["test.woff2"])).toThrow("Missing reference");
    write("dist/color-schemes.css", ":root {}");
    rmSync(path.join(root, "dist/motion.js"));
    expect(() => validateInstalledPackage(root, ["test.woff2"])).toThrow("Missing reference");
    write("dist/motion.js", "export {};");
    rmSync(path.join(root, "dist/fonts/test.woff2"));
    expect(() => validateInstalledPackage(root, ["test.woff2"])).toThrow("Missing CSS font");
  });
});

describe("publishing workflow gates", () => {
  it.each(["docs/guides/npm-release.md", "docs/guides/npm-release.en.md"])("documents bootstrap, OIDC and recovery for %s", file => {
    const guide = readFileSync(file, "utf8");
    for (const value of ["HUSTRadio", "unitary-ui", "publish.yml", "npmjs", "NPM_TOKEN", "20", "30", "latest", "beta", "https://docs.npmjs.com/trusted-publishers/"]) expect(guide).toContain(value);
    expect(guide).toMatch(/48/);
  });
  it("publishes only after every required validation and scopes the bootstrap credential to one step", () => {
    const parsed = parseDocument(readFileSync(".github/workflows/publish.yml", "utf8"));
    expect(parsed.errors).toEqual([]);
    type Step = { uses?: string; run?: string; if?: string; env?: Record<string, string>; "working-directory"?: string };
    const workflow = parsed.toJS() as {
      on: unknown;
      concurrency: Record<string, unknown>;
      jobs: Record<string, { needs?: string[]; environment?: string; permissions?: Record<string, string>; "timeout-minutes": number; steps: Step[] }>;
    };
    expect(workflow.on).toEqual({ release: { types: ["published"] }, workflow_dispatch: { inputs: { version: {
      description: "Beta version matching package.json (run on master)", required: true, type: "string",
    } } } });
    expect(workflow.concurrency["cancel-in-progress"]).toBe(false);
    expect(workflow.jobs.package.needs).toEqual(["guard", "ci", "browsers"]);
    const job = workflow.jobs.publish;
    expect(job["timeout-minutes"] * 60_000).toBeGreaterThan(PUBLICATION_WAIT_MS + 5 * 60_000);
    expect(job.needs).toEqual(["guard", "ci", "browsers", "package"]);
    expect(job.environment).toBe("npmjs");
    expect(job.permissions).toEqual({ contents: "read", "id-token": "write" });
    const credentialSteps = job.steps.filter(step => JSON.stringify(step).includes("secrets.NPM_TOKEN"));
    expect(credentialSteps).toHaveLength(1);
    expect(credentialSteps[0].if).toBe("steps.artifact.outputs.mode == 'bootstrap'");
    expect(credentialSteps[0].run).toContain('test -n "$NODE_AUTH_TOKEN"');
    expect(credentialSteps[0].env?.PACKAGE_TAG).toBe("${{ steps.artifact.outputs.tag }}");
    expect(credentialSteps[0].run).toContain('--tag "$PACKAGE_TAG"');
    const oidc = job.steps.find(step => step.if === "steps.artifact.outputs.mode == 'oidc'");
    expect(oidc?.env?.NODE_AUTH_TOKEN).toBe("");
    for (const step of [credentialSteps[0], oidc!]) {
      expect(step["working-directory"]).toBe("${{ runner.temp }}");
      expect(step.run).toContain('npm publish "$GITHUB_WORKSPACE/.scratch/npm-release/$PACKAGE_FILE"');
    }
    expect(job.steps.some(step => /pnpm install|build:lib|test:package/.test(step.run ?? ""))).toBe(false);
    const receiptIndex = job.steps.findIndex(step => step.run === "node scripts/npm-release.mjs check-artifact");
    expect(receiptIndex).toBeGreaterThan(0);
    expect(job.steps.indexOf(credentialSteps[0])).toBeGreaterThan(receiptIndex);
    const docs = workflow.jobs["docs-static"];
    expect(docs.needs).toEqual(["guard", "package", "publish"]);
    expect(docs.permissions).toEqual({ contents: "read" });
    expect(docs.steps.some(step => step.run === "pnpm run build:docs:registry -- --receipt .scratch/npm-release/published.json")).toBe(true);
    expect(docs.steps.some(step => /npm publish|build:lib|test:package/.test(step.run ?? ""))).toBe(false);
    expect(JSON.stringify(docs)).not.toContain("NPM_TOKEN");
    for (const current of Object.values(workflow.jobs) as Array<{ steps?: Array<{ uses?: string }> }>) {
      for (const step of current.steps ?? []) if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
    }
    for (const name of ["ci", "e2e-nightly"]) expect(parseDocument(readFileSync(`.github/workflows/${name}.yml`, "utf8")).toJS().on).toHaveProperty("workflow_call");
  });
});
