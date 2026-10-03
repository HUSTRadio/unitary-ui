# Table

> Route: `/components/table`

Display structured data in rows and columns for comparison.

[Back to Components](#/components)

# Table

table

Display structured data in rows and columns for comparison.

## When to use

- When data rows share the same shape and at least one column is sortable or comparable across rows.
- Rendering dense structured data such as order lists, member tables, or deployment logs.

## When not to use

- A single row paired with one action should use the Entity component instead of a table.
- Key/value metadata on a detail page should use Description, not a two-column table impersonation.

## Examples

### Basic table

A standard header-body table structure showing the core usage pattern.

### Table border variants

Uses colorScheme="bordered" on Table to render row dividers.

## Accessibility

- For sortable columns, callers render a button inside TableHead and manage sorting state and aria-sort themselves.
- Empty cells should show an em dash (—), never N/A or an empty string, to keep table alignment correct.

## Controlled behavior

Not applicable: Table does not provide built-in sorting state or callbacks. Sort rows before rendering and implement any sortable header buttons in caller code.

## Responsive behavior

- TableRoot provides horizontal scrolling when content is wider than its container; the component does not switch to a card layout.

## Theme behavior

- Table background colors, dividers, and hover highlights inherit theme tokens; zebra striping is configurable.

## Live Demo

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr></tbody></table>

```tsx
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
```

## Striped table

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableStripedExample() {
  return (
    <Table colorScheme="striped">
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
```

## Row dividers

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
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
```

## Outlined table

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
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
```

## Interactive table

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:transition-colors [&amp;_tr:hover]:bg-gray-100"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
```

## Full featured table

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground [&amp;_tr&gt;:not(:first-child)]:border-s [&amp;_tr&gt;:not(:first-child)]:border-gray-alpha-400"><colgroup class=""><col class="w-[44%]"><col class="w-[22%]"><col class="w-[22%]"><col class="w-[11%]"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Product</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Usage</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Price</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Charge</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Headlight Bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">300 bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$15 per bulb</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$4,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Windshield Wipers</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">250 pairs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$20 per pair</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Spark Plugs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">500 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$5 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,500.00</td></tr></tbody><tfoot class="border-t border-gray-alpha-400 font-medium [&amp;&gt;tr]:last:border-b-0"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle font-medium text-foreground" colspan="3">Subtotal</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 align-middle text-right font-medium tabular-nums text-foreground">$24,000.00</td></tr></tfoot></table>

```tsx
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
} from "@/components/ui/table";

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
```

## Virtualized table

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><colgroup class=""><col class="w-[44%]"><col class="w-[22%]"><col class="w-[22%]"><col class="w-[11%]"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Product</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Usage</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Price</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Charge</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Headlight Bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">300 bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$15 per bulb</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$4,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Windshield Wipers</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">250 pairs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$20 per pair</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Spark Plugs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">500 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$5 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr></tbody></table>

```tsx
import * as React from "react";
import { ShowMore } from "@/components/ui/show-more";
import {
  Table,
  TableBody,
  TableCell,
  TableCol,
  TableColgroup,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  TableRoot,
  Table,
  TableColgroup,
  TableCol,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MaybeAlign</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Default horizontal and vertical cell alignment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowHeight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | "auto"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Fixed row height in pixels or content-driven height.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto" | "fit"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Keeps responsive columns or measures and locks column widths once.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colorScheme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TableColorScheme</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Basic, striped, bordered, or interactive row treatment.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls the TableRoot outline while keeping content clipped to its rounded corners.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columnDividers</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Adds logical inline-start dividers after the first cell in each row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerRow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Adds column-header scope semantics to the header row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerCol</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders the first body column as row headers.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use <Table> for tabular data where rows share the same shape and at least one column is sortable or comparable across rows.
- For a row of descriptive content paired with a single action (membership row, integration row), use Entity instead.
- For a key/value metadata block on a detail page, use Description, not a two-column table.
- When the underlying list is empty (filter cleared, never created), render Empty State outside the table rather than an empty <Table.Body>.
- Render — in cells where a value is unknown or not applicable. Don’t substitute N/A, null, or an empty string.
- Sortable column headers are buttons. The visible label stays Title Case; the sort-direction arrow is decorative and the button announces the next sort state to assistive tech.
- Apply tabular-nums (or JetBrains Maple Mono) to numeric columns so digits align across rows for comparison.
- Column headers (<Table.Head>) are Title Case nouns or noun phrases: Last Used, Requests (7d), Created, Status. Never sentences.
- Use the canonical short relative-time form in cells (2m ago, 5h ago); switch to Mar 14, 2026 past 7 days. See Relative Time Card.
- Pagination labels are Previous and Next. Page-count copy reads Page 2 of 7 or 21–40 of 142 with an en-dash inside the range.
