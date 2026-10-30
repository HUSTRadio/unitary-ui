import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

import {
  listRscModuleFiles,
  inspectRscModule,
} from "../scripts/lib/rsc-module-analysis.mjs";

/**
 * RSC 模块边界治理（M0-01/M0-02）。
 *
 * 台账 tests/fixtures/rsc-boundaries.json 声明每个公共模块的边界分类；
 * 本测试用同一 AST 分析器（scripts/lib/rsc-module-analysis.mjs）双向校验：
 * - client 指标模块 → 分类必须为 client，且文件以 "use client" 指令开头；
 * - 无指标模块 → 分类必须为 server-pure，且不得携带指令；
 * - 台账必须覆盖扫描根下全部实现模块；barrel 保持无指令。
 */

const root = process.cwd();

interface BoundaryEntry {
  file: string;
  classification: "client" | "server-pure";
  indicators: string[];
  reason: string;
}

const ledger = JSON.parse(
  readFileSync(path.join(root, "tests/fixtures/rsc-boundaries.json"), "utf8"),
) as { version: number; entries: BoundaryEntry[] };

describe("RSC module boundaries", () => {
  test("ledger covers every implementation module exactly once", () => {
    expect(ledger.version).toBeGreaterThanOrEqual(1);
    const listed = new Set(ledger.entries.map((entry) => entry.file));
    const actual = listRscModuleFiles(root);
    for (const file of actual) {
      expect(listed.has(file), `module missing from ledger: ${file}`).toBe(true);
    }
    const onDisk = new Set(actual);
    for (const entry of ledger.entries) {
      expect(onDisk.has(entry.file), `ledger entry not on disk: ${entry.file}`).toBe(true);
      expect(existsSync(path.join(root, entry.file)), `ledger entry missing: ${entry.file}`).toBe(true);
    }
    expect(new Set(ledger.entries.map((entry) => entry.file)).size).toBe(ledger.entries.length);
  });

  test("ledger classification matches the analyzer and source directives", () => {
    for (const entry of ledger.entries) {
      const { indicators, hasDirective } = inspectRscModule(root, entry.file);
      if (indicators.length > 0) {
        expect(entry.classification, `${entry.file}: has client indicators but is not classified client`).toBe("client");
        expect(
          hasDirective,
          `${entry.file}: client module must start with "use client"`,
        ).toBe(true);
      } else {
        expect(entry.classification, `${entry.file}: no client indicators but classified client`).toBe("server-pure");
        expect(
          hasDirective,
          `${entry.file}: server-pure module must not carry a "use client" directive`,
        ).toBe(false);
      }
    }
  });

  test("barrel entries stay server-neutral (no blanket client directive)", () => {
    for (const barrel of ["src/lib/index.ts", "src/lib/bundle.ts"]) {
      const source = readFileSync(path.join(root, barrel), "utf8");
      expect(/^\s*["']use client["']/.test(source), `${barrel} must not start with "use client"`).toBe(false);
      const entry = ledger.entries.find((candidate) => candidate.file === barrel);
      expect(entry?.classification, `${barrel} must be classified server-pure`).toBe("server-pure");
    }
  });
});
