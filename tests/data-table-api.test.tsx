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
  size: number;
}

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "size", header: "Size", cell: (row) => `${row.size} KB`, align: "right" },
];

const ROWS: Row[] = [
  { id: "a", name: "alpha", size: 12 },
  { id: "b", name: "beta", size: 34 },
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

const table = () => container.querySelector("table") as HTMLTableElement | null;
const headCells = () => [...container.querySelectorAll("thead th")];
const bodyRows = () => [...container.querySelectorAll("tbody tr[data-row-index]")];

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("DataTable structure", () => {
  test("maps columns to headers and cells to values", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        caption: "Artifacts",
      }),
    );

    expect(headCells().map((cell) => cell.textContent)).toEqual(["Name", "Size"]);
    expect(bodyRows()).toHaveLength(2);
    expect(bodyRows()[0].textContent).toContain("alpha");
    expect(bodyRows()[0].textContent).toContain("12 KB");
    expect(container.querySelector("caption")?.textContent).toBe("Artifacts");
    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state")).toBe("ready");
  });

  test("applies column alignment, width and class hooks", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: [
          { ...COLUMNS[0], width: 240, headClassName: "head-name", cellClassName: "cell-name" },
          COLUMNS[1],
        ],
        rows: ROWS,
        getRowKey: (row) => row.id,
      }),
    );

    const cols = container.querySelectorAll("colgroup col");
    expect((cols[0] as HTMLElement).style.width).toBe("240px");
    expect(headCells()[0].className).toContain("head-name");
    expect(bodyRows()[0].querySelector("td")?.className).toContain("cell-name");
  });

  test("renders skeleton rows while loading and no data rows", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        loading: true,
        loadingRows: 4,
      }),
    );

    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state")).toBe("loading");
    expect(container.querySelectorAll('[data-slot="data-table-skeleton-row"]')).toHaveLength(4);
    expect(bodyRows()).toHaveLength(0);
    expect(headCells()).toHaveLength(2);
  });

  test("renders the empty message in a single spanning row", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        empty: "No artifacts yet",
      }),
    );

    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state")).toBe("empty");
    expect(container.querySelector('[data-slot="data-table-empty"]')).not.toBeNull();
    expect(container.textContent).toContain("No artifacts yet");
    expect(container.querySelector("td")?.getAttribute("colspan")).toBe("2");
    expect(bodyRows()).toHaveLength(0);
  });

  test("prefers the error message over rows and empty state", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        error: "Request failed",
        empty: "No artifacts yet",
      }),
    );

    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state")).toBe("error");
    expect(container.textContent).toContain("Request failed");
    expect(container.textContent).not.toContain("No artifacts yet");
    expect(bodyRows()).toHaveLength(0);
  });

  test("keeps loading above error so the first paint never flashes an error", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: [],
        getRowKey: (row) => row.id,
        loading: true,
        error: "Request failed",
      }),
    );
    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-state")).toBe("loading");
  });

  test("reports row clicks with the row and index", async () => {
    const onRowClick = vi.fn();
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        onRowClick,
      }),
    );

    await act(async () => (bodyRows()[1] as HTMLElement).click());
    expect(onRowClick).toHaveBeenCalledWith(ROWS[1], 1);
  });

  test("passes appearance through to Table", async () => {
    await mount(
      createElement(DataTable<Row>, {
        columns: COLUMNS,
        rows: ROWS,
        getRowKey: (row) => row.id,
        colorScheme: "striped",
        headerRow: true,
        columnDividers: true,
      }),
    );

    expect(container.querySelector('[data-slot="data-table"]')?.getAttribute("data-color-scheme")).toBe("striped");
    expect(headCells()[0].getAttribute("scope")).toBe("col");
    expect(table()).not.toBeNull();
  });

  test("does not fetch, sort or paginate", async () => {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const src = await readFile(path.join(rootDir, "src/components/ui/data-table.tsx"), "utf8");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

    expect(code).not.toMatch(/fetch\(|XMLHttpRequest/);
    expect(code).not.toMatch(/\.sort\(|\.reverse\(|\.splice\(/);
    expect(code).not.toMatch(/useState|useReducer/);
    expect(code).not.toMatch(/Pagination/);
  });
});
