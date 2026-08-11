import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/description.tsx", import.meta.url),
  "utf8",
);

describe("Description official contract", () => {
  test("uses definition-list semantics and the official compact typography", () => {
    expect(source).toContain("<dl");
    expect(source).toContain("<dt");
    expect(source).toContain("<dd");
    expect(source).toContain("text-description-title");
    expect(source).toContain("text-description-content");
  });

  test("supports right and ellipsis variants without changing markup", () => {
    expect(source).toContain('right && "text-right"');
    expect(source).toContain("ellipsis &&");
    expect(source).toContain("[&>dt]:truncate");
    expect(source).toContain("[&>dd]:truncate");
  });

  test("renders a keyboard-focusable tooltip indicator only when tooltip is supplied", () => {
    expect(source).toContain("tooltip &&");
    expect(source).toContain("<Tooltip text={tooltip}>");
    expect(source).toContain("tabIndex={0}");
    expect(source).toContain('data-slot="description-tooltip"');
    expect(source).toContain("aria-label={tooltip}");
  });

  test("keeps the component transparent and delegates framing to the demo wrapper", () => {
    expect(source).toMatch(/className=\{cn\(\s*"m-0"/);
    expect(source).not.toContain("rounded-[8px]");
    expect(source).not.toContain("border-gray-alpha-400");
    expect(source).not.toContain("bg-background-100");
    expect(source).not.toContain("p-4");
  });
});
