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

// checkbox 场景：root(demo卡片) / demo-container / checkbox-row(label) / checkbox-box / checkbox-label
const contract = {
  demoId: "default",
  variant: "default",
  state: "default",
  clipRole: "root",
  evidenceNotBefore: "2026-08-13T00:00:00.000Z",
  roles: {
    root: {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "context-owned-fill",
      contextOwnerRole: "demo-container",
    },
    "demo-container": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "measurement-context",
      measurementAxes: ["width"],
    },
    "checkbox-row": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "strict",
    },
    "checkbox-box": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "strict",
    },
    "checkbox-label": {
      selectors: selectorPair,
      presence: "required",
      acceptanceProfile: "mapped-text",
    },
  },
  semanticNodeInventory: [],
  transparentWrappers: [],
};

const manifest = (behaviorInfra: boolean) => ({
  schemaVersion: 2,
  status: "IN_PROGRESS_NO_COMPLETION_CLAIM",
  viewports: [{ width: 375, height: 812 }],
  themes: ["light", "dark"],
  allowedStatuses: ["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"],
  acceptancePolicy: {
    evidenceEpochNotBefore: "2026-08-13T00:00:00.000Z",
    approvedFontMappings: [
      { officialPrimaryFamily: "Geist", localPrimaryFamily: "HarmonyOS Sans SC" },
    ],
    approvedIconMappings: [],
    systematicExemptions: ["TRANSITION_SHORTHAND", "FLEX_ITEM_MIN_SIZE", "HOST_CHROME"],
    hostChromeRoles: ["root"],
    acceptedBehaviorInfrastructure: behaviorInfra
      ? [
          {
            officialTag: "span",
            localTag: "button",
            localRole: "checkbox",
            exemptFields: ["role", "aria-checked", "aria-hidden", "aria-label", "animation"],
          },
        ]
      : [],
    localSourceInputs: ["src/**"],
    pixelAttribution: { foregroundColorDistanceMax: 0, edgeExpansionDevicePixels: 1 },
  },
  components: [],
});

const styles = (overrides: Record<string, string> = {}) => ({
  display: "flex",
  position: "relative",
  boxSizing: "border-box",
  width: "16px",
  height: "16px",
  minWidth: "0px",
  minHeight: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  color: "rgb(23, 23, 23)",
  backgroundColor: "rgba(0, 0, 0, 0)",
  fontSize: "13px",
  fontWeight: "400",
  lineHeight: "16px",
  letterSpacing: "normal",
  transition: "none",
  animation: "none",
  textAlign: "start",
  ...overrides,
});

// 构造 checkbox 场景 metrics，支持按 role 覆盖 styles/aria/tag
const checkboxMetrics = (
  source: "official" | "local",
  opts: {
    transitionOfficial?: string;
    transitionLocal?: string;
    minSizeLocal?: string;
    hostChrome?: boolean;
    behaviorInfra?: boolean;
  } = {},
) => {
  const isOff = source === "official";
  const fontFamily = isOff ? "Geist, sans-serif" : "HarmonyOS Sans SC, sans-serif";
  const behaviorInfra = opts.behaviorInfra ?? false;

  // checkbox-box：官方 span（无 role/aria），本地 button（role=checkbox）
  const boxStyles = styles({
    fontFamily,
    ...(isOff
      ? {
          transition: opts.transitionOfficial ?? "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: behaviorInfra ? "0.2s" : "none",
        }
      : {
          transition:
            opts.transitionLocal ??
            "color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: "none",
          minWidth: opts.minSizeLocal ?? "0px",
          minHeight: opts.minSizeLocal ?? "0px",
        }),
  });

  const rootStyles = styles({
    fontFamily,
    ...(isOff
      ? {}
      : opts.hostChrome
        ? { position: "static", marginTop: "24px", minWidth: "auto", minHeight: "auto" }
        : {}),
  });

  return {
    viewport: "375x812",
    root: { x: 0, y: 0, width: 812, height: 72 },
    roles: {
      root: {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 0, y: 0, width: 812, height: 72 },
        styles: rootStyles,
        aria: {},
        ancestorChain: [],
      },
      "demo-container": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 0, y: 0, width: 812, height: 72 },
        styles: styles({ fontFamily }),
        aria: {},
        ancestorChain: [],
      },
      "checkbox-row": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 0, y: 0, width: 74, height: 16 },
        styles: styles({ fontFamily, display: isOff ? "inline-flex" : "inline-flex" }),
        aria: {},
        ancestorChain: [],
      },
      "checkbox-box": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 0, y: 0, width: 16, height: 16 },
        styles: boxStyles,
        aria: isOff
          ? {}
          : behaviorInfra
            ? { role: "checkbox", "aria-checked": "false", "aria-label": "选项 1" }
            : {},
        ancestorChain: [],
      },
      "checkbox-label": {
        selector: isOff ? "[data-o]" : "[data-l]",
        present: true,
        rect: { x: 24, y: 0, width: 50, height: 16 },
        styles: styles({ fontFamily }),
        aria: {},
        ancestorChain: [],
      },
    },
    nodes: [
      { path: "0", tag: "div", rect: { x: 0, y: 0, width: 812, height: 72 }, styles: rootStyles },
      {
        path: "0.0",
        tag: "label",
        rect: { x: 0, y: 0, width: 74, height: 16 },
        styles: styles({ fontFamily }),
      },
      {
        path: "0.0.0",
        tag: isOff ? "span" : "button",
        rect: { x: 0, y: 0, width: 16, height: 16 },
        styles: boxStyles,
      },
    ],
  };
};

const cell = (source: "official" | "local") => ({
  schemaVersion: 2,
  source,
  slug: "checkbox",
  demoId: "default",
  variant: "default",
  state: "default",
  theme: "light",
  viewport: { width: 375, height: 812 },
  viewportText: "375x812",
  url: "https://vercel.com/geist/checkbox",
  rootSelector: "[data-o]",
  roleSelectors: {},
  auditRunId: "audit-exempt-01",
  contractDigest: "a".repeat(64),
  effectiveEvidenceNotBefore: "2026-08-13T00:00:00.000Z",
  contract,
  navigationStartedAt: "2026-08-13T02:00:00.000Z",
  stateStabilizedAt: "2026-08-13T02:00:01.000Z",
  capturedAt: "2026-08-13T02:00:02.000Z",
  producer: { collectorSha256: "b".repeat(64), browserVersion: "Chrome/151.0.0.0" },
  artifacts: { screenshot: "screenshot.png", metrics: "metrics.json" },
  localRevision: null,
  worktreeClean: null,
  localSourceDigest: null,
  localSourceFiles: [],
  observedTheme: { colorScheme: "light" },
  status: "captured",
});

const runComparator = (
  dir: string,
  officialMetrics: string,
  localMetrics: string,
  behaviorInfra: boolean,
) => {
  const official = makeImage(dir, "official.png");
  const local = makeImage(dir, "local.png");
  const officialCell = join(dir, "official-cell.json");
  const localCell = join(dir, "local-cell.json");
  const manifestPath = join(dir, "manifest.json");
  writeFileSync(officialCell, JSON.stringify(cell("official")));
  writeFileSync(localCell, JSON.stringify(cell("local")));
  writeFileSync(manifestPath, JSON.stringify(manifest(behaviorInfra)));
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

describe("comparator v3 systematic exemptions", { timeout: 15000 }, () => {
  test("transition shorthand vs tailwind expansion is exempted", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-transition-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(checkboxMetrics("official", {})));
    writeFileSync(localMetrics, JSON.stringify(checkboxMetrics("local", {})));

    const report = runComparator(dir, officialMetrics, localMetrics, false);
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).toContain("TRANSITION_SHORTHAND");
  });

  test("flex item min-size (auto vs 0) is exempted", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-minsize-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(checkboxMetrics("official", {})));
    writeFileSync(localMetrics, JSON.stringify(checkboxMetrics("local", { minSizeLocal: "auto" })));

    const report = runComparator(dir, officialMetrics, localMetrics, false);
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).toContain("FLEX_ITEM_MIN_SIZE");
  });

  test("host chrome position/marginTop is exempted on root role", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-host-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(checkboxMetrics("official", {})));
    writeFileSync(localMetrics, JSON.stringify(checkboxMetrics("local", { hostChrome: true })));

    const report = runComparator(dir, officialMetrics, localMetrics, false);
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).toContain("HOST_CHROME");
  });

  test("behavior infrastructure (button vs span) exempts aria/role/animation", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-behavior-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(
      officialMetrics,
      JSON.stringify(checkboxMetrics("official", { behaviorInfra: true })),
    );
    writeFileSync(localMetrics, JSON.stringify(checkboxMetrics("local", { behaviorInfra: true })));

    const report = runComparator(dir, officialMetrics, localMetrics, true);
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).toContain("BEHAVIOR_INFRASTRUCTURE");
    // 尺寸 16x16 仍严格：box 尺寸差异不应豁免
    expect(report.semanticAcceptanceStatus).toBe("PASS");
  });

  test("behavior infrastructure not granted without manifest config", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-behavior-neg-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(
      officialMetrics,
      JSON.stringify(checkboxMetrics("official", { behaviorInfra: true })),
    );
    writeFileSync(localMetrics, JSON.stringify(checkboxMetrics("local", { behaviorInfra: true })));

    const report = runComparator(dir, officialMetrics, localMetrics, false);
    const classifications = report.approvedExclusions.map(
      (e: { classification?: string }) => e.classification,
    );
    expect(classifications).not.toContain("BEHAVIOR_INFRASTRUCTURE");
  });

  const flowMetrics = (source: "official" | "local") => {
    const isOff = source === "official";
    const fontFamily = isOff ? "Geist, sans-serif" : "HarmonyOS Sans SC, sans-serif";
    const item1W = isOff ? 400 : 305; // 第一个 item 字体映射宽度差 95
    const node = (path: string, x: number, width: number, tag: string) => ({
      path,
      tag,
      rect: { x, y: 0, width, height: 70 },
      styles: { fontFamily },
    });
    return {
      viewport: "375x812",
      root: { x: 0, y: 0, width: 812, height: 72 },
      roles: {},
      nodes: [
        node("root", 0, 812, "div"),
        node("0", 0, 812, "div"),
        node("0.0", 0, 812, "ul"),
        node("0.0.0", 0, item1W, "label"),
        node("0.0.1", item1W, 400, "label"), // x = 前序 item 宽度，传递
      ],
    };
  };

  test("font-mapped inline flow x (sibling width propagation) is exempted", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-exempt-flow-"));
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    writeFileSync(officialMetrics, JSON.stringify(flowMetrics("official")));
    writeFileSync(localMetrics, JSON.stringify(flowMetrics("local")));

    const report = runComparator(dir, officialMetrics, localMetrics, false);
    // 第二个 item 的 x 差 95 根因是前序字体映射宽度传递，应豁免（delta 不再含 x）
    const second = report.geometry.nodes.find((n: { path: string }) => n.path === "0.0.1");
    expect(second).toBeTruthy();
    expect(second.delta.x).toBeUndefined();
    // width 亦被 font-mapped 子树豁免（宽度差 0 被 pop）
    expect(second.delta.width).toBeUndefined();
  });
});
