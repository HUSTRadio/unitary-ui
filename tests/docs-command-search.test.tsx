import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { DOCS_ROUTE_GROUPS, getRouteSearchText } from "../docs/site/src/data/docs-routes";

function findRoute(label: string) {
  for (const group of DOCS_ROUTE_GROUPS) {
    const item = group.items.find((route) => route.label === label);
    if (item) return { group, item };
  }

  throw new Error(`Missing route ${label}`);
}

describe("docs command search text", () => {
  test("indexes bilingual item labels without leaking group names into each result", () => {
    const { item } = findRoute("Status Dot");
    const { group: layout, item: stack } = findRoute("Stack");

    expect(getRouteSearchText(item)).toBe("status dot 状态圆点");
    expect(layout.title).toBe("Layout & Organization");
    expect(getRouteSearchText(stack)).toBe("stack 堆叠");
    expect(getRouteSearchText(stack)).not.toContain("organization");
  });

  test("preserves aliases without indexing the group", () => {
    expect(
      getRouteSearchText({ label: "Toast", labelZh: "轻提示", aliases: ["Notification"] }),
    ).toBe("toast 轻提示 notification");
  });

  test("uses the canonical bilingual search text as the command item value", () => {
    const app = readFileSync(new URL("../docs/site/src/App.tsx", import.meta.url), "utf8");

    expect(app).toContain("getRouteSearchText");
    expect(app).toContain("value={getRouteSearchText(item)}");
    expect(app).not.toContain("value={`${group.title} ${item.label}`}");
  });
});
