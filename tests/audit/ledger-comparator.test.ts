import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { auditDir } from "./fixtures/ledger-fixture";

describe("Geist audit comparator (Task 4: semantic roles / responsive deltas / field-level exemptions)", () => {
  const fixture = (name: string) =>
    JSON.parse(readFileSync(join(auditDir, "fixtures", name), "utf8"));

  const runComparator = (
    dir: string,
    officialMetrics: Record<string, unknown>,
    localMetrics: Record<string, unknown>,
  ) => {
    const official = join(dir, "official.png");
    const local = join(dir, "local.png");
    const officialMetricsPath = join(dir, "official.json");
    const localMetricsPath = join(dir, "local.json");
    const out = join(dir, "out");
    // 两张完全相同的纯黑图：像素差异必须为 0，viewport/角色差异只允许出现在语义字段里。
    execFileSync("python", [
      "-c",
      "from PIL import Image; import sys; Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[1]); Image.new('RGBA',(2,2),(0,0,0,255)).save(sys.argv[2])",
      official,
      local,
    ]);
    writeFileSync(officialMetricsPath, JSON.stringify(officialMetrics));
    writeFileSync(localMetricsPath, JSON.stringify(localMetrics));
    execFileSync("python", [
      join(auditDir, "compare-replica-evidence.py"),
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
    ]);
    return JSON.parse(readFileSync(join(out, "comparison.json"), "utf8"));
  };

  test("aligns roles by semantic name and classifies missing / unexpected roles", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-roles-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );

    expect(report.schemaVersion).toBe(3);
    expect(report.semanticAcceptanceStatus).toBe("FAIL");
    expect(Object.keys(report.roleComparisons).sort()).toEqual(["1440x900", "375x812"]);

    const byRole = Object.fromEntries(
      (report.roleComparisons["375x812"] as Array<{ role: string; classification: string }>).map(
        (row) => [row.role, row],
      ),
    );
    expect(Object.keys(byRole).sort()).toEqual([
      "content",
      "icon",
      "item",
      "portal",
      "root",
      "title",
      "trigger",
    ]);
    expect(byRole.item.classification).toBe("MISSING_ROLE");
    expect(byRole.portal.classification).toBe("UNEXPECTED_ROLE");

    // 缺失/多余角色按 viewport 报告（375x812 在 1440x900 之前，宽度升序）
    expect(report.missingRoles).toEqual([
      {
        role: "item",
        viewport: "375x812",
        selector: '[data-demo-id="drawer-demo"] [data-role="item"]',
      },
      {
        role: "item",
        viewport: "1440x900",
        selector: '[data-demo-id="drawer-demo"] [data-role="item"]',
      },
    ]);
    expect(report.unexpectedRoles).toEqual([
      {
        role: "portal",
        viewport: "375x812",
        selector: '[data-demo-id="drawer-demo"] [data-role="portal"]',
      },
      {
        role: "portal",
        viewport: "1440x900",
        selector: '[data-demo-id="drawer-demo"] [data-role="portal"]',
      },
    ]);
  }, 15_000);

  test("font-family and Lucide icon path diffs are field-level exemptions that never mask size/color/ARIA", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-exempt-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );
    const byRole = Object.fromEntries(
      (
        report.roleComparisons["375x812"] as Array<{
          role: string;
          classification: string;
          rect: { max_delta_px: number };
          styles: { failures: Array<{ field: string }>; exemptions: unknown[] };
          aria: { failures: Array<{ field: string }> };
        }>
      ).map((row) => [row.role, row]),
    );

    // root：唯一差异是 fontFamily，无 manifest -> strict failure，无豁免
    expect(byRole.root.classification).toBe("MISMATCH");
    expect(byRole.root.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "fontFamily",
    );
    expect(byRole.root.styles.exemptions).toEqual([]);

    // trigger：唯一差异是 backgroundImage (icon path)，无 manifest -> strict failure
    expect(byRole.trigger.classification).toBe("MISMATCH");
    expect(byRole.trigger.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "backgroundImage",
    );
    expect(byRole.trigger.styles.exemptions).toEqual([]);

    // icon：尺寸 + backgroundImage 都是 strict failure
    expect(byRole.icon.classification).toBe("MISMATCH");
    expect(byRole.icon.rect.max_delta_px).toBe(8);
    expect(byRole.icon.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "width",
    );
    expect(byRole.icon.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "backgroundImage",
    );
    expect(byRole.icon.styles.exemptions).toEqual([]);

    // title：颜色与 fontFamily 同时不同 -> 都是 strict failure
    expect(byRole.title.classification).toBe("MISMATCH");
    expect(byRole.title.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "color",
    );
    expect(byRole.title.styles.failures.map((entry: { field: string }) => entry.field)).toContain(
      "fontFamily",
    );
    expect(byRole.title.styles.exemptions).toEqual([]);

    // content：rect/styles 相同，aria-expanded 不同 → ARIA 差异必须 FAIL，不能被任何豁免抹掉
    expect(byRole.content.classification).toBe("MISMATCH");
    expect(byRole.content.rect.max_delta_px).toBe(0);
    expect(byRole.content.styles.failures).toEqual([]);
    expect(byRole.content.aria.failures.map((entry: { field: string }) => entry.field)).toContain(
      "aria-expanded",
    );
  }, 15_000);

  test("responsiveDelta reports same-role viewport changes instead of pixel error", () => {
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-responsive-"));
    const report = runComparator(
      dir,
      fixture("semantic-official.json"),
      fixture("semantic-local.json"),
    );

    // 图像完全相同 → 像素误差为 0；viewport 引起的差异只能出现在 responsiveDelta / 对应 viewport 的角色比较里
    expect(report.pixel.changed_ratio).toBe(0);

    const entries = report.responsiveDelta as Array<{
      role: string;
      viewportA: string;
      viewportB: string;
      classification: string;
      official: { rectDelta: Record<string, number> };
      local: { rectDelta: Record<string, number> };
      reasons: string[];
    }>;
    expect(entries.map((entry) => entry.role).sort()).toEqual(["content", "root", "trigger"]);

    const content = entries.find((entry) => entry.role === "content")!;
    expect(content.viewportA).toBe("375x812");
    expect(content.viewportB).toBe("1440x900");
    expect(content.classification).toBe("RESPONSIVE_STRUCTURE_DELTA");
    expect(content.official.rectDelta.width).toBe(700);
    expect(content.local.rectDelta.width).toBe(0);
    expect(content.reasons.join(" ")).toMatch(/width/);

    const trigger = entries.find((entry) => entry.role === "trigger")!;
    expect(trigger.classification).toBe("MATCH");
    expect(trigger.official.rectDelta.width).toBe(80);
    expect(trigger.local.rectDelta.width).toBe(80);
    expect(trigger.reasons).toEqual([]);

    // 同一 role 必须按 viewport 对齐比较：375 上 content 完全一致，1440 上才是宽度差
    const rows375 = report.roleComparisons["375x812"] as Array<{
      role: string;
      rect: { max_delta_px: number };
    }>;
    const rows1440 = report.roleComparisons["1440x900"] as Array<{
      role: string;
      rect: { max_delta_px: number };
    }>;
    expect(rows375.find((row) => row.role === "content")!.rect.max_delta_px).toBe(0);
    expect(rows1440.find((row) => row.role === "content")!.rect.max_delta_px).toBe(700);
    // icon 的尺寸差异（rect delta 8）只出现在 375 的 role 比较里，不进入 responsiveDelta
    expect(
      report.responsiveDelta.find((entry: { role: string }) => entry.role === "icon"),
    ).toBeUndefined();
  }, 15_000);

  test("style and aria comparison covers the required field sets", () => {
    const requiredStyleFields = [
      "width",
      "height",
      "padding",
      "margin",
      "border",
      "borderRadius",
      "display",
      "position",
      "background",
      "color",
      "fontFamily",
      "transition",
      "animation",
    ];
    const requiredAriaFields = ["role", "aria-label", "aria-expanded", "disabled", "tabIndex"];
    const build = (prefix: string) => ({
      viewport: "375x812",
      root: { x: 0, y: 0, width: 100, height: 100 },
      roles: {
        root: {
          present: true,
          rect: { x: 0, y: 0, width: 100, height: 100 },
          styles: Object.fromEntries(
            requiredStyleFields.map((field) => [field, `${prefix}-${field}`]),
          ),
          aria: Object.fromEntries(
            requiredAriaFields.map((field) => [
              field,
              field === "disabled" ? prefix === "official" : `${prefix}-${field}`,
            ]),
          ),
        },
      },
    });
    const dir = mkdtempSync(join(tmpdir(), "geist-audit-compare-coverage-"));
    const report = runComparator(dir, build("official"), build("local"));
    const row = (report.roleComparisons["375x812"] as Array<Record<string, any>>)[0];

    expect(row.classification).toBe("MISMATCH");
    const failureFields = (row.styles.failures as Array<{ field: string }>).map(
      (entry) => entry.field,
    );
    for (const field of requiredStyleFields) {
      if (field === "fontFamily") continue;
      expect(failureFields, `style field "${field}" must be compared`).toContain(field);
    }
    const exemptionFields = (row.styles.exemptions as Array<{ field: string; reason: string }>).map(
      (entry) => [entry.field, entry.reason],
    );
    expect(failureFields).toContain("fontFamily");
    expect(exemptionFields).toEqual([]);

    const ariaFailureFields = (row.aria.failures as Array<{ field: string }>).map(
      (entry) => entry.field,
    );
    for (const field of requiredAriaFields) {
      expect(ariaFailureFields, `aria field "${field}" must be compared`).toContain(field);
    }
  }, 15_000);
});
