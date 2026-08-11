import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/checkbox.tsx", import.meta.url), "utf8");

describe("Checkbox official matrix contract", () => {
  test("supports default, checked, indeterminate, and disabled states", () => {
    expect(source).toContain("data-[state=indeterminate]");
    expect(source).toContain("disabled:");
  });

  test("keeps the official 16px default geometry and visible focus ring", () => {
    expect(source).toContain("data-[size=sm]:size-4");
    expect(source).toContain("rounded-[4px]");
    expect(source).toContain("focus-ring");
  });

  test("uses semantic foreground/background tokens for checked and mixed states", () => {
    expect(source).toContain("data-[state=checked]:bg-foreground");
    expect(source).toContain("data-[state=checked]:text-background");
    expect(source).toContain("data-[state=indeterminate]:bg-foreground");
    expect(source).toContain("data-[state=indeterminate]:text-background");
    expect(source).toContain("<Minus");
  });
});
