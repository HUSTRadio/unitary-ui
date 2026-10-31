// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { isBlockPaste, parsePasteMatrix } from "@/lib/paste-matrix";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

interface Row {
  id: string;
  name: string;
  note: string;
}

const ROWS: Row[] = [
  { id: "a", name: "alpha", note: "one" },
  { id: "b", name: "beta", note: "two" },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", cell: (row) => row.name, editable: true, getValue: (row) => row.name },
  { id: "note", header: "Note", cell: (row) => row.note, editable: true, getValue: (row) => row.note },
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

async function dblClick(element: HTMLElement) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await Promise.resolve();
  });
}

function pasteEvent(text: string) {
  const event = new Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "clipboardData", { value: { getData: () => text } });
  return event;
}

async function paste(text: string) {
  const event = pasteEvent(text);
  await act(async () => {
    editor()?.dispatchEvent(event);
    await Promise.resolve();
  });
  return event;
}

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("parsePasteMatrix", () => {
  test("splits a tab-separated block", () => {
    expect(parsePasteMatrix("a\tb\nc\td")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("falls back to commas when there is no tab", () => {
    expect(parsePasteMatrix("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("handles CRLF and a trailing newline", () => {
    expect(parsePasteMatrix("a\r\nb\r\n")).toEqual([["a"], ["b"]]);
  });

  test("trims cells and ignores empty input", () => {
    expect(parsePasteMatrix(" a , b ")).toEqual([["a", "b"]]);
    expect(parsePasteMatrix("")).toEqual([]);
    expect(parsePasteMatrix("\n")).toEqual([]);
  });
});

describe("isBlockPaste", () => {
  test("only counts multi-row or multi-column matrices", () => {
    expect(isBlockPaste([])).toBe(false);
    expect(isBlockPaste([["solo"]])).toBe(false);
    expect(isBlockPaste([["a", "b"]])).toBe(true);
    expect(isBlockPaste([["a"], ["b"]])).toBe(true);
  });
});

describe("DataTable block paste", () => {
  test("reports the block with its start cell and closes the editor", async () => {
    const onPasteBlock = vi.fn();
    const onCellChange = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange,
        onPasteBlock,
      }),
    );

    await dblClick(cell(1, 0));
    const event = await paste("x\ty\nz\tw");

    expect(event.defaultPrevented).toBe(true);
    expect(onPasteBlock).toHaveBeenCalledTimes(1);
    expect(onPasteBlock.mock.calls[0][0]).toMatchObject({
      startRowKey: "b",
      startColumnId: "name",
      values: [
        ["x", "y"],
        ["z", "w"],
      ],
      index: 1,
    });
    expect(onCellChange).not.toHaveBeenCalled();
    expect(editor()).toBeNull();
  });

  test("lets a single-cell paste behave normally", async () => {
    const onPasteBlock = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
        onPasteBlock,
      }),
    );

    await dblClick(cell(0, 0));
    const event = await paste("solo");

    expect(event.defaultPrevented).toBe(false);
    expect(onPasteBlock).not.toHaveBeenCalled();
    expect(editor()).not.toBeNull();
  });

  test("ignores block pastes when no handler is provided", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onCellChange: () => {},
      }),
    );

    await dblClick(cell(0, 0));
    const event = await paste("a\tb\nc\td");

    expect(event.defaultPrevented).toBe(false);
    expect(editor()).not.toBeNull();
  });
});
