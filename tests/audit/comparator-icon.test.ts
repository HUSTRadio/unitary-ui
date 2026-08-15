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

const selectorPair = {
  default: { official: "[data-o]", local: "[data-l]" },
  byViewport: {},
};

const contract = {
  demoId: "default",
  variant: "default",
  state: "default",
  clipRole: "root",
  evidenceNotBefore: "2026-08-12T00:00:00.000Z",
  roles: {
    root: {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "strict",
    },
    title: {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "mapped-text",
    },
    "tooltip-shell": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "text-adjacent-icon",
      textRole: "title",
      anchorEdge: "right",
    },
    "tooltip-trigger": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "text-adjacent-icon",
      textRole: "title",
      anchorEdge: "right",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const manifest = (approvedIcons: boolean) => ({
  schemaVersion: 2,
  status: "IN_PROGRESS_NO_COMPLETION_CLAIM",
  viewports: [{ width: 375, height: 812 }],
  themes: ["light", "dark"],
  allowedStatuses: ["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"],
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-12T00:00:00.000Z",
    approvedFontMappings: [
      { officialPrimaryFamily: "Geist", localPrimaryFamily: "HarmonyOS Sans SC" },
    ],
    approvedIconMappings: approvedIcons
      ? [{ officialIconSet: "geist", localIconSet: "lucide" }]
      : [],
    localSourceInputs: ["src/**"],
    pixelAttribution: { foregroundColorDistanceMax: 0, edgeExpansionDevicePixels: 1 },
  },
  components: [],
});

const baseStyles = (fontFamily: string) => ({
  display: "block",
  width: "auto",
  height: "auto",
  padding: "0px",
  margin: "0px",
  border: "0px",
  borderRadius: "0px",
  background: "rgba(0, 0, 0, 0)",
  color: "rgb(0, 0, 0)",
  fontFamily,
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  letterSpacing: "normal",
  overflow: "visible",
  whiteSpace: "normal",
  transformOrigin: "0px 0px",
  transition: "none",
  animation: "none",
});

// Official title text is wider (Geist) than local (HarmonyOS Sans SC); the icon is
// anchored to the title's right edge with a fixed 4px gap, so the icon x delta
// equals the text right-edge delta.
const iconMetrics = (source: "official" | "local", textWidth: number, svgSize = 14) => {
  const isOff = source === "official";
  const fontFamily = isOff ? "Geist, sans-serif" : "HarmonyOS Sans SC, sans-serif";
  const iconX = textWidth + 4;
  return {
    viewport: "375x812",
    root: { x: 0, y: 0, width: 812, height: 40 },
    roles: {
      title: {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 0, y: 0, width: 812, height: 16 },
        styles: baseStyles(fontFamily),
        textEvidence: {
          textSample: isOff ? "Section Title" : "区块标题",
          fontShorthand: `normal 400 14px/20px ${fontFamily}`,
          fontLoadStatus: true,
          clientRects: [{ x: 0, y: 0, width: textWidth, height: 19 }],
          clientWidth: textWidth,
          scrollWidth: textWidth,
          whiteSpace: "nowrap",
          overflow: "visible",
          textOverflow: "clip",
        },
        aria: {},
        ancestorChain: [],
      },
      "tooltip-shell": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: iconX, y: 0, width: 14, height: 16 },
        styles: baseStyles(fontFamily),
        aria: {},
        ancestorChain: [],
      },
      "tooltip-trigger": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: iconX, y: 0, width: svgSize, height: svgSize },
        styles: baseStyles(fontFamily),
        aria: {},
        ancestorChain: [],
      },
    },
    nodes: [
      {
        path: "0",
        tag: "dt",
        rect: { x: 0, y: 0, width: 812, height: 16 },
        styles: baseStyles(fontFamily),
      },
      {
        path: "0.0",
        tag: "span",
        rect: { x: iconX, y: 0, width: 14, height: 16 },
        styles: baseStyles(fontFamily),
      },
      {
        path: "0.0.0",
        tag: "span",
        rect: { x: iconX, y: 0, width: svgSize, height: svgSize },
        styles: baseStyles(fontFamily),
      },
      {
        path: "0.0.0.0",
        tag: "svg",
        rect: { x: iconX, y: 0, width: svgSize, height: svgSize },
        styles: baseStyles(fontFamily),
      },
      // glyph children: Geist circular glyph vs Lucide Info
      ...(isOff
        ? [
            {
              path: "0.0.0.0.0",
              tag: "path",
              rect: { x: iconX + 1.75, y: 1.75, width: 10.5, height: 10.5 },
              styles: {},
            },
            {
              path: "0.0.0.0.1",
              tag: "path",
              rect: { x: iconX + 5.47, y: 3.5, width: 2.4, height: 6.34 },
              styles: {},
            },
          ]
        : [
            {
              path: "0.0.0.0.0",
              tag: "circle",
              rect: { x: iconX + 1.17, y: 1.17, width: 11.67, height: 11.67 },
              styles: {},
            },
            {
              path: "0.0.0.0.1",
              tag: "path",
              rect: { x: iconX + 7, y: 7, width: 0, height: 2.33 },
              styles: {},
            },
            {
              path: "0.0.0.0.2",
              tag: "path",
              rect: { x: iconX + 7, y: 4.67, width: 0.006, height: 0 },
              styles: {},
            },
          ]),
    ],
  };
};

const cell = (source: "official" | "local") => ({
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
  rootSelector: "[data-o]",
  roleSelectors: {},
  auditRunId: "audit-icon-01",
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

const runComparator = (dir: string, officialMetrics: string, localMetrics: string) => {
  const official = makeImage(dir, "official.png");
  const local = makeImage(dir, "local.png");
  const officialCell = join(dir, "official-cell.json");
  const localCell = join(dir, "local-cell.json");
  const manifestPath = join(dir, "manifest.json");
  writeFileSync(officialCell, JSON.stringify(cell("official")));
  writeFileSync(localCell, JSON.stringify(cell("local")));
  writeFileSync(manifestPath, JSON.stringify(manifest(true)));
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
    "--manifest",
    manifestPath,
    "--out",
    out,
  ]);
  return JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
};

describe("comparator v3 icon exemptions", { timeout: 15000 }, () => {
  test("glyph path geometry and anchor-edge x delta are exempted under approved icon mappings", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-icon-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(iconMetrics("official", 75.5)));
    writeFileSync(localMetrics, JSON.stringify(iconMetrics("local", 56)));

    const report = runComparator(dir, officialMetrics, localMetrics);

    expect(report.semanticAcceptanceStatus).toBe("PASS");
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).toContain("ICON_GLYPH");
    expect(classifications).toContain("FONT_METRIC_ADJACENT_ICON_X");
    expect(report.geometry.max_geometry_delta_px).toBeLessThanOrEqual(0.5);
    expect(report.geometry.missing_paths).toEqual([]);
  });

  test("icon outer-box size mismatch is not exempted", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-icon-size-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    // same text width, so no anchor displacement; only the icon svg size differs
    writeFileSync(officialMetrics, JSON.stringify(iconMetrics("official", 60, 14)));
    writeFileSync(localMetrics, JSON.stringify(iconMetrics("local", 60, 16)));

    const report = runComparator(dir, officialMetrics, localMetrics);

    expect(report.semanticAcceptanceStatus).toBe("FAIL");
  });

  test("without approved icon mappings glyph differences remain failures", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-comparator-icon-unapproved-"));
    const official = makeImage(dir, "official.png");
    const local = makeImage(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const officialCell = join(dir, "official-cell.json");
    const localCell = join(dir, "local-cell.json");
    const manifestPath = join(dir, "manifest.json");
    writeFileSync(officialMetrics, JSON.stringify(iconMetrics("official", 60)));
    writeFileSync(localMetrics, JSON.stringify(iconMetrics("local", 60)));
    writeFileSync(officialCell, JSON.stringify(cell("official")));
    writeFileSync(localCell, JSON.stringify(cell("local")));
    writeFileSync(manifestPath, JSON.stringify(manifest(false)));
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
      "--manifest",
      manifestPath,
      "--out",
      out,
    ]);

    const report = JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).not.toContain("ICON_GLYPH");
  });
});
