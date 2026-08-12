import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const auditDir = join(root, "tests/audit");
const comparator = join(auditDir, "compare-replica-evidence.py");

const makeImage = (dir: string, name: string, w = 2, h = 2) => {
  const path = join(dir, name);
  const script = `import sys\nfrom PIL import Image\nImage.new('RGBA',(${w},${h}),(0,0,0,255)).save(sys.argv[1])`;
  execFileSync("python", ["-c", script, path]);
  return path;
};

const metrics = {
  viewport: "375x812",
  root: { x: 0, y: 0, width: 100, height: 100 },
  roles: {
    root: {
      selector: "[data-root]",
      present: true,
      rect: { x: 0, y: 0, width: 100, height: 100 },
      styles: {
        display: "block",
        position: "static",
        width: "100px",
        height: "100px",
        padding: "0px",
        margin: "0px",
        border: "0px",
        borderRadius: "0px",
        background: "rgb(255, 255, 255)",
        color: "rgb(0, 0, 0)",
        fontFamily: "Arial, sans-serif",
        transition: "none",
        animation: "none",
      },
      aria: { role: "dialog" },
      ancestorChain: [],
    },
  },
};

const cell = (overrides: Record<string, unknown> = {}) => ({
  schemaVersion: 2,
  source: "official",
  slug: "drawer",
  demoId: "default",
  variant: "default",
  state: "open",
  theme: "dark",
  viewport: { width: 375, height: 812 },
  viewportText: "375x812",
  url: "https://vercel.com/geist/drawer",
  rootSelector: "[data-root]",
  roleSelectors: { root: "[data-root]" },
  auditRunId: "audit-20260812-01",
  contractDigest: "a".repeat(64),
  effectiveEvidenceNotBefore: "2026-08-12T00:00:00.000Z",
  contract: {
    demoId: "default",
    variant: "default",
    state: "open",
    clipRole: "root",
    evidenceNotBefore: "2026-08-12T00:00:00.000Z",
    roles: {
      root: {
        selectors: {
          default: { official: "[data-root]", local: "[data-root]" },
          byViewport: {},
        },
        presence: "required",
        acceptanceProfile: "strict",
      },
    },
    semanticNodeInventory: [],
    transparentWrappers: [],
  },
  navigationStartedAt: "2026-08-12T02:00:00.000Z",
  stateStabilizedAt: "2026-08-12T02:00:01.000Z",
  capturedAt: "2026-08-12T02:00:02.000Z",
  sourceTimestamp: null,
  producer: {
    collectorSha256: "b".repeat(64),
    browserVersion: "Chrome/139.0.0.0",
  },
  artifacts: { screenshot: "screenshot.png", metrics: "metrics.json" },
  localRevision: null,
  worktreeClean: null,
  localSourceDigest: null,
  localSourceFiles: [],
  observedTheme: { colorScheme: "dark" },
  status: "captured",
  ...overrides,
});

const runComparatorWithCells = (dir: string, officialCell: object, localCell: object) => {
  const official = makeImage(dir, "official.png");
  const local = makeImage(dir, "local.png");
  const officialMetrics = join(dir, "official.json");
  const localMetrics = join(dir, "local.json");
  const officialCellPath = join(dir, "official-cell.json");
  const localCellPath = join(dir, "local-cell.json");
  writeFileSync(officialMetrics, JSON.stringify(metrics));
  writeFileSync(localMetrics, JSON.stringify(metrics));
  writeFileSync(officialCellPath, JSON.stringify(officialCell));
  writeFileSync(localCellPath, JSON.stringify(localCell));
  const out = join(dir, "out");
  execFileSync("python", [
    comparator,
    "--official-image",
    official,
    "--local-image",
    local,
    "--official-metrics",
    officialMetrics,
    "--local-metrics",
    localMetrics,
    "--official-cell",
    officialCellPath,
    "--local-cell",
    localCellPath,
    "--out",
    out,
  ]);
  return JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
};

describe("comparator v3 evidence provenance gate", { timeout: 15000 }, () => {
  let directory: string;

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), "geist-comparator-provenance-"));
  });

  test("matching auditRunId and contractDigest produce PASS", () => {
    const dir = mkdtempSync(join(directory, "match-"));
    const report = runComparatorWithCells(dir, cell(), cell({ source: "local" }));
    expect(report.semanticAcceptanceStatus).toBe("PASS");
  });

  test("mismatched contractDigest between official and local forces BLOCKED", () => {
    const dir = mkdtempSync(join(directory, "digest-mismatch-"));
    const report = runComparatorWithCells(
      dir,
      cell(),
      cell({ source: "local", contractDigest: "f".repeat(64) }),
    );
    expect(report.semanticAcceptanceStatus).toBe("BLOCKED");
    expect(report.strictFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ classification: "EVIDENCE_DIGEST_MISMATCH" }),
      ]),
    );
  });

  test("mismatched auditRunId between official and local forces BLOCKED", () => {
    const dir = mkdtempSync(join(directory, "run-mismatch-"));
    const report = runComparatorWithCells(
      dir,
      cell(),
      cell({ source: "local", auditRunId: "audit-20260812-OTHER" }),
    );
    expect(report.semanticAcceptanceStatus).toBe("BLOCKED");
    expect(report.strictFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ classification: "EVIDENCE_RUN_MISMATCH" }),
      ]),
    );
  });

  test("missing cell files still produce diagnostic-only BLOCKED output", () => {
    const dir = mkdtempSync(join(directory, "no-cell-out-"));
    const official = makeImage(dir, "official.png");
    const local = makeImage(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(metrics));
    writeFileSync(localMetrics, JSON.stringify(metrics));
    const out = join(dir, "out");
    execFileSync("python", [
      comparator,
      "--official-image",
      official,
      "--local-image",
      local,
      "--official-metrics",
      officialMetrics,
      "--local-metrics",
      localMetrics,
      "--out",
      out,
    ]);
    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.semanticAcceptanceStatus).toBe("BLOCKED");
  });
});
