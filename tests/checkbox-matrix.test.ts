import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/checkbox.tsx", import.meta.url), "utf8");
const captureSource = readFileSync(new URL("./capture-visual-matrix.mjs", import.meta.url), "utf8");

describe("Checkbox official matrix contract", () => {
  test("supports default, checked, indeterminate, and disabled states", () => {
    expect(source).toContain("data-[state=indeterminate]");
    expect(source).toContain("disabled:");
  });

  test("keeps the official 16px default geometry and visible focus ring", () => {
    expect(source).toContain("data-[size=sm]:size-4");
    expect(source).toContain("rounded-[4px]");
    expect(source).toContain("focus-ring");
    expect(source).toContain("border-gray-700 bg-background-100");
    expect(source).not.toContain("border-gray-700 bg-background ");
  });

  test("uses semantic foreground/background tokens for checked and mixed states", () => {
    expect(source).toContain("data-[state=checked]:bg-foreground");
    expect(source).toContain("data-[state=checked]:text-background");
    expect(source).toContain("data-[state=indeterminate]:bg-foreground");
    expect(source).toContain("data-[state=indeterminate]:text-background");
    expect(source).toContain("<Minus");
  });

  test("visual capture waits for the color transition to settle", () => {
    expect(captureSource).toContain("await sleep(250)");
    expect(captureSource).not.toContain("await sleep(60)");
  });
});
