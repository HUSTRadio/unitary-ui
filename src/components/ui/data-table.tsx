"use client";

import * as React from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { isBlockPaste, parsePasteMatrix } from "@/lib/paste-matrix";
import { cn } from "@/lib/utils";

import { Checkbox } from "./checkbox";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCol,
  TableColgroup,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  type MaybeAlign,
  type TableColorScheme,
} from "./table";

/**
 * DataTable — 受控表格展示（M3-01）。
 *
 * 只负责把 `columns` × `rows` 映射成 Table 结构：不排序、不筛选、不分页、不发请求，
 * `rows` 只读且永不修改。loading / empty / error 三种状态显式传入，互不推断。
 * 分页等组合由示例层用现有 Pagination 拼装，不进组件 API。
 */

export interface DataTableColumn<T> {
  /** 稳定列标识，兼作 key。 */
  id: string;
  header: React.ReactNode;
  /** 单元格内容；只接收该行数据。 */
  cell: (row: T) => React.ReactNode;
  align?: MaybeAlign;
  /** 列宽（写回 colgroup）。 */
  width?: string | number;
  headClassName?: string;
  cellClassName?: string;
  /** 可排序：表头渲染为排序按钮，点击只上报意图。 */
  sortable?: boolean;
  /** 可编辑：布尔或按行判定；未声明即不可编辑。 */
  editable?: boolean | ((row: T, index: number) => boolean);
  /** 编辑时的原始字符串；缺省回退到 cell 的文本。 */
  getValue?: (row: T) => string;
  /** 单元格校验：返回非空字符串即视为错误，阻止回写。 */
  validate?: (value: string, row: T, index: number) => string | null | undefined;
}

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSort {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableCellChange<T> {
  rowKey: React.Key;
  columnId: string;
  value: string;
  previousValue: string;
  row: T;
  index: number;
}

export interface DataTablePasteBlock<T> {
  startRowKey: React.Key;
  startColumnId: string;
  values: string[][];
  row: T;
  index: number;
}

export interface DataTableSelection<T> {
  /** 已选行的 key，与 getRowKey 的返回值对应。 */
  selectedKeys: readonly React.Key[];
  /** 报出下一次完整选择数组。 */
  onChange: (next: React.Key[]) => void;
  /** 是否在表头提供全选/半选控件，默认 true。 */
  selectAll?: boolean;
  /** 单行是否可选（默认全部可选）。 */
  selectable?: (row: T, index: number) => boolean;
}

export interface DataTableProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  columns: DataTableColumn<T>[];
  /** 只读行数据；组件不会排序、复制或修改它。 */
  rows: readonly T[];
  /** 稳定行 key（默认要求调用方提供，避免索引漂移）。 */
  getRowKey: (row: T, index: number) => React.Key;
  caption?: React.ReactNode;
  /** 外观直通 Table。 */
  colorScheme?: TableColorScheme;
  headerRow?: boolean;
  headerCol?: boolean;
  columnDividers?: boolean;
  rowHeight?: number | "auto";
  align?: MaybeAlign;
  frame?: "outline" | "none";
  /** 加载态：渲染骨架行，不渲染数据行。 */
  loading?: boolean;
  loadingRows?: number;
  /** 错误态：渲染一条跨列消息。 */
  error?: React.ReactNode;
  /** 空态：`rows` 为空且非 loading/error 时使用。 */
  empty?: React.ReactNode;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  /** 受控排序（单列对象或多列数组）；组件只读它，不排序 rows。 */
  sort?: DataTableSort | readonly DataTableSort[];
  /** 排序意图回调：给出下一次完整的排序数组。 */
  onSortChange?: (next: DataTableSort[]) => void;
  /** 允许多列排序（点击追加而非替换），默认 false。 */
  multiSort?: boolean;
  /** 受控选择；提供时首列渲染复选框，组件只读 selectedKeys。 */
  selection?: DataTableSelection<T>;
  /** 表格级只读：为 true 时任何列都不可编辑。 */
  readOnly?: boolean;
  /** 单元格提交：只在值真正变化、且通过校验后触发。 */
  onCellChange?: (change: DataTableCellChange<T>) => void;
  /** 块粘贴：从起始单元格向右下填充，越界由调用方截断。 */
  onPasteBlock?: (block: DataTablePasteBlock<T>) => void;
}

type DataTableState = "loading" | "error" | "empty" | "ready";

function DataTable<T>({
  className,
  columns,
  rows,
  getRowKey,
  caption,
  colorScheme,
  headerRow,
  headerCol,
  columnDividers,
  rowHeight,
  align,
  frame,
  loading = false,
  loadingRows = 3,
  error,
  empty,
  rowClassName,
  onRowClick,
  sort,
  onSortChange,
  multiSort = false,
  selection,
  readOnly = false,
  onCellChange,
  onPasteBlock,
  ...props
}: DataTableProps<T>) {
  const state: DataTableState = loading
    ? "loading"
    : error !== undefined && error !== null && error !== false && error !== ""
      ? "error"
      : rows.length === 0
        ? "empty"
        : "ready";

  const activeSort: DataTableSort[] = sort === undefined ? [] : Array.isArray(sort) ? [...sort] : [sort as DataTableSort];

  const selectionEnabled = Boolean(selection);
  const showSelectAll = selectionEnabled && selection?.selectAll !== false;
  const selectedSet = new Set((selection?.selectedKeys ?? []).map((key) => String(key)));
  const rowKeys = rows.map((row, index) => ({
    key: getRowKey(row, index),
    selectable: selectionEnabled ? (selection?.selectable?.(row, index) ?? true) : false,
  }));
  const selectableKeys = rowKeys.filter((entry) => entry.selectable).map((entry) => entry.key);
  const selectedInView = selectableKeys.filter((key) => selectedSet.has(String(key)));
  const allSelected = selectableKeys.length > 0 && selectedInView.length === selectableKeys.length;
  const someSelected = selectedInView.length > 0 && !allSelected;
  const columnCount = Math.max(columns.length + (selectionEnabled ? 1 : 0), 1);

  // 编辑态：仅记录「当前在编辑哪个单元格」与草稿，永不持有 rows 副本。
  const [editing, setEditing] = React.useState<{ rowKey: string; columnId: string } | null>(null);
  const [draft, setDraft] = React.useState("");
  const [cellError, setCellError] = React.useState<string | null>(null);
  const editor = React.useRef<HTMLInputElement>(null);

  const canEdit = (column: DataTableColumn<T>, row: T, index: number) => {
    if (readOnly || column.editable === undefined) return false;
    return typeof column.editable === "function" ? column.editable(row, index) : column.editable;
  };

  const rawValue = (column: DataTableColumn<T>, row: T) =>
    column.getValue ? column.getValue(row) : String(column.cell(row) ?? "");

  const beginEdit = (row: T, index: number, column: DataTableColumn<T>) => {
    if (!canEdit(column, row, index)) return;
    setEditing({ rowKey: String(rowKeys[index].key), columnId: column.id });
    setDraft(rawValue(column, row));
    setCellError(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
    setCellError(null);
  };

  const commitEdit = (row: T, index: number, column: DataTableColumn<T>) => {
    const previousValue = rawValue(column, row);
    const error = column.validate?.(draft, row, index) ?? null;
    if (error) {
      setCellError(error);
      return;
    }
    if (draft !== previousValue) {
      onCellChange?.({
        rowKey: rowKeys[index].key,
        columnId: column.id,
        value: draft,
        previousValue,
        row,
        index,
      });
    }
    cancelEdit();
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    row: T,
    index: number,
    column: DataTableColumn<T>,
  ) => {
    if (!onPasteBlock) return;
    const text = event.clipboardData?.getData("text") ?? "";
    const matrix = parsePasteMatrix(text);
    if (!isBlockPaste(matrix)) return;
    event.preventDefault();
    onPasteBlock({
      startRowKey: rowKeys[index].key,
      startColumnId: column.id,
      values: matrix,
      row,
      index,
    });
    cancelEdit();
  };

  // 校验失败后把焦点还回输入框，避免用户必须再点一次。
  React.useEffect(() => {
    if (editing && cellError) editor.current?.focus();
  }, [editing, cellError]);

  /** 全选/清空只影响当前可见且可选的行，保留其它选择。 */
  const toggleAll = () => {
    if (!selection) return;
    if (allSelected) {
      const inView = new Set(selectableKeys.map((key) => String(key)));
      selection.onChange(selection.selectedKeys.filter((key) => !inView.has(String(key))));
      return;
    }
    const already = new Set(selection.selectedKeys.map((key) => String(key)));
    selection.onChange([...selection.selectedKeys, ...selectableKeys.filter((key) => !already.has(String(key)))]);
  };

  const toggleRow = (key: React.Key) => {
    if (!selection) return;
    const exists = selectedSet.has(String(key));
    selection.onChange(
      exists ? selection.selectedKeys.filter((entry) => String(entry) !== String(key)) : [...selection.selectedKeys, key],
    );
  };

  /** 循环 asc → desc → 移除；multiSort 时追加而非替换。只上报意图，绝不排序 rows。 */
  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const index = activeSort.findIndex((entry) => entry.columnId === columnId);
    if (index === -1) {
      onSortChange(
        multiSort ? [...activeSort, { columnId, direction: "asc" }] : [{ columnId, direction: "asc" }],
      );
      return;
    }
    if (activeSort[index].direction === "asc") {
      onSortChange(
        activeSort.map((entry) =>
          entry.columnId === columnId ? { columnId, direction: "desc" as const } : entry,
        ),
      );
      return;
    }
    onSortChange(activeSort.filter((entry) => entry.columnId !== columnId));
  };

  return (
    <TableRoot
      data-slot="data-table"
      data-state={state}
      data-color-scheme={colorScheme ?? "basic"}
      frame={frame}
      className={cn("w-full min-w-0", className)}
      {...props}
    >
      <Table
        colorScheme={colorScheme}
        headerRow={headerRow}
        headerCol={headerCol}
        columnDividers={columnDividers}
        rowHeight={rowHeight}
        align={align}
      >
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableColgroup>
          {columns.map((column) => (
            <TableCol key={column.id} style={column.width === undefined ? undefined : { width: column.width }} />
          ))}
        </TableColgroup>
        <TableHeader>
          <TableRow>
            {selectionEnabled ? (
              <TableHead className="w-10" data-slot="data-table-select-head">
                {showSelectAll ? (
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    data-slot="data-table-select-all"
                  />
                ) : null}
              </TableHead>
            ) : null}
            {columns.map((column) => {
              const sortIndex = activeSort.findIndex((entry) => entry.columnId === column.id);
              const direction = sortIndex === -1 ? undefined : activeSort[sortIndex].direction;
              const interactive = Boolean(onSortChange) && column.sortable === true;
              return (
                <TableHead
                  key={column.id}
                  align={column.align}
                  className={column.headClassName}
                  data-sortable={interactive ? "true" : undefined}
                  data-sort={direction}
                  data-sort-index={sortIndex === -1 ? undefined : sortIndex}
                >
                  {interactive ? (
                    <button
                      type="button"
                      data-slot="data-table-sort"
                      data-direction={direction ?? "none"}
                      onClick={() => handleSort(column.id)}
                      className="inline-flex items-center gap-1 rounded-sm outline-none focus-ring"
                    >
                      {column.header}
                      {direction === "asc" ? (
                        <ChevronUp aria-hidden className="size-3.5 shrink-0" />
                      ) : direction === "desc" ? (
                        <ChevronDown aria-hidden className="size-3.5 shrink-0" />
                      ) : (
                        <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 opacity-60" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === "ready"
            ? rows.map((row, index) => (
                <TableRow
                  key={rowKeys[index].key}
                  data-row-index={index}
                  data-selected={selectedSet.has(String(rowKeys[index].key)) ? "true" : undefined}
                  className={cn(rowClassName?.(row, index), onRowClick ? "cursor-pointer" : undefined)}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                >
                  {selectionEnabled ? (
                    <TableCell className="w-10" onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        checked={selectedSet.has(String(rowKeys[index].key))}
                        disabled={!rowKeys[index].selectable}
                        onChange={() => toggleRow(rowKeys[index].key)}
                        data-slot="data-table-select-row"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => {
                    const editable = canEdit(column, row, index);
                    const isEditing =
                      editing?.rowKey === String(rowKeys[index].key) && editing?.columnId === column.id;
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={column.cellClassName}
                        data-slot="data-table-cell"
                        data-editable={editable ? "true" : undefined}
                        data-editing={isEditing ? "true" : undefined}
                        onClick={editable ? (event) => event.stopPropagation() : undefined}
                        onDoubleClick={editable ? () => beginEdit(row, index, column) : undefined}
                      >
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <input
                              ref={editor}
                              data-slot="data-table-editor"
                              value={draft}
                              onChange={(event) => {
                                setDraft(event.target.value);
                                if (cellError) setCellError(null);
                              }}
                              onBlur={() => commitEdit(row, index, column)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") cancelEdit();
                              }}
                              onPaste={(event) => handlePaste(event, row, index, column)}
                              className="w-full rounded-sm bg-background-100 px-1 py-0.5 text-copy-14 text-gray-1000 outline-none focus-ring"
                            />
                            {cellError ? (
                              <span
                                data-slot="data-table-cell-error"
                                className="text-label-12 text-error-foreground"
                              >
                                {cellError}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          column.cell(row)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            : null}
          {state === "loading"
            ? Array.from({ length: Math.max(loadingRows, 1) }, (_, index) => (
                <TableRow key={`skeleton-${index}`} data-slot="data-table-skeleton-row">
                  {selectionEnabled ? (
                    <TableCell className="w-10">
                      <div
                        data-slot="data-table-skeleton"
                        className="size-4 animate-pulse rounded-sm bg-gray-alpha-300 motion-reduce:animate-none"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      <div
                        data-slot="data-table-skeleton"
                        className="h-3 w-full max-w-[160px] animate-pulse rounded-sm bg-gray-alpha-300 motion-reduce:animate-none"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
          {state === "empty" || state === "error" ? (
            <TableRow data-slot={`data-table-${state}`}>
              <TableCell colSpan={columnCount} className="py-6 text-center text-copy-13 text-gray-700">
                <div data-slot={`data-table-${state}-message`}>
                  {state === "error" ? error : (empty ?? null)}
                </div>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableRoot>
  );
}

export { DataTable };
