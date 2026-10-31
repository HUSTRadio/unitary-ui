// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataTable, type DataTableCellChange, type DataTableColumn } from "@/components/ui/data-table";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

interface Row {
  id: string;
  name: string;
  qty: number;
}

const ROWS: Row[] = [
  { id: "a", name: "alpha", qty: 1 },
  { id: "b", name: "beta", qty: 2 },
];

const editableColumns = (onCellChange?: (change: DataTableCellChange<Row>) => void): DataTableColumn<Row>[] => [
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
    editable: true,
    getValue: (row) => row.name,
    validate: (value) => (value.trim().length === 0 ? "Name is required" : null),
    ...(onCellChange ? {} : {}),
  },
  { id: "qty", header: "Qty", cell: (row) => String(row.qty) },
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

const cell = (row: number, column: number) =>
  container.querySelectorAll("tbody tr[data-row-index]")[row]?.querySelectorAll("td")[column] as HTMLElement;
const editor = () => container.querySelector('[data-slot="data-table-editor"]') as HTMLInputElement | null;
const cellError = () => container.querySelector('[data-slot="data-table-cell-error"]')?.textContent ?? null;

async function typeInto(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  await act(async () => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
  });
}

async function dblClick(element: HTMLElement) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await Promise.resolve();
  });
}

async function blur(element: HTMLElement) {
  await act(async () => {
    element.dispatchEvent(new FocusEvent("blur", { bubbles: false }));
    element.dispatchEvent(new Event("focusout", { bubbles: true }));
    await Promise.resolve();
  });
}

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("DataTable cell editing", () => {
  test("keeps cells inert without an editable column", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: [{ id: "name", header: "Name", cell: (row) => row.name }],
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
      }),
    );

    await dblClick(cell(0, 0));
    expect(editor()).toBeNull();
    expect(cell(0, 0).hasAttribute("data-editable")).toBe(false);
  });

  test("honours the table-level readOnly flag", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
        readOnly: true,
      }),
    );

    await dblClick(cell(0, 0));
    expect(editor()).toBeNull();
    expect(cell(0, 0).hasAttribute("data-editable")).toBe(false);
  });

  test("supports a per-row editable predicate", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: [
          { id: "name", header: "Name", cell: (row) => row.name, editable: (row) => row.id === "b" },
        ],
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
      }),
    );

    expect(cell(0, 0).hasAttribute("data-editable")).toBe(false);
    expect(cell(1, 0).getAttribute("data-editable")).toBe("true");
    await dblClick(cell(0, 0));
    expect(editor()).toBeNull();
  });

  test("opens the editor with the current value on double click", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
      }),
    );

    await dblClick(cell(1, 0));
    expect(editor()?.value).toBe("beta");
    expect(cell(1, 0).getAttribute("data-editing")).toBe("true");
  });

  test("commits a changed value on blur", async () => {
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await typeInto(editor() as HTMLInputElement, "alpha edited");
    await blur(editor() as HTMLInputElement);

    expect(onCellChange).toHaveBeenCalledTimes(1);
    expect(onCellChange.mock.calls[0][0]).toMatchObject({
      rowKey: "a",
      columnId: "name",
      value: "alpha edited",
      previousValue: "alpha",
      index: 0,
    });
    expect(editor()).toBeNull();
  });

  test("does not report an unchanged value", async () => {
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await blur(editor() as HTMLInputElement);
    expect(onCellChange).not.toHaveBeenCalled();
    expect(editor()).toBeNull();
  });

  test("blocks the commit while validation fails and keeps editing", async () => {
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await typeInto(editor() as HTMLInputElement, "   ");
    await blur(editor() as HTMLInputElement);

    expect(onCellChange).not.toHaveBeenCalled();
    expect(editor()).not.toBeNull();
    expect(cellError()).toBe("Name is required");
  });

  test("clears the error and commits once the value becomes valid", async () => {
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await typeInto(editor() as HTMLInputElement, "   ");
    await blur(editor() as HTMLInputElement);
    expect(cellError()).toBe("Name is required");

    await typeInto(editor() as HTMLInputElement, "fixed");
    expect(cellError()).toBeNull();
    await blur(editor() as HTMLInputElement);

    expect(onCellChange).toHaveBeenCalledTimes(1);
    expect(onCellChange.mock.calls[0][0]).toMatchObject({ value: "fixed", previousValue: "alpha" });
  });

  test("cancels with Escape without reporting", async () => {
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await typeInto(editor() as HTMLInputElement, "throwaway");
    await act(async () => {
      editor()?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await Promise.resolve();
    });

    expect(editor()).toBeNull();
    expect(onCellChange).not.toHaveBeenCalled();
  });

  test("does not bubble cell clicks into onRowClick", async () => {
    const onRowClick = vi.fn();
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
        onRowClick,
      }),
    );

    await act(async () => {
      cell(0, 0).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onRowClick).not.toHaveBeenCalled();
  });

  test("never writes into the rows it receives", async () => {
    const rows = Object.freeze(ROWS.map((row) => Object.freeze({ ...row }))) as readonly Row[];
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: editableColumns(),
        rows,
        getRowKey: (row) => row.id,
        onCellChange,
      }),
    );

    await dblClick(cell(0, 0));
    await typeInto(editor() as HTMLInputElement, "changed");
    await blur(editor() as HTMLInputElement);

    expect(rows[0].name).toBe("alpha");
    expect(onCellChange).toHaveBeenCalledTimes(1);
  });
});
