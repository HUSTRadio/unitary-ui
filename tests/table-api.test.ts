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
    // 遗留的容器式 Table 实现（Table 自带 rounded border 容器）已移除：
    // 现在容器职责唯一归 TableRoot（data-slot="table-root"），Table 只渲染语义化 <table>。
    // TableRoot 是唯一带 data-slot="table-root" 的位置，Table 自身不得创建第二个容器。
    expect(source.match(/data-slot="table-root"/g) ?? []).toHaveLength(1);
    // Table 组件渲染裸 <table>（不留 legacy 容器 div）。
    expect(source.match(/const Table = React.forwardRef/)).toBeTruthy();
    expect(source).toContain("<table");
  });

  it("no longer hardcodes the implicit last-column right alignment", () => {
    expect(source).not.toContain("last:text-right");
  });

  it("declares the default cell alignment explicitly as left + middle", () => {
    // TableHead 基类：text-left align-middle
    expect(source).toContain('"h-9 whitespace-nowrap px-2 text-left align-middle');
    // TableCell 基类：text-left align-middle
    expect(source).toContain('"whitespace-nowrap px-2 py-2.5 text-left align-middle');
  });
});
