import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  resolve(import.meta.dirname, "../src/components/ui/context-card.tsx"),
  "utf8",
);

describe("Context Card official visual contract", () => {
  test("uses tooltip material, fitted geometry, official radius, arrow, and portal layer", () => {
    expect(source).toContain("z-[1000000]");
    expect(source).toContain("w-fit");
    expect(source).toContain("rounded-[6px]");
    expect(source).toContain("p-3");
    expect(source).toContain("shadow-[var(--material-shadow-tooltip)]");
    expect(source).toContain("<HoverCardPrimitive.Arrow");
    expect(source).toContain("width={14}");
    expect(source).toContain("height={7}");
  });
});
