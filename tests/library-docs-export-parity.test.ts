import { readFileSync } from "node:fs";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import { COMPONENT_API } from "../docs/geist/src/data/component-api";

function libraryValueExports(): {
  all: Set<string>;
  byComponent: Map<string, Set<string>>;
} {
  const file = "src/lib/index.ts";
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const all = new Set<string>();
  const byComponent = new Map<string, Set<string>>();

  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue;
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;

    const modulePath = statement.moduleSpecifier?.getText(source).slice(1, -1);
    const component = modulePath?.match(/^@\/components\/ui\/(.+)$/)?.[1];
    const componentExports = component
      ? (byComponent.get(component) ?? new Set<string>())
      : undefined;

    for (const specifier of statement.exportClause.elements) {
      if (specifier.isTypeOnly) continue;
      all.add(specifier.name.text);
      componentExports?.add(specifier.name.text);
    }
    if (component && componentExports) byComponent.set(component, componentExports);
  }
  return { all, byComponent };
}

function libraryTypeExports(): Set<string> {
  const file = "src/lib/index.ts";
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const types = new Set<string>();

  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement)) continue;
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue;
    for (const specifier of statement.exportClause.elements) {
      if (statement.isTypeOnly || specifier.isTypeOnly) types.add(specifier.name.text);
    }
  }
  return types;
}

describe("library/docs public export parity", () => {
  it("exports every value advertised by component API docs from the package entry", () => {
    const { all } = libraryValueExports();
    const documented = [...new Set(Object.values(COMPONENT_API).flatMap((api) => api.exports))];
    expect(documented.filter((name) => !all.has(name))).toEqual([]);
  });

  it("documents every package-root value exported from a documented component module", () => {
    const { byComponent } = libraryValueExports();

    for (const [component, actual] of byComponent) {
      const api = COMPONENT_API[component as keyof typeof COMPONENT_API];
      if (!api) continue;
      expect(
        [...actual].filter((name) => !api.exports.includes(name)),
        `${component} has undocumented package-root exports`,
      ).toEqual([]);
    }
  });

  it("exports prop types for standalone and pattern-companion public surfaces", () => {
    const types = libraryTypeExports();
    expect([...types]).toEqual(
      expect.arrayContaining([
        "BottomSheetProps",
        "DeviceProps",
        "DeviceScreenProps",
        "ErrorBoundaryProps",
        "NavbarProps",
        "SidebarNavProps",
        "SidebarNavGroup",
        "SidebarNavItem",
        "FooterProps",
        "FooterColumn",
        "FooterLink",
        "RatingPillProps",
        "RatingValue",
      ]),
    );
  });

  it("does not expose parent implementation details from the package root", () => {
    const { all } = libraryValueExports();
    expect([...all]).not.toEqual(
      expect.arrayContaining(["ExpandPanel", "Grabber", "PhoneStatusBar", "PhoneSafariChrome"]),
    );
  });
});
