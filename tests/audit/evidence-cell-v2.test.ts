import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, test } from "vitest";
import { collectEvidenceCellSemanticViolations } from "./evidence-v2.mjs";

const auditDir = resolve(import.meta.dirname);
const readJson = (name: string) => JSON.parse(readFileSync(resolve(auditDir, name), "utf8"));
const compileSchema = () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  ajv.addSchema(readJson("geist-audit-manifest.schema.json"));
  return ajv.compile(readJson("evidence-cell.schema.json"));
};
const fixtureManifest = {
  schemaVersion: 2,
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
    approvedFontMappings: [],
    localSourceInputs: ["src/**"],
    pixelAttribution: {
      foregroundColorDistanceMax: 0,
      edgeExpansionDevicePixels: 1,
    },
  },
};

const expectRejected = (cell: unknown) => {
  const validate = compileSchema();
  expect(validate(cell), JSON.stringify(validate.errors, null, 2)).toBe(false);
};

describe("evidence cell v2 schema", () => {
  test("accepts the checked-in v2 fixture and locks producer/freshness fields", () => {
    const fixture = readJson("fixtures/evidence-cell-v2.json");
    const validate = compileSchema();

    expect(validate(fixture), JSON.stringify(validate.errors, null, 2)).toBe(true);
    expect(collectEvidenceCellSemanticViolations(fixture, fixtureManifest)).toEqual([]);
    expect(fixture.schemaVersion).toBe(2);
    expect(fixture.auditRunId).toBeTruthy();
    expect(fixture.contractDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(fixture.producer.collectorSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(fixture.producer.browserVersion).toBeTruthy();
    expect(fixture.artifacts).toEqual({
      screenshot: "screenshot.png",
      metrics: "metrics.json",
    });
    expect(Date.parse(fixture.navigationStartedAt)).toBeLessThanOrEqual(
      Date.parse(fixture.stateStabilizedAt),
    );
    expect(Date.parse(fixture.stateStabilizedAt)).toBeLessThanOrEqual(
      Date.parse(fixture.capturedAt),
    );
  });

  test("rejects legacy, incomplete, dirty and malformed evidence", () => {
    const fixture = readJson("fixtures/evidence-cell-v2.json");
    expectRejected({ ...structuredClone(fixture), schemaVersion: 1 });

    for (const field of [
      "auditRunId",
      "contractDigest",
      "contract",
      "navigationStartedAt",
      "stateStabilizedAt",
      "capturedAt",
      "producer",
      "artifacts",
    ]) {
      const missing = structuredClone(fixture);
      delete missing[field];
      expectRejected(missing);
    }

    const dirty = structuredClone(fixture);
    dirty.source = "local";
    dirty.worktreeClean = false;
    dirty.localRevision = "a".repeat(40);
    dirty.localSourceDigest = "b".repeat(64);
    dirty.localSourceFiles = ["package.json"];
    expectRejected(dirty);

    const badRevision = structuredClone(fixture);
    badRevision.source = "local";
    badRevision.worktreeClean = true;
    badRevision.localRevision = "short";
    badRevision.localSourceDigest = "b".repeat(64);
    badRevision.localSourceFiles = ["package.json"];
    expectRejected(badRevision);
  });

  test("semantic validation rejects stale, inverted and tampered evidence", () => {
    const fixture = readJson("fixtures/evidence-cell-v2.json");

    const inverted = structuredClone(fixture);
    inverted.capturedAt = "2026-08-12T01:59:59.000Z";
    expect(collectEvidenceCellSemanticViolations(inverted, fixtureManifest)).toContainEqual(
      expect.objectContaining({ reason: expect.stringContaining("time order") }),
    );

    const stale = structuredClone(fixture);
    stale.stateStabilizedAt = "2026-08-12T00:59:59.000Z";
    expect(collectEvidenceCellSemanticViolations(stale, fixtureManifest)).toContainEqual(
      expect.objectContaining({ reason: expect.stringContaining("effective evidence epoch") }),
    );

    const tampered = structuredClone(fixture);
    tampered.contract.roles.root.acceptanceProfile = "mapped-text";
    expect(collectEvidenceCellSemanticViolations(tampered, fixtureManifest)).toContainEqual(
      expect.objectContaining({ reason: expect.stringContaining("contractDigest") }),
    );
  });
});
