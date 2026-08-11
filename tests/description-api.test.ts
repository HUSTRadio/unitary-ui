import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/description.tsx", import.meta.url),
  "utf8",
);

describe("Description official contract", () => {
  test("uses definition-list semantics and official text utilities", () => {
    expect(source).toContain("<dl");
    expect(source).toContain("<dt");
    expect(source).toContain("<dd");
    expect(source).toContain("text-label-14");
    expect(source).toContain("text-copy-14");
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

  test("uses the official bordered surface contract", () => {
    expect(source).toContain("rounded-[8px]");
    expect(source).toContain("border-gray-alpha-400");
    expect(source).toContain("bg-background-100");
  });
});
