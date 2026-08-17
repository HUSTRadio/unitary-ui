import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

const root = process.cwd();
const docsPath = path.resolve(root, "docs/geist/src/components/docs-components-page.tsx");

function controlledDemoFieldsMissingReadOnly(source: string) {
  const file = ts.createSourceFile(
    docsPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const hits: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText(file);
      if (tag === "Toggle" || tag === "Checkbox") {
        const attributes = new Set(
          node.attributes.properties
            .filter(ts.isJsxAttribute)
            .map((attribute) => attribute.name.getText(file)),
        );
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
  return hits;
}

describe("docs controlled field console contract", () => {
  test("static checked Checkbox and Toggle demos are explicitly read-only", async () => {
    const source = await readFile(docsPath, "utf8");
    expect(controlledDemoFieldsMissingReadOnly(source)).toEqual([]);
  });

  test("copyable static checked examples are explicitly read-only", async () => {
    const [batch1, batch7, components] = await Promise.all([
      readFile(path.resolve(root, "docs/geist/src/data/demo-code-batch1.ts"), "utf8"),
      readFile(path.resolve(root, "docs/geist/src/data/demo-code-batch7.ts"), "utf8"),
      readFile(path.resolve(root, "docs/geist/src/data/components.ts"), "utf8"),
    ]);

    expect(batch1).toContain("<Checkbox checked readOnly disabled>Disabled Checked</Checkbox>");
    expect(batch7).toContain('<Toggle aria-label="Enable Firewall" checked readOnly disabled />');
    expect(batch7).toContain(
      '<Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />',
    );
    expect(components).toContain('<Checkbox id="checked" checked readOnly />');
  });
});
