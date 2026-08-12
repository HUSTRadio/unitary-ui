import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const auditDir = join(root, "tests/audit");
const comparator = join(auditDir, "compare-replica-evidence.py");

const manifest = {
  schemaVersion: 2,
  status: "IN_PROGRESS_NO_COMPLETION_CLAIM",
  viewports: [
    { width: 375, height: 812 },
    { width: 1440, height: 900 },
  ],
  themes: ["light", "dark"],
  allowedStatuses: ["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"],
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
    approvedFontMappings: [
      {
        officialPrimaryFamily: "Geist",
        localPrimaryFamily: "HarmonyOS Sans SC",
      },
    ],
    localSourceInputs: ["src/**"],
    pixelAttribution: {
      foregroundColorDistanceMax: 0,
      edgeExpansionDevicePixels: 1,
    },
  },
  components: [
    {
      slug: "drawer",
      officialUrl: "https://vercel.com/geist/drawer",
      inventoryStatus: "live_enumeration_complete",
      variants: ["default"],
      states: ["open"],
      demos: [{ id: "default" }],
      viewports: ["375x812"],
      themes: ["light", "dark"],
      interactionRecipes: [],
      responsiveExpectations: [],
      selectors: { official: "[data-o]", local: "[data-l]" },
      interaction: "applicable",
      acceptanceContracts: [
        {
          demoId: "default",
          variant: "default",
          state: "open",
          clipRole: "root",
          evidenceNotBefore: "2026-08-12T00:00:00.000Z",
          roles: {
            root: {
              selectors: {
                default: { official: "[data-o]", local: "[data-l]" },
                byViewport: {},
              },
              presence: "required",
              acceptanceProfile: "strict",
            },
          },
          semanticNodeInventory: [],
          transparentWrappers: [],
        },
      ],
    },
  ],
};

const makeImage = (dir: string, name: string, w: number, h: number, color = [0, 0, 0, 255]) => {
  const path = join(dir, name);
  const script = `import sys\nfrom PIL import Image\nImage.new('RGBA',(${w},${h}),tuple(${JSON.stringify(color)})).save(sys.argv[1])`;
  execFileSync("python", ["-c", script, path]);
  return path;
};

const runComparator = (
  dir: string,
  officialMetrics: object,
  localMetrics: object,
  manifestPath?: string,
) => {
  const official = makeImage(dir, "official.png", 2, 2);
  const local = makeImage(dir, "local.png", 2, 2);
  const officialMetricsPath = join(dir, "official.json");
  const localMetricsPath = join(dir, "local.json");
  writeFileSync(officialMetricsPath, JSON.stringify(officialMetrics));
  writeFileSync(localMetricsPath, JSON.stringify(localMetrics));
  const out = join(dir, "out");
  const args = [
    comparator,
    "--official-image",
    official,
    "--local-image",
    local,
    "--official-metrics",
    officialMetricsPath,
    "--local-metrics",
    localMetricsPath,
    "--out",
    out,
  ];
  if (manifestPath) {
    args.push("--manifest", manifestPath);
  }
  execFileSync("python", args);
  return JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
};

describe("comparator v3 acceptance-policy-driven exemptions", () => {
  let directory: string;
  let manifestPath: string;

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), "geist-comparator-v3-"));
    manifestPath = join(directory, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest));
  });

  const metricsWithFontFamily = (fontFamily: string) => ({
    viewport: "375x812",
    root: { x: 0, y: 0, width: 100, height: 100 },
    roles: {
      root: {
        selector: "[data-o]",
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
          fontFamily,
          transition: "none",
          animation: "none",
        },
        aria: { role: "dialog" },
        ancestorChain: [],
      },
    },
  });

  test("without manifest, fontFamily difference is a strict failure and status is BLOCKED", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-v3-no-manifest-"));
    const report = runComparator(
      dir,
      metricsWithFontFamily('"Geist", "Inter", sans-serif'),
      metricsWithFontFamily('"HarmonyOS Sans SC", sans-serif'),
    );

    expect(report.schemaVersion).toBe(3);
    expect(report.semanticAcceptanceStatus).toBe("BLOCKED");
    expect(report.diagnosticPixelStatus).toBe("IDENTICAL");
    expect(report.strictFailures).toBeInstanceOf(Array);
    expect(report.strictFailures.length).toBeGreaterThan(0);
    const fontFailure = report.strictFailures.find(
      (f: { field?: string }) => f.field === "fontFamily",
    );
    expect(fontFailure).toBeTruthy();
    expect(report.approvedExclusions).toEqual([]);
  });

  test("with manifest, approved fontFamily mapping is an approved exclusion, not a strict failure", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-v3-approved-"));
    const report = runComparator(
      dir,
      metricsWithFontFamily('"Geist", "Inter", sans-serif'),
      metricsWithFontFamily('"HarmonyOS Sans SC", sans-serif'),
      manifestPath,
    );

    expect(report.schemaVersion).toBe(3);
    expect(report.semanticAcceptanceStatus).toBe("PASS");
    expect(report.strictFailures).toEqual([]);
    expect(report.approvedExclusions.length).toBe(1);
    expect(report.approvedExclusions[0]).toMatchObject({
      classification: "FONT_FAMILY_MAPPING",
      scope: "role",
      role: "root",
      fields: ["fontFamily"],
    });
  });

  test("with manifest, unapproved fontFamily pair is a strict failure", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-v3-unapproved-"));
    const report = runComparator(
      dir,
      metricsWithFontFamily('"Unknown Font", sans-serif'),
      metricsWithFontFamily('"Other Font", sans-serif'),
      manifestPath,
    );

    expect(report.schemaVersion).toBe(3);
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(report.strictFailures.length).toBeGreaterThan(0);
    const fontFailure = report.strictFailures.find(
      (f: { field?: string }) => f.field === "fontFamily",
    );
    expect(fontFailure).toBeTruthy();
    expect(report.approvedExclusions).toEqual([]);
  });

  test("ICON_PATH is no longer a valid exemption reason", () => {
    const iconMetrics = (svgPath: string) => ({
      viewport: "375x812",
      root: { x: 0, y: 0, width: 100, height: 100 },
      roles: {
        root: {
          selector: "[data-o]",
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
            background: "transparent",
            color: "rgb(0, 0, 0)",
            fontFamily: "Arial, sans-serif",
            transition: "none",
            animation: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${svgPath}'/%3E%3C/svg%3E")`,
          },
          aria: {},
          ancestorChain: [],
        },
      },
    });

    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-v3-icon-"));
    const report = runComparator(
      dir,
      iconMetrics("M12 5v14M5 12h14"),
      iconMetrics("M5 12h14"),
      manifestPath,
    );

    expect(report.schemaVersion).toBe(3);
    const iconExemptions = report.approvedExclusions.filter(
      (e: { classification?: string }) => e.classification === "ICON_PATH",
    );
    expect(iconExemptions).toEqual([]);
    const bgFailure = report.strictFailures.find(
      (f: { field?: string }) => f.field === "backgroundImage",
    );
    expect(bgFailure).toBeTruthy();
  });
});
