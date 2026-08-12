import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const auditDir = join(root, "tests/audit");
const comparator = join(auditDir, "compare-replica-evidence.py");

const makeImage = (dir: string, name: string, w = 2, h = 2) => {
  const path = join(dir, name);
  const script = `import sys\nfrom PIL import Image\nImage.new('RGBA',(${w},${h}),(0,0,0,255)).save(sys.argv[1])`;
  execFileSync("python", ["-c", script, path]);
  return path;
};

const contract = {
  demoId: "default",
  variant: "default",
  state: "default",
  clipRole: "root",
  evidenceNotBefore: "2026-08-12T00:00:00.000Z",
  roles: {
    "demo-container": {
      selectors: {
        default: { official: "[data-context-o]", local: "[data-context-l]" },
        byViewport: {},
      },
      presence: "required",
      acceptanceProfile: "measurement-context",
      measurementAxes: ["width"],
    },
    root: {
      selectors: {
        default: { official: "[data-root-o]", local: "[data-root-l]" },
        byViewport: {},
      },
      presence: "required",
      acceptanceProfile: "context-owned-fill",
      contextOwnerRole: "demo-container",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const metrics = (contextWidth: number, rootWidth: number, source: "official" | "local") => ({
  viewport: "375x812",
  root: { x: 0, y: 0, width: rootWidth, height: 40 },
  roles: {
    "demo-container": {
      selector: source === "official" ? "[data-context-o]" : "[data-context-l]",
      present: true,
      rect: { x: 0, y: 0, width: contextWidth, height: 88 },
      styles: {
        display: "block",
        width: `${contextWidth}px`,
        height: "88px",
        padding: "24px",
      },
      aria: {},
      ancestorChain: [],
    },
    root: {
      selector: source === "official" ? "[data-root-o]" : "[data-root-l]",
      present: true,
      rect: { x: 24, y: 24, width: rootWidth, height: 40 },
      styles: {
        display: "block",
        width: `${rootWidth}px`,
        height: "40px",
        padding: "0px",
        margin: "0px",
        border: "0px",
        borderRadius: "0px",
        background: "rgb(255, 255, 255)",
        color: "rgb(0, 0, 0)",
        fontFamily: "Arial, sans-serif",
        transformOrigin: `${rootWidth / 2}px 20px`,
        transition: "none",
        animation: "none",
      },
      aria: {},
      ancestorChain: [],
    },
  },
});

const cell = (source: "official" | "local", _contextWidth: number, _rootWidth: number) => ({
  schemaVersion: 2,
  source,
  slug: "description",
  demoId: "default",
  variant: "default",
  state: "default",
  theme: "dark",
  viewport: { width: 375, height: 812 },
  viewportText: "375x812",
  url: "https://vercel.com/geist/description",
  rootSelector: source === "official" ? "[data-root-o]" : "[data-root-l]",
  roleSelectors: {
    "demo-container": source === "official" ? "[data-context-o]" : "[data-context-l]",
    root: source === "official" ? "[data-root-o]" : "[data-root-l]",
  },
  auditRunId: "audit-context-01",
  contractDigest: "a".repeat(64),
  effectiveEvidenceNotBefore: "2026-08-12T00:00:00.000Z",
  contract,
  navigationStartedAt: "2026-08-12T02:00:00.000Z",
  stateStabilizedAt: "2026-08-12T02:00:01.000Z",
  capturedAt: "2026-08-12T02:00:02.000Z",
  producer: { collectorSha256: "b".repeat(64), browserVersion: "Chrome/139.0.0.0" },
  artifacts: { screenshot: "screenshot.png", metrics: "metrics.json" },
  localRevision: null,
  worktreeClean: null,
  localSourceDigest: null,
  localSourceFiles: [],
  observedTheme: { colorScheme: "dark" },
  status: "captured",
});

describe("comparator v3 context-owned-fill attribution", { timeout: 15000 }, () => {
  test("fill width delta fully explained by measurement-context width delta is exempted", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-context-"));
    const official = makeImage(dir, "official.png");
    const local = makeImage(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const officialCell = join(dir, "official-cell.json");
    const localCell = join(dir, "local-cell.json");
    writeFileSync(officialMetrics, JSON.stringify(metrics(812, 812, "official")));
    writeFileSync(localMetrics, JSON.stringify(metrics(813, 813, "local")));
    writeFileSync(officialCell, JSON.stringify(cell("official", 812, 812)));
    writeFileSync(localCell, JSON.stringify(cell("local", 813, 813)));
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
      officialCell,
      "--local-cell",
      localCell,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.semanticAcceptanceStatus).toBe("PASS");
    const widthExclusions = report.approvedExclusions.filter(
      (e: { classification?: string }) => e.classification === "CONTEXT_OWNED_WIDTH",
    );
    expect(widthExclusions.length).toBeGreaterThan(0);
    expect(widthExclusions[0]).toMatchObject({ scope: "role", role: "root" });
  });

  test("fill width delta not matching context delta remains a strict failure", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-context-fail-"));
    const official = makeImage(dir, "official.png");
    const local = makeImage(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const officialCell = join(dir, "official-cell.json");
    const localCell = join(dir, "local-cell.json");
    writeFileSync(officialMetrics, JSON.stringify(metrics(812, 812, "official")));
    writeFileSync(localMetrics, JSON.stringify(metrics(812, 820, "local")));
    writeFileSync(officialCell, JSON.stringify(cell("official", 812, 812)));
    writeFileSync(localCell, JSON.stringify(cell("local", 812, 820)));
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
      officialCell,
      "--local-cell",
      localCell,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    const widthFailure = report.strictFailures.find(
      (f: { field?: string; role?: string }) => f.role === "root" && f.field === "width",
    );
    expect(widthFailure).toBeTruthy();
  });
});
