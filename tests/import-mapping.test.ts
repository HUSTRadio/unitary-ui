import { describe, expect, test } from "vitest";

import {
  buildImportPreview,
  canSubmitImport,
  resolveImportRows,
  validateImportMapping,
  type ImportField,
  type ImportSource,
} from "../src/lib/import-mapping";

const FIELDS: ImportField[] = [
  { id: "name", label: "Name", required: true },
  { id: "email", label: "Email", required: true },
  { id: "note", label: "Note" },
];

const SOURCE: ImportSource = {
  columns: ["Full name", "Mail", "Remark"],
  records: [
    ["Ada", "ada@example.com", "first"],
    ["Grace", "grace@example.com", ""],
    ["Alan", "alan@example.com", "third"],
    ["Edsger", "e@example.com", "fourth"],
    ["Barbara", "b@example.com", "fifth"],
    ["Ken", "k@example.com", "sixth"],
  ],
};

describe("validateImportMapping", () => {
  test("reports missing required fields and ignores optional ones", () => {
    const issues = validateImportMapping(SOURCE, FIELDS, { name: null });
    expect(issues).toEqual([
      { type: "required", fieldId: "name" },
      { type: "required", fieldId: "email" },
    ]);
  });

  test("reports a column used by two fields on both", () => {
    const issues = validateImportMapping(SOURCE, FIELDS, { name: 0, email: 0 });
    expect(issues).toEqual([
      { type: "duplicate", fieldId: "name", column: 0 },
      { type: "duplicate", fieldId: "email", column: 0 },
    ]);
  });

  test("reports out-of-range columns, including negative ones", () => {
    expect(validateImportMapping(SOURCE, FIELDS, { name: 9, email: 1 })).toEqual([
      { type: "out-of-range", fieldId: "name", column: 9 },
    ]);
    expect(validateImportMapping(SOURCE, FIELDS, { name: -1, email: 1 })).toEqual([
      { type: "out-of-range", fieldId: "name", column: -1 },
    ]);
  });

  test("is quiet for a complete mapping", () => {
    expect(validateImportMapping(SOURCE, FIELDS, { name: 0, email: 1, note: 2 })).toEqual([]);
  });

  test("does not mutate the mapping or the source", () => {
    const mapping = { name: 0, email: 0 };
    validateImportMapping(SOURCE, FIELDS, mapping);
    expect(mapping).toEqual({ name: 0, email: 0 });
    expect(SOURCE.records).toHaveLength(6);
  });
});

describe("buildImportPreview", () => {
  test("keeps only mapped fields, in field order", () => {
    const preview = buildImportPreview(SOURCE, FIELDS, { email: 1, name: 0 }, 2);
    expect(preview.fields.map((field) => field.id)).toEqual(["name", "email"]);
    expect(preview.rows).toEqual([
      ["Ada", "ada@example.com"],
      ["Grace", "grace@example.com"],
    ]);
    expect(preview.total).toBe(6);
    expect(preview.truncated).toBe(true);
  });

  test("fills missing cells with an empty string", () => {
    const preview = buildImportPreview(
      { columns: ["A", "B"], records: [["only-a"]] },
      FIELDS,
      { name: 0, email: 1 },
      5,
    );
    expect(preview.rows).toEqual([["only-a", ""]]);
    expect(preview.truncated).toBe(false);
  });

  test("returns no fields when nothing is mapped", () => {
    const preview = buildImportPreview(SOURCE, FIELDS, {});
    expect(preview.fields).toEqual([]);
    expect(preview.rows).toEqual([]);
  });

  test("treats a non-positive limit as unlimited", () => {
    const preview = buildImportPreview(SOURCE, FIELDS, { name: 0 }, 0);
    expect(preview.rows).toHaveLength(6);
    expect(preview.truncated).toBe(false);
  });
});

describe("resolveImportRows", () => {
  test("keys cells by field id and skips unmapped fields", () => {
    const rows = resolveImportRows(SOURCE, FIELDS, { name: 0, note: 2 });
    expect(rows[0]).toEqual({ name: "Ada", note: "first" });
    expect(rows[1]).toEqual({ name: "Grace", note: "" });
    expect(rows).toHaveLength(6);
    expect("email" in rows[0]).toBe(false);
  });
});

describe("canSubmitImport", () => {
  test("requires source data", () => {
    expect(canSubmitImport({ columns: [], records: [] }, FIELDS, { name: 0, email: 1 })).toBe(false);
  });

  test("requires a complete mapping", () => {
    expect(canSubmitImport(SOURCE, FIELDS, { name: 0 })).toBe(false);
    expect(canSubmitImport(SOURCE, FIELDS, { name: 0, email: 0 })).toBe(false);
  });

  test("requires at least one mapped field even when nothing is required", () => {
    const optionalOnly: ImportField[] = [{ id: "note", label: "Note" }];
    expect(canSubmitImport(SOURCE, optionalOnly, {})).toBe(false);
    expect(canSubmitImport(SOURCE, optionalOnly, { note: 2 })).toBe(true);
  });

  test("allows submission for a valid mapping", () => {
    expect(canSubmitImport(SOURCE, FIELDS, { name: 0, email: 1 })).toBe(true);
  });
});
