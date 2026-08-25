import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);

describe("Entity official demo contract", () => {
  test("owns and consumes the theme-sensitive list surface locally", () => {
    expect(source).toContain('"--accents-2": "var(--entity-list-divider)"');
    expect(source).toContain("[--entity-list-background:var(--background-100)]");
    expect(source).toContain("dark:[--entity-list-background:var(--background-200)]");
    expect(source).toContain("[--entity-list-divider:#eaeaea]");
    expect(source).toContain("dark:[--entity-list-divider:#333333]");
    expect(source).toContain("bg-[var(--entity-list-background)]");
    expect(source).toContain("stroke-[var(--entity-list-background)]");
  });

  test("does not retain retired Entity variable shims", () => {
    for (const retiredVariable of [
      "--geist-gap-half",
      "--geist-form-small-font",
      "--geist-background",
    ]) {
      expect(source).not.toContain(retiredVariable);
    }
  });

  test("keeps the local button geometry and 14px type behavior", () => {
    expect(source).toContain("[--x-padding:6px]");
    expect(source).toContain("!pl-[var(--x-padding)]");
    expect(source).toContain("!pr-[var(--x-padding)]");
    expect(source).toContain("text-[14px]");
  });

  test("keeps checkbox and column-class demo containers at auto min-width", () => {
    for (const demoId of ["entity-with-list-and-checkbox", "entity-with-column-class-names"]) {
      expect(source).toContain(`<div className="w-full p-6" data-demo-container="${demoId}">`);
    }
  });

  test("checks only the first row in the checkbox list demo", () => {
    expect(source).toContain("checked={index === 0}");
  });
});
