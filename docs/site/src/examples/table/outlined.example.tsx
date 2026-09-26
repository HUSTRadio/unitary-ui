import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRoot,
} from "@/components/ui/table";

/**
 * 真正的「带外框」变体：外框由 `TableRoot` 的 `frame="outline"` 提供
 * （1px 发丝线 + background-100 底 + 8px 圆角裁切容器），行间分隔线仍由
 * `colorScheme="bordered"` 提供。与 Row dividers 唯一的区别就是这层外框，
 * 两者并排即可看出 `frame` 到底控制什么。
 */
export function TableOutlinedExample() {
  return (
    <TableRoot frame="outline">
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
    </TableRoot>
  );
}
