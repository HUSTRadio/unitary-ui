// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ImportMapper } from "@/components/ui/import-mapper";
import type { ImportField, ImportMapping, ImportSource } from "@/lib/import-mapping";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

const FIELDS: ImportField[] = [
  { id: "name", label: "Name", required: true },
  { id: "email", label: "Email", required: true },
  { id: "note", label: "Note" },
];

const SOURCE: ImportSource = {
  columns: ["Full name", "Mail", "Remark"],
  records: [
    ["Ada", "ada@example.com", "first"],
    ["Grace", "grace@example.com", "second"],
    ["Alan", "alan@example.com", "third"],
  ],
};

async function mount(node: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(node);
    await Promise.resolve();
  });
}

const fieldRows = () => [...container.querySelectorAll('[data-slot="import-mapper-field"]')] as HTMLElement[];
const previewHeaders = () =>
  [...container.querySelectorAll('[data-slot="import-mapper-preview"] thead th')].map((cell) => cell.textContent);
const previewRows = () => container.querySelectorAll('[data-slot="import-mapper-preview"] tbody tr[data-row-index]');
const submitButton = () =>
  container.querySelector('[data-slot="import-mapper-actions"] button') as HTMLButtonElement | null;

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
});

describe("ImportMapper rendering", () => {
  test("shows an empty state when the source has no columns", async () => {
    await mount(
      createElement(ImportMapper, {
        source: { columns: [], records: [] },
        fields: FIELDS,
        mapping: {},
        onMappingChange: () => {},
        emptyLabel: "Pick a file first",
      }),
    );

    expect(container.querySelector('[data-slot="import-mapper-empty"]')?.textContent).toBe("Pick a file first");
    expect(fieldRows()).toHaveLength(0);
    expect(container.querySelector('[data-slot="import-mapper"]')?.getAttribute("data-state")).toBe("empty");
  });

  test("renders one row per target field and marks required ones", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: {},
        onMappingChange: () => {},
      }),
    );

    const rows = fieldRows();
    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.getAttribute("data-field-id"))).toEqual(["name", "email", "note"]);
    expect(rows[0].textContent).toContain("Name *");
    expect(rows[2].textContent).toContain("Note");
    expect(rows[2].textContent).not.toContain("Note *");
  });

  test("surfaces required and duplicate issues per field", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0, email: 0 },
        onMappingChange: () => {},
      }),
    );

    const rows = fieldRows();
    expect(rows[0].textContent).toContain("This column is already used");
    expect(rows[1].textContent).toContain("This column is already used");
    expect(rows[2].textContent).not.toContain("Choose a column");
    expect(container.querySelector('[data-slot="import-mapper"]')?.getAttribute("data-state")).toBe("invalid");
  });

  test("reports a missing required mapping", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0 },
        onMappingChange: () => {},
      }),
    );
    expect(fieldRows()[1].textContent).toContain("Choose a column for this field");
  });

  test("previews the mapped fields with the requested limit", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { email: 1, name: 0 },
        onMappingChange: () => {},
        previewLimit: 2,
      }),
    );

    expect(previewHeaders()).toEqual(["Name", "Email"]);
    expect(previewRows()).toHaveLength(2);
    expect(previewRows()[0].textContent).toContain("Ada");
    expect(previewRows()[1].textContent).toContain("Grace");
  });

  test("hides the preview until something is mapped", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: {},
        onMappingChange: () => {},
      }),
    );
    expect(container.querySelector('[data-slot="import-mapper-preview"]')).toBeNull();
  });

  test("renders a submission error in an error card", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0, email: 1 },
        onMappingChange: () => {},
        error: "Import failed: 2 rows rejected",
      }),
    );

    expect(container.querySelector('[data-slot="import-mapper-error"]')).not.toBeNull();
    expect(container.textContent).toContain("2 rows rejected");
  });
});

describe("ImportMapper submission", () => {
  test("disables submit while the mapping has issues", async () => {
    const onSubmit = vi.fn();
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0 },
        onMappingChange: () => {},
        onSubmit,
      }),
    );

    expect(submitButton()?.disabled).toBe(true);
    await act(async () => submitButton()?.click());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("submits resolved rows once the mapping is valid", async () => {
    const onSubmit = vi.fn();
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0, email: 1 },
        onMappingChange: () => {},
        onSubmit,
      }),
    );

    expect(submitButton()?.disabled).toBe(false);
    await act(async () => submitButton()?.click());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [rows] = onSubmit.mock.calls[0] as [Record<string, string>[]];
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ name: "Ada", email: "ada@example.com" });
    expect("note" in rows[0]).toBe(false);
  });

  test("keeps submit disabled and swaps the label while pending", async () => {
    const onSubmit = vi.fn();
    const props = {
      source: SOURCE,
      fields: FIELDS,
      mapping: { name: 0, email: 1 } as ImportMapping,
      onMappingChange: () => {},
      onSubmit,
    };

    await mount(createElement(ImportMapper, props));
    expect(submitButton()?.textContent).toBe("Import");

    await act(async () => root?.unmount());
    container.remove();
    await mount(createElement(ImportMapper, { ...props, pending: true }));

    expect(submitButton()?.disabled).toBe(true);
    expect(submitButton()?.textContent).toBe("Import…");
    expect(container.querySelector('[data-slot="import-mapper"]')?.getAttribute("data-state")).toBe("pending");
  });

  test("does not render actions without an onSubmit handler", async () => {
    await mount(
      createElement(ImportMapper, {
        source: SOURCE,
        fields: FIELDS,
        mapping: { name: 0, email: 1 },
        onMappingChange: () => {},
      }),
    );
    expect(container.querySelector('[data-slot="import-mapper-actions"]')).toBeNull();
  });
});
