import { describe, expect, test } from "vitest";

import {
  AvailableChartColors,
  chartColors,
  constructCategoryColors,
  getColorClassName,
} from "../src/components/ui/charts/chart-colors";

describe("chartColors palette", () => {
  test("exposes the nine Tremor chart colors", () => {
    expect(AvailableChartColors).toHaveLength(9);
    expect(AvailableChartColors).toEqual(
      expect.arrayContaining([
        "blue",
        "emerald",
        "violet",
        "amber",
        "gray",
        "cyan",
        "pink",
        "lime",
        "fuchsia",
      ]),
    );
  });

  test("every color maps all four utilities", () => {
    for (const color of AvailableChartColors) {
      expect(chartColors[color].bg).toBe(`bg-${color}-500`);
      expect(chartColors[color].stroke).toBe(`stroke-${color}-500`);
      expect(chartColors[color].fill).toBe(`fill-${color}-500`);
      expect(chartColors[color].text).toBe(`text-${color}-500`);
    }
  });
});

describe("constructCategoryColors", () => {
  test("maps categories onto colors in order", () => {
    const map = constructCategoryColors(["sales", "profit"], ["blue", "emerald"]);
    expect(map.get("sales")).toBe("blue");
    expect(map.get("profit")).toBe("emerald");
  });

  test("wraps around when categories exceed colors", () => {
    const map = constructCategoryColors(
      ["a", "b", "c", "d"],
      ["amber", "violet"],
    );
    expect(map.get("a")).toBe("amber");
    expect(map.get("b")).toBe("violet");
    expect(map.get("c")).toBe("amber");
    expect(map.get("d")).toBe("violet");
  });

  test("returns an empty map for no categories", () => {
    expect(constructCategoryColors([], AvailableChartColors).size).toBe(0);
  });
});

describe("getColorClassName", () => {
  test("returns the class for every utility type", () => {
    expect(getColorClassName("blue", "bg")).toBe("bg-blue-500");
    expect(getColorClassName("emerald", "stroke")).toBe("stroke-emerald-500");
    expect(getColorClassName("violet", "fill")).toBe("fill-violet-500");
    expect(getColorClassName("amber", "text")).toBe("text-amber-500");
  });

  test("falls back to gray-500 for unknown color keys", () => {
    expect(getColorClassName("not-a-color" as never, "bg")).toBe("bg-gray-500");
    expect(getColorClassName("not-a-color" as never, "fill")).toBe(
      "fill-gray-500",
    );
  });
});
