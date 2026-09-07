import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import {
  allowedStatuses,
  auditDir,
  COMPLETION_CLAIM_RE,
  readJson,
  readReport,
} from "./fixtures/ledger-fixture";

describe("Geist replica audit contract (consumers)", () => {
  test("manifest declares exactly 72 unique official components", () => {
    const manifest = readJson("geist-audit-manifest.json");
    expect(manifest.schemaVersion).toBe(2);
    expect(manifest.components).toHaveLength(72);
    const slugs = manifest.components.map((component: { slug: string }) => component.slug);
    expect(new Set(slugs).size).toBe(72);

    for (const component of manifest.components) {
      expect(component.officialUrl).toMatch(/^https:\/\/vercel\.com\/geist\//);
      expect(component.variants.length).toBeGreaterThan(0);
      expect(component.states.length).toBeGreaterThan(0);
      expect(component.selectors.official).toBeTruthy();
      expect(component.selectors.local).toBeTruthy();
      expect(["applicable", "NOT_APPLICABLE", "pending"]).toContain(component.interaction);
      expect(component).not.toHaveProperty("approvedExclusions");
    }
  });

  test("ledger never permits an evidence-free PASS or reason-free BLOCKED", () => {
    const ledger = readJson("geist-audit-ledger.json");
    expect(ledger.schemaVersion).toBe(2);
    expect(ledger.results).toBeInstanceOf(Array);

    for (const result of ledger.results) {
      expect(allowedStatuses.has(result.status)).toBe(true);
      expect(result).toHaveProperty("evidenceStatus");
      expect(result).toHaveProperty("semanticAcceptanceStatus");
      if (result.evidenceStatus === "READY") {
        expect(result.status).toBe(result.semanticAcceptanceStatus);
        expect(result).toHaveProperty("diagnosticPixelStatus");
        expect(result).toHaveProperty("strictFailures");
        expect(result).toHaveProperty("approvedExclusions");
        expect(result.auditRunId).toBeTruthy();
        expect(result.contractDigest).toMatch(/^[a-f0-9]{64}$/);
      }
      if (result.evidenceStatus === "BLOCKED") {
        expect(result.semanticAcceptanceStatus).toBe("BLOCKED");
        expect(result.reason).toBeTruthy();
      }
      if (result.evidenceStatus === "MISSING" || result.evidenceStatus === "NOT_APPLICABLE") {
        expect(result.semanticAcceptanceStatus).toBeNull();
      }
    }
  });

  test("completion claims in the report require a populated, failure-free ledger", () => {
    const manifest = readJson("geist-audit-manifest.json");
    const ledger = readJson("geist-audit-ledger.json");
    const report = readReport();

    const claimsCompletion = COMPLETION_CLAIM_RE.test(report);
    const evidenceComplete =
      manifest.status === "ACCEPTANCE_EVIDENCE_COMPLETE" &&
      Array.isArray(ledger.results) &&
      ledger.results.length > 0 &&
      ledger.results.every(
        (row: { status: string }) => !["FAIL", "MISSING", "BLOCKED"].includes(row.status),
      );

    // 双向门禁：报告出现 72/72 或 576/576 完成声明 ⟺ manifest/ledger 处于完整验收证据状态。
    // 不写成 if 条件，避免撤销报告后测试逃逸、失去持续约束。
    expect(
      claimsCompletion,
      "完成声明必须与 ACCEPTANCE_EVIDENCE_COMPLETE + 已填充无失败 ledger 同真同假",
    ).toBe(evidenceComplete);
  });

  test("collector validates a single isolated cell without opening a browser", { timeout: 20_000 }, () => {
    const output = execFileSync(
      process.execPath,
      [
        join(auditDir, "collect-replica-evidence.mjs"),
        "--dry-run",
        "--source",
        "official",
        "--slug",
        "button",
        "--variant",
        "default",
        "--state",
        "default",
        "--theme",
        "light",
        "--viewport",
        "375x812",
        "--selector",
        "main",
        "--url",
        "https://vercel.com/geist/button",
        "--out",
        join(tmpdir(), "geist-audit-dry-run"),
      ],
      { encoding: "utf8" },
    );
    const config = JSON.parse(output);
    expect(config.source).toBe("official");
    expect(config.viewport).toEqual({ width: 375, height: 812 });
    expect(config.cellKey).toBe("official/button/default/default/light/375x812");
    expect(config.outputPolicy).toBe("isolated-run-directory");
  });

  test("comparator emits decoded pixel diff, overlay and normalized geometry", { timeout: 20_000 }, () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); im=Image.new('RGBA',(2,2),(0,0,0,255)); im.putpixel((1,1),(255,255,255,255)); im.save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({
        root: { x: 100, y: 40 },
        nodes: [{ path: "0", rect: { x: 110, y: 50, width: 20, height: 10 } }],
      }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({
        root: { x: 200, y: 80 },
        nodes: [{ path: "0", rect: { x: 211, y: 91, width: 20, height: 10 } }],
      }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
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
    expect(report.pixel.changed_pixels).toBe(1);
    expect(report.pixel.total_pixels).toBe(4);
    expect(report.geometry.max_geometry_delta_px).toBe(1);
    expect(report.geometry.nodes[0].official).toEqual({ x: 10, y: 10, width: 20, height: 10 });
    expect(readFileSync(join(out, "diff.png")).byteLength).toBeGreaterThan(0);
    expect(readFileSync(join(out, "overlay.png")).byteLength).toBeGreaterThan(0);
  }, 15_000);

  test("comparator records image dimension mismatches instead of aborting without artifacts", { timeout: 20_000 }, () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-dimensions-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(3,2),(0,0,0,0)).save(sys.argv[1]); Image.new('RGBA',(2,2),(0,0,0,0)).save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({ root: { x: 0, y: 0, width: 3, height: 2 }, nodes: [] }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({ root: { x: 0, y: 0, width: 3, height: 2 }, nodes: [] }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
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
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(report.pixel.dimension_mismatch).toBe(true);
    expect(report.pixel.image_dimensions).toEqual({
      official: { width: 3, height: 2 },
      local: { width: 2, height: 2 },
      canvas: { width: 3, height: 2 },
    });
    expect(report.pixel.total_pixels).toBe(6);
    expect(report.pixel.changed_pixels).toBe(0);
    expect(readFileSync(join(out, "diff.png")).byteLength).toBeGreaterThan(0);
    expect(readFileSync(join(out, "overlay.png")).byteLength).toBeGreaterThan(0);
  }, 15_000);

  test("comparator keeps legacy output compatible while adding semantic-role fields", { timeout: 20_000 }, () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-legacy-"));
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetrics = join(dir, "official.json");
    const localMetrics = join(dir, "local.json");
    const out = join(dir, "out");

    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); im=Image.new('RGBA',(2,2),(0,0,0,255)); im.putpixel((1,1),(255,255,255,255)); im.save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(
      officialMetrics,
      JSON.stringify({
        root: { x: 100, y: 40 },
        nodes: [{ path: "0", rect: { x: 110, y: 50, width: 20, height: 10 } }],
      }),
    );
    writeFileSync(
      localMetrics,
      JSON.stringify({
        root: { x: 200, y: 80 },
        nodes: [{ path: "0", rect: { x: 211, y: 91, width: 20, height: 10 } }],
      }),
    );

    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
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
    // Task 4 输出契约：旧字段原样保留，新语义字段以 schemaVersion=2 共存。
    expect(report.schemaVersion).toBe(3);
    expect(report.pixelDiff).toEqual(report.pixel);
    expect(report.missingPaths).toEqual(report.geometry.missing_paths);
    expect(report.normalizedGeometry).toEqual(report.geometry);
    expect(report.roleComparisons).toEqual({ default: [] });
    expect(report.missingRoles).toEqual([]);
    expect(report.unexpectedRoles).toEqual([]);
    expect(report.responsiveDelta).toEqual([]);
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(report.approved_exclusions).toEqual([]);
    expect(report.artifacts).toEqual({ diff: "diff.png", overlay: "overlay.png" });
  }, 15_000);
});
