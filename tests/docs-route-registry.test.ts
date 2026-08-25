import { describe, expect, it } from "vitest";

import { COMPONENTS } from "../docs/geist/src/data/components";
import { NAV_GROUPS } from "../docs/geist/src/data/nav";
import {
  DOCS_ROUTE_GROUPS,
  DOCS_ROUTE_SEQUENCE,
  canonicalDocsPath,
  getAdjacentDocsPages,
  getDocsRoute,
  getDocsRouteLabel,
} from "../docs/geist/src/data/docs-routes";

describe("canonical docs route registry", () => {
  it("normalizes introduction aliases and trailing slashes", () => {
    expect(canonicalDocsPath("introduction")).toBe("/");
    expect(canonicalDocsPath("/introduction/")).toBe("/");
    expect(canonicalDocsPath("/colors/")).toBe("/colors");
    expect(getDocsRoute("/introduction/")?.renderer).toEqual({
      kind: "static",
      page: "introduction",
    });
    expect(getDocsRouteLabel(DOCS_ROUTE_SEQUENCE[0], "zh-CN")).toBe("介绍");
  });

  it("uses unique canonical routes and derives component details from COMPONENTS", () => {
    const paths = DOCS_ROUTE_SEQUENCE.map((route) => route.to);
    expect(new Set(paths).size).toBe(paths.length);

    const componentPaths = DOCS_ROUTE_SEQUENCE
      .filter((route) => route.renderer.kind === "component-detail")
      .map((route) => route.to)
      .sort();
    expect(componentPaths).toEqual(
      COMPONENTS.map((component) => `/components/${component.name}`).sort(),
    );
  });

  it("projects a duplicate-free sidebar while keeping the component overview paginable", () => {
    const sidebarPaths = DOCS_ROUTE_GROUPS.flatMap((group) =>
      group.items.map((item) => item.to),
    );
    expect(sidebarPaths).not.toContain("/components");
    expect(sidebarPaths).toEqual(
      DOCS_ROUTE_SEQUENCE.filter((route) => route.sidebar).map((route) => route.to),
    );
  });

  it("keeps NAV_GROUPS as an exact registry compatibility projection", () => {
    expect(NAV_GROUPS).toEqual(
      DOCS_ROUTE_GROUPS.map((group) => ({
        title: group.title,
        titleZh: group.titleZh,
        items: group.items.map(({ label, labelZh, to, icon }) => ({ label, labelZh, to, icon })),
      })),
    );
  });

  it("keeps adjacency symmetric across every canonical route, aliases, and unknown paths", () => {
    DOCS_ROUTE_SEQUENCE.forEach((route, index) => {
      const adjacent = getAdjacentDocsPages(route.to);
      expect(adjacent.previous?.to).toBe(DOCS_ROUTE_SEQUENCE[index - 1]?.to);
      expect(adjacent.next?.to).toBe(DOCS_ROUTE_SEQUENCE[index + 1]?.to);
    });

    expect(getAdjacentDocsPages("/introduction")).toEqual(getAdjacentDocsPages("/"));
    expect(getAdjacentDocsPages("/introduction/")).toEqual(getAdjacentDocsPages("/"));

    const unknown = getAdjacentDocsPages("/not-a-doc-route");
    expect(unknown.previous).toBeUndefined();
    expect(unknown.next).toBeUndefined();
  });

  it("accepts every route renderer descriptor in App's typed renderer maps", () => {
    for (const route of DOCS_ROUTE_SEQUENCE) {
      expect(["static", "localized", "component-index", "component-detail"]).toContain(
        route.renderer.kind,
      );
    }
  });
});
