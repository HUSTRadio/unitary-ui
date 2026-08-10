import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "docs/geist/src/components/docs-components-page.tsx"),
  "utf8",
);

describe("Table docs demo card contract", () => {
  it("uses a dedicated full-width Table demo card", () => {
    expect(source).toContain("function TableDemoCard");
    expect(source).toContain('className="w-full overflow-x-auto p-6"');
  });

  it("renders the official Show code footer as part of the card", () => {
    expect(source).toContain("aria-expanded={showCode}");
    expect(source).toContain("aria-controls={codeId}");
    expect(source).toContain("id={codeId}");
    expect(source).toContain("Show code");
    expect(source).toContain("h-12 w-full items-center");
    expect(source).toContain("border-t border-gray-alpha-400 bg-background-200");
  });

  it("uses TableDemoCard for Live Demo and all table variants", () => {
    expect(source).toContain('name === "table" ? (');
    expect(source.match(/tableCode=/g)?.length ?? 0).toBe(4);
    expect(source).toContain("<TableDemoCard code={meta.code}>");
  });
});
