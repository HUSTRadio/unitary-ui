import { readFileSync } from "node:fs";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import { COMPONENT_API } from "../docs/geist/src/data/component-api";

function libraryValueExports(): Set<string> {
  const file = "src/lib/index.ts";
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const names = new Set<string>();

  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
    for (const specifier of statement.exportClause.elements) {
      if (!specifier.isTypeOnly) names.add(specifier.name.text);
    }
  }
  return names;
}

describe("library/docs public export parity", () => {
  it("exports every value advertised by component API docs from the package entry", () => {
    const actual = libraryValueExports();
    const documented = [...new Set(Object.values(COMPONENT_API).flatMap((api) => api.exports))];
    expect(documented.filter((name) => !actual.has(name))).toEqual([]);
  });
});
