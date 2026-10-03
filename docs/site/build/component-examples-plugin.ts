import { readFile } from "node:fs/promises";
import ts from "typescript";
import type { Plugin } from "vite";

/** Derive component chunks from the canonical paired demo/source registry. */
export function componentExamplesPlugin(): Plugin {
  return {
    name: "unitary-component-examples",
    enforce: "pre",
    async load(id) {
      const queryIndex = id.indexOf("?");
      if (queryIndex < 0) return null;
      const query = new URLSearchParams(id.slice(queryIndex + 1));
      if (!query.has("example-loaders") && !query.has("example-component")) return null;
      const fileName = id.slice(0, queryIndex);
      const source = ts.createSourceFile(
        fileName, await readFile(fileName, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS,
      );
      const imports = new Map<string, ts.ImportDeclaration>();
      const groups = new Map<string, ts.ObjectLiteralExpression[]>();
      for (const statement of source.statements) {
        if (ts.isImportDeclaration(statement) && statement.importClause) {
          const clause = statement.importClause;
          if (clause.name) imports.set(clause.name.text, statement);
          if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
            for (const binding of clause.namedBindings.elements) imports.set(binding.name.text, statement);
          }
        }
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "EXAMPLE_RECORDS") continue;
          if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
            throw new Error(`${fileName}: expected an EXAMPLE_RECORDS array`);
          }
          for (const record of declaration.initializer.elements) {
            if (!ts.isObjectLiteralExpression(record)) throw new Error(`${fileName}: expected a literal example record`);
            const slug = record.properties.find((property): property is ts.PropertyAssignment =>
              ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && property.name.text === "slug",
            )?.initializer;
            if (!slug || !ts.isStringLiteral(slug)) throw new Error(`${fileName}: expected a literal example slug`);
            const records = groups.get(slug.text) ?? [];
            records.push(record);
            groups.set(slug.text, records);
          }
        }
      }
      if (!groups.size) throw new Error(`${fileName}: no example records found`);
      // Watch the source registry as well as the virtual chunk, so HMR rebuilds
      // the loader map when examples are added, removed or regrouped.
      this.addWatchFile(fileName);
      if (query.has("example-loaders")) {
        if (query.get("example-loaders") !== "" || query.has("example-component")) {
          throw new Error(`${id}: invalid example-loaders query`);
        }
        return `export const EXAMPLE_LOADERS = {${[...groups.keys()].map((slug) =>
          `${JSON.stringify(slug)}: () => import(${JSON.stringify(`./registry.ts?example-component=${encodeURIComponent(slug)}`)})`,
        ).join(",\n")}};`;
      }
      const slug = query.get("example-component")!;
      const records = groups.get(slug);
      if (!records) throw new Error(`${id}: unknown component examples`);
      const requiredImports = new Set<ts.ImportDeclaration>();
      for (const record of records) {
        for (const property of record.properties) {
          if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.initializer)) continue;
          const declaration = imports.get(property.initializer.text);
          if (!declaration) throw new Error(`${fileName}: missing example import ${property.initializer.text}`);
          requiredImports.add(declaration);
        }
      }
      return `${[...requiredImports].map((statement) => statement.getText(source)).join("\n")}
export const EXAMPLE_REGISTRY = {${JSON.stringify(slug)}: [${records.map((record) => record.getText(source)).join(",\n")}]};`;
    },
  };
}
