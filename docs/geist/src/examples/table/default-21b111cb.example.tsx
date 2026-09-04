import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRoot,
} from "@/components/ui/table";

export function TableDefault21B111CBExample() {
  return (
    <TableRoot frame="outline">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
            <TableHead>Col 2</TableHead>
            <TableHead>Col 3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Value 1.1</TableCell>
            <TableCell>Value 1.2</TableCell>
            <TableCell>Value 1.3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Value 2.1</TableCell>
            <TableCell>Value 2.2</TableCell>
            <TableCell>Value 2.3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableRoot>
  );
}
