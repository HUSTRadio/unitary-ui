"use client";

import * as React from "react";

import { useI18n } from "@/lib/i18n";
import {
  buildImportPreview,
  canSubmitImport,
  resolveImportRows,
  validateImportMapping,
  type ImportField,
  type ImportMapping,
  type ImportSource,
  type ImportIssue,
} from "@/lib/import-mapping";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { DataTable } from "./data-table";
import { ErrorCard } from "./error-card";
import { Field } from "./field";
import { Select, SelectItem } from "./select";

/**
 * ImportMapper — 列映射与预览（M3-05）。
 *
 * 只接收**已解析**的 source（表头 + 行），组件本身不读文件、不解析 CSV、不发请求：
 * 映射由 `mapping` 受控，校验由 `validateImportMapping` 纯函数给出，
 * 提交时把 `resolveImportRows` 的结果交给 `onSubmit`。
 */

const UNMAPPED = "__unmapped__";

export interface ImportMapperProps extends Omit<React.ComponentProps<"div">, "children" | "title" | "onSubmit"> {
  source: ImportSource;
  fields: ImportField[];
  /** 受控映射：字段 id → 源列下标（null 表示未映射）。 */
  mapping: ImportMapping;
  onMappingChange: (next: ImportMapping) => void;
  /** 提交：拿到按字段解析好的行。 */
  onSubmit?: (rows: Record<string, string>[]) => void | Promise<void>;
  /** 提交中：禁用提交并切换文案。 */
  pending?: boolean;
  /** 提交失败信息，渲染在 ErrorCard 中。 */
  error?: React.ReactNode;
  title?: React.ReactNode;
  /** 预览行数上限，默认 5；<=0 表示不限。 */
  previewLimit?: number;
  submitLabel?: React.ReactNode;
  pendingLabel?: React.ReactNode;
  emptyLabel?: React.ReactNode;
}

function issueMessage(issue: ImportIssue, t: (key: string) => string): string {
  if (issue.type === "required") return t("Choose a column for this field");
  if (issue.type === "duplicate") return t("This column is already used");
  return t("This column is no longer available");
}

function ImportMapper({
  className,
  source,
  fields,
  mapping,
  onMappingChange,
  onSubmit,
  pending = false,
  error,
  title,
  previewLimit = 5,
  submitLabel,
  pendingLabel,
  emptyLabel,
  ...props
}: ImportMapperProps) {
  const { t } = useI18n();
  const issues = React.useMemo(
    () => validateImportMapping(source, fields, mapping),
    [source, fields, mapping],
  );
  const issuesByField = React.useMemo(() => {
    const map = new Map<string, ImportIssue>();
    for (const issue of issues) if (!map.has(issue.fieldId)) map.set(issue.fieldId, issue);
    return map;
  }, [issues]);
  const preview = React.useMemo(
    () => buildImportPreview(source, fields, mapping, previewLimit),
    [source, fields, mapping, previewLimit],
  );
  const empty = source.columns.length === 0;
  const submittable = !pending && canSubmitImport(source, fields, mapping);
  const state = pending ? "pending" : empty ? "empty" : issues.length > 0 ? "invalid" : "ready";

  const setColumn = (fieldId: string, value: string) => {
    onMappingChange({ ...mapping, [fieldId]: value === UNMAPPED ? null : Number(value) });
  };

  const submit = () => {
    if (!onSubmit || !submittable) return;
    void onSubmit(resolveImportRows(source, fields, mapping));
  };

  return (
    <div
      data-slot="import-mapper"
      data-state={state}
      className={cn("flex w-full min-w-0 flex-col gap-4", className)}
      {...props}
    >
      {title ? (
        <div data-slot="import-mapper-title" className="text-copy-14 leading-5 text-gray-1000">
          {title}
        </div>
      ) : null}

      {empty ? (
        <div data-slot="import-mapper-empty" className="text-copy-13 text-gray-700">
          {emptyLabel ?? t("Nothing to import")}
        </div>
      ) : (
        <>
          <div data-slot="import-mapper-fields" className="flex flex-col gap-3">
            {fields.map((field) => {
              const column = mapping[field.id];
              const issue = issuesByField.get(field.id);
              return (
                <div key={field.id} data-slot="import-mapper-field" data-field-id={field.id}>
                  <Field
                    label={`${field.label}${field.required ? " *" : ""}`}
                    error={issue ? issueMessage(issue, t) : undefined}
                  >
                    <Select
                      value={column === null || column === undefined ? UNMAPPED : String(column)}
                      onValueChange={(value) => setColumn(field.id, value)}
                      placeholder={t("Choose a column for this field")}
                    >
                      <SelectItem value={UNMAPPED}>—</SelectItem>
                      {source.columns.map((column, index) => (
                        <SelectItem key={`${field.id}-${column}`} value={String(index)}>
                          {column}
                        </SelectItem>
                      ))}
                    </Select>
                  </Field>
                </div>
              );
            })}
          </div>

          {preview.fields.length > 0 ? (
            <div data-slot="import-mapper-preview">
              <DataTable<readonly string[]>
                caption={`${t("Preview")} · ${preview.total}`}
              columns={preview.fields.map((field, index) => ({
                id: field.id,
                header: field.label,
                cell: (record) => record[index] ?? "",
              }))}
              rows={preview.rows}
              getRowKey={(_record, index) => index}
                empty={t("Nothing to import")}
                colorScheme="striped"
                headerRow
              />
            </div>
          ) : null}

          {error ? (
            <ErrorCard data-slot="import-mapper-error">
              <div className="text-copy-13">{error}</div>
            </ErrorCard>
          ) : null}

          {onSubmit ? (
            <div data-slot="import-mapper-actions" className="flex items-center gap-2">
              <Button type="default" size="small" disabled={!submittable} onClick={submit}>
                {pending ? (pendingLabel ?? `${submitLabel ?? t("Import")}…`) : (submitLabel ?? t("Import"))}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export { ImportMapper };
