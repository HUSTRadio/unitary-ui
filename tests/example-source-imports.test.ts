import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

function rootName(tag: ts.JsxTagNameExpression): string | undefined {
  if (ts.isIdentifier(tag)) return tag.text;
  if (!ts.isPropertyAccessExpression(tag)) return undefined;

  let expression: ts.Expression = tag.expression;
  while (ts.isPropertyAccessExpression(expression)) expression = expression.expression;
  return ts.isIdentifier(expression) ? expression.text : undefined;
}

function missingJsxImports(code: string): string[] {
  const source = ts.createSourceFile(
    "show-code.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const available = new Set<string>();
  const used = new Set<string>();

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause;
      if (clause?.name) available.add(clause.name.text);
      if (clause?.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings)) {
          available.add(clause.namedBindings.name.text);
        } else {
          for (const specifier of clause.namedBindings.elements) {
            available.add(specifier.name.text);
          }
        }
      }
    } else if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) {
      if (statement.name) available.add(statement.name.text);
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) available.add(declaration.name.text);
      }
    }
  }

  function visit(node: ts.Node): void {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = rootName(node.tagName);
      if (name && /^[A-Z]/.test(name)) used.add(name);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);

  return [...used].filter((name) => !available.has(name)).sort();
}

function exportedNames(moduleName: string): Set<string> {
  const modulePath = path.join("src", "components", "ui", `${moduleName}.tsx`);
  if (!existsSync(modulePath)) return new Set();
  const source = ts.createSourceFile(
    modulePath,
    readFileSync(modulePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const names = new Set<string>();
  const isExported = (node: ts.Node) =>
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false);

  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const specifier of statement.exportClause.elements) names.add(specifier.name.text);
    } else if (ts.isVariableStatement(statement) && isExported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      isExported(statement) &&
      statement.name
    ) {
      names.add(statement.name.text);
    }
  }
  return names;
}

function invalidUiImports(code: string): string[] {
  const source = ts.createSourceFile(
    "show-code.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const invalid: string[] = [];

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const match = statement.moduleSpecifier.text.match(/^@\/components\/ui\/([a-z0-9-]+)$/);
    if (!match || !statement.importClause?.namedBindings) continue;
    if (!ts.isNamedImports(statement.importClause.namedBindings)) continue;

    const exports = exportedNames(match[1]);
    for (const specifier of statement.importClause.namedBindings.elements) {
      const imported = specifier.propertyName?.text ?? specifier.name.text;
      if (!exports.has(imported)) invalid.push(`${match[1]}:${imported}`);
    }
  }
  return invalid.sort();
}

describe("Show Code JSX imports", () => {
  it("detects an unresolved component tag", () => {
    expect(missingJsxImports('import { Modal } from "@/components/ui/modal";\n<ModalTrigger />')).toEqual([
      "ModalTrigger",
    ]);
  });

  it("imports or locally declares every component tag in every snippet", () => {
    for (const [slug, blocks] of Object.entries(EXAMPLE_SOURCE)) {
      for (const [block, code] of Object.entries(blocks)) {
        expect(missingJsxImports(code), `${slug}.${block} has unresolved JSX tags`).toEqual([]);
      }
    }
  });

  it("imports names that the referenced UI module actually exports", () => {
    for (const [slug, blocks] of Object.entries(EXAMPLE_SOURCE)) {
      for (const [block, code] of Object.entries(blocks)) {
        expect(invalidUiImports(code), `${slug}.${block} imports missing UI exports`).toEqual([]);
      }
    }
  });
});
