import { readFileSync } from "node:fs";
import path from "node:path";

// M1-04: package budget contract. Measurement lives in
// scripts/check-package-budgets.mjs; this module stays dependency-free so both
// the CLI and tests/package-budgets.test.ts validate the same fixture.
export const FIXTURE_PATH = "tests/fixtures/package-budgets.json";
export const SCHEMA_VERSION = 1;

/**
 * Canonical measurement identities. A budget entry must exist for every one of
 * them and for nothing else, so a renamed or dropped measurement fails closed
 * instead of silently losing coverage.
 */
export const MEASUREMENTS = [
  {
    id: "root.button.jsGzip",
    unit: "gzip bytes",
    group: "js",
    description: "Button-only 根消费端（package exports 解析）产物 JS 含惰性 chunk 的 gzip 总量",
  },
  {
    id: "subpath.charts.jsGzip",
    unit: "gzip bytes",
    group: "js",
    description: "仅 charts 子路径消费端的产物 JS gzip 总量",
  },
  {
    id: "subpath.motion.jsGzip",
    unit: "gzip bytes",
    group: "js",
    description: "仅 motion 子路径消费端的产物 JS gzip 总量",
  },
  {
    id: "subpath.device.jsGzip",
    unit: "gzip bytes",
    group: "js",
    description: "仅 device 子路径消费端的产物 JS gzip 总量",
  },
  {
    id: "subpath.code.jsGzip",
    unit: "gzip bytes",
    group: "js",
    description: "仅 code 子路径消费端的产物 JS gzip 总量",
  },
  {
    id: "css.published.gzip",
    unit: "gzip bytes",
    group: "css",
    description: "发布样式 dist/unitary-ui.css 的 gzip 大小（与子路径无关，四个子路径共用同一份 CSS）",
  },
  {
    id: "fonts.published.total",
    unit: "bytes",
    group: "fonts",
    description: "发布字体 dist/fonts 下全部 woff2 原始字节总量（与子路径无关）",
  },
  {
    id: "tarball.published.total",
    unit: "bytes",
    group: "tarball",
    description: "pnpm pack 产出的 tarball 字节数（含 dist、文档与声明文件）",
  },
];

export const MEASUREMENT_IDS = MEASUREMENTS.map(measurement => measurement.id);

/**
 * Gaps this contract records instead of hiding. Each one must stay listed until
 * a dedicated task closes it, so the budget cannot look healthier than it is.
 */
export const KNOWN_GAP_IDS = [
  "root.button.excludes-charts",
  "subpath.download-reduction",
];

const ALLOWANCE_RATIO = 1.3;
const MIN_RATIONALE_LENGTH = 24;

const fail = (message) => {
  throw new Error(message);
};

/**
 * Validate the fixture shape, coverage and provenance.
 * @param {unknown} fixture
 * @returns {{ budgets: Record<string, {limit: number, baseline: number, unit: string, rationale: string, allowanceReason?: string}>, knownGaps: Array<{id: string, status: string, detail: string, task: string}> }} validated fixture
 */
export function validateBudgetFixture(fixture) {
  if (typeof fixture !== "object" || fixture === null) fail("package-budgets.json 必须是对象");
  const record = /** @type {Record<string, any>} */ (fixture);
  if (record.schemaVersion !== SCHEMA_VERSION) {
    fail(`package-budgets.json schemaVersion 必须为 ${SCHEMA_VERSION}，实际为 ${String(record.schemaVersion)}`);
  }
  if (typeof record.recordedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(record.recordedAt)) {
    fail("package-budgets.json 缺少 recordedAt（YYYY-MM-DD）");
  }
  if (typeof record.measuredWith !== "string" || record.measuredWith.trim().length === 0) {
    fail("package-budgets.json 缺少 measuredWith（复现基线所用命令）");
  }
  if (typeof record.budgets !== "object" || record.budgets === null) fail("package-budgets.json 缺少 budgets");

  const budgetIds = Object.keys(record.budgets);
  const missing = MEASUREMENT_IDS.filter(id => !budgetIds.includes(id));
  const unknown = budgetIds.filter(id => !MEASUREMENT_IDS.includes(id));
  if (missing.length > 0) fail(`budgets 缺少测量项：${missing.join(", ")}`);
  if (unknown.length > 0) fail(`budgets 含未定义的测量项：${unknown.join(", ")}`);

  for (const measurement of MEASUREMENTS) {
    const budget = record.budgets[measurement.id];
    if (typeof budget !== "object" || budget === null) fail(`${measurement.id} 必须是对象`);
    if (budget.unit !== measurement.unit) {
      fail(`${measurement.id} unit 必须为 "${measurement.unit}"，实际为 ${String(budget.unit)}`);
    }
    for (const field of ["limit", "baseline"]) {
      if (!Number.isInteger(budget[field]) || budget[field] <= 0) {
        fail(`${measurement.id}.${field} 必须是大于 0 的整数，实际为 ${String(budget[field])}`);
      }
    }
    if (typeof budget.rationale !== "string" || budget.rationale.trim().length < MIN_RATIONALE_LENGTH) {
      fail(`${measurement.id}.rationale 必须说明阈值来源（至少 ${MIN_RATIONALE_LENGTH} 个字符）`);
    }
    if (budget.limit < budget.baseline) {
      fail(`${measurement.id} 阈值 ${budget.limit} 低于已记录基线 ${budget.baseline}`);
    }
    const ceiling = Math.ceil(budget.baseline * ALLOWANCE_RATIO);
    if (budget.limit > ceiling) {
      if (typeof budget.allowanceReason !== "string" || budget.allowanceReason.trim().length < MIN_RATIONALE_LENGTH) {
        fail(`${measurement.id} 阈值 ${budget.limit} 超出基线 ${ceiling}（基线 ×${ALLOWANCE_RATIO}）且未提供 allowanceReason`);
      }
    }
  }

  if (!Array.isArray(record.knownGaps)) fail("package-budgets.json 缺少 knownGaps");
  const gapIds = record.knownGaps.map(gap => gap?.id);
  for (const id of KNOWN_GAP_IDS) {
    if (!gapIds.includes(id)) fail(`knownGaps 缺少已知缺口：${id}`);
  }
  for (const gap of record.knownGaps) {
    if (!KNOWN_GAP_IDS.includes(gap?.id)) fail(`knownGaps 含未定义的缺口：${String(gap?.id)}`);
    if (!["deferred", "resolved"].includes(gap.status)) fail(`knownGaps ${gap.id} status 必须为 deferred 或 resolved`);
    if (typeof gap.detail !== "string" || gap.detail.trim().length < MIN_RATIONALE_LENGTH) {
      fail(`knownGaps ${gap.id} 必须记录 detail（至少 ${MIN_RATIONALE_LENGTH} 个字符）`);
    }
    if (typeof gap.task !== "string" || gap.task.trim().length === 0) fail(`knownGaps ${gap.id} 必须指向承接任务`);
  }
  return /** @type {any} */ (record);
}

/** @param {string} root repository or built snapshot root */
export function loadBudgetFixture(root) {
  return validateBudgetFixture(JSON.parse(readFileSync(path.join(root, FIXTURE_PATH), "utf8")));
}

/**
 * Compare measured values against the recorded budgets.
 * @param {Record<string, any>} fixture validated fixture
 * @param {Record<string, number>} measured measurement id → actual value
 */
export function compareBudgets(fixture, measured) {
  const absent = MEASUREMENT_IDS.filter(id => typeof measured[id] !== "number");
  if (absent.length > 0) fail(`缺少实测值：${absent.join(", ")}`);
  const rows = MEASUREMENTS.map(measurement => {
    const budget = fixture.budgets[measurement.id];
    const actual = measured[measurement.id];
    return {
      id: measurement.id,
      group: measurement.group,
      unit: measurement.unit,
      baseline: budget.baseline,
      limit: budget.limit,
      actual,
      delta: actual - budget.baseline,
      ok: actual <= budget.limit,
    };
  });
  return { rows, failures: rows.filter(row => !row.ok) };
}

const pad = (text, width) => String(text).padEnd(width);
const padStart = (text, width) => String(text).padStart(width);

/** @param {ReturnType<typeof compareBudgets>["rows"]} rows */
export function formatBudgetReport(rows) {
  const header = `${pad("measurement", 26)}${padStart("actual", 12)}${padStart("baseline", 12)}${padStart("limit", 12)}  status`;
  const lines = rows.map(row => {
    const status = row.ok ? "ok" : "OVER";
    return `${pad(row.id, 26)}${padStart(row.actual, 12)}${padStart(row.baseline, 12)}${padStart(row.limit, 12)}  ${status}`;
  });
  return [header, "-".repeat(header.length), ...lines].join("\n");
}

/** @param {ReturnType<typeof compareBudgets>["failures"]} failures */
export function formatBudgetFailures(failures) {
  return failures.map(failure =>
    `${failure.id} 超出预算：实测 ${failure.actual} ${failure.unit}，阈值 ${failure.limit}（基线 ${failure.baseline}，超出 ${failure.actual - failure.limit}）`)
    .join("\n");
}
