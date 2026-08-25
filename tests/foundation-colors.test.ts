import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { FOUNDATION_COLOR_SCALES } from "../docs/geist/src/data/foundation-colors";

const expectedScales = [
  ["Backgrounds", [100, 200]],
  ["Gray", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Gray alpha", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Blue", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Red", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Amber", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Green", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Teal", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Purple", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
  ["Pink", [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]],
] as const;

describe("foundation color metadata", () => {
  test("keeps the canonical scale order, existing steps, and only token metadata", async () => {
    const css = await readFile("src/styles/index.css", "utf8");

    expect(FOUNDATION_COLOR_SCALES.map((scale) => scale.label)).toEqual(
      expectedScales.map(([label]) => label),
    );

    for (const [index, [label, steps]] of expectedScales.entries()) {
      const scale = FOUNDATION_COLOR_SCALES[index];
      expect(scale).toMatchObject({ label });
      expect(Object.keys(scale).sort()).toEqual(["label", "steps", "usage"]);
      expect(scale.steps.map((color) => color.step)).toEqual(steps);

      for (const color of scale.steps) {
        expect(Object.keys(color).sort()).toEqual(["step", "token"]);
        expect(color.token).toMatch(/^--color-[a-z-]+-\d+$/);
        expect(css).toContain(`${color.token}:`);
      }
    }

    expect(JSON.stringify(FOUNDATION_COLOR_SCALES)).not.toMatch(
      /#(?:[0-9a-f]{3,8})\b|\b(?:rgb|hsl|oklch)\(|display-p3/i,
    );
  });

  test("places every metadata alias in the static runtime-emission owner", async () => {
    const css = await readFile("src/styles/index.css", "utf8");
    const staticStart = css.indexOf("@theme static {");
    const staticOwner = css.slice(staticStart, css.indexOf("\n}", staticStart));
    const metadataTokens = FOUNDATION_COLOR_SCALES.flatMap((scale) =>
      scale.steps.map((color) => color.token),
    );

    expect(staticStart).toBeGreaterThanOrEqual(0);
    expect(metadataTokens).toHaveLength(92);
    expect(metadataTokens.filter((token) => !staticOwner.includes(`${token}:`))).toEqual([]);
  });
});
