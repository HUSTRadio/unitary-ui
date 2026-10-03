// 基线运行：产出 show code 审计报告 JSON（不 fail，仅统计）
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditShowCode, loadExampleSources } from "./showcode-audit-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const report = await auditShowCode(root, await loadExampleSources(root));

const outDir = path.join(root, ".hermes/audit");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "showcode-audit-baseline.json"), JSON.stringify(report, null, 2));

console.log("totalReferences:", report.totalReferences);
console.log("ok:", report.okCount);
console.log("missing:", report.missing.length);
console.log("empty:", report.empty.length);
console.log("orphanEntries:", report.orphanEntries.length);
console.log("syntaxIssues:", report.syntaxIssues.length);
console.log("totalEntries:", report.totalEntries);
console.log("--- missing (slug/id) ---");
for (const m of report.missing) console.log(`  ${m.slug}/${m.id}`);
console.log("--- empty (slug/id) ---");
for (const e of report.empty) console.log(`  ${e.slug}/${e.id}`);
console.log("--- syntax issues ---");
for (const s of report.syntaxIssues.slice(0, 30)) console.log(`  ${s.slug}/${s.id}: ${s.message}`);
