import * as React from "react";
import { ShowMore } from "@hustradio/unitary-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableCol,
  TableColgroup,
  TableHead,
  TableHeader,
  TableRow,
} from "@hustradio/unitary-ui";

const items = [
  ["Brake Pads Set", "100 sets", "$50 per set", "$5,000.00"],
  ["Oil Filters", "200 filters", "$10 per filter", "$2,000.00"],
  ["Car Batteries", "50 batteries", "$100 per battery", "$5,000.00"],
  ["Headlight Bulbs", "300 bulbs", "$15 per bulb", "$4,500.00"],
  ["Windshield Wipers", "250 pairs", "$20 per pair", "$5,000.00"],
  ["Spark Plugs", "500 sets", "$5 per set", "$2,500.00"],
] as const;

export function TableVirtualizedExample() {
  const [expanded, setExpanded] = React.useState(false);
  const rows = expanded ? 48 : 9;
  return (
    <div className="relative">
      <Table colorScheme="striped">
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
          {Array.from({ length: rows }, (_, index) => {
            const [product, usage, price, charge] = items[index % items.length];
            return (
              <TableRow key={`${product}-${index}`}>
                <TableCell>{product}</TableCell>
                <TableCell>{usage}</TableCell>
                <TableCell>{price}</TableCell>
                <TableCell className="tabular-nums text-right">{charge}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!expanded ? (
        <div className="pointer-events-none absolute bottom-0 left-0 h-[30%] w-full rounded bg-linear-to-t from-background-100 to-transparent opacity-80" />
      ) : null}
      <div className="flex justify-center pt-2">
        <ShowMore expanded={expanded} noBorder onClick={() => setExpanded(!expanded)} />
      </div>
    </div>
  );
}
