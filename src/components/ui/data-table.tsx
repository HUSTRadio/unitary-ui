"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

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
  ...props
}: DataTableProps<T>) {
  const state: DataTableState = loading
    ? "loading"
    : error !== undefined && error !== null && error !== false && error !== ""
      ? "error"
      : rows.length === 0
        ? "empty"
        : "ready";

  const columnCount = Math.max(columns.length, 1);

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
            {columns.map((column) => (
              <TableHead key={column.id} align={column.align} className={column.headClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === "ready"
            ? rows.map((row, index) => (
                <TableRow
                  key={getRowKey(row, index)}
                  data-row-index={index}
                  className={cn(rowClassName?.(row, index), onRowClick ? "cursor-pointer" : undefined)}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} className={column.cellClassName}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
          {state === "loading"
            ? Array.from({ length: Math.max(loadingRows, 1) }, (_, index) => (
                <TableRow key={`skeleton-${index}`} data-slot="data-table-skeleton-row">
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
