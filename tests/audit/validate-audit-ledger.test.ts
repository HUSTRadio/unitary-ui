import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const auditDir = join(root, "tests/audit");
const allowedStatuses = new Set(["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"]);

const readJson = (name: string) => JSON.parse(readFileSync(join(auditDir, name), "utf8"));
const readReport = () => readFileSync(resolve(root, "docs/geist-replica-acceptance.md"), "utf8");
const COMPLETION_CLAIM_RE = /72\/72|576\/576/;

describe("Geist replica audit contract", () => {
  test("manifest declares exactly 72 unique official components", () => {
    const manifest = readJson("geist-audit-manifest.json");
    expect(manifest.schemaVersion).toBe(1);
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
      expect(component.approvedExclusions).toBeInstanceOf(Array);
    }
  });

  test("ledger never permits an evidence-free PASS or reason-free BLOCKED", () => {
    const ledger = readJson("geist-audit-ledger.json");
    expect(ledger.schemaVersion).toBe(1);
    expect(ledger.results).toBeInstanceOf(Array);

    for (const result of ledger.results) {
      expect(allowedStatuses.has(result.status)).toBe(true);
      expect(result).toHaveProperty("max_geometry_delta_px");
      expect(result).toHaveProperty("style_failures");
      if (result.status === "PASS") {
        expect(result.officialScreenshot).toBeTruthy();
        expect(result.localScreenshot).toBeTruthy();
        expect(result.metrics).toBeTruthy();
        expect(result.styleFields.length).toBeGreaterThan(0);
        expect(result.approvedExclusions).toBeInstanceOf(Array);
      }
      if (result.status === "BLOCKED") expect(result.reason).toBeTruthy();
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
    expect(claimsCompletion, "完成声明必须与 ACCEPTANCE_EVIDENCE_COMPLETE + 已填充无失败 ledger 同真同假").toBe(
      evidenceComplete,
    );
  });

  test("collector validates a single isolated cell without opening a browser", () => {
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

  test("comparator emits decoded pixel diff, overlay and normalized geometry", () => {
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
  });
});
