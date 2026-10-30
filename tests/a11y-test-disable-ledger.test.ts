import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/**
 * 无障碍测试禁用台账治理（A11Y-00）。
 *
 * 这是禁用治理测试，不是无障碍功能测试：
 * - 校验台账 schema、ID/路径/标题唯一性；
 * - 校验禁用项与 vitest.config.ts / playwright.config.ts 的精确排除一一对应（双向）；
 * - 防止关键词 glob、未登记的配置漂移。
 *
 * 边界约定见 tests/fixtures/a11y-test-disable-ledger.json 的 `rules`。
 */

const root = process.cwd();

interface LedgerEntry {
  id: string;
  file: string;
  runner: "vitest" | "playwright" | "website" | "motion";
  kind: "file" | "describe" | "test" | "parameterized-case";
  titlePath: string[];
  action: "disable" | "retain-mixed-unit" | "retain-not-a11y" | "retain-visual-structural-audit";
  method: string | null;
  reason: string;
  ordinaryCoverage: string;
  pr: string;
}

interface Ledger {
  version: number;
  updatedAt: string;
  boundary: string;
  rules: Record<string, unknown>;
  entries: LedgerEntry[];
}

function read(relativePath: string): string {
  return readFileSync(`${root}/${relativePath}`, "utf8");
}

const ledger: Ledger = JSON.parse(read("tests/fixtures/a11y-test-disable-ledger.json"));

const disabledVitestFiles = ledger.entries.filter(
  (entry) => entry.action === "disable" && entry.runner === "vitest" && entry.kind === "file",
);
const disabledPlaywrightFiles = ledger.entries.filter(
  (entry) => entry.action === "disable" && entry.runner === "playwright" && entry.kind === "file",
);

describe("a11y test disable ledger", () => {
  test("ledger schema and uniqueness", () => {
    expect(ledger.version).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(ledger.entries)).toBe(true);
    expect(ledger.entries.length).toBeGreaterThan(0);

    const ids = new Set<string>();
    const titleKeys = new Set<string>();
    for (const entry of ledger.entries) {
      // 完整必填字段。
      for (const key of ["id", "file", "runner", "kind", "titlePath", "action", "method", "reason", "ordinaryCoverage", "pr"] as const) {
        expect(entry, `entry missing ${key}`).toHaveProperty(key);
      }
      expect(entry.id).toMatch(/^A11Y-(FILE|SPEC|DESC|TEST|KEEP)-\d{4}$/);
      expect(ids.has(entry.id), `duplicate id ${entry.id}`).toBe(false);
      ids.add(entry.id);

      // 精确路径：不允许任何通配符/关键词 glob。
      expect(entry.file).toMatch(/^(tests|website\/tests)\/[\w./-]+\.(test|spec)\.(ts|tsx)$/);
      expect(entry.file).not.toContain("*");
      expect(entry.file, `${entry.file} must exist on disk`).toBeTruthy();
      expect(existsSync(`${root}/${entry.file}`), `${entry.file} must exist`).toBe(true);

      // kind !== file 时必须锚定完整标题路径。
      if (entry.kind !== "file") {
        expect(entry.titlePath.length, `${entry.id} needs titlePath`).toBeGreaterThan(0);
        expect(entry.action === "disable" ? entry.method : true).toBeTruthy();
      }

      // (file, titlePath) 唯一。
      const titleKey = `${entry.file}#${entry.titlePath.join(" > ")}`;
      expect(titleKeys.has(titleKey), `duplicate title key ${titleKey}`).toBe(false);
      titleKeys.add(titleKey);

      expect(entry.reason.length).toBeGreaterThan(0);
      expect(entry.pr).toMatch(/^PR-/);
    }
  });

  test("vitest config exclusions match ledger both ways", () => {
    const config = read("vitest.config.ts");

    // 正向：每个 vitest 文件级禁用项都被精确排除。
    for (const entry of disabledVitestFiles) {
      expect(config).toContain(`"${entry.file}"`);
    }

    // 反向：配置中的精确测试路径不得超出台账登记范围（防漂移/防关键词误伤）。
    const precisePaths = [...config.matchAll(/"(tests\/[^"]+\.(?:test|spec)\.(?:ts|tsx))"/g)].map((match) => match[1]);
    const expected = new Set(disabledVitestFiles.map((entry) => entry.file));
    for (const precisePath of precisePaths) {
      expect(expected.has(precisePath), `unmanaged vitest exclusion: ${precisePath}`).toBe(true);
    }
    expect(precisePaths.length).toBe(expected.size);

    // 禁止关键词 glob 进入配置。
    for (const forbidden of ["*a11y*", "*keyboard*", "*motion*", "*touch*", "*focus*", "*aria*"]) {
      expect(config.includes(`"${forbidden}"`), `keyword glob leaked into vitest config: ${forbidden}`).toBe(false);
    }
  });

  test("playwright config testIgnore matches ledger both ways", () => {
    const config = read("playwright.config.ts");

    // 正向：每个 playwright 文件级禁用项都被精确 testIgnore（锚定文件名的精确路径）。
    for (const entry of disabledPlaywrightFiles) {
      expect(config).toContain(`"**/${entry.file}"`);
    }

    // 反向：testIgnore 中的精确 spec 路径不得超出台账登记范围。
    const precisePaths = [...config.matchAll(/"\*\*\/(tests\/e2e\/[^"]+\.spec\.ts)"/g)].map((match) => match[1]);
    const expected = new Set(disabledPlaywrightFiles.map((entry) => entry.file));
    for (const precisePath of precisePaths) {
      expect(expected.has(precisePath), `unmanaged playwright testIgnore: ${precisePath}`).toBe(true);
    }
    expect(precisePaths.length).toBe(expected.size);

    for (const forbidden of ["*a11y*", "*keyboard*", "*motion*", "*touch*", "*focus*"]) {
      expect(config.includes(`"${forbidden}"`), `keyword glob leaked into playwright config: ${forbidden}`).toBe(false);
    }
  });
});
