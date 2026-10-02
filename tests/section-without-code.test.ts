import { test, expect } from "vitest";
import ts from "typescript";
import { docsPageSource } from "./helpers/docs-page-source";

function sectionCodeContracts(source: string) {
  const file = ts.createSourceFile("docs-page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const contracts: boolean[] = [];
  function visit(node: ts.Node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(file) === "Section") {
      contracts.push(node.attributes.properties.some((attribute) => {
        if (!ts.isJsxAttribute(attribute) || attribute.name.getText(file) !== "code") return false;
        const initializer = attribute.initializer;
        if (!initializer || !ts.isJsxExpression(initializer) || !initializer.expression) return false;
        const expression = initializer.expression;
        return ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression)
          && expression.expression.text === "record" && expression.name.text === "source";
      }));
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return contracts;
}

test("every demo Section uses its registry record as Show Code source", () => {
  const sections = sectionCodeContracts(docsPageSource);
  expect(sections.length, "guard: docs page must render at least one Section").toBeGreaterThan(0);
  expect(sections.every(Boolean)).toBe(true);
});

test("JSX callbacks do not truncate the opening tag or hide missing code", () => {
  expect(sectionCodeContracts('<Section description={examples.find((example) => example.visible)?.description} code={record.source} />')).toEqual([true]);
  expect(sectionCodeContracts('<Section description={examples.find((example) => example.visible)?.description} />')).toEqual([false]);
  expect(sectionCodeContracts('<Section code={other.source} />')).toEqual([false]);
});
