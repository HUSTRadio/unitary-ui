// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

interface Row {
  id: string;
  name: string;
}

const COLUMNS: DataTableColumn<Row>[] = [{ id: "name", header: "Name", cell: (row) => row.name }];

const ROWS: Row[] = [
  { id: "a", name: "alpha" },
  { id: "b", name: "beta" },
  { id: "c", name: "gamma" },
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

const rowCheckboxes = () =>
  [...container.querySelectorAll('[data-slot="data-table-select-row"]')] as HTMLInputElement[];
const selectAll = () => container.querySelector('[data-slot="data-table-select-all"]') as HTMLInputElement | null;
const bodyRows = () => [...container.querySelectorAll("tbody tr[data-row-index]")] as HTMLElement[];

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("DataTable controlled selection", () => {
  test("renders no checkbox column without a selection prop", async () => {
    await mount(
      createElement(DataTable<Row>, { columns: COLUMNS, rows: ROWS, getRowKey: (row) => row.id }),
    );
    expect(selectAll()).toBeNull();
    expect(rowCheckboxes()).toHaveLength(0);
  });

  test("reflects selectedKeys on both header and rows", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        selection: { selectedKeys: ["b"], onChange: () => {} },
      }),
    );

    const boxes = rowCheckboxes();
    expect(boxes).toHaveLength(3);
    expect(boxes.map((box) => box.checked)).toEqual([false, true, false]);
    expect(bodyRows()[1].getAttribute("data-selected")).toBe("true");
    expect(bodyRows()[0].hasAttribute("data-selected")).toBe(false);
    expect(selectAll()?.indeterminate).toBe(true);
  });

  test("adds and removes a single row", async () => {
    const onChange = vi.fn();
    const props = {
      columns: COLUMNS,
      rows: ROWS,
      getRowKey: (row: Row) => row.id,
      selection: { selectedKeys: [] as React.Key[], onChange },
    };

    await mount(createElement(DataTable<Row>, props));
    await act(async () => rowCheckboxes()[0].click());
    expect(onChange).toHaveBeenLastCalledWith(["a"]);

    await mount(createElement(DataTable<Row>, { ...props, selection: { selectedKeys: ["a"], onChange } }));
    await act(async () => rowCheckboxes()[0].click());
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  test("selects every selectable row from the header", async () => {
    const onChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        selection: { selectedKeys: [], onChange },
      }),
    );

    await act(async () => selectAll()?.click());
    expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
    expect(selectAll()?.indeterminate).toBe(false);
  });

  test("clearing from the header keeps keys outside the current view", async () => {
    const onChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        selection: { selectedKeys: ["a", "b", "c", "elsewhere"], onChange },
      }),
    );

    expect(selectAll()?.checked).toBe(true);
    await act(async () => selectAll()?.click());
    expect(onChange).toHaveBeenLastCalledWith(["elsewhere"]);
  });

  test("skips rows excluded by selectable", async () => {
    const onChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        selection: { selectedKeys: [], onChange, selectable: (row) => row.id !== "b" },
      }),
    );

    const boxes = rowCheckboxes();
    expect(boxes[1].disabled).toBe(true);

    await act(async () => selectAll()?.click());
    expect(onChange).toHaveBeenLastCalledWith(["a", "c"]);
  });

  test("hides the header checkbox when selectAll is false", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        selection: { selectedKeys: [], onChange: () => {}, selectAll: false },
      }),
    );

    expect(selectAll()).toBeNull();
    expect(rowCheckboxes()).toHaveLength(3);
    expect(container.querySelector('[data-slot="data-table-select-head"]')).not.toBeNull();
  });

  test("does not bubble row selection into onRowClick", async () => {
    const onRowClick = vi.fn();
    const onChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onRowClick,
        selection: { selectedKeys: [], onChange },
      }),
    );

    await act(async () => rowCheckboxes()[0].click());
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  test("counts the selection column in empty and error spans", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        selection: { selectedKeys: [], onChange: () => {} },
        empty: "Nothing here",
      }),
    );
    expect(container.querySelector("td")?.getAttribute("colspan")).toBe("2");

    await act(async () => root?.unmount());
    container.remove();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        selection: { selectedKeys: [], onChange: () => {} },
        error: "Boom",
      }),
    );
    expect(container.querySelector("td")?.getAttribute("colspan")).toBe("2");
  });

  test("keeps skeleton rows aligned with the selection column", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        loading: true,
        loadingRows: 2,
        selection: { selectedKeys: [], onChange: () => {} },
      }),
    );

    const skeletonRows = container.querySelectorAll('[data-slot="data-table-skeleton-row"]');
    expect(skeletonRows).toHaveLength(2);
    expect(skeletonRows[0].querySelectorAll("td")).toHaveLength(2);
  });
});
