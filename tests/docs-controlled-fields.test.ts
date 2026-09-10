import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

const root = process.cwd();
const docsPath = path.resolve(root, "docs/geist/src/components/docs-components-page.tsx");

function inspectControlledDemoFields(source: string, fileName = docsPath) {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const hits: string[] = [];
  let controlledCount = 0;

  function visit(node: ts.Node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText(file);
      if (tag === "Toggle" || tag === "Checkbox") {
        const attributes = new Set(
          node.attributes.properties
            .filter(ts.isJsxAttribute)
            .map((attribute) => attribute.name.getText(file)),
        );
        if (attributes.has("checked")) {
          controlledCount += 1;
        }
        if (
          attributes.has("checked") &&
          !attributes.has("onChange") &&
          !attributes.has("readOnly")
        ) {
          const { line } = file.getLineAndCharacterOfPosition(node.getStart(file));
          hits.push(`${tag}:${line + 1}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(file);
  return { controlledCount, hits };
}

describe("docs controlled field console contract", () => {
  test("static checked Checkbox and Toggle demos are explicitly read-only", async () => {
    const sources = [
      { fileName: docsPath, source: await readFile(docsPath, "utf8") },
      ...Object.entries(EXAMPLE_SOURCE).flatMap(([slug, examples]) =>
        Object.entries(examples).map(([id, source]) => ({
          fileName: `${slug}#${id}.tsx`,
          source,
        })),
      ),
    ];
    const inspections = sources.map(({ source, fileName }) =>
      inspectControlledDemoFields(source, fileName),
    );
    const controlledCount = inspections.reduce((sum, result) => sum + result.controlledCount, 0);
    const hits = inspections.flatMap((result) => result.hits);

    expect(controlledCount, "guard: at least one controlled Checkbox/Toggle must be scanned").toBeGreaterThan(0);
    expect(hits).toEqual([]);
  });
});
