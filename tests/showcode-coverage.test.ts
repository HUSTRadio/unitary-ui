/**
 * Show code 红线契约（任务 0/1）：
 * - 每个 demoCode()/sectionCode() 引用必须解析到非空 EXAMPLE_SOURCE 条目
 * - 每个 EXAMPLE_SOURCE 条目必须 TSX 语法合法
 * 报告落盘 .hermes/audit/showcode-audit-baseline.json 供分批补齐跟踪。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";
import { auditShowCode, loadExampleSources } from "./audit/showcode-audit-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("show code coverage contract", () => {
  test("standalone audit reads the same sources as the live example registry", async () => {
    const sources = await loadExampleSources(root);
    expect(sources).toEqual(EXAMPLE_SOURCE);
    const expectedReport = await auditShowCode(root, EXAMPLE_SOURCE);
    expect(expectedReport.totalEntries).toBeGreaterThan(0);

    const stdout = execFileSync(
      process.execPath,
      ["--import", "tsx", path.join(root, "tests/audit/run-showcode-audit.mts")],
      { cwd: root, encoding: "utf8", timeout: 30000 },
    );
    const report = JSON.parse(
      await readFile(path.join(root, ".hermes/audit/showcode-audit-baseline.json"), "utf8"),
    );
    expect(report).toEqual(expectedReport);
    expect(stdout).toContain(`totalEntries: ${expectedReport.totalEntries}`);
  }, 60000);

  test("uses only paired physical example modules", async () => {
    const dataFiles = await readdir(path.join(root, "docs/site/src/data"));
    expect(dataFiles.filter((file) => /^demo-code.*\.ts$/.test(file))).toEqual([]);

    const examplesRoot = path.join(root, "docs/site/src/examples");
    const exampleFiles = (await readdir(examplesRoot, { recursive: true })).filter((file) =>
      file.endsWith(".example.tsx"),
    );
    const registry = await readFile(path.join(examplesRoot, "registry.ts"), "utf8");
    expect(registry.match(/from "\.\/.+\.example";/g)).toHaveLength(exampleFiles.length);
    expect(registry.match(/\.example\.tsx\?example-source";/g)).toHaveLength(exampleFiles.length);
  });

  test("every demo block resolves to non-empty, syntactically valid code", async () => {
    const report = await auditShowCode(root, EXAMPLE_SOURCE);

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
