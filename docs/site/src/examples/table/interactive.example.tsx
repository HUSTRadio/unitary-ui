import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hustradio/unitary-ui";

export function TableInteractiveExample() {
  return (
    <Table colorScheme="interactive">
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
