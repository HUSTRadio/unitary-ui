import { describe, expect, test } from "vitest";
import { defaultRangeColorScheme, resolveRangeColors } from "@/lib/calendar-colors";

describe("calendar range colors", () => {
  test("uses semantic roles instead of theme-specific blue utility classes", () => {
    expect(defaultRangeColorScheme).toEqual({
      selectedBg: "var(--info)",
      selectedFg: "var(--info-foreground)",
      softBg: "var(--info-soft)",
      softFg: "var(--gray-1000)",
    });
  });

  test("accepts partial consumer overrides while retaining missing semantic roles", () => {
    expect(resolveRangeColors({ selectedBg: "#7c3aed" })).toEqual({
      ...defaultRangeColorScheme,
      selectedBg: "#7c3aed",
    });
  });
});
