import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";
import { COMPONENT_API } from "../docs/site/src/data/component-api";

const docsRoot = path.resolve("docs/site/src");
const packageName = "@hustradio/unitary-ui";
const publicStyles = new Set([`${packageName}/styles.css`, `${packageName}/tailwind-reference.css`]);
const interpolation = "__docs_interpolated_value__";

function constantStrings(source: ts.SourceFile): Map<string, string> {
  const constants = new Map<string, string>();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement) || !(statement.declarationList.flags & ts.NodeFlags.Const)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer && ts.isStringLiteralLike(declaration.initializer)) {
        constants.set(declaration.name.text, declaration.initializer.text);
      }
    }
  }
  return constants;
}

function stringValue(node: ts.Node, constants: ReadonlyMap<string, string>): string | undefined {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isIdentifier(node)) return constants.get(node.text);
  return undefined;
}

function importPathViolations(apis: readonly { importPath?: string }[]): string[] {
  return apis.flatMap((api) => api.importPath === undefined || api.importPath === packageName
    ? [] : [`${api.importPath}: component imports must use the package root`]);
}

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "__tests__") return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
}

function publicExports(): Set<string> {
  const source = ts.createSourceFile("index.ts", readFileSync("src/lib/index.ts", "utf8"), ts.ScriptTarget.Latest, true);
  const names = new Set<string>();
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      statement.exportClause.elements.forEach((entry) => names.add(entry.name.text));
    }
  }
  return names;
}

/** Inspect syntax rather than matching quoted prose or comments that mention paths. */
function importViolations(file: string, text: string, exports: Set<string>): string[] {
  const violations: string[] = [];
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = constantStrings(source);
  function check(moduleName: string, node: ts.Node, names: readonly string[] = []) {
    if (moduleName.includes(interpolation)) {
      violations.push(`${moduleName}: cannot verify an interpolated module specifier`);
      return;
    }
    const relative = moduleName.startsWith(".") ? path.relative(docsRoot, path.resolve(path.dirname(file), moduleName.split("?")[0])) : undefined;
    if (moduleName.startsWith("@/") || (relative !== undefined && (relative === ".." || relative.startsWith(`..${path.sep}`)))) {
      violations.push(`${moduleName}: imports repository internals`);
    }
    if (moduleName.startsWith(`${packageName}/`) && !publicStyles.has(moduleName)) {
      violations.push(`${moduleName}: is not a public docs entry point`);
    }
    if (moduleName === packageName) {
      for (const name of names) if (!exports.has(name)) violations.push(`${name}: is absent from the package root`);
      if (ts.isImportDeclaration(node) && node.importClause?.name) violations.push("default: is absent from the package root");
    }
  }
  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const bindings = node.importClause?.namedBindings;
      check(node.moduleSpecifier.text, node, bindings && ts.isNamedImports(bindings)
        ? bindings.elements.map((entry) => (entry.propertyName ?? entry.name).text) : []);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      check(node.moduleSpecifier.text, node, node.exportClause && ts.isNamedExports(node.exportClause)
        ? node.exportClause.elements.map((entry) => (entry.propertyName ?? entry.name).text) : []);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const moduleName = node.arguments[0];
      if (moduleName) {
        const literal = stringValue(moduleName, constants);
        const resolved = literal ?? (ts.isTemplateExpression(moduleName)
          ? moduleName.head.text + moduleName.templateSpans.map((span) =>
            (stringValue(span.expression, constants) ?? interpolation) + span.literal.text).join("")
          : interpolation);
        check(resolved, node);
      }
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      check(node.argument.literal.text, node);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return violations;
}

function fileImportViolations(file: string, text: string, exports: Set<string>): string[] {
  const found = importViolations(file, text, exports);
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = constantStrings(source);
  function snippets(node: ts.Node) {
    if (ts.isStringLiteralLike(node) && /\b(?:import|require)\b/.test(node.text)) {
      found.push(...importViolations(file, node.text, exports));
    } else if (ts.isTemplateExpression(node) && /\b(?:import|require)\b/.test(node.head.text + node.templateSpans.map((span) => span.literal.text).join(""))) {
      let candidates = [node.head.text];
      for (const span of node.templateSpans) {
        const expression = span.expression;
        let values = [stringValue(expression, constants) ?? interpolation];
        // The API renderer interpolates canonical metadata; inspect every path it can render.
        if (file === path.join(docsRoot, "components/docs-api-reference.tsx")
          && ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
          && ts.isPropertyAccessExpression(expression.left) && ts.isIdentifier(expression.left.expression)
          && expression.left.expression.text === "api" && expression.left.name.text === "importPath"
          && ts.isStringLiteralLike(expression.right)) {
          const fallback = expression.right.text;
          values = [...new Set(Object.values(COMPONENT_API).map((api) => api.importPath ?? fallback))];
        }
        candidates = candidates.flatMap((prefix) => values.map((value) => prefix + value + span.literal.text));
      }
      // Interpolated export names have their own registry parity checks; static names remain checked.
      for (const candidate of candidates) found.push(...importViolations(file, candidate, new Set([...exports, interpolation])));
    }
    ts.forEachChild(node, snippets);
  }
  snippets(source);
  return found;
}

describe("docs public library imports", () => {
  it("keeps runtime, types, dynamic imports and displayed static snippets inside public boundaries", () => {
    const exports = publicExports();
    const violations = filesIn(docsRoot).flatMap((file) => {
      const text = readFileSync(file, "utf8");
      const found = fileImportViolations(file, text, exports);
      return found.map((issue) => `${path.relative(docsRoot, file)}: ${issue}`);
    });
    expect(violations).toEqual([]);
  });

  it("detects aliased, dynamic, type-only and snippet imports that bypass the public API", () => {
    const file = path.join(docsRoot, "pages/fixture.tsx");
    expect(importViolations(file, `
      import { Internal as Alias } from "${packageName}";
      export { Hidden } from "${packageName}/internal";
      const load = () => import("@/lib/private");
      type HiddenType = import("../../../../src/lib/private").Hidden;
    `, new Set())).toEqual([
      "Internal: is absent from the package root",
      `${packageName}/internal: is not a public docs entry point`,
      "@/lib/private: imports repository internals",
      "../../../../src/lib/private: imports repository internals",
    ]);
  });

  it("checks no-substitution templates in dynamic imports and require calls", () => {
    const file = path.join(docsRoot, "pages/fixture.tsx");
    expect(importViolations(file, 'const load = () => import(`@/lib/private`); const required = require(`@hustradio/unitary-ui/private`);', new Set())).toEqual([
      "@/lib/private: imports repository internals",
      `${packageName}/private: is not a public docs entry point`,
    ]);
  });

  it("checks private paths in snippets with interpolated bodies or constant importPath variables", () => {
    const file = path.join(docsRoot, "pages/fixture.tsx");
    for (const text of [
      'const snippet = `import { Button } from "@hustradio/unitary-ui/private";\n${body}`;',
      'const importPath = "@hustradio/unitary-ui/private"; const snippet = `import { Button } from "${importPath}";\n${body}`;',
    ]) expect(fileImportViolations(file, text, new Set(["Button"]))).toEqual([
      `${packageName}/private: is not a public docs entry point`,
    ]);
  });

  it("rejects unresolved module interpolation while allowing generated names with a public path", () => {
    const file = path.join(docsRoot, "pages/fixture.tsx");
    expect(fileImportViolations(file, 'const snippet = `import { Button } from "${runtimePath}";`;', new Set(["Button"]))).toEqual([
      `${interpolation}: cannot verify an interpolated module specifier`,
    ]);
    expect(fileImportViolations(file, 'const importPath = "@hustradio/unitary-ui"; const snippet = `import { ${names} } from "${importPath}";`;', new Set())).toEqual([]);
  });

  it("keeps every component importPath consumed by the API template on the public root", () => {
    expect(importPathViolations(Object.values(COMPONENT_API))).toEqual([]);
    expect(importPathViolations([{ importPath: `${packageName}/private` }, { importPath: packageName }, {}])).toEqual([
      `${packageName}/private: component imports must use the package root`,
    ]);
  });
});
