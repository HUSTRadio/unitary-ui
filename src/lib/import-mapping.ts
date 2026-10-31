/**
 * Import 列映射的纯逻辑（M3-05）。
 *
 * 只做四件事：校验映射、生成预览、解析提交行、给出是否可提交。
 * 不读文件、不解析 CSV、不发请求——粘贴/文件解析由调用方完成后传进来。
 */

export interface ImportField {
  /** 目标字段标识（稳定）。 */
  id: string;
  /** 展示名。 */
  label: string;
  /** 必填：未映射即不可提交。 */
  required?: boolean;
}

/** 目标字段 → 源列下标；null/undefined 表示未映射。 */
export type ImportMapping = Record<string, number | null | undefined>;

export interface ImportSource {
  /** 源表头。 */
  columns: readonly string[];
  /** 源数据行，按列顺序。 */
  records: readonly (readonly string[])[];
}

export type ImportIssueType = "required" | "duplicate" | "out-of-range";

export interface ImportIssue {
  type: ImportIssueType;
  fieldId: string;
  /** 仅 duplicate / out-of-range 有值。 */
  column?: number;
}

function columnOf(mapping: ImportMapping, fieldId: string): number | null {
  const value = mapping[fieldId];
  return value === null || value === undefined ? null : value;
}

/**
 * 校验映射：必填缺失、同一列被多个字段占用、列下标越界。
 * 返回顺序跟随 `fields`，同一字段最多一条；越界优先于重复。
 */
export function validateImportMapping(
  source: ImportSource,
  fields: readonly ImportField[],
  mapping: ImportMapping,
): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const usage = new Map<number, string[]>();

  for (const field of fields) {
    const column = columnOf(mapping, field.id);
    if (column === null) {
      if (field.required) issues.push({ type: "required", fieldId: field.id });
      continue;
    }
    if (!Number.isInteger(column) || column < 0 || column >= source.columns.length) {
      issues.push({ type: "out-of-range", fieldId: field.id, column });
      continue;
    }
    usage.set(column, [...(usage.get(column) ?? []), field.id]);
  }

  for (const [column, owners] of usage) {
    if (owners.length < 2) continue;
    for (const fieldId of owners) {
      issues.push({ type: "duplicate", fieldId, column });
    }
  }

  return issues;
}

export interface ImportPreview {
  /** 已映射字段（按 fields 顺序）。 */
  fields: ImportField[];
  /** 预览行，单元格与 fields 一一对应。 */
  rows: string[][];
  /** 源记录总数（不受 previewLimit 影响）。 */
  total: number;
  /** 是否因 limit 截断。 */
  truncated: boolean;
}

/** 生成预览：只取已映射字段，最多 `limit` 行（默认 5，<=0 表示不限）。 */
export function buildImportPreview(
  source: ImportSource,
  fields: readonly ImportField[],
  mapping: ImportMapping,
  limit = 5,
): ImportPreview {
  const mapped = fields.filter((field) => columnOf(mapping, field.id) !== null);
  const total = source.records.length;
  // 没有任何已映射字段时，预览行没有意义，直接返回空行集。
  if (mapped.length === 0) return { fields: [], rows: [], total, truncated: false };
  const rows = limit > 0 ? source.records.slice(0, limit) : source.records;
  return {
    fields: mapped,
    rows: rows.map((record) =>
      mapped.map((field) => {
        const column = columnOf(mapping, field.id);
        return column === null ? "" : (record[column] ?? "");
      }),
    ),
    total,
    truncated: rows.length < total,
  };
}

/** 按映射把源记录解析成 `{ [fieldId]: cell }`，供 onSubmit 使用。 */
export function resolveImportRows(
  source: ImportSource,
  fields: readonly ImportField[],
  mapping: ImportMapping,
): Record<string, string>[] {
  return source.records.map((record) => {
    const row: Record<string, string> = {};
    for (const field of fields) {
      const column = columnOf(mapping, field.id);
      if (column === null) continue;
      row[field.id] = record[column] ?? "";
    }
    return row;
  });
}

/** 有源数据、无校验问题、至少映射一个字段时才可提交。 */
export function canSubmitImport(
  source: ImportSource,
  fields: readonly ImportField[],
  mapping: ImportMapping,
): boolean {
  if (source.columns.length === 0 || source.records.length === 0) return false;
  if (validateImportMapping(source, fields, mapping).length > 0) return false;
  return fields.some((field) => columnOf(mapping, field.id) !== null);
}
