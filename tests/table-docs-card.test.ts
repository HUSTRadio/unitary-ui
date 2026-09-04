import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

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
    expect(Object.keys(EXAMPLE_SOURCE.table)).toHaveLength(6);
    for (const example of Object.values(EXAMPLE_SOURCE.table)) {
      expect(example).toContain("<Table");
    }
  });

  it("table Live Demo pairs the component and source from one registry record", () => {
    expect(source).toContain("const record = primaryExample(EXAMPLE_REGISTRY[name] ?? []);");
    expect(source).toContain("const Example = record.Component;");
    expect(source).toContain("<TableDemoCard id={record.id} code={record.source}>");
    expect(EXAMPLE_SOURCE.table.Default).toContain("export function");
    expect(EXAMPLE_SOURCE.table.Default).toContain("<Table");
  });
});
