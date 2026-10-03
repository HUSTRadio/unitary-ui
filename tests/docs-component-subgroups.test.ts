// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

import { COMPONENTS } from "../docs/site/src/data/components";
import { CHART_COMPONENT_NAMES, DOCS_ROUTE_GROUPS } from "../docs/site/src/data/docs-routes";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** 侧栏「组件」区块的二级分类顺序（即 registry 中的声明顺序）。 */
const EXPECTED_SUBGROUP_IDS = [
  "actions",
  "forms",
  "navigation",
  "data-display",
  "feedback",
  "overlays",
  "content",
  "mobile",
];

/** 布局原语归入「排版与布局」分组，图表组件归入「图表」分组，都不属于「组件」区块。 */
const LAYOUT_COMPONENT_NAMES = new Set(["safe-area", "stack"]);
const NETWORK_COMPONENT_NAMES = new Set(["lazy-load", "prefetch"]);

/** 「组件」区块只收常规组件页，排除独立归组的原语与图表。 / Excludes separately grouped pages. */
const REGULAR_COMPONENTS = COMPONENTS.filter(
  (component) =>
    !LAYOUT_COMPONENT_NAMES.has(component.name) &&
    !NETWORK_COMPONENT_NAMES.has(component.name) &&
    !CHART_COMPONENT_NAMES.has(component.name),
);

function componentsGroup() {
  const group = DOCS_ROUTE_GROUPS.find((entry) => entry.id === "components");
  if (!group) throw new Error("canonical registry 缺少 components 分组");
  return group;
}

function componentPath(name: string): string {
  return `/components/${name}`;
}

describe("docs components second-level categories", () => {
  test("declares the functional subgroups in sidebar order with bilingual titles", () => {
    const subgroups = componentsGroup().subgroups ?? [];
    expect(subgroups.map((subgroup) => subgroup.id)).toEqual(EXPECTED_SUBGROUP_IDS);
    for (const subgroup of subgroups) {
      expect(subgroup.title.trim().length, `${subgroup.id} 缺少英文标题`).toBeGreaterThan(0);
      expect(subgroup.titleZh.trim().length, `${subgroup.id} 缺少中文标题`).toBeGreaterThan(0);
      expect(subgroup.items.length, `${subgroup.id} 不应为空分类`).toBeGreaterThan(0);
    }
  });

  test("covers regular component pages exactly once and leaves separately grouped primitives and charts out", () => {
    const paths = componentsGroup().items.map((item) => item.to);
    expect(new Set(paths).size, "组件区块出现重复路由").toBe(paths.length);
    expect([...paths].sort()).toEqual(
      REGULAR_COMPONENTS.map((component) => componentPath(component.name)).sort(),
    );
  });

  test("keeps the flat sequence identical to the concatenated subgroups", () => {
    const group = componentsGroup();
    const flat = group.subgroups?.flatMap((subgroup) => subgroup.items.map((item) => item.to));
    expect(flat).toEqual(group.items.map((item) => item.to));
  });

  test("sorts each subgroup alphabetically by English label", () => {
    for (const subgroup of componentsGroup().subgroups ?? []) {
      const labels = subgroup.items.map((item) => item.label);
      expect(labels, `${subgroup.id} 未按字母序排列`).toEqual(
        [...labels].sort((left, right) => left.localeCompare(right, "en")),
      );
    }
  });

  test("collects every mobileOnly component into the trailing Mobile only subgroup", () => {
    const mobileOnly = COMPONENTS.filter((component) => component.mobileOnly)
      .map((component) => componentPath(component.name))
      .sort();
    const mobileSubgroup = componentsGroup().subgroups?.find((subgroup) => subgroup.id === "mobile");

    expect(mobileOnly.length).toBeGreaterThan(0);
    expect(mobileSubgroup?.items.map((item) => item.to).sort()).toEqual(mobileOnly);
  });

  test("does not hard-code mobileOnly components in the non-mobile category table", () => {
    const source = readFileSync(path.join(ROOT, "docs/site/src/data/docs-routes.ts"), "utf8");
    const table = source.match(/const COMPONENT_SUBGROUP_BY_NAME[^=]*=\s*\{([\s\S]*?)\n\};/);
    expect(table, "未找到 COMPONENT_SUBGROUP_BY_NAME 分类表").not.toBeNull();

    for (const component of COMPONENTS.filter((entry) => entry.mobileOnly)) {
      expect(
        table?.[1],
        `${component.name} 由 ComponentMeta.mobileOnly 归类，不应再写入分类表`,
      ).not.toMatch(new RegExp(`(^|[\\s"])${component.name}"?\\s*:`));
    }
  });
});
