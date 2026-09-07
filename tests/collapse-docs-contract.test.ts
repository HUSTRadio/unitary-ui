import { describe, expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

describe("Collapse official demo contract", () => {
  test("collapse examples use theme-sensitive divider borders", () => {
    const ids = Object.keys(EXAMPLE_SOURCE.collapse);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    for (const example of Object.values(EXAMPLE_SOURCE.collapse)) {
      expect(example).toMatch(/border-b|border-gray-alpha-400/);
    }
  });
});
