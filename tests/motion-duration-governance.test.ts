import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
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

const templateRoots = readdirSync(path.join(root, "templates"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(path.join(root, "templates", entry.name, "src")))
  .map((entry) => `templates/${entry.name}/src`);
const SCAN_ROOTS = [
  "src",
  // 文档站代码目录；content/i18n/data 为指南散文（含中文时长叙述），不在扫描范围
  "docs/site/src",
  "website/src",
  ...templateRoots,
];

// Registries contain prose and displayed snippets. Their executable motion options
// still receive AST checks; units in their text do not represent rendered styles.
function proseRegistry(file: string): boolean {
  return /^docs\/site\/src\/(?:content|i18n|data)\//.test(file)
    || /^(?:website\/src|templates\/[^/]+\/src)\/(?:content|data|documents)\.ts$/.test(file);
}

// token 真源定义行不算字面量（值即 token 本体）
const TOKEN_DEF = /^\s*--(?:uni-duration|uni-motion|uni-loop|animate|default-transition-duration)[\w-]*\s*:/;

function walk(dir: string, files: string[] = []): string[] {
  if (!statSync(dir).isDirectory()) return files;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (["node_modules", "dist", "__tests__"].includes(entry)) continue;
      walk(full, files);
    } else if (/\.(ts|tsx|css)$/.test(entry) && !/\.(?:test|spec)\.tsx?$/.test(entry)) {
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

/**
 * 裸时长（`.15s` / `200ms`）只有落在样式上下文里才承担动效语义。
 * 文档页与指南的自然语言散文（「默认 1s 起、2 倍增长、30s 封顶」）不是渲染样式，
 * 属于审计范围外（docs/audits/motion-duration-audit-2026-09-20.md §D）——散文里的
 * 数字+单位若被当作时长档位，只会把叙述登记进账本。因此裸时长必须与样式构造同现；
 * 无歧义的 Tailwind 形式（duration-*、animate-[*]、delay-[*]）不经过该门。
 */
const STYLE_CONTEXT = /(?:duration|animation|transition|animate|keyframes|--uni-|ease-|timing-function)/;

/** 行内时长字面量（归一化为 "<数字><ms|s>"）。仅剔除 delay 值，保留同行时长。 */
function lineDurationLiterals(line: string): string[] {
  if (TOKEN_DEF.test(line)) return [];
  // delay 族：delay-[60ms]、animation-delay/transition-delay —— 时序值非时长档位
  const timing = line
    .replace(/\bdelay-\[[^\]]*\]/g, "")
    .replace(/(?:animation|transition)-delay\s*:\s*[^;}"'\]]+/g, "");
  const literals: string[] = [];
  for (const m of timing.matchAll(/\bduration-\[?(\d+(?:\.\d+)?)(m?s)?\]?/g)) {
    literals.push(m[1] + (m[2] ?? "ms"));
  }
  if (!STYLE_CONTEXT.test(timing)) return literals;
  // Tailwind arbitrary animation 用下划线分隔值；它在这里与空格一样是合法边界。
  for (const m of timing.matchAll(/(?<![a-zA-Z0-9.#%/-])(\d+(?:\.\d+)?|\.\d+)(ms|s)(?![a-zA-Z0-9])/g)) {
    literals.push(Number(m[1]) + m[2]);
  }
  return literals;
}

/** Numeric Motion durations use seconds; native Animation timing uses milliseconds. */
function sourceDurationLiterals(file: string, text: string): string[] {
  const literals: string[] = [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const motionAnimate = new Set<string>();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)
      || !["motion", "motion/react", "motion/mini", "motion/react-mini"].includes(statement.moduleSpecifier.text)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const item of bindings.elements) {
        if ((item.propertyName ?? item.name).text === "animate") motionAnimate.add(item.name.text);
      }
    }
  }
  const unwrap = (node: ts.Expression): ts.Expression => {
    while (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)
      || ts.isSatisfiesExpression(node) || ts.isTypeAssertionExpression(node) || ts.isNonNullExpression(node)) node = node.expression;
    return node;
  };
  const duration = (node: ts.Expression, seconds: boolean) => {
    node = unwrap(node);
    if (ts.isNumericLiteral(node)) {
      const value = Number(node.text);
      if (value > 0) literals.push(`${value * (seconds ? 1000 : 1)}ms`);
    } else if (ts.isConditionalExpression(node)) {
      duration(node.whenTrue, seconds);
      duration(node.whenFalse, seconds);
    }
  };
  const options = (node: ts.Expression, seconds: boolean) => {
    node = unwrap(node);
    if (ts.isConditionalExpression(node)) {
      options(node.whenTrue, seconds);
      options(node.whenFalse, seconds);
    } else if (ts.isObjectLiteralExpression(node)) {
      for (const property of node.properties) {
        if (ts.isPropertyAssignment(property) && property.name.getText(source).replace(/["']/g, "") === "duration") {
          duration(property.initializer, seconds);
        } else if (seconds && ts.isPropertyAssignment(property)) {
          // Motion also accepts per-property and default transition objects.
          options(property.initializer, true);
        }
      }
    } else if (!seconds) duration(node, false); // Element.animate(keyframes, 200)
  };
  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node) && node.name.getText(source).replace(/["']/g, "") === "transition") options(node.initializer, true);
    if (ts.isJsxAttribute(node) && node.name.getText(source) === "transition"
      && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression) {
      options(node.initializer.expression, true);
    }
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const type = node.type?.getText(source);
      if (type === "Transition" || /transition/i.test(node.name.getText(source))) options(node.initializer, true);
      else if (["KeyframeAnimationOptions", "KeyframeEffectOptions"].includes(type ?? "")) options(node.initializer, false);
    }
    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "animate" && node.arguments[1]) {
        options(node.arguments[1], false);
      } else if (ts.isIdentifier(node.expression) && motionAnimate.has(node.expression.text) && node.arguments[2]) {
        options(node.arguments[2], true);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...new Set(literals)];
}

function findDurationLiterals(): Map<string, Set<string>> {
  const byLiteral = new Map<string, Set<string>>();
  for (const scanRoot of SCAN_ROOTS) {
    for (const relative of walk(path.join(root, scanRoot))) {
      // 静态目录复制 CSS 定义，并由生成确定性测试验证；不是新增动画实现。
      // The generated catalog mirrors CSS definitions, checked by the catalog test.
      if (relative === "src/lib/token-catalog.ts") continue;
      const isCss = relative.endsWith(".css");
      const original = readFileSync(path.join(root, relative), "utf8");
      const text = codeOnly(original, isCss);
      const literals = proseRegistry(relative) ? [] : text.split("\n").flatMap(lineDurationLiterals);
      if (!isCss) literals.push(...sourceDurationLiterals(relative, original));
      for (const literal of literals) {
        const files = byLiteral.get(literal) ?? new Set<string>();
        files.add(relative);
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
    readFileSync(path.join(root, "tests", "audit", "motion-duration-allowlist.json"), "utf8"),
  ) as { entries: AllowlistEntry[] };
  return raw.entries;
}

// The remaining historical baseline can shrink, including within a file.
const frozenBaseline: Record<string, Record<string, number>> = {
  "2s": { "src/components/ui/grid.module.css": 6 },
};
function baselineViolations(entries: AllowlistEntry[], read = (file: string) => readFileSync(path.join(root, file), "utf8")) {
  const violations: string[] = [];
  for (const entry of entries.filter(item => item.source === "motion-baseline-2026-09-20")) {
    const files = frozenBaseline[entry.literal];
    if (!files) { violations.push(`${entry.literal}: migrated baseline literal cannot return`); continue; }
    for (const file of entry.files) {
      const limit = files[file];
      if (limit === undefined) { violations.push(`${entry.literal} @ ${file}: new baseline file`); continue; }
      const count = codeOnly(read(file), file.endsWith(".css")).split("\n")
        .flatMap(lineDurationLiterals).filter(literal => literal === entry.literal).length;
      if (count > limit) violations.push(`${entry.literal} @ ${file}: ${count} occurrences exceed frozen ${limit}`);
    }
  }
  return violations;
}

describe("motion duration literal governance", () => {
  test("covers documentation shells, website styles and every copyable template", () => {
    const files = SCAN_ROOTS.flatMap((directory) => walk(path.join(root, directory)));
    for (const file of ["docs/site/src/App.tsx", "docs/site/src/pages/tokens.tsx", "docs/site/src/index.css", "website/src/index.css"]) {
      expect(files).toContain(file);
    }
    for (const directory of templateRoots) expect(files).toContain(`${directory}/App.tsx`);
    expect(files.some((file) => file.includes("/__tests__/"))).toBe(false);
    expect(proseRegistry("docs/site/src/content/component-guides/guides-26-motion.ts")).toBe(true);
    expect(proseRegistry("docs/site/src/pages/tokens.tsx")).toBe(false);
  });

  test.each([
    ['<motion.div transition={{ duration: .2 }} />', ["200ms"]],
    ['const variants = { open: { transition: { duration: .2 } } };', ["200ms"]],
    ['<motion.div transition={{ opacity: { duration: .2 }, default: { duration: .3 } }} />', ["200ms", "300ms"]],
    ['const transition = { opacity: condition ? { duration: .2 } : { duration: 0 }, repeat: 3, delay: .4 };', ["200ms"]],
    ['const transition = { duration: condition ? .2 : 0 } as const;', ["200ms"]],
    ['const timing: Transition = { duration: (.2 as number) };', ["200ms"]],
    ['element.animate(frames, { duration: 240, delay: 100 });', ["240ms"]],
    ['element.animate(frames, condition ? 240 : 0);', ["240ms"]],
    ['const timing: KeyframeAnimationOptions = { duration: 240 };', ["240ms"]],
    ['import { animate as run } from "motion"; run(element, { opacity: 1 }, { duration: .2 });', ["200ms"]],
    ['const transition = { duration: 0, delay: .2 };', []],
    ['const transition = { ...tokens, duration: tokens.duration };', []],
    ['toast({ duration: 3500 }); const media = { duration: 120 };', []],
    ['const source = "transition: { duration: .2 }"; const scene = { frames: 72 };', []],
    ['const animation = { dwell: 1000, delay: 200 };', []],
  ] as const)("detects numeric motion timing without treating dwell or media as animation: %s", (source, expected) => {
    expect(sourceDurationLiterals("fixture.tsx", source)).toEqual(expected);
  });

  test.each([
    ["before:animate-[loading_1.4s_var(--ease-in-out)_infinite]", ["1.4s"]],
    ["animate-[loading_120ms_var(--ease-in-out)_infinite]", ["120ms"]],
    ["duration-150", ["150ms"]],
    ["transition: opacity .15s var(--ease-snap);", ["0.15s"]],
    ["delay-[60ms] duration-[240ms]", ["240ms"]],
    ["animate-[loading_1.4s_var(--ease-in-out)_infinite] delay-[60ms]", ["1.4s"]],
    ["transition-delay: 60ms; transition-duration: 240ms;", ["240ms"]],
    ["animation-delay: .1s, 200ms; animation-duration: .4s;", ["0.4s"]],
    ['const classes = "[animation-delay:60ms] duration-300";', ["300ms"]],
    ["--animate-blink: blink 1.4s var(--ease-in-out) infinite;", []],
    ["delay-[60ms] duration-(--uni-duration-base)", []],
    ["animation-delay: 60ms, .1s;", []],
    ['const source = "/capture-1.4s";', []],
    // 散文里的数字+单位是叙述，不是时长档位（审计范围外）；样式上下文里的同样形式仍要检出。
    ['" 指数退避（默认 1s 起、2 倍增长、30s 封顶），两个适配器共用同一套参数。",', []],
    ['" exponential backoff (1s start, 2x growth, 30s cap), so both adapters take the same options.",', []],
    ["animation: fade var(--ease-out) 2s;", ["2s"]],
    ['style={{ animation: "spin 1s linear infinite" }}', ["1s"]],
  ] as const)("detects duration values without treating delay as duration: %s", (source, expected) => {
    expect([...new Set(lineDurationLiterals(source))]).toEqual(expected);
  });

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
          SCAN_ROOTS.some((directory) => file.startsWith(`${directory}/`)),
          `literal ${entry.literal} 的 scope 必须指向扫描范围内的文件: ${file}`,
        ).toBe(true);
      }
    }
    const literals = entries.map((entry) => entry.literal);
    expect(new Set(literals).size).toBe(literals.length);
  });

  test("the frozen baseline can only shrink, never grow", () => {
    expect(baselineViolations(readAllowlist())).toEqual([]);
  });

  test.each([
    ["2s", "src/components/ui/grid.module.css", 1, true],
    ["2s", "src/components/ui/grid.module.css", 6, true],
    ["2s", "src/components/ui/grid.module.css", 7, false],
    ["2s", "src/components/ui/new-widget.css", 1, false],
    ["0.3s", "src/components/ui/grid.module.css", 1, false],
  ] as const)("freezes baseline literal, file and occurrence count: %s %s x%s", (literal, file, count, allowed) => {
    const entries = [{ literal, source: "motion-baseline-2026-09-20", reason: "fixture", files: [file] }];
    const source = Array.from({ length: count }, () => `animation: fixture ${literal};`).join("\n");
    expect(baselineViolations(entries, () => source).length === 0).toBe(allowed);
  });
});
