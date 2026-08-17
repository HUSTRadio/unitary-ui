import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

const sourcePath = path.resolve(process.cwd(), "docs/geist/src/i18n/components-demo.ts");

describe("component demo translations", () => {
  test("defines each translation key once per language", async () => {
    const source = await readFile(sourcePath, "utf8");
    const file = ts.createSourceFile(
      sourcePath,
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
