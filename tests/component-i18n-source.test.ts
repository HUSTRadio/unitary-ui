import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";
import { describe, expect, test } from "vitest";
import { FRAMEWORK_MESSAGES } from "@/lib/framework-messages";
import { COMPONENTS } from "../docs/site/src/data/components";
import { localizeComponentMetadata } from "../docs/site/src/i18n/components-zh";
import COMPONENT_BEST_PRACTICES_ZH from "../docs/site/src/i18n/best-practices-zh";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentDirectory = path.join(root, "src/components/ui");
const translatableAttributes = new Set(["aria-label", "alt", "placeholder", "title"]);
const allowedTechnicalText = new Set(["UTC", "Esc", "K"]);
const componentsDemoPath = path.join(root, "docs/site/src/i18n/components-demo.ts");
const bestPracticesZhPath = path.join(root, "docs/site/src/i18n/best-practices-zh.ts");

const zhSource = await readFile(bestPracticesZhPath, "utf8");

async function componentFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return componentFiles(entryPath);
      return entry.name.endsWith(".tsx") ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

/** 取 JSX 属性上的字符串字面量：直接写法或 {} 包裹两种形式。 */
function jsxStringLiteral(
  initializer: ts.JsxAttributeValue | undefined,
): ts.StringLiteral | undefined {
  if (!initializer) return undefined;
  if (ts.isStringLiteral(initializer)) return initializer;
  if (
    ts.isJsxExpression(initializer) &&
    initializer.expression &&
    ts.isStringLiteral(initializer.expression)
  ) {
    return initializer.expression;
  }
  return undefined;
}

describe("component i18n source guard", () => {
  test("does not add raw user-facing JSX strings to framework components", { timeout: 20_000 }, async () => {
    const violations: string[] = [];

    for (const file of await componentFiles(componentDirectory)) {
      const sourceText = await readFile(file, "utf8");
      const source = ts.createSourceFile(
        file,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const visit = (node: ts.Node) => {
        if (ts.isJsxText(node)) {
          const text = node.getText(source).trim();
          if (text && /[A-Za-z]/u.test(text) && !allowedTechnicalText.has(text)) {
            violations.push(`${path.relative(root, file)}: raw JSX text ${JSON.stringify(text)}`);
          }
        }
        if (ts.isJsxAttribute(node)) {
          const attributeName = node.name.getText(source);
          const literal = translatableAttributes.has(attributeName)
            ? jsxStringLiteral(node.initializer)
            : undefined;
          if (literal) {
            violations.push(
              `${path.relative(root, file)}: raw ${attributeName} ${JSON.stringify(literal.text)}`,
            );
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }

    expect(violations).toEqual([]);
  });
});

describe("component demo translations", () => {
  test("defines each translation key once per language", async () => {
    const source = await readFile(componentsDemoPath, "utf8");
    const file = ts.createSourceFile(
      componentsDemoPath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const duplicates: string[] = [];

    function visit(node: ts.Node) {
      if (ts.isObjectLiteralExpression(node)) {
        const keys = new Set<string>();
        for (const property of node.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          const key = property.name.getText(file).replace(/^['"]|['"]$/g, "");
          if (keys.has(key)) duplicates.push(key);
          keys.add(key);
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(file);
    expect(duplicates).toEqual([]);
  });
});

/**
 * Best Practices i18n 契约测试：
 * 1. 每个有英文 bestPractices 的组件，在 COMPONENT_BEST_PRACTICES_ZH 都有翻译
 * 2. 中文条目数量与英文一致（不允许漏条或增条）
 * 3. localizeComponentMetadata 注入 bestPracticesZh
 */
describe("Best Practices i18n contract", () => {
  test("every component with English bestPractices has a Chinese translation", () => {
    const withEn = COMPONENTS.filter((c) => c.bestPractices?.length);
    const missing = withEn.filter((c) => !COMPONENT_BEST_PRACTICES_ZH[c.name]).map((c) => c.name);
    expect(missing, "缺中文翻译的组件").toEqual([]);
  });

  test("Chinese translation entry count matches English", () => {
    const mismatches = COMPONENTS.filter((c) => c.bestPractices?.length).filter(
      (c) => COMPONENT_BEST_PRACTICES_ZH[c.name]?.length !== c.bestPractices?.length,
    );
    expect(
      mismatches.map(
        (c) =>
          `${c.name}: en=${c.bestPractices?.length} zh=${COMPONENT_BEST_PRACTICES_ZH[c.name]?.length}`,
      ),
      "条目数不一致",
    ).toEqual([]);
  });

  test("localizeComponentMetadata injects bestPracticesZh", () => {
    const withEn = COMPONENTS.find((c) => c.bestPractices?.length);
    expect(withEn).toBeDefined();
    const localized = localizeComponentMetadata(withEn!);
    expect(localized.bestPracticesZh).toBeDefined();
    expect(localized.bestPracticesZh!.length).toBe(withEn!.bestPractices!.length);
  });

  test("translation file is valid TSX (no stray template backticks)", () => {
    const backtickCount = (zhSource.match(/`/g) ?? []).length;
    expect(backtickCount, "翻译文件不应包含模板反引号").toBe(0);
  });
});

/**
 * HIG-AUD-008 i18n key 契约。
 *
 * 1. 两个 locale 的键集严格同构——编译期已由 `src/lib/i18n.tsx` 的
 *    `Record<FrameworkMessageKey, string>` 注解兜底，这里做运行期双保险；
 * 2. **组件内 `t("…")` 的字面量 key 必须存在**——这正是让 3 个 key 漏过原审核的缺口：
 *    既有守卫只检查「裸 JSX 文案」，从不检查 `t()` 的 key 是否存在，
 *    缺 key 时 `i18n.tsx` 会静默回显 key 原文（不告警、不抛错）。
 */
describe("framework message key contract (HIG-AUD-008)", () => {
  const enKeys = Object.keys(FRAMEWORK_MESSAGES.en);
  const zhKeys = Object.keys(FRAMEWORK_MESSAGES["zh-CN"]);

  test("en and zh-CN expose the same key set", () => {
    expect(zhKeys.filter((key) => !enKeys.includes(key)), "zh-CN 多出的 key").toEqual([]);
    expect(enKeys.filter((key) => !zhKeys.includes(key)), "zh-CN 缺失的 key").toEqual([]);
  });

  test("keys reported by HIG-AUD-008 exist in both locales", () => {
    // 钉住本轮补齐的三个 key（其中 grabber 的 key 由中文改为英文写法）。
    for (const key of ["Close menu", "Ctrl K", "Resize height"]) {
      expect(enKeys, `en 缺 ${key}`).toContain(key);
      expect(zhKeys, `zh-CN 缺 ${key}`).toContain(key);
    }
  });

  test(
    "every literal t() key used in src exists in both locales",
    { timeout: 20_000 },
    async () => {
      const en = new Set(enKeys);
      const zh = new Set(zhKeys);
      const missing: string[] = [];
      const orphanPrefixes: string[] = [];
      const scannedKeys = new Set<string>();

      for (const file of await sourceFiles(path.join(root, "src"))) {
        const sourceText = await readFile(file, "utf8");
        const source = ts.createSourceFile(
          file,
          sourceText,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        );
        const visit = (node: ts.Node) => {
          if (isTranslateCall(node)) {
            const collect = (argument: ts.Node) => {
              if (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) {
                const key = argument.text;
                scannedKeys.add(key);
                if (!en.has(key)) {
                  missing.push(`${path.relative(root, file)}: ${JSON.stringify(key)} 不在 en`);
                }
                if (!zh.has(key)) {
                  missing.push(`${path.relative(root, file)}: ${JSON.stringify(key)} 不在 zh-CN`);
                }
                return;
              }
              if (ts.isTemplateExpression(argument)) {
                // 动态拼接（如 `JSON ${node.type}`）：退化为「必须存在同前缀的 key 族」
                const prefix = argument.head.text;
                if (!enKeys.some((key) => key.startsWith(prefix))) {
                  orphanPrefixes.push(
                    `${path.relative(root, file)}: ${JSON.stringify(prefix)}… 无同前缀 key`,
                  );
                }
                return;
              }
              // 条件表达式等分支：继续下钻收集字面量（如 t(playing ? "Pause video" : "Play video")）
              ts.forEachChild(argument, collect);
            };
            collect(node.arguments[0]);
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
      }

      // 守卫的守卫：收集器失效时必须**响亮失败**，而不是空集通过
      expect(
        scannedKeys.size,
        "扫描到的 t() 字面量 key 数量异常，收集器可能已失效",
      ).toBeGreaterThan(50);
      expect(missing).toEqual([]);
      expect(orphanPrefixes).toEqual([]);
    },
  );
});

/** `src` 下的源码文件（排除测试文件自身，避免把测试里的字面量当成组件 key）。 */
async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(entryPath);
      if (entry.name.includes(".test.")) return [];
      return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

/** `t("…")` / `t(\`…\`)` 调用（`t` 为 useI18n 解构出的翻译函数）。 */
function isTranslateCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "t" &&
    node.arguments.length > 0
  );
}
