import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * 行间分隔线：`colorScheme="bordered"` 只在**行与行之间**画 1px 发丝线。
 * 容器外框是完全独立的另一件事，由 `TableRoot` 的 `frame` 控制——这里刻意不包
 * `TableRoot`，因此只有行分隔线、没有外框；需要外框时请看 Outlined table。
 */
export function TableRowDividersExample() {
  return (
    <Table colorScheme="bordered">
      <TableHeader>
        <TableRow>
          <TableHead>Col 1</TableHead>
          <TableHead>Col 2</TableHead>
          <TableHead>Col 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((row) => (
          <TableRow key={row}>
            <TableCell>Value {row}.1</TableCell>
            <TableCell>Value {row}.2</TableCell>
            <TableCell>Value {row}.3</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
