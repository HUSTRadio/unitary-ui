import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);

describe("Entity official demo contract", () => {
  test("uses the theme-sensitive legacy list surface and divider colors", () => {
    expect(source).toContain('"--geist-background": "var(--background-200)"');
    expect(source).toContain('"--accents-2": "var(--entity-list-divider)"');
    expect(source).toContain("[--entity-list-divider:#eaeaea]");
    expect(source).toContain("dark:[--entity-list-divider:#333333]");
  });

  test("keeps checkbox and column-class demo containers at auto min-width", () => {
    for (const demoId of ["entity-with-list-and-checkbox", "entity-with-column-class-names"]) {
      expect(source).toContain(
        `<div className="w-full p-6" data-demo-container="${demoId}">`,
      );
    }
  });
});
