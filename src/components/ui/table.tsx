import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Table — Geist 官方 Table 规范实现（AGENTS.md §Table 视觉约束 + docs/geist-markdown-refs/components/table.md 实测）。
 * - TableRoot：显式提供 1px hairline（gray-alpha-400）+ 8px 圆角 + background-100 容器
 * - Table：只渲染语义化 `<table>`；在 DemoSection/Section 等已有卡片中不会重复创建边框容器
 * - 表头：500 14px/20px，36px 高，无填充背景，仅靠字重区分；正文：400 14px/20px；颜色均 gray-900
 * - 单元格 padding `10px 8px`（py-2.5 / px-2），行高 40px；单元格自身无 border-bottom
 * - thead 行下沿 1px 发丝线（gray-alpha-400，与容器外框同源）；Basic 无行分隔线；
 *   striped（斑马纹 background-200）/ bordered（gray-alpha-400 行间线）/ interactive（gray-100 hover）由 TableBody 控制
 * - 空列表渲染 Empty State；未知值渲染 —（页面层约定）
 *
 * 对齐（item 11 扩展）：默认全左对齐 + 垂直居中；Table 级 `align` 经 context 下发为默认，
 *   TableRow/TableCol/TableHead/TableCell 的显式 `align` / `vertical` 逐层覆盖。
 * 行高：`rowHeight` 数字=固定 px（CSS 变量 --table-row-h 驱动），"auto"=内容自适应（默认）。
 * 列宽：`colWidth="fit"` 一次性测量各列宽度写回 colgroup（非响应式）。
 * 外观：`colorScheme` 聚合三布尔；headerRow/headerCol 提供行列头语义。
 */

export type AlignH = "left" | "center" | "right";
export type AlignV = "top" | "middle" | "bottom";

export interface TableAlign {
  h?: AlignH;
  v?: AlignV;
}

/** 传字符串时视为水平对齐（h），对象可同时指定水平 + 垂直 */
export type MaybeAlign = AlignH | TableAlign;

export type TableColorScheme = "basic" | "striped" | "bordered" | "interactive";

export interface TableRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 外框样式；默认 outline，none 移除可见外框但保留圆角裁切和滚动 owner */
  frame?: "outline" | "none";
}

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** 表格级默认对齐（经 context 下发，单元格级优先） */
  align?: MaybeAlign;
  /** 行高：数字=固定 px；"auto"=内容自适应（默认） */
  rowHeight?: number | "auto";
  /** 列宽策略："auto" 保持自适应（默认）；"fit" 一次性测量后锁定（非响应式） */
  colWidth?: "auto" | "fit";
  /** 外观聚合（与 TableBody 三布尔二选一；basic 为全关） */
  colorScheme?: TableColorScheme;
  /** 为每行第二列及以后单元格添加 inline-start 分隔线 */
  columnDividers?: boolean;
  /** 标记首行为行头（TableHeader 的 th 加 scope="col"） */
  headerRow?: boolean;
  /** 标记首列为行头列（TableBody 首列 th scope="row" + 视觉强调） */
  headerCol?: boolean;
}

export interface TableColgroupProps extends React.HTMLAttributes<HTMLTableColElement> {}

export interface TableColProps extends React.HTMLAttributes<HTMLTableColElement> {
  /** 列级水平对齐（映射 col 上；浏览器对 th/td 生效需配合 table-layout 固定列宽，建议用 TableHead/TableCell align） */
  align?: AlignH;
  /** 列宽（数字=px；colWidth="fit" 时被测量结果覆盖） */
  width?: number | string;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** @deprecated 使用 Table 的 colorScheme="striped" 替代 */
  striped?: boolean;
  /** @deprecated 使用 Table 的 colorScheme="bordered" 替代 */
  bordered?: boolean;
  /** @deprecated 使用 Table 的 colorScheme="interactive" 替代 */
  interactive?: boolean;
  /** 首列渲染为行头（th scope="row"）；默认跟随 Table.headerCol */
  headerCol?: boolean;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** 行级水平对齐覆盖（作用于本行所有单元格） */
  align?: AlignH;
  /** 行级垂直对齐覆盖 */
  vertical?: AlignV;
}

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** 单元格级水平对齐（覆盖表格/行级默认）；字符串=水平，对象可含垂直 */
  align?: MaybeAlign;
  /** 单元格级垂直对齐（覆盖表格/行级默认） */
  vertical?: AlignV;
  /** 由 TableBody headerCol 注入的行头标记（内部透传，勿手动使用） */
  "data-row-header"?: string;
}

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** 单元格级水平对齐（覆盖表格/行级默认）；字符串=水平，对象可含垂直 */
  align?: MaybeAlign;
  /** 单元格级垂直对齐（覆盖表格/行级默认） */
  vertical?: AlignV;
  /** 由 TableBody headerCol 注入的行头标记（内部透传，勿手动使用） */
  "data-row-header"?: string;
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

/* ---------- context ---------- */

const TableAlignContext = React.createContext<TableAlign>({});

interface TableContextValue {
  rowHeight: number | "auto";
  colorScheme?: TableColorScheme;
  headerRow: boolean;
  headerCol: boolean;
}

const TableContext = React.createContext<TableContextValue>({
  rowHeight: "auto",
  colorScheme: undefined,
  headerRow: false,
  headerCol: false,
});

/** 把 MaybeAlign（字符串视为 h）归一成 TableAlign */
function normalizeAlign(align?: MaybeAlign): TableAlign {
  if (typeof align === "string") return { h: align };
  return align ?? {};
}

/** 对齐 → Tailwind 工具类；未指定时回退到 context 默认（最终回退 left/middle） */
function resolveAlignClasses(
  own?: MaybeAlign,
  vertical?: AlignV,
  ctx?: TableAlign,
): { h: string; v: string } {
  const ownNorm = normalizeAlign(own);
  const h = ownNorm.h ?? ctx?.h ?? "left";
  const v = vertical ?? ownNorm.v ?? ctx?.v ?? "middle";
  const hClass = h === "center" ? "text-center" : h === "right" ? "text-right" : "text-left";
  const vClass = v === "top" ? "align-top" : v === "bottom" ? "align-bottom" : "align-middle";
  return { h: hClass, v: vClass };
}

const TableRoot = React.forwardRef<HTMLDivElement, TableRootProps>(
  ({ className, frame = "outline", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="table-root"
      className={cn(
        "relative w-full overflow-x-auto rounded-[8px]",
        frame === "outline" && "border border-gray-alpha-400 bg-background-100",
        className,
      )}
      {...props}
    />
  ),
);
TableRoot.displayName = "TableRoot";

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      align,
      rowHeight = "auto",
      colWidth = "auto",
      colorScheme,
      columnDividers = false,
      headerRow = false,
      headerCol = false,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const tableRef = React.useRef<HTMLTableElement>(null);

    // colWidth="fit"：一次性测量各 col 宽度写回（table-layout: fixed），之后不再跟踪（非响应式）
    React.useLayoutEffect(() => {
      if (colWidth !== "fit") return;
      const table = tableRef.current;
      if (!table) return;
      const cols = Array.from(table.querySelectorAll<HTMLTableColElement>("col"));
      if (cols.length === 0) return;
      const widths = cols.map((col) => col.getBoundingClientRect().width);
      table.style.tableLayout = "fixed";
      cols.forEach((col, index) => {
        col.style.width = `${Math.round(widths[index])}px`;
      });
    }, [colWidth]);

    const alignValue = React.useMemo(() => normalizeAlign(align), [align]);
    const contextValue = React.useMemo<TableContextValue>(
      () => ({ rowHeight, colorScheme, headerRow, headerCol }),
      [rowHeight, colorScheme, headerRow, headerCol],
    );

    const tableStyle = React.useMemo<React.CSSProperties>(
      () => ({
        ...(rowHeight !== "auto" ? { "--table-row-h": `${rowHeight}px` } : null),
        ...style,
      }),
      [rowHeight, style],
    );

    return (
      <TableContext.Provider value={contextValue}>
        <TableAlignContext.Provider value={alignValue}>
          <table
            ref={(node) => {
              tableRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            className={cn(
              "w-full caption-bottom border-collapse text-copy-14 text-muted-foreground",
              columnDividers &&
                "[&_tr>:not(:first-child)]:border-s [&_tr>:not(:first-child)]:border-gray-alpha-400",
              className,
            )}
            style={tableStyle}
            {...props}
          >
            {children}
          </table>
        </TableAlignContext.Provider>
      </TableContext.Provider>
    );
  },
);
Table.displayName = "Table";

const TableColgroup = React.forwardRef<HTMLTableColElement, TableColgroupProps>(
  ({ className, ...props }, ref) => <colgroup ref={ref} className={cn("", className)} {...props} />,
);
TableColgroup.displayName = "TableColgroup";

const TableCol = React.forwardRef<HTMLTableColElement, TableColProps>(
  ({ className, align, width, style, ...props }, ref) => (
    <col
      ref={ref}
      className={cn(
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      style={{
        ...(width !== undefined
          ? { width: typeof width === "number" ? `${width}px` : width }
          : null),
        ...style,
      }}
      {...props}
    />
  ),
);
TableCol.displayName = "TableCol";

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    const { headerRow } = React.useContext(TableContext);
    return (
      <thead
        ref={ref}
        className={cn("[&_tr]:border-b [&_tr]:border-gray-alpha-400", className)}
        {...(headerRow ? { "data-header-row": "" } : {})}
        {...props}
      />
    );
  },
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, striped, bordered, interactive, headerCol, children, ...props }, ref) => {
    const { colorScheme, headerCol: contextHeaderCol } = React.useContext(TableContext);
    // colorScheme 为新入口；旧三布尔（@deprecated）在未指定 colorScheme 时兼容生效
    const useStriped = colorScheme === "striped" || (colorScheme === undefined && striped);
    const useBordered = colorScheme === "bordered" || (colorScheme === undefined && bordered);
    const useInteractive =
      colorScheme === "interactive" || (colorScheme === undefined && interactive);
    const rowHeader = headerCol ?? contextHeaderCol;

    // headerCol：把每个 <tr> 的首个单元格标记为行头（th scope="row"），
    // 通过 data-row-header 属性透传给 TableCell/TableHead 自行决定渲染 th。
    let content: React.ReactNode = children;
    if (rowHeader) {
      content = React.Children.map(children, (row) => {
        if (!React.isValidElement(row)) return row;
        const rowProps = row.props as { children?: React.ReactNode };
        const cells = React.Children.map(rowProps.children, (cell, index) => {
          if (!React.isValidElement(cell) || index !== 0) return cell;
          type WithRowHeader = { "data-row-header"?: string };
          return React.cloneElement(
            cell as React.ReactElement<WithRowHeader>,
            { "data-row-header": "" },
          );
        });
        return React.cloneElement(row as React.ReactElement<{ children?: React.ReactNode }>, {
          children: cells,
        });
      });
    }

    return (
      <tbody
        ref={ref}
        className={cn(
          "[&_td:first-child]:rounded-l-sm [&_td:last-child]:rounded-r-sm",
          useBordered && "[&_tr]:border-b [&_tr]:border-gray-alpha-400",
          useStriped && "[&_tr:where(:nth-child(odd))]:bg-background-200",
          useInteractive && "[&_tr]:transition-colors [&_tr:hover]:bg-gray-100",
          className,
        )}
        {...props}
      >
        {content}
      </tbody>
    );
  },
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t border-gray-alpha-400 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, align, vertical, ...props }, ref) => {
    const ctx = React.useContext(TableAlignContext);
    const rowAlign = normalizeAlign(align);
    const h = rowAlign.h ?? ctx.h;
    const v = vertical ?? rowAlign.v ?? ctx.v;
    return (
      <tr
        ref={ref}
        className={cn(
          "transition-colors data-[state=selected]:bg-gray-100",
          h === "center" && "[&>*]:text-center",
          h === "right" && "[&>*]:text-right",
          v === "top" && "[&>*]:align-top",
          v === "bottom" && "[&>*]:align-bottom",
          className,
        )}
        {...props}
      />
    );
  },
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, align, vertical, "data-row-header": dataRowHeader, ...props }, ref) => {
    const ctx = React.useContext(TableAlignContext);
    const { headerRow, rowHeight } = React.useContext(TableContext);
    const { h: hClass, v: vClass } = resolveAlignClasses(align, vertical, ctx);
    return (
      <th
        ref={ref}
        scope={dataRowHeader !== undefined ? "row" : headerRow ? "col" : undefined}
        className={cn(
          "h-9 whitespace-nowrap px-2 text-left align-middle text-copy-14 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          rowHeight !== "auto" && "h-[var(--table-row-h)]",
          hClass,
          vClass,
          dataRowHeader !== undefined && "font-medium text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, vertical, "data-row-header": dataRowHeader, ...props }, ref) => {
    const ctx = React.useContext(TableAlignContext);
    const { rowHeight } = React.useContext(TableContext);
    const { h: hClass, v: vClass } = resolveAlignClasses(align, vertical, ctx);
    const asHeader = dataRowHeader !== undefined;
    const CellTag = asHeader ? "th" : "td";
    return (
      <CellTag
        ref={ref}
        scope={asHeader ? "row" : undefined}
        className={cn(
          "whitespace-nowrap px-2 py-2.5 text-left align-middle text-muted-foreground [&:has([role=checkbox])]:pr-0",
          rowHeight !== "auto" && "py-0 h-[var(--table-row-h)]",
          hClass,
          vClass,
          asHeader && "font-medium text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-copy-13 text-muted-foreground", className)}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

export {
  TableAlignContext,
  TableRoot,
  Table,
  TableColgroup,
  TableCol,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
