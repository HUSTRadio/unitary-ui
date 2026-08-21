import { describe, expect, test } from "vitest";
import {
  defaultDateFmt,
  formatDateTime,
  parseDateTime,
  parseTimeOfDay,
  resolveTimeZone,
} from "@/lib/date-time";

describe("date-time locale and timezone helpers", () => {
  test("derives locale field order and separator without making timezone determine it", () => {
    expect(defaultDateFmt("zh-CN", "Asia/Shanghai")).toBe("yyyy/MM/dd");
    expect(defaultDateFmt("en-US", "Asia/Shanghai")).toBe("MM/dd/yyyy");
    expect(defaultDateFmt("en-GB", "Europe/London")).toBe("dd/MM/yyyy");
    expect(defaultDateFmt("de-DE", "Europe/Berlin")).toBe("dd.MM.yyyy");
  });

  test("formats an instant in the requested timezone", () => {
    expect(
      formatDateTime(new Date("2026-08-21T04:00:00Z"), {
        locale: "zh-CN",
        timeZone: "Asia/Shanghai",
      }),
    ).toBe("2026/08/21");
  });

  test("parses unpadded numeric dates and rejects invalid calendar dates", () => {
    const parsed = parseDateTime("2026/8/5", { locale: "zh-CN", timeZone: "Asia/Shanghai" });
    expect(parsed).not.toBeNull();
    expect(formatDateTime(parsed!, { locale: "zh-CN", timeZone: "Asia/Shanghai" })).toBe(
      "2026/08/05",
    );
    expect(parseDateTime("2026/13/40", { locale: "zh-CN", timeZone: "Asia/Shanghai" })).toBeNull();
  });

  test("resolves an IANA timezone with UTC fallback", () => {
    expect(resolveTimeZone("")).toMatch(/^[A-Za-z_+\-/0-9]+$/);
  });

  test("parses both default and explicitly supplied LDML time patterns", () => {
    expect(parseTimeOfDay("8:05")).toEqual({ hours: 8, minutes: 5 });
    expect(parseTimeOfDay("08.05", "HH.mm")).toEqual({ hours: 8, minutes: 5 });
    expect(parseTimeOfDay("29:00")).toBeNull();
  });
});
