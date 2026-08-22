import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";
import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentDirectory = path.join(root, "src/components/ui");
const translatableAttributes = new Set(["aria-label", "alt", "placeholder", "title"]);
const allowedTechnicalText = new Set(["UTC", "Esc", "K"]);

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
  test("does not add raw user-facing JSX strings to framework components", async () => {
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
