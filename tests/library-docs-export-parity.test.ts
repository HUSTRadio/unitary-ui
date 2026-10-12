import { readFileSync } from "node:fs";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import { COMPONENT_GUIDES } from "../docs/site/src/content/component-guides";
import { COMPONENT_API } from "../docs/site/src/data/component-api";
import { COMPONENTS } from "../docs/site/src/data/components";
import { EXAMPLE_REGISTRY } from "../docs/site/src/examples/registry";

/**
 * Package modules intentionally documented on a broader owner page. Every
 * exception is explicit so a new public module cannot silently skip docs.
 */
const PUBLIC_UTILITIES_WITHOUT_COMPONENT_PAGES = new Set(["charts/chart-colors"]);

const REQUIRED_PUBLIC_COMPONENT_MODULES = [
  "sidebar-nav", "navbar", "footer", "hamburger-menu", "rating-pill", "skeleton-mask", "side-panel",
] as const;

const DOCUMENT_OWNER_BY_MODULE: Readonly<Record<string, readonly string[]>> = {
  "nav-layout": ["sidebar-nav", "hamburger-menu"],
  layout: ["safe-area", "flex"],
  "skeleton-mask": ["skeleton"],
  "rating-pill": ["feedback"],
  "chart-category-bar": ["category-bar"],
  "chart-bar-list": ["bar-list"],
  "chart-progress-circle": ["progress-circle"],
  "chart-tracker": ["tracker"],
  "charts/category-bar": ["category-bar"],
  "charts/bar-list": ["bar-list"],
  "charts/progress-circle": ["progress-circle"],
  "charts/tracker": ["tracker"],
  "charts/area-chart": ["area-chart"],
  "charts/bar-chart": ["bar-chart"],
  "charts/combo-chart": ["combo-chart"],
  "charts/donut-chart": ["donut-chart"],
  "charts/line-chart": ["line-chart"],
  "charts/spark-chart": ["spark-chart"],
};

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

  it("maps every package-root component module to complete docs owners", () => {
    const { byComponent } = libraryValueExports();
    expect([...REQUIRED_PUBLIC_COMPONENT_MODULES].filter((moduleName) => !byComponent.has(moduleName))).toEqual([]);
    const registeredSlugs = new Set(COMPONENTS.map(({ name }) => name));

    for (const [moduleName, actual] of byComponent) {
      if (PUBLIC_UTILITIES_WITHOUT_COMPONENT_PAGES.has(moduleName)) continue;
      const owners = DOCUMENT_OWNER_BY_MODULE[moduleName] ?? [moduleName];
      const documented = new Set<string>();
      for (const owner of owners) {
        expect(registeredSlugs.has(owner), `${moduleName} has no registered docs owner ${owner}`).toBe(true);
        expect(COMPONENT_API[owner], `${moduleName} owner ${owner} has no API table`).toBeDefined();
        expect(COMPONENT_GUIDES[owner]?.["zh-CN"], `${moduleName} owner ${owner} has no Chinese guide`).toBeDefined();
        expect(COMPONENT_GUIDES[owner]?.["en-US"], `${moduleName} owner ${owner} has no English guide`).toBeDefined();
        expect(EXAMPLE_REGISTRY[owner]?.length, `${moduleName} owner ${owner} has no example`).toBeGreaterThan(0);
        COMPONENT_API[owner]?.exports.forEach((name) => documented.add(name));
      }
      expect(
        [...actual].filter((name) => !documented.has(name)),
        `${moduleName} has package-root exports missing from owners ${owners.join(", ")}`,
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
