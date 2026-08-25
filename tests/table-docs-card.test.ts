import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { docsPageSource as source } from "./helpers/docs-page-source";

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
    expect(source).toContain("border-t border-gray-400 bg-background-200");
  });

  it("uses TableDemoCard for table variants", () => {
    expect(source).toContain("function TableDemoCard");
    expect(source.match(/code="<Table>/g)?.length ?? 0).toBe(5);
  });

  it("table Live Demo has its own per-block Show code source", () => {
    expect(source).toContain('const demoCode = (id: string) => DEMO_CODE["table"]?.[id] ?? "";');
    expect(source).toContain('data-demo-card="Default"');
    expect(source).toContain('<ShowCodeFooter code={demoCode("Default")} />');
  });
});
