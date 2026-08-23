import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/context-menu.tsx", import.meta.url),
  "utf8",
);

describe("Context Menu official contract", () => {
  test("supports link, prefix, suffix, value, click, and disabled APIs", () => {
    expect(source).toContain("href?: string");
    expect(source).toContain("prefix?: React.ReactNode");
    expect(source).toContain("suffix?: React.ReactNode");
    expect(source).toContain("data-value={value}");
    expect(source).toContain("data-context-menu-prefix");
    expect(source).toContain("data-context-menu-suffix");
    expect(source).toContain("aria-disabled={disabled || undefined}");
  });

  test("renders href items through an anchor with menuitem semantics", () => {
    expect(source).toContain("ContextMenuPrimitive.Item asChild");
    expect(source).toContain("ref={ref as React.ForwardedRef<HTMLAnchorElement>}");
    expect(source).toContain('role="menuitem"');
  });

  test("uses the official menu surface and row geometry", () => {
    expect(source).toContain("rounded-overlay");
    expect(source).toContain("rounded-overlay-item");
    expect(source).toContain("p-1.5");
    expect(source).toContain("text-label-14");
    expect(source).toContain("cursor-pointer");
    expect(source).toContain("data-[disabled]:cursor-default");
    expect(source).not.toContain("h-9 cursor-default");
  });

  test("uses content-sized desktop width and the official mobile sheet classes", () => {
    expect(source).toContain("w-max");
    expect(source).toContain("max-sm:w-full");
    expect(source).toContain("max-sm:rounded-b-none");
    expect(source).not.toContain("min-w-[10rem]");
  });

  test("disabled items retain readable gray text without opacity reduction", () => {
    expect(source).toContain("data-[disabled]:text-gray-500");
    expect(source).not.toContain("data-[disabled]:opacity-50");
  });
});
