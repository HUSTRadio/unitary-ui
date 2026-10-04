import { describe, expect, it } from "vitest";

import { COMPONENTS } from "../docs/site/src/data/components";
import { NAV_GROUPS } from "../docs/site/src/data/nav";
import {
  CHART_COMPONENT_NAMES,
  DOCS_ROUTE_GROUPS,
  DOCS_ROUTE_SEQUENCE,
  canonicalDocsPath,
  getAdjacentDocsPages,
  getDocsRoute,
  getDocsRouteLabel,
} from "../docs/site/src/data/docs-routes";

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
      COMPONENTS.map((component) =>
        CHART_COMPONENT_NAMES.has(component.name)
          ? `/charts/${component.name}`
          : `/components/${component.name}`,
      ).sort(),
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
        // 分组稳定 id：侧栏折叠状态的记忆键（与语言无关）
        id: group.id,
        title: group.title,
        titleZh: group.titleZh,
        items: group.items.map(({ label, labelZh, to, icon, status }) => ({
          label,
          labelZh,
          to,
          icon,
          status,
        })),
        ...(group.subgroups
          ? {
              subgroups: group.subgroups.map((subgroup) => ({
                title: subgroup.title,
                titleZh: subgroup.titleZh,
                items: subgroup.items.map(({ label, labelZh, to, icon, status }) => ({
                  label,
                  labelZh,
                  to,
                  icon,
                  status,
                })),
              })),
            }
          : {}),
      })),
    );
  });

  it("splits the components sidebar section into ordered second-level categories", () => {
    const components = DOCS_ROUTE_GROUPS.find((group) => group.id === "components");
    expect(components?.subgroups?.map((subgroup) => subgroup.id)).toEqual([
      "actions",
      "forms",
      "navigation",
      "data-display",
      "feedback",
      "overlays",
      "content",
      "mobile",
    ]);

    // 二级分类的拼接结果必须与分组扁平序列逐项一致（顺序即侧栏顺序）
    expect(components?.subgroups?.flatMap((subgroup) => subgroup.items.map((item) => item.to))).toEqual(
      components?.items.map((item) => item.to),
    );

    // 只有「组件」区块有二级分类
    expect(
      DOCS_ROUTE_GROUPS.filter((group) => group.subgroups !== undefined).map((group) => group.id),
    ).toEqual(["components"]);
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

  it("groups network and async primitives after API with bilingual titles and existing URLs", () => {
    const groupIndex = DOCS_ROUTE_GROUPS.findIndex((group) => group.id === "network");
    const network = DOCS_ROUTE_GROUPS[groupIndex];
    expect(DOCS_ROUTE_GROUPS[groupIndex - 1]?.id).toBe("api");
    expect(DOCS_ROUTE_GROUPS[groupIndex + 1]?.id).toBe("components");
    expect(network?.title).toBe("Network & Async");
    expect(network?.titleZh).toBe("网络与异步");
    expect(network?.subgroups).toBeUndefined();
    expect(network?.items.map((route) => route.to)).toEqual([
      "/components/lazy-load",
      "/components/prefetch",
    ]);
    for (const name of ["lazy-load", "prefetch"]) {
      expect(getDocsRoute(`/components/${name}/`)).toMatchObject({
        group: "network",
        renderer: { kind: "component-detail", componentName: name },
      });
      expect(DOCS_ROUTE_GROUPS.find((group) => group.id === "components")?.items.map((route) => route.to))
        .not.toContain(`/components/${name}`);
    }
  });

  it("follows the new network section order in previous and next links", () => {
    expect(getAdjacentDocsPages("/lifecycle-and-hooks").next?.to).toBe("/components/lazy-load");
    expect(getAdjacentDocsPages("/components/lazy-load").previous?.to).toBe("/lifecycle-and-hooks");
    expect(getAdjacentDocsPages("/components/lazy-load").next?.to).toBe("/components/prefetch");
    expect(getAdjacentDocsPages("/components/prefetch").next?.to).toBe("/components");
    expect(getAdjacentDocsPages("/components").previous?.to).toBe("/components/prefetch");
  });

  it("accepts every route renderer descriptor in App's typed renderer maps", () => {
    for (const route of DOCS_ROUTE_SEQUENCE) {
      expect(["static", "localized", "component-index", "component-detail"]).toContain(
        route.renderer.kind,
      );
    }
  });
});
