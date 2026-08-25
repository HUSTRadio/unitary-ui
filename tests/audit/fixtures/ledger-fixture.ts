// 共享 fixture：validate-audit-ledger 三分套件共用的路径与读盘工具。
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

// fixtures/ 在 tests/audit/fixtures，仓库根再上一层
export const root = resolve(import.meta.dirname, "../../..");
// fixtures/ 位于 tests/audit/fixtures，JSON 在上一级 tests/audit
export const auditDir = resolve(import.meta.dirname, "..");
export const readJson = (name: string) =>
  JSON.parse(readFileSync(join(auditDir, name), "utf8"));
export const readReport = () =>
  readFileSync(resolve(root, "docs/geist-replica-acceptance.md"), "utf8");
export const allowedStatuses = new Set(["PASS", "FAIL", "MISSING", "BLOCKED", "NOT_APPLICABLE"]);
export const COMPLETION_CLAIM_RE = /72\/72|576\/576/;
