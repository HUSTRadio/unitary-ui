import {
  Table,
  TableBody,
  TableCell,
  TableCol,
  TableColgroup,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRoot,
} from "@hustradio/unitary-ui";

const items = [
  ["Brake Pads Set", "100 sets", "$50 per set", "$5,000.00"],
  ["Oil Filters", "200 filters", "$10 per filter", "$2,000.00"],
  ["Car Batteries", "50 batteries", "$100 per battery", "$5,000.00"],
  ["Headlight Bulbs", "300 bulbs", "$15 per bulb", "$4,500.00"],
  ["Windshield Wipers", "250 pairs", "$20 per pair", "$5,000.00"],
  ["Spark Plugs", "500 sets", "$5 per set", "$2,500.00"],
] as const;

export function TableFullFeaturedExample() {
  return (
    <TableRoot frame="none">
      <Table colorScheme="bordered" columnDividers>
        <TableColgroup>
          <TableCol className="w-[44%]" />
          <TableCol className="w-[22%]" />
          <TableCol className="w-[22%]" />
          <TableCol className="w-[11%]" />
        </TableColgroup>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Charge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(([product, usage, price, charge]) => (
            <TableRow key={product}>
              <TableCell>{product}</TableCell>
              <TableCell>{usage}</TableCell>
              <TableCell>{price}</TableCell>
              <TableCell className="tabular-nums text-right">{charge}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-medium text-foreground" colSpan={3}>
              Subtotal
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums text-foreground">
              $24,000.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableRoot>
  );
}
