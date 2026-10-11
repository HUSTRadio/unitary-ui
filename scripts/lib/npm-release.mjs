import assert from "node:assert/strict";
import { PACKAGE_NAME, REGISTRY, packageIntegrity } from "./package-artifact.mjs";

export function validateRelease({ event, manifest, onMaster, packument }) {
  assert.equal(manifest.name, PACKAGE_NAME, "Unexpected package name");
  assert.equal(event.action, "published", "Only published Releases may publish npm packages");
  assert.equal(event.release?.draft, false, "Draft Releases cannot publish");
  assert.equal(event.release?.prerelease, false, "Prereleases cannot publish to latest");
  assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, "Only stable versions may publish");
  assert.equal(event.release.tag_name, `v${manifest.version}`, "Release tag must match package.version");
  assert.equal(onMaster, true, "Release commit must belong to master");
  assert.ok(!packument?.versions?.[manifest.version], "Target version already exists; do not republish it");
  if (packument === null) {
    assert.equal(manifest.version, "0.1.0", "Only initial 0.1.0 may bootstrap a missing package");
    return "bootstrap";
  }
  assert.equal(packument.name, PACKAGE_NAME, "Unexpected registry package");
  return "oidc";
}

export function validateArtifact(summary, bytes, manifest) {
  assert.equal(summary.name, PACKAGE_NAME);
  assert.equal(summary.version, manifest.version);
  assert.equal(summary.filename, `hustradio-unitary-ui-${manifest.version}.tgz`);
  assert.equal(summary.integrity, packageIntegrity(bytes), "Artifact integrity differs from validated package");
}

export function validateBeta({ event, manifest, ref, onMaster, packument }) {
  assert.equal(manifest.name, PACKAGE_NAME, "Unexpected package name");
  assert.match(
    manifest.version,
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-beta\.(0|[1-9]\d*)$/,
    "Manual publication requires a beta version",
  );
  assert.equal(
    event.inputs?.version,
    manifest.version,
    "Requested beta version must match package.version",
  );
  assert.equal(ref, "refs/heads/master", "Beta publication must run on master");
  assert.equal(onMaster, true, "Beta commit must belong to master");
  assert.ok(
    !packument?.versions?.[manifest.version],
    "Target version already exists; do not republish it",
  );
  if (packument === null) {
    assert.equal(
      manifest.version,
      "0.1.0-beta.0",
      "Only initial 0.1.0-beta.0 may bootstrap a missing package",
    );
    return "bootstrap";
  }
  assert.equal(packument.name, PACKAGE_NAME, "Unexpected registry package");
  return "oidc";
}

export function validatePublished(packument, summary, tag = "latest") {
  const version = packument.versions?.[summary.version];
  assert.ok(version, "Published version is missing");
  assert.equal(packument["dist-tags"]?.[tag], summary.version, `${tag} points to another version`);
  assert.equal(version.dist?.integrity, summary.integrity, "Registry tarball differs from validated artifact");
  assert.equal(version.name, PACKAGE_NAME);
  assert.equal(version.publishConfig?.access, "public");
  assert.ok(version.dist?.attestations?.provenance, "Published package has no provenance");
  const attestation = new URL(version.dist.attestations.url);
  assert.equal(attestation.origin, new URL(REGISTRY).origin, "Unexpected attestation registry");
  return attestation.href;
}

export function validateProvenance(data, summary, sha, ref = `refs/tags/v${summary.version}`) {
  const type = "https://slsa.dev/provenance/v1";
  const bundle = data.attestations?.find(item => item.predicateType === type)?.bundle;
  const envelope = bundle?.dsseEnvelope;
  assert.ok(envelope?.payload && envelope.signatures?.length, "Signed provenance bundle is missing");
  const statement = JSON.parse(Buffer.from(envelope.payload, "base64").toString("utf8"));
  assert.equal(statement.predicateType, type);
  const digest = Buffer.from(summary.integrity.slice("sha512-".length), "base64").toString("hex");
  assert.ok(statement.subject?.some(subject => subject.digest?.sha512 === digest), "Provenance subject differs from the published tarball");
  const definition = statement.predicate?.buildDefinition;
  assert.deepEqual(definition?.externalParameters?.workflow, {
    ref,
    repository: "https://github.com/HUSTRadio/unitary-ui",
    path: ".github/workflows/publish.yml",
  }, "Provenance workflow differs from the configured publisher");
  assert.ok(definition.resolvedDependencies?.some(dependency => dependency.digest?.gitCommit === sha), "Provenance commit differs from the Release");
  assert.equal(statement.predicate.runDetails?.builder?.id, "https://github.com/actions/runner/github-hosted");
}

export async function readPackument(fetcher = fetch) {
  const response = await fetcher(`${REGISTRY}${encodeURIComponent(PACKAGE_NAME)}`, { signal: AbortSignal.timeout(30_000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`npm registry query failed: HTTP ${response.status}`);
  const body = await response.json();
  assert.equal(body.name, PACKAGE_NAME, "Malformed npm registry response");
  assert.ok(body.versions && typeof body.versions === "object", "Registry response omits versions");
  return body;
}

export const PUBLICATION_WAIT_MS = 20 * 60_000;

/** npm scans uploads before exposing versions; polling never repeats a publish. */
export async function waitForPublishedVersion(version, {
  read = readPackument,
  now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  timeoutMs = PUBLICATION_WAIT_MS,
  intervalMs = 10_000,
} = {}) {
  const deadline = now() + timeoutMs;
  for (;;) {
    const packument = await read();
    if (packument?.versions?.[version]) return packument;
    const remaining = deadline - now();
    if (remaining <= 0) throw new Error("Published version is still unavailable after waiting for npm scanning; do not republish it");
    await sleep(Math.min(intervalMs, remaining));
  }
}
