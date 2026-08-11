import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/dots-menu.tsx", import.meta.url), "utf8");

describe("Dots Menu official contract", () => {
  test("uses the official trigger, menu surface, and row geometry", () => {
    expect(source).toContain('aria-label="Menu"');
    expect(source).toContain("size-8");
    expect(source).toContain("min-w-[200px]");
    expect(source).toContain("rounded-[12px]");
    expect(source).toContain("p-1.5");
    expect(source).toContain("h-9");
  });

  test("supports official icon sizes and a disabled trigger", () => {
    expect(source).toContain("iconSize?: number");
    expect(source).toContain("iconSize = 18");
    expect(source).toContain("disabled?: boolean");
    expect(source).toContain("disabled={disabled}");
    expect(source).toContain("disabled:bg-gray-100");
    expect(source).toContain("disabled:opacity-50");
  });

  test("keeps disabled menu items readable without opacity reduction", () => {
    expect(source).toContain("data-[disabled]:text-gray-700");
    expect(source).toContain("data-[disabled]:opacity-100");
    expect(source).not.toContain("data-[disabled]:opacity-50");
  });
});
