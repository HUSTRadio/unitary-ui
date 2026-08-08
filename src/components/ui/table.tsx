import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Table — Geist 官方 Table 规范实现（AGENTS.md §Table 视觉约束 + docs/geist/components/table.md 实测）。
 * - 外层容器：1px hairline（gray-alpha-400）+ 8px 圆角 + background-100（官方视觉主体）
 * - 表头：500 14px/20px，无填充背景，仅靠字重区分；正文：400 14px/20px；颜色均 gray-900
 * - 单元格 padding `10px 8px`，行高 40px；单元格自身无 border-bottom
 * - Basic 无行分隔线；striped（斑马纹）/ bordered（行间 hairline）/ interactive（hover）由 TableBody 控制
 * - 空列表渲染 Empty State；未知值渲染 —（页面层约定）
 */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto rounded-[8px] border border-gray-alpha-400 bg-background">
      <table
        ref={ref}
        className={cn("w-full caption-bottom border-collapse text-copy-14", className)}
        {...props}
      />
    </div>
  ),
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
>(({ className, ...props }, ref) => <thead ref={ref} className={cn("", className)} {...props} />);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** 斑马纹：奇数行背景色 */
  striped?: boolean;
  /** 行间 hairline 分隔 */
  bordered?: boolean;
  /** 可交互：行 hover 背景 */
  interactive?: boolean;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, striped, bordered, interactive, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        bordered && "[&_tr]:border-b [&_tr]:border-gray-alpha-400",
        striped && "[&_tr:nth-child(odd)]:bg-subtle/50",
        interactive && "[&_tr]:transition-colors [&_tr:hover]:bg-gray-alpha-200",
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
    className={cn("border-t font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("data-[state=selected]:bg-gray-alpha-200", className)} {...props} />
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
      "h-10 px-1.5 text-left align-middle text-copy-14 font-medium text-muted-foreground first:pl-3 last:pr-3 [&:has([role=checkbox])]:pr-0",
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
      "px-1.5 py-2.5 align-middle text-muted-foreground first:pl-3 last:pr-3 [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:align-top [&:has([role=checkbox])>[role=checkbox]]:mt-0.5",
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
