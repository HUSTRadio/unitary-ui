import { describe, expect, test } from "vitest";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

describe("Context Card official demo contract", () => {
  test("covers default, alignment, and render-prop demos with real triggers", () => {
    const { default: defaultExample, alignment, "render-prop": renderProp } = EXAMPLE_SOURCE[
      "context-card"
    ];
    for (const example of [defaultExample, alignment, renderProp]) {
      expect(example).toContain("<ContextCardTrigger");
    }
    expect(renderProp.match(/<ContextCardTrigger/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });
});
