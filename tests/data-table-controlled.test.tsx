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

const bodyRows = () => [...container.querySelectorAll("tbody tr[data-row-index]")];

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("DataTable controlled display", () => {
  test("follows the rows prop without keeping an internal copy", async () => {
    const first: Row[] = [{ id: "a", name: "alpha" }];
    await mount(
      createElement(DataTable<Row>, { columns: COLUMNS, rows: first, getRowKey: (row) => row.id }),
    );
    expect(bodyRows()).toHaveLength(1);

    const second: Row[] = [
      { id: "b", name: "beta" },
      { id: "c", name: "gamma" },
    ];
    await rerender(
      createElement(DataTable<Row>, { columns: COLUMNS, rows: second, getRowKey: (row) => row.id }),
    );
    expect(bodyRows()).toHaveLength(2);
    expect(container.textContent).toContain("beta");
    expect(container.textContent).not.toContain("alpha");
  });

  test("keeps row nodes stable for unchanged keys", async () => {
    const rows: Row[] = [
      { id: "a", name: "alpha" },
      { id: "b", name: "beta" },
    ];
    await mount(createElement(DataTable<Row>, { columns: COLUMNS, rows, getRowKey: (row) => row.id }));
    const before = bodyRows();

    await rerender(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [{ id: "a", name: "alpha" }, { id: "b", name: "beta" }, { id: "c", name: "gamma" }],
        getRowKey: (row) => row.id,
      }),
    );

    const after = bodyRows();
    expect(after).toHaveLength(3);
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
  });

  test("never mutates the rows it receives", async () => {
    const rows = Object.freeze([
      Object.freeze({ id: "a", name: "alpha" }),
      Object.freeze({ id: "b", name: "beta" }),
    ]) as readonly Row[];

    await mount(createElement(DataTable<Row>, { columns: COLUMNS, rows, getRowKey: (row) => row.id }));

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.id)).toEqual(["a", "b"]);
    expect(bodyRows()).toHaveLength(2);
  });

  test("calls getRowKey once per visible row", async () => {
    const getRowKey = vi.fn((row: Row, _index: number) => row.id);
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [
          { id: "a", name: "alpha" },
          { id: "b", name: "beta" },
          { id: "c", name: "gamma" },
        ],
        getRowKey,
      }),
    );

    expect(getRowKey).toHaveBeenCalledTimes(3);
    expect(getRowKey.mock.calls.map(([row, index]) => [row.id, index])).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 2],
    ]);
  });

  test("keeps cells inert unless a column opts into editing", async () => {
    const onClick = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: [{ ...COLUMNS[0], header: "Name" }],
        rows: [{ id: "a", name: "alpha" }],
        getRowKey: (row) => row.id,
      }),
    );

    const header = container.querySelector("thead th") as HTMLElement;
    await act(async () => header.click());
    expect(onClick).not.toHaveBeenCalled();
    expect(header.getAttribute("aria-sort")).toBeNull();
    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(container.querySelector('td[data-editable]')).toBeNull();
    expect(container.querySelector('[data-slot="data-table-editor"]')).toBeNull();
  });

  test("switches states from props alone", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        empty: "Empty",
      }),
    );
    const state = () => container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state");
    expect(state()).toBe("empty");

    await rerender(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        loading: true,
      }),
    );
    expect(state()).toBe("loading");

    await rerender(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [{ id: "a", name: "alpha" }],
        getRowKey: (row) => row.id,
      }),
    );
    expect(state()).toBe("ready");
  });
});
