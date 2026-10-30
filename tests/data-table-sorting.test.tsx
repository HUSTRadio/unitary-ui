// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataTable, type DataTableColumn, type DataTableSort } from "@/components/ui/data-table";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

interface Row {
  id: string;
  name: string;
  size: number;
}

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", cell: (row) => row.name, sortable: true },
  { id: "size", header: "Size", cell: (row) => row.size, sortable: true, align: "right" },
  { id: "notes", header: "Notes", cell: () => "—" },
];

const ROWS: Row[] = [
  { id: "b", name: "beta", size: 34 },
  { id: "a", name: "alpha", size: 12 },
];

async function mount(node: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(node);
    await Promise.resolve();
  });
}

async function rerender(node: React.ReactElement) {
  await act(async () => {
    root?.render(node);
    await Promise.resolve();
  });
}

const head = (index: number) => container.querySelectorAll("thead th")[index] as HTMLElement;
const sortButton = (index: number) => head(index).querySelector('[data-slot="data-table-sort"]') as HTMLElement | null;
const renderedNames = () =>
  [...container.querySelectorAll("tbody tr[data-row-index]")].map((row) => row.textContent ?? "");

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("DataTable controlled sorting", () => {
  test("renders sort buttons only for sortable columns with a handler", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onSortChange: () => {},
      }),
    );

    expect(sortButton(0)).not.toBeNull();
    expect(sortButton(1)).not.toBeNull();
    expect(sortButton(2)).toBeNull();
    expect(head(2).hasAttribute("data-sortable")).toBe(false);
  });

  test("keeps headers inert without an onSortChange handler", async () => {
    await mount(
      createElement(DataTable<Row>, { columns: COLUMNS, rows: ROWS, getRowKey: (row) => row.id }),
    );
    expect(sortButton(0)).toBeNull();
    expect(head(0).textContent).toBe("Name");
  });

  test("cycles unsorted → asc → desc → off for a single column", async () => {
    const onSortChange = vi.fn();
    const props = {
      columns: COLUMNS,
      rows: ROWS,
      getRowKey: (row: Row) => row.id,
      onSortChange,
    };

    await mount(createElement(DataTable<Row>, props));
    await act(async () => sortButton(0)?.click());
    expect(onSortChange).toHaveBeenLastCalledWith([{ columnId: "name", direction: "asc" }]);

    await rerender(
      createElement(DataTable<Row>, { ...props, sort: [{ columnId: "name", direction: "asc" }] }),
    );
    expect(head(0).getAttribute("data-sort")).toBe("asc");
    await act(async () => sortButton(0)?.click());
    expect(onSortChange).toHaveBeenLastCalledWith([{ columnId: "name", direction: "desc" }]);

    await rerender(
      createElement(DataTable<Row>, { ...props, sort: [{ columnId: "name", direction: "desc" }] }),
    );
    expect(head(0).getAttribute("data-sort")).toBe("desc");
    await act(async () => sortButton(0)?.click());
    expect(onSortChange).toHaveBeenLastCalledWith([]);
  });

  test("accepts a single sort object as well as an array", async () => {
    const sort: DataTableSort = { columnId: "size", direction: "desc" };
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        sort,
        onSortChange: () => {},
      }),
    );

    expect(head(1).getAttribute("data-sort")).toBe("desc");
    expect(sortButton(1)?.getAttribute("data-direction")).toBe("desc");
    expect(head(0).hasAttribute("data-sort")).toBe(false);
  });

  test("replaces the sort by default and appends it with multiSort", async () => {
    const single = vi.fn();
    const singleProps = {
      columns: COLUMNS,
      rows: ROWS,
      getRowKey: (row: Row) => row.id,
      onSortChange: single,
      sort: [{ columnId: "name", direction: "asc" as const }],
    };
    await mount(createElement(DataTable<Row>, singleProps));
    await act(async () => sortButton(1)?.click());
    expect(single).toHaveBeenLastCalledWith([{ columnId: "size", direction: "asc" }]);

    const multiple = vi.fn();
    await rerender(
      createElement(DataTable<Row>, {
        ...singleProps,
        onSortChange: multiple,
        multiSort: true,
      }),
    );
    await act(async () => sortButton(1)?.click());
    expect(multiple).toHaveBeenLastCalledWith([
      { columnId: "name", direction: "asc" },
      { columnId: "size", direction: "asc" },
    ]);
  });

  test("reports the multi-column priority through data-sort-index", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        sort: [
          { columnId: "size", direction: "desc" },
          { columnId: "name", direction: "asc" },
        ],
        onSortChange: () => {},
        multiSort: true,
      }),
    );

    expect(head(1).getAttribute("data-sort-index")).toBe("0");
    expect(head(0).getAttribute("data-sort-index")).toBe("1");
    expect(head(0).getAttribute("data-sort")).toBe("asc");
  });

  test("never reorders or mutates rows", async () => {
    const rows = Object.freeze(ROWS.map((row) => Object.freeze({ ...row }))) as readonly Row[];
    const onSortChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows,
        getRowKey: (row) => row.id,
        sort: [{ columnId: "name", direction: "asc" }],
        onSortChange,
      }),
    );

    const before = renderedNames();
    await act(async () => sortButton(0)?.click());
    expect(renderedNames()).toEqual(before);
    expect(before[0]).toContain("beta");
    expect(rows.map((row) => row.id)).toEqual(["b", "a"]);
  });

  test("shows a direction indicator and a neutral affordance", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        sort: [{ columnId: "name", direction: "asc" }],
        onSortChange: () => {},
      }),
    );

    expect(sortButton(0)?.getAttribute("data-direction")).toBe("asc");
    expect(sortButton(1)?.getAttribute("data-direction")).toBe("none");
    expect(sortButton(0)?.querySelector("svg")).not.toBeNull();
    expect(sortButton(1)?.querySelector("svg")).not.toBeNull();
  });
});
