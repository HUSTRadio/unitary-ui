import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Table, TableRoot } from "../src/components/ui/table";

const source = readFileSync(resolve(process.cwd(), "src/components/ui/table.tsx"), "utf8");

describe("Table container contract", () => {
  it("renders a bare table when Table is used without TableRoot", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        Table,
        null,
        React.createElement(
          "tbody",
          null,
          React.createElement("tr", null, React.createElement("td", null, "Value")),
        ),
      ),
    );

    expect(html.startsWith("<table")).toBe(true);
    expect(html).not.toContain('data-slot="table-root"');
  });

  it("uses TableRoot as the explicit bordered container", () => {
    const html = renderToStaticMarkup(
      React.createElement(TableRoot, null, React.createElement(Table, null)),
    );

    expect(html).toContain('data-slot="table-root"');
    expect(html.match(/data-slot="table-root"/g)).toHaveLength(1);
    expect(html).toContain("border-gray-alpha-400");
    expect(html).toContain("<table");
  });

  it("does not keep the legacy implicit Table container", () => {
    expect(source).not.toContain('data-slot="table-root"\n        className="relative w-full');
  });
});
