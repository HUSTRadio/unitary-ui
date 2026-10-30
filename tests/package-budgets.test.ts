// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  KNOWN_GAP_IDS,
  MEASUREMENTS,
  MEASUREMENT_IDS,
  compareBudgets,
  formatBudgetFailures,
  formatBudgetReport,
  loadBudgetFixture,
  validateBudgetFixture,
} from "../scripts/lib/package-budgets.mjs";

// M1-04: the budget contract has to stay honest. These tests never bundle the
// package (scripts/check-package-budgets.mjs owns measurement); they pin the
// fixture shape, the threshold policy and the failure reporting that makes a
// regression visible.
const root = path.resolve(import.meta.dirname, "..");
const fixture = loadBudgetFixture(root);
const script = readFileSync(path.join(root, "scripts/check-package-budgets.mjs"), "utf8");

const actualFor = (overrides: Record<string, number> = {}) =>
  Object.fromEntries(MEASUREMENT_IDS.map(id => [id, overrides[id] ?? fixture.budgets[id].baseline]));

describe("package budgets fixture", () => {
  it("covers every measurement exactly once with a recorded baseline", () => {
    expect(Object.keys(fixture.budgets).sort()).toEqual([...MEASUREMENT_IDS].sort());
    for (const measurement of MEASUREMENTS) {
      const budget = fixture.budgets[measurement.id];
      expect(budget.unit, measurement.id).toBe(measurement.unit);
      expect(Number.isInteger(budget.baseline), measurement.id).toBe(true);
      expect(budget.baseline, measurement.id).toBeGreaterThan(0);
    }
  });

  it("keeps thresholds above the baseline but inside the reviewed allowance", () => {
    for (const measurement of MEASUREMENTS) {
      const budget = fixture.budgets[measurement.id];
      expect(budget.limit, measurement.id).toBeGreaterThanOrEqual(budget.baseline);
      expect(budget.limit, measurement.id).toBeLessThanOrEqual(Math.ceil(budget.baseline * 1.3));
      expect(budget.rationale.trim().length, measurement.id).toBeGreaterThanOrEqual(24);
    }
  });

  it("measures subpath cost in JavaScript only", () => {
    const subpaths = MEASUREMENTS.filter(measurement => measurement.id.startsWith("subpath."));
    expect(subpaths).toHaveLength(4);
    for (const measurement of subpaths) {
      expect(measurement.group, measurement.id).toBe("js");
      expect(measurement.unit, measurement.id).toBe("gzip bytes");
    }
    // Stylesheet and font weight are published once and shared; they must be
    // measured from the published files, never attributed to a subpath.
    expect(MEASUREMENT_IDS.filter(id => id.startsWith("subpath.") && /css|font/i.test(id))).toEqual([]);
  });

  it("records the known gaps instead of dropping them", () => {
    expect(fixture.knownGaps.map(gap => gap.id).sort()).toEqual([...KNOWN_GAP_IDS].sort());
    for (const gap of fixture.knownGaps) {
      expect(["deferred", "resolved"], gap.id).toContain(gap.status);
      expect(gap.task.length, gap.id).toBeGreaterThan(0);
      expect(gap.detail.trim().length, gap.id).toBeGreaterThanOrEqual(24);
    }
    const chartsGap = fixture.knownGaps.find(gap => gap.id === "root.button.excludes-charts");
    expect(chartsGap?.status).toBe("deferred");
  });

  it("rejects thresholds that shrink below the recorded baseline", () => {
    const tampered = structuredClone(fixture);
    tampered.budgets["root.button.jsGzip"].limit = tampered.budgets["root.button.jsGzip"].baseline - 1;
    expect(() => validateBudgetFixture(tampered)).toThrow(/低于已记录基线/);
  });

  it("rejects an unreviewed threshold raise beyond the allowance", () => {
    const tampered = structuredClone(fixture);
    const budget = tampered.budgets["css.published.gzip"];
    budget.limit = Math.ceil(budget.baseline * 1.5);
    delete budget.allowanceReason;
    expect(() => validateBudgetFixture(tampered)).toThrow(/未提供 allowanceReason/);
  });

  it("rejects budgets that silently lose a measurement", () => {
    const tampered = structuredClone(fixture);
    delete tampered.budgets["tarball.published.total"];
    expect(() => validateBudgetFixture(tampered)).toThrow(/budgets 缺少测量项/);
  });
});

describe("package budget comparison", () => {
  it("passes at the recorded baseline", () => {
    const { rows, failures } = compareBudgets(fixture, actualFor());
    expect(failures).toEqual([]);
    expect(rows).toHaveLength(MEASUREMENT_IDS.length);
    expect(rows.every(row => row.actual === row.baseline)).toBe(true);
  });

  it("fails only the measurement that exceeds its limit", () => {
    const over = fixture.budgets["subpath.motion.jsGzip"].limit + 1234;
    const { rows, failures } = compareBudgets(fixture, actualFor({ "subpath.motion.jsGzip": over }));
    expect(failures.map(failure => failure.id)).toEqual(["subpath.motion.jsGzip"]);
    expect(rows.filter(row => !row.ok)).toHaveLength(1);
  });

  it("reports actual and limit so a regression is actionable", () => {
    const limit = fixture.budgets["root.button.jsGzip"].limit;
    const { failures } = compareBudgets(fixture, actualFor({ "root.button.jsGzip": limit + 5000 }));
    const message = formatBudgetFailures(failures);
    expect(message).toContain("root.button.jsGzip");
    expect(message).toContain(String(limit + 5000));
    expect(message).toContain(String(limit));
  });

  it("prints a table with every measurement", () => {
    const { rows } = compareBudgets(fixture, actualFor());
    const report = formatBudgetReport(rows);
    for (const id of MEASUREMENT_IDS) expect(report).toContain(id);
  });

  it("refuses to compare when a measurement is missing", () => {
    const partial = actualFor();
    delete partial["fonts.published.total"];
    expect(() => compareBudgets(fixture, partial)).toThrow(/缺少实测值/);
  });
});

describe("package budget CLI", () => {
  it("fails the process when a budget is exceeded", () => {
    expect(script).toContain("formatBudgetFailures");
    expect(script).toContain("process.exit(1)");
  });

  it("records a baseline without enforcing thresholds", () => {
    expect(script).toContain("--record");
    expect(script).toContain("measured.json");
  });
});
