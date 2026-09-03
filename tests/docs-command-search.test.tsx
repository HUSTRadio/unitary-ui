import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { DOCS_ROUTE_GROUPS, getRouteSearchText } from "../docs/geist/src/data/docs-routes";

function findRoute(label: string) {
  for (const group of DOCS_ROUTE_GROUPS) {
    const item = group.items.find((route) => route.label === label);
    if (item) return { group, item };
  }

  throw new Error(`Missing route ${label}`);
}

describe("docs command search text", () => {
  test("indexes Chinese and English group and item labels regardless of UI language", () => {
    const { group, item } = findRoute("Status Dot");

    expect(getRouteSearchText(group, item)).toBe("components 组件 status dot 状态圆点");
  });

  test("uses the canonical bilingual search text as the command item value", () => {
    const app = readFileSync(new URL("../docs/geist/src/App.tsx", import.meta.url), "utf8");

    expect(app).toContain("getRouteSearchText");
    expect(app).toContain("value={getRouteSearchText(group, item)}");
    expect(app).not.toContain("value={`${group.title} ${item.label}`}");
  });
});
