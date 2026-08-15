import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/empty-state.tsx", import.meta.url),
  "utf8",
);

describe("Empty State official contract", () => {
  test("exposes the empty state and icon slots", () => {
    expect(source).toContain('data-slot="empty-state"');
    expect(source).toContain('data-slot="empty-state-icon"');
    expect(source).toContain("title?: React.ReactNode");
    expect(source).toContain("description?: React.ReactNode");
    expect(source).toContain("icon?: React.ReactNode");
  });

  test("uses the official bordered centered surface and content rhythm", () => {
    expect(source).toContain("rounded-lg");
    expect(source).toContain("border-gray-200");
    expect(source).toContain("px-[70px]");
    expect(source).toContain("py-12");
    expect(source).toContain("gap-6");
    expect(source).toContain("max-w-[340px]");
    expect(source).toContain("text-balance");
  });

  test("supports a real CTA slot without adding a second wrapper", () => {
    expect(source).toContain("{children}");
    expect(source).toContain("[&>a]:text-sm");
  });
});
