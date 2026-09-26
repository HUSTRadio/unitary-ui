import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/*
 * 动效时长字面量治理（棘轮账本，仿 raw-color-governance）：
 * 1) 组件库/样式/文档站代码目录中仍存在的动画与过渡时长字面量，必须逐条登记在
 *    tests/audit/motion-duration-allowlist.json（literal + source + reason + files）。
 * 2) 每条账目必须仍存在于代码中——迁移完成就必须清账。
 * 3) 字面量只能迁出（换成 --uni-duration-* / --uni-motion-* / --uni-loop-* token），
 *    不能未审新增。
 * 范围外（见 docs/audits/motion-duration-audit-2026-09-20.md §D）：delay/dwell/
 * auto-dismiss 等时序值、hamburger 编排参数（STAGGER_* 常量）、--animate-* token
 * 定义内部的字面量、指南散文中的时长叙述。
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_ROOTS = [
  "src/components",
  "src/lib",
  "src/styles",
  // 文档站代码目录；content/i18n/data 为指南散文（含中文时长叙述），不在扫描范围
  "docs/site/src/components",
  "docs/site/src/examples",
];

// token 真源定义行不算字面量（值即 token 本体）
const TOKEN_DEF = /^\s*--(?:uni-duration|uni-motion|uni-loop|animate|default-transition-duration)[\w-]*\s*:/;

function walk(dir: string, files: string[] = []): string[] {
  if (!statSync(dir).isDirectory()) return files;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      walk(full, files);
    } else if (/\.(ts|tsx|css)$/.test(entry)) {
      files.push(path.relative(root, full).replace(/\\/g, "/"));
    }
  }
  return files;
}

/** 去注释但保内容：块注释→空白；TS/TSX 行注释仅在引号平衡时剥离（同 raw-color-governance）。 */
function codeOnly(text: string, isCss: boolean): string {
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  if (isCss) return stripped;
  return stripped
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("//");
      if (idx < 0) return line;
      const before = line.slice(0, idx);
      const balanced =
        before.split('"').length % 2 === 1 &&
        before.split("'").length % 2 === 1 &&
        before.split("`").length % 2 === 1;
      return balanced ? before : line;
    })
    .join("\n");
}

/** 行内时长字面量（归一化为 "<数字><ms|s>"）。delay 族与时序常量整行排除。 */
function lineDurationLiterals(line: string): string[] {
  if (TOKEN_DEF.test(line)) return [];
  // delay 族：delay-[60ms]、animation-delay/transition-delay —— 时序值非时长档位
  if (/\bdelay-\[|(?:animation|transition)-delay\s*:/.test(line)) return [];
  const literals: string[] = [];
  for (const m of line.matchAll(/\bduration-\[?(\d+(?:\.\d+)?)(m?s)?\]?/g)) {
    literals.push(m[1] + (m[2] ?? "ms"));
  }
  for (const m of line.matchAll(/(?<![\w-])(\d+(?:\.\d+)?)ms\b/g)) literals.push(m[1] + "ms");
  for (const m of line.matchAll(/(?<![\w.#%/-])(\d+(?:\.\d+)?)s\b/g)) literals.push(m[1] + "s");
  return literals;
}

function findDurationLiterals(): Map<string, Set<string>> {
  const byLiteral = new Map<string, Set<string>>();
  for (const scanRoot of SCAN_ROOTS) {
    for (const relative of walk(path.join(root, scanRoot))) {
      const isCss = relative.endsWith(".css");
      const text = codeOnly(readFileSync(path.join(root, relative), "utf8"), isCss);
      for (const line of text.split("\n")) {
        for (const literal of lineDurationLiterals(line)) {
          const files = byLiteral.get(literal) ?? new Set<string>();
          files.add(relative);
          byLiteral.set(literal, files);
        }
      }
    }
  }
  return byLiteral;
}

interface AllowlistEntry {
  literal: string;
  source: string;
  reason: string;
  files: string[];
}

function readAllowlist(): AllowlistEntry[] {
  const raw = JSON.parse(
    readFileSync(path.join(root, "tests", "audit", "motion-duration-allowlist.json"), "utf8"),
  ) as { entries: AllowlistEntry[] };
  return raw.entries;
}

describe("motion duration literal governance", () => {
  test("every duration literal occurrence is allowlisted with provenance", () => {
    const actual = findDurationLiterals();
    const ledger = new Map(readAllowlist().map((entry) => [entry.literal, new Set(entry.files)]));

    const violations: string[] = [];
    for (const [literal, files] of [...actual.entries()].sort()) {
      const ledgerFiles = ledger.get(literal);
      if (!ledgerFiles) {
        violations.push(
          `${literal}: 未登记（应迁移到 --uni-duration-*/--uni-motion-*/--uni-loop-* token，` +
            `或在 motion-duration-allowlist.json 以 source/reason 登记例外）`,
        );
        continue;
      }
      for (const file of [...files].sort()) {
        if (!ledgerFiles.has(file)) {
          violations.push(`${literal} @ ${file}: 该文件未登记在账本 files[] 中`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  test("the allowlist contains no stale entries (migrated literals must be removed)", () => {
    const actual = findDurationLiterals();
    const violations: string[] = [];
    for (const entry of readAllowlist()) {
      const files = actual.get(entry.literal);
      if (!files) {
        violations.push(`${entry.literal}: 代码中已不存在，应从账本删除`);
        continue;
      }
      for (const file of entry.files) {
        if (!files.has(file)) {
          violations.push(`${entry.literal} @ ${file}: 该文件已不再包含此字面量，应从 files[] 移除`);
        }
      }
    }
    expect(
      violations,
      `motion-duration-allowlist.json 存在陈旧条目（迁移后没有清账）: ${violations.join("; ")}`,
    ).toEqual([]);
  });

  test("allowlist entries carry non-empty provenance fields within scan scope", () => {
    const entries = readAllowlist();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.source.trim(), `literal ${entry.literal} 缺少 source`).not.toBe("");
      expect(entry.reason.trim(), `literal ${entry.literal} 缺少 reason`).not.toBe("");
      expect(entry.files.length, `literal ${entry.literal} 缺少 files`).toBeGreaterThan(0);
      for (const file of entry.files) {
        expect(
          file.startsWith("src/") || file.startsWith("docs/site/src/"),
          `literal ${entry.literal} 的 scope 必须指向扫描范围内的文件: ${file}`,
        ).toBe(true);
      }
    }
    const literals = entries.map((entry) => entry.literal);
    expect(new Set(literals).size).toBe(literals.length);
  });

  test("the frozen baseline can only shrink, never grow", () => {
    // 2026-09-20 动效审核冻结基线（docs/audits/motion-duration-audit-2026-09-20.md）：
    // 迁移一个字面量 = 从账本删除；新 legacy 字面量不可能出现；新例外必须以
    // 非 motion-baseline-2026-09-20 的 source 附真实理由登记。
    const FROZEN_BASELINE = new Set([
      "0s", "0.01ms", "0.15s", "0.2s", "0.3s", "0.4s",
      "150ms", "200ms", "250ms", "300ms", "500ms", "2s",
    ]);
    const baselineLiterals = readAllowlist()
      .filter((entry) => entry.source === "motion-baseline-2026-09-20")
      .map((entry) => entry.literal);
    const outsideBaseline = baselineLiterals.filter((literal) => !FROZEN_BASELINE.has(literal));
    expect(
      outsideBaseline,
      `以下字面量自称 2026-09-20 冻结基线，但不在审核清点中: ${outsideBaseline.join(", ")}`,
    ).toEqual([]);
  });
});
