import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";
import { describe, expect, test } from "vitest";
import { COMPONENTS } from "../docs/geist/src/data/components";
import { localizeComponentMetadata } from "../docs/geist/src/i18n/components-zh";
import COMPONENT_BEST_PRACTICES_ZH from "../docs/geist/src/i18n/best-practices-zh";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentDirectory = path.join(root, "src/components/ui");
const translatableAttributes = new Set(["aria-label", "alt", "placeholder", "title"]);
const allowedTechnicalText = new Set(["UTC", "Esc", "K"]);
const componentsDemoPath = path.join(root, "docs/geist/src/i18n/components-demo.ts");
const bestPracticesZhPath = path.join(root, "docs/geist/src/i18n/best-practices-zh.ts");

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
        if (ts.isJsxAttribute(node) && translatableAttributes.has(node.name.text)) {
          const initializer = node.initializer;
          const literal = ts.isStringLiteral(initializer)
            ? initializer
            : ts.isJsxExpression(initializer) &&
                initializer.expression &&
                ts.isStringLiteral(initializer.expression)
              ? initializer.expression
              : undefined;
          if (literal) {
            violations.push(
              `${path.relative(root, file)}: raw ${node.name.text} ${JSON.stringify(literal.text)}`,
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
