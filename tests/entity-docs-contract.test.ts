import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

describe("Entity official demo contract", () => {
  test("entity examples render the official Entity component structure", () => {
    const examples = Object.values(EXAMPLE_SOURCE.entity);
    expect(examples.length).toBeGreaterThan(0);
    const joined = examples.join("\n");
    expect(joined).toContain("<Entity");
    expect(joined).toContain("<EntityTitle");
    expect(joined).toContain("<EntityDescription");
    expect(joined).toContain("<EntityMedia");
    expect(joined).toContain("<EntityAction");
  });

  test("does not retain retired Entity variable shims", () => {
    for (const example of Object.values(EXAMPLE_SOURCE.entity)) {
      expect(example).not.toContain("--geist-gap-half");
      expect(example).not.toContain("--geist-form-small-font");
      expect(example).not.toContain("--geist-background");
    }
  });

  test("keeps the local button geometry and 14px type behavior", () => {
    const joined = Object.values(EXAMPLE_SOURCE.entity).join("\n");
    expect(joined).toContain("<EntityAction");
    expect(joined).toContain("text-copy-14");
  });

  test("entity demos render complete list containers", () => {
    for (const id of ["entity-with-list-and-checkbox", "entity-with-column-class-names"]) {
      expect(EXAMPLE_SOURCE.entity[id]).toContain("<Entity");
    }
  });

  test("checks only the first row in the checkbox list demo", () => {
    expect(EXAMPLE_SOURCE.entity["entity-with-list-and-checkbox"]).toContain("github: true");
    expect(EXAMPLE_SOURCE.entity["entity-with-list-and-checkbox"]).toContain("checked={checkedStates[item.id]}");
  });
});
