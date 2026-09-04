import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import * as publicApi from "../src/lib";
import { ContinuousSurface } from "../src/components/ui/continuous-surface";
import {
  CONTINUOUS_CORNER_EXPONENT,
  CIRCULAR_CORNER_EXPONENT,
  continuousCornerPath,
  cornerCurvePoints,
  superellipsePath,
} from "../src/lib/continuous-corner";

const closeTo = (actual: number, expected: number, tolerance = 1e-8) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);

describe("continuous corner geometry", () => {
  test("uses source-neutral Unitary curve constants", () => {
    expect(CIRCULAR_CORNER_EXPONENT).toBe(2);
    expect(CONTINUOUS_CORNER_EXPONENT).toBe(3);
  });

  test("p=2 samples lie exactly on the circular arc", () => {
    const radius = 20;
    const points = cornerCurvePoints(radius, 2, 24);
    expect(points).toHaveLength(25);
    expect(points[0]).toEqual([0, radius]);
    closeTo(points.at(-1)![0], radius);
    closeTo(points.at(-1)![1], 0);

    for (const [x, y] of points) {
      closeTo((x - radius) ** 2 + (y - radius) ** 2, radius ** 2, 1e-7);
    }
  });

  test("higher exponents move the diagonal monotonically toward the corner", () => {
    const diagonal = (exponent: number) => cornerCurvePoints(1, exponent, 2)[1]![0];
    expect(diagonal(5)).toBeLessThan(diagonal(3));
    expect(diagonal(3)).toBeLessThan(diagonal(2));
  });

  test("emits exact SVG arcs for the p=2 rounded-rectangle baseline", () => {
    const path = continuousCornerPath(100, 60, { radius: 12, exponent: 2 });
    expect(path).toBe(
      "M 12 0 H 88 A 12 12 0 0 1 100 12 V 48 A 12 12 0 0 1 88 60 H 12 A 12 12 0 0 1 0 48 V 12 A 12 12 0 0 1 12 0 Z",
    );
  });

  test("clamps radius to half the shortest side and closes sampled paths", () => {
    const path = continuousCornerPath(80, 20, { radius: 99, exponent: 3, samples: 8 });
    expect(path.startsWith("M 10 0 L 70 0")).toBe(true);
    expect(path.endsWith(" Z")).toBe(true);
    expect(path).not.toMatch(/NaN|Infinity/);
  });

  test("superellipse samples stay inside the requested bounds", () => {
    const path = superellipsePath(40, 30, { exponent: 5, samples: 32 });
    const numbers = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
    const xs = numbers.filter((_, index) => index % 2 === 0);
    const ys = numbers.filter((_, index) => index % 2 === 1);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(40);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(30);
    expect(path.endsWith(" Z")).toBe(true);
  });

  test.each([
    () => cornerCurvePoints(-1, 3, 8),
    () => cornerCurvePoints(8, 1, 8),
    () => cornerCurvePoints(8, 3, 1),
    () => continuousCornerPath(0, 20, { radius: 4 }),
    () => continuousCornerPath(20, 20, { radius: Number.NaN }),
    () => superellipsePath(20, 20, { exponent: 1 }),
  ])("rejects invalid geometry instead of emitting a corrupt path", (call) => {
    expect(call).toThrow(RangeError);
  });
});

describe("ContinuousSurface", () => {
  test("is available with the geometry helpers from the package root", () => {
    expect(publicApi.ContinuousSurface).toBe(ContinuousSurface);
    expect(publicApi.continuousCornerPath).toBe(continuousCornerPath);
    expect(publicApi.cornerCurvePoints).toBe(cornerCurvePoints);
    expect(publicApi.superellipsePath).toBe(superellipsePath);
    expect(publicApi.useContinuousCorners).toBeTypeOf("function");
  });

  test("renders a measurable clip owner with an SSR-safe circular fallback", () => {
    const html = renderToStaticMarkup(
      <ContinuousSurface radius={12} exponent={3} className="surface" aria-label="Preview">
        Content
      </ContinuousSurface>,
    );
    expect(html).toContain('data-slot="continuous-surface"');
    expect(html).toContain('class="surface"');
    expect(html).toContain('style="border-radius:12px"');
    expect(html).toContain("Content");
  });
});
