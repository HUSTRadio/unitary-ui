import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { describe, expect, test } from "vitest";

const auditDir = resolve(import.meta.dirname);
const readJson = (name: string) => JSON.parse(readFileSync(resolve(auditDir, name), "utf8"));

const compileLedgerSchema = () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(readJson("geist-audit-ledger.schema.json"));
};

const expectRejected = (ledger: unknown) => {
  const validate = compileLedgerSchema();
  expect(validate(ledger), JSON.stringify(validate.errors, null, 2)).toBe(false);
};

const validResult: Record<string, unknown> = {
  cellKey: "description/default/default/light/375x812",
  slug: "description",
  variant: "default",
  state: "default",
  theme: "light",
  viewport: "375x812",
  evidenceStatus: "READY",
  semanticAcceptanceStatus: "FAIL",
  status: "FAIL",
  diagnosticPixelStatus: "DIFFERENT",
  strictFailures: [
    {
      classification: "GEOMETRY_MISMATCH",
      scope: "role",
      role: "root",
      field: "width",
      official: 277,
      local: 276,
    },
  ],
  approvedExclusions: [
    {
      classification: "FONT_FAMILY_MAPPING",
      scope: "role",
      role: "root",
      fields: ["fontFamily"],
      official: '"Geist", "Inter", sans-serif',
      local: '"HarmonyOS Sans SC", sans-serif',
    },
  ],
  roleClassifications: [{ role: "root", verdict: "MISMATCH" }],
  pixel: {
    changed_pixels: 2050,
    total_pixels: 11080,
    changed_ratio: 0.185,
    dimension_mismatch: true,
  },
  geometry: {
    max_geometry_delta_px: 4.65625,
    missing_paths: [],
  },
  officialEvidenceTimestamp: "2026-08-12T04:05:49.165Z",
  auditRunId: "audit-20260812-01",
  contractDigest: "a".repeat(64),
  localRevision: "b".repeat(40),
  localSourceDigest: "c".repeat(64),
  worktreeClean: true,
  artifacts: {
    officialScreenshot: "external:official/screenshot.png",
    localScreenshot: "external:local/screenshot.png",
    comparison: "external:comparison/comparison.json",
  },
};

const validLedger = {
  schemaVersion: 2,
  status: "IN_PROGRESS_NO_COMPLETION_CLAIM",
  results: [validResult],
};

describe("ledger v2 schema and state mapping", () => {
  test("accepts a valid v2 ledger with dual status fields", () => {
    const validate = compileLedgerSchema();
    expect(validate(validLedger), JSON.stringify(validate.errors, null, 2)).toBe(true);
  });

  test("rejects schemaVersion 1", () => {
    expectRejected({ ...structuredClone(validLedger), schemaVersion: 1 });
  });

  test("rejects missing evidenceStatus or semanticAcceptanceStatus", () => {
    for (const field of ["evidenceStatus", "semanticAcceptanceStatus", "status"]) {
      const missing = structuredClone(validLedger);
      delete missing.results[0][field];
      expectRejected(missing);
    }
  });

  test("READY evidence with PASS semantic maps status to PASS", () => {
    const ledger = structuredClone(validLedger);
    ledger.results[0].semanticAcceptanceStatus = "PASS";
    ledger.results[0].status = "PASS";
    ledger.results[0].strictFailures = [];
    const validate = compileLedgerSchema();
    expect(validate(ledger)).toBe(true);
  });

  test("READY evidence with BLOCKED semantic maps status to BLOCKED", () => {
    const ledger = structuredClone(validLedger);
    ledger.results[0].semanticAcceptanceStatus = "BLOCKED";
    ledger.results[0].status = "BLOCKED";
    const validate = compileLedgerSchema();
    expect(validate(ledger)).toBe(true);
  });

  test("BLOCKED evidence forces semantic and status to BLOCKED", () => {
    const ledger = structuredClone(validLedger);
    ledger.results[0].evidenceStatus = "BLOCKED";
    ledger.results[0].semanticAcceptanceStatus = "BLOCKED";
    ledger.results[0].status = "BLOCKED";
    const validate = compileLedgerSchema();
    expect(validate(ledger)).toBe(true);
  });

  test("MISSING evidence forces semantic to null and status to MISSING", () => {
    const ledger = structuredClone(validLedger);
    ledger.results[0].evidenceStatus = "MISSING";
    ledger.results[0].semanticAcceptanceStatus = null;
    ledger.results[0].status = "MISSING";
    const validate = compileLedgerSchema();
    expect(validate(ledger)).toBe(true);
  });

  test("NOT_APPLICABLE evidence forces semantic to null and status to NOT_APPLICABLE", () => {
    const ledger = structuredClone(validLedger);
    ledger.results[0].evidenceStatus = "NOT_APPLICABLE";
    ledger.results[0].semanticAcceptanceStatus = null;
    ledger.results[0].status = "NOT_APPLICABLE";
    const validate = compileLedgerSchema();
    expect(validate(ledger)).toBe(true);
  });

  test("rejects READY with null semantic or MISSING with non-null semantic", () => {
    const readyNull = structuredClone(validLedger);
    readyNull.results[0].semanticAcceptanceStatus = null;
    expectRejected(readyNull);

    const missingWithSemantic = structuredClone(validLedger);
    missingWithSemantic.results[0].evidenceStatus = "MISSING";
    missingWithSemantic.results[0].semanticAcceptanceStatus = "PASS";
    missingWithSemantic.results[0].status = "MISSING";
    expectRejected(missingWithSemantic);
  });

  test("rejects READY result without strictFailures, approvedExclusions or artifacts", () => {
    for (const field of [
      "strictFailures",
      "approvedExclusions",
      "diagnosticPixelStatus",
      "artifacts",
      "auditRunId",
      "contractDigest",
    ]) {
      const missing = structuredClone(validLedger);
      delete missing.results[0][field];
      expectRejected(missing);
    }
  });

  test("rejects non-40-char localRevision and non-64-char contractDigest", () => {
    const badRevision = structuredClone(validLedger);
    badRevision.results[0].localRevision = "short";
    expectRejected(badRevision);

    const badDigest = structuredClone(validLedger);
    badDigest.results[0].contractDigest = "short";
    expectRejected(badDigest);
  });

  test("the checked-in ledger validates against the v2 schema", () => {
    const ledger = readJson("geist-audit-ledger.json");
    const validate = compileLedgerSchema();
    expect(validate(ledger), JSON.stringify(validate.errors, null, 2)).toBe(true);
  });
});
