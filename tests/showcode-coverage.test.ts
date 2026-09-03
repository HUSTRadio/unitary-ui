/**
 * Show code 红线契约（任务 0/1）：
 * - 每个 demoCode()/sectionCode() 引用必须解析到非空 DEMO_CODE 条目
 * - 每个 DEMO_CODE 条目必须 TSX 语法合法
 * 报告落盘 .hermes/audit/showcode-audit-baseline.json 供分批补齐跟踪。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

import { DEMO_CODE } from "../docs/geist/src/data/demo-code";
import { auditShowCode } from "./audit/showcode-audit-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("show code coverage contract", () => {
  test("every demo block resolves to non-empty, syntactically valid code", async () => {
    const report = await auditShowCode(root, DEMO_CODE);

    const outDir = path.join(root, ".hermes/audit");
    await mkdir(outDir, { recursive: true });
    await writeFile(
      path.join(outDir, "showcode-audit-baseline.json"),
      JSON.stringify(report, null, 2),
    );

    const missing = report.missing.map((m) => `${m.slug}/${m.id}`);
    const empty = report.empty.map((e) => `${e.slug}/${e.id}`);
    const syntax = report.syntaxIssues.map((s) => `${s.slug}/${s.id}: ${s.message}`);
    const orphanEntries = report.orphanEntries.map(({ slug, id }) => `${slug}/${id}`);

    expect(missing, `missing show code entries (${missing.length})`).toEqual([]);
    expect(empty, `empty show code entries (${empty.length})`).toEqual([]);
    expect(orphanEntries, `orphan show code entries (${orphanEntries.length})`).toEqual([]);
    expect(syntax, `TSX syntax issues (${syntax.length})`).toEqual([]);
  }, 60000);
});
