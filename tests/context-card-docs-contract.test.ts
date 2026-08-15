import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  resolve(import.meta.dirname, "../docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);

describe("Context Card official demo contract", () => {
  test("covers default, alignment, and render-prop demos with real triggers", () => {
    expect(source).toContain("data-demo-card={id}");
    expect(source).toContain("data-demo-container={id}");
    for (const id of ["default", "alignment", "render-prop"]) {
      expect(source).toContain(`"${id}",`);
    }
    expect(source.match(/<ContextCardTrigger/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });
});
