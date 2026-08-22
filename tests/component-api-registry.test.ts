import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { COMPONENT_API } from "../docs/geist/src/data/component-api";
import { COMPONENTS } from "../docs/geist/src/data/components";
import { NAV_GROUPS } from "../docs/geist/src/data/nav";

describe("component API registry", () => {
  it("has an API entry for every documented component", () => {
    expect(Object.keys(COMPONENT_API).sort()).toEqual(COMPONENTS.map(({ name }) => name).sort());
  });

  it("keeps every entry useful to a consumer", () => {
    for (const [name, api] of Object.entries(COMPONENT_API)) {
      expect(api.exports.length, `${name} needs at least one public export`).toBeGreaterThan(0);
      expect(
        api.exports.every((entry) => entry.trim().length > 0),
        `${name} exports blank API text`,
      ).toBe(true);
    }
  });

  it("links the common lifecycle conventions and every component page to the registry UI", async () => {
    expect(NAV_GROUPS.find((group) => group.title === "API")?.items).toEqual([
      expect.objectContaining({ to: "/lifecycle-and-hooks" }),
    ]);
    const source = await readFile("docs/geist/src/components/docs-components-page.tsx", "utf8");
    expect(source).toContain("<ComponentApiReference componentName={name} />");
  });
});
