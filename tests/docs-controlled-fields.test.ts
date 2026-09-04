import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

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

  test("copyable static checked examples are explicitly read-only", () => {
    const copyableExamples = Object.values(EXAMPLE_SOURCE).flatMap((examples) =>
      Object.values(examples),
    );
    const source = copyableExamples.join("\n");

    expect(source).toContain("<Checkbox checked readOnly disabled>Disabled Checked</Checkbox>");
    expect(source).toContain('<Toggle aria-label="Enable Firewall" checked readOnly disabled />');
    expect(source).toContain(
      '<Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />',
    );
    expect(source).toContain('<Checkbox checked readOnly aria-label="Checked" />');
  });
});
