import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Table — Geist 官方 Table 规范实现（AGENTS.md §Table 视觉约束 + docs/geist-markdown-refs/components/table.md 实测）。
 * - TableRoot：1px hairline（gray-alpha-400）+ 8px 圆角 + background-100 容器；Table 单独使用时会自带容器
 * - 表头：500 14px/20px，36px 高，无填充背景，仅靠字重区分；正文：400 14px/20px；颜色均 gray-900
 * - 单元格 padding `10px 8px`（py-2.5 / px-2），行高 40px；单元格自身无 border-bottom
 * - thead 行下沿 1px 发丝线（gray-400）；Basic 无行分隔线；
 *   striped（斑马纹 background-200）/ bordered（gray-400 行间线）/ interactive（gray-100 hover）由 TableBody 控制
 * - 空列表渲染 Empty State；未知值渲染 —（页面层约定）
 */

const TableRootContext = React.createContext(false);

const TableRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <TableRootContext.Provider value={true}>
      <div
        ref={ref}
        data-slot="table-root"
        className={cn(
          "relative w-full overflow-x-auto rounded-[8px] border border-gray-alpha-400 bg-background-100",
          className,
        )}
        {...props}
      />
    </TableRootContext.Provider>
  ),
);
TableRoot.displayName = "TableRoot";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    const inRoot = React.useContext(TableRootContext);
    const table = (
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom border-collapse text-copy-14 text-muted-foreground",
          className,
        )}
        {...props}
      />
    );
    if (inRoot) return table;
    return (
      <div
        data-slot="table-root"
        className="relative w-full overflow-x-auto rounded-[8px] border border-gray-alpha-400 bg-background-100"
      >
        {table}
      </div>
    );
  },
);
Table.displayName = "Table";

const TableColgroup = React.forwardRef<
  HTMLTableColElement,
  React.HTMLAttributes<HTMLTableColElement>
>(({ className, ...props }, ref) => (
  <colgroup ref={ref} className={cn("", className)} {...props} />
));
TableColgroup.displayName = "TableColgroup";

const TableCol = React.forwardRef<HTMLTableColElement, React.HTMLAttributes<HTMLTableColElement>>(
  ({ className, ...props }, ref) => <col ref={ref} className={cn("", className)} {...props} />,
);
TableCol.displayName = "TableCol";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-gray-400", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** 斑马纹：奇数行背景色（官方 background-200 实色） */
  striped?: boolean;
  /** 行间 hairline 分隔（官方 gray-400 实色） */
  bordered?: boolean;
  /** 可交互：行 hover 背景（官方 gray-100） */
  interactive?: boolean;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, striped, bordered, interactive, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "[&_td:first-child]:rounded-l-sm [&_td:last-child]:rounded-r-sm",
        bordered && "[&_tr]:border-b [&_tr]:border-gray-400",
        striped && "[&_tr:where(:nth-child(odd))]:bg-background-200",
        interactive && "[&_tr]:transition-colors [&_tr:hover]:bg-gray-100",
        className,
      )}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t border-gray-400 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("transition-colors data-[state=selected]:bg-gray-100", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-9 whitespace-nowrap px-2 text-left align-middle text-copy-14 font-medium text-muted-foreground last:text-right [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "whitespace-nowrap px-2 py-2.5 align-middle text-muted-foreground last:text-right [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-copy-13 text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
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
