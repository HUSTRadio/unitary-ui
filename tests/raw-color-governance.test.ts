// @vitest-environment node
/**
 * Raw color literal governance gate (visual plan item 1 follow-up).
 *
 * Rule: every raw color literal (hex / rgb[a] / hsl[a]) in component and lib
 * source must be listed in tests/audit/raw-color-allowlist.json with
 * source/reason/scope provenance, and every allowlist entry must still exist
 * in the code. This makes the ledger a ratchet: raw literals can only leave
 * the codebase, never re-enter unreviewed, and a migrated literal blocks the
 * suite until its ledger entry is removed (no stale entries).
 *
 * The palette owner `src/styles/index.css` is exempt — it is the runtime
 * foundation-scale definition and is gated against the Geist snapshot by
 * tests/color-palette-governance.test.ts instead.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_ROOTS = ["src/components", "src/lib"];
const EXEMPT_FILES = new Set([path.join("src", "styles", "index.css")]);

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
// Only reject an alphabetic predecessor: inside Tailwind arbitrary values the
// literal is preceded by `_` (a word character), so a `\w` lookbehind would
// silently miss it.
const FN_COLOR = /(?<![a-zA-Z])rgba?\([^)]*\)|(?<![a-zA-Z])hsla?\([^)]*\)/g;

function walk(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    const relative = path.relative(root, full);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules") continue;
      walk(full, files);
    } else if (/\.(ts|tsx|css)$/.test(entry) && !EXEMPT_FILES.has(relative)) {
      files.push(relative);
    }
  }
  return files;
}

/** Drop block comments and (in TS/TSX) line comments outside string quotes. */
function codeOnly(source: string, isCss: boolean): string {
  let text = source.replace(/\/\*[\s\S]*?\*\//g, "");
  if (isCss) return text;
  text = text
    .split("\n")
    .map((line) => {
      const index = line.indexOf("//");
      if (index < 0) return line;
      const before = line.slice(0, index);
      const balanced =
        before.split('"').length % 2 === 1 &&
        before.split("'").length % 2 === 1 &&
        before.split("`").length % 2 === 1;
      return balanced ? before : line;
    })
    .join("\n");
  return text;
}

function normalizeHex(hex: string): string {
  const value = hex.toLowerCase();
  if (value.length === 4) return `#${value.slice(1).split("").map((c) => c + c).join("")}`;
  return value;
}

function findRawLiterals(): Map<string, Set<string>> {
  const byLiteral = new Map<string, Set<string>>();
  for (const scanRoot of SCAN_ROOTS) {
    for (const relative of walk(path.join(root, scanRoot))) {
      const isCss = relative.endsWith(".css");
      const text = codeOnly(readFileSync(path.join(root, relative), "utf8"), isCss);
      const literals = [
        ...(text.match(HEX) ?? []).map(normalizeHex),
        ...(text.match(FN_COLOR) ?? []).map((entry) => entry.replace(/\s+/g, " ").toLowerCase()),
      ];
      for (const literal of literals) {
        const files = byLiteral.get(literal) ?? new Set<string>();
        files.add(relative.replace(/\\/g, "/"));
        byLiteral.set(literal, files);
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
    readFileSync(path.join(root, "tests", "audit", "raw-color-allowlist.json"), "utf8"),
  ) as { entries: AllowlistEntry[] };
  return raw.entries;
}

describe("raw color literal governance", () => {
  test("every raw color literal occurrence is allowlisted with provenance", () => {
    const actual = findRawLiterals();
    const allowlist = readAllowlist();
    const ledger = new Map(allowlist.map((entry) => [entry.literal, new Set(entry.files)]));

    const violations: string[] = [];
    for (const [literal, files] of [...actual.entries()].sort()) {
      const ledgerFiles = ledger.get(literal);
      if (!ledgerFiles) {
        violations.push(`${literal}: 未登记（需要迁移到语义 token，或在 raw-color-allowlist.json 中以 source/reason/scope 登记例外）`);
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
    const actual = findRawLiterals();
    const allowlist = readAllowlist();
    const violations: string[] = [];
    for (const entry of allowlist) {
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
      `raw-color-allowlist.json 存在陈旧条目（迁移后没有清账）: ${violations.join("; ")}`,
    ).toEqual([]);
  });

  test("allowlist entries carry non-empty provenance fields", () => {
    const allowlist = readAllowlist();
    expect(allowlist.length).toBeGreaterThan(0);
    for (const entry of allowlist) {
      expect(entry.source.trim(), `literal ${entry.literal} 缺少 source`).not.toBe("");
      expect(entry.reason.trim(), `literal ${entry.literal} 缺少 reason`).not.toBe("");
      expect(entry.files.length, `literal ${entry.literal} 缺少 files`).toBeGreaterThan(0);
      for (const file of entry.files) {
        expect(file.startsWith("src/"), `literal ${entry.literal} 的 scope 必须指向 src/ 文件: ${file}`).toBe(true);
      }
    }
    const literals = allowlist.map((entry) => entry.literal);
    expect(new Set(literals).size).toBe(literals.length);
  });

  test("the legacy baseline can only shrink, never grow", () => {
    const allowlist = readAllowlist();
    // Frozen 2026-09-04 audit baseline: every raw literal in component/lib
    // source at that point. Migrating a literal removes it from the ledger;
    // new legacy literals are impossible, and any new raw literal must be
    // reviewed in with real provenance (never the legacy source).
    const LEGACY_BASELINE = new Set([
      "#000000", "#00000005", "#0000000a", "#00000014", "#00000029", "#00000057",
      "#00000066", "#0070f3", "#0096ff", "#0a0a0a", "#111111", "#171717", "#1a1a1a",
      "#1c1c1e", "#1f1f1f", "#28c840", "#333333", "#444444", "#45a557", "#45dec4",
      "#8f8f8f", "#999999", "#9a9a9a", "#c41562", "#da2f35", "#e5484d", "#eaeaea",
      "#ee0000", "#efefef", "#f2f2f2", "#f5b047", "#f5f5f5", "#f81ce5", "#fafafa",
      "#febc2e", "#ff1e56", "#ff518d", "#ff5f57", "#ffb224", "#ffe381", "#ffffff",
      "#ffffff24", "#ffffff66", "hsl(0,0%,30%)", "hsl(0,0%,87%)", "rgb(250, 250, 250)",
      "rgba(0, 0, 0, 0.02)", "rgba(0, 0, 0, 0.03)", "rgba(0, 0, 0, 0.04)",
      "rgba(0, 0, 0, 0.05)", "rgba(0, 0, 0, 0.06)", "rgba(0, 0, 0, 0.08)",
      "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.2)",
      "rgba(0, 0, 0, 0.5)", "rgba(0,0,0,0)", "rgba(0,0,0,0.04)", "rgba(0,0,0,0.07)",
      "rgba(0,0,0,0.08)", "rgba(0,0,0,0.12)", "rgba(0,0,0,0.16)", "rgba(0,0,0,0.24)",
      "rgba(0,0,0,0.36)", "rgba(128,128,128,0.35)", "rgba(128,128,128,0.45)",
      "rgba(203,42,47,0.16)", "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)",
      "rgba(255, 255, 255, 0.25)", "rgba(255, 255, 255, 0.3)", "rgba(255,255,255,0.15)",
      "rgba(255,255,255,0.24)", "rgba(var(--debug-color-rgb)",
    ]);
    const legacyLiterals = allowlist
      .filter((entry) => entry.source === "legacy-baseline-2026-09-04")
      .map((entry) => entry.literal);
    const outsideBaseline = legacyLiterals.filter((literal) => !LEGACY_BASELINE.has(literal));
    expect(
      outsideBaseline,
      `以下字面量自称 legacy 基线，但不在 2026-09-04 冻结审计中: ${outsideBaseline.join(", ")}`,
    ).toEqual([]);
  });
});
