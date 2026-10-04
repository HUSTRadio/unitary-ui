import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { FRAMEWORK_API } from "../docs/site/src/data/framework-api";
import { DOCS_ROUTE_GROUPS, DOCS_ROUTE_SEQUENCE, getDocsRoute, getComponentDocsPath } from "../docs/site/src/data/docs-routes";

describe("canonical documentation categories", () => {
  it("provides the API pages in the intended order", () => {
    expect(DOCS_ROUTE_GROUPS.find((group) => group.id === "api")!.items.map((route) => route.to)).toEqual(["/api", "/api/state-and-events", "/api/tokens", "/api/color-schemes"]);
  });
  it("lists the public palette and code theme APIs in the overview", () => {
    const entry = FRAMEWORK_API.find((group) => group.to === "/api/color-schemes");
    expect(entry?.names).toEqual(["COLOR_SCHEMES", "CODE_THEMES", "getColorScheme", "getCodeTheme", "resolveCodeTheme", "getInlineCodeColors", "createColorSchemeCSS", "applyColorScheme", "applyCodeTheme"]);
  });
  it("uses unique category paths and removes obsolete moved routes", () => {
    expect(new Set(DOCS_ROUTE_SEQUENCE.map((route) => route.to)).size).toBe(DOCS_ROUTE_SEQUENCE.length);
    for (const name of ["grid", "safe-area", "flex", "layer"]) expect(getDocsRoute(getComponentDocsPath(name))?.group).toBe("layout");
    for (const name of ["lazy-load", "prefetch"]) expect(getDocsRoute(getComponentDocsPath(name))?.group).toBe("network");
    for (const old of ["/grid", "/typography", "/tokens", "/lifecycle-and-hooks", "/components/grid", "/components/stack", "/components/safe-area", "/components/prefetch", "/components/lazy-load"]) expect(getDocsRoute(old)).toBeUndefined();
  });
  it("indexes only real package-root exports and valid reference destinations", () => {
    const source = ts.createSourceFile("index.ts", readFileSync("src/lib/index.ts", "utf8"), ts.ScriptTarget.Latest, true);
    const names = new Set<string>();
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        statement.exportClause.elements.forEach((entry) => names.add(entry.name.text));
      }
    }
    for (const entry of FRAMEWORK_API) {
      entry.names.forEach((name) => expect(names.has(name), name).toBe(true));
      expect(getDocsRoute(entry.to.split("#")[0]), entry.to).toBeDefined();
    }
  });
});
