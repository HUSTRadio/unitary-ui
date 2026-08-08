# Table

A semantic HTML table component

> **渲染视觉参数（2026-08-08 官方页面 computed style 实测，light / dark 两套）**
>
> 官方 Geist Table 的视觉实现要点（这些参数文档页不直接展示，是此前 coding agent 实现与官方存在视觉差别的根源）：
>
> | 属性           | Light                                            | Dark                                                   |
> | -------------- | ------------------------------------------------ | ------------------------------------------------------ |
> | 外层容器边框   | `1px solid rgba(0,0,0,0.08)`（≈ gray-alpha-400） | `1px solid rgba(255,255,255,0.14)`（≈ gray-alpha-400） |
> | 外层容器圆角   | 8px                                              | 8px                                                    |
> | 外层容器背景   | #ffffff（background-100）                        | #0a0a0a（background-100）                              |
> | 表头 padding   | `0 8px`（水平 8px）                              | 同左                                                   |
> | 表头字体       | 500 14px/20px                                    | 同左                                                   |
> | 表头颜色       | gray-900 #4d4d4d                                 | gray-900 #a1a1a1                                       |
> | 单元格 padding | `10px 8px`（垂直 10 水平 8）                     | 同左                                                   |
> | 单元格字体     | 400 14px/20px                                    | 同左                                                   |
> | 单元格颜色     | gray-900 #4d4d4d                                 | gray-900 #a1a1a1                                       |
> | 行高           | 40px（行内最小高度）                             | 同左                                                   |
> | 单元格自身边框 | 0（**行分隔线不在 td 上**）                      | 同左                                                   |
> | 字体           | Geist Sans（本项目映射为 HarmonyOS Sans SC）     | 同左                                                   |
>
> **实现要点**：
>
> - 表格外观主要由**外层容器**承载（1px hairline 边框 + 8px 圆角 + background-100），单元格自身无边框
> - 分隔线效果通过容器边框 + 变体背景实现，不是给每个 td 加 border-bottom
> - 表头 500 字重 / 正文 400 字重，均 14px/20px
> - 表头无填充背景（透明），仅靠字重与正文区分
> - striped 变体交替行背景、bordered 变体行间 hairline、interactive 变体行 hover 态（见下方代码示例的 `striped` / `bordered` / `interactive` props）

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Basic table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Striped table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Bordered table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Interactive table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Full featured table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Virtualized table**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#171717 · bg:#ffffff · r:3.35544e+07px
>
> **Dark 主题**
>
> - **Basic table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Striped table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Bordered table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Interactive table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Full featured table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Virtualized table**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Show More" · .outline-none · h:32px · pad:0px 12px · 500 14px/21px · fg:#ededed · bg:#0a0a0a · r:3.35544e+07px

<!-- GEIST-RENDER-METRICS-END -->

## Basic table

| Col 1     | Col 2     | Col 3     |
| --------- | --------- | --------- |
| Value 1.1 | Value 1.2 | Value 1.3 |
| Value 2.1 | Value 2.2 | Value 2.3 |
| Value 3.1 | Value 3.2 | Value 3.3 |

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableRoot,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TableRoot>
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
          <TableRow>
            <TableCell>Value 3.1</TableCell>
            <TableCell>Value 3.2</TableCell>
            <TableCell>Value 3.3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableRoot>
  );
}
```

## Striped table

| Col 1     | Col 2     | Col 3     |
| --------- | --------- | --------- |
| Value 1.1 | Value 1.2 | Value 1.3 |
| Value 2.1 | Value 2.2 | Value 2.3 |
| Value 3.1 | Value 3.2 | Value 3.3 |

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableRoot,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
            <TableHead>Col 2</TableHead>
            <TableHead>Col 3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody striped>
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
          <TableRow>
            <TableCell>Value 3.1</TableCell>
            <TableCell>Value 3.2</TableCell>
            <TableCell>Value 3.3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableRoot>
  );
}
```

## Bordered table

| Col 1     | Col 2     | Col 3     |
| --------- | --------- | --------- |
| Value 1.1 | Value 1.2 | Value 1.3 |
| Value 2.1 | Value 2.2 | Value 2.3 |
| Value 3.1 | Value 3.2 | Value 3.3 |

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableRoot,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
            <TableHead>Col 2</TableHead>
            <TableHead>Col 3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody bordered>
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
          <TableRow>
            <TableCell>Value 3.1</TableCell>
            <TableCell>Value 3.2</TableCell>
            <TableCell>Value 3.3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableRoot>
  );
}
```

## Interactive table

| Col 1     | Col 2     | Col 3     |
| --------- | --------- | --------- |
| Value 1.1 | Value 1.2 | Value 1.3 |
| Value 2.1 | Value 2.2 | Value 2.3 |
| Value 3.1 | Value 3.2 | Value 3.3 |

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableRoot,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
            <TableHead>Col 2</TableHead>
            <TableHead>Col 3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody interactive>
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
          <TableRow>
            <TableCell>Value 3.1</TableCell>
            <TableCell>Value 3.2</TableCell>
            <TableCell>Value 3.3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableRoot>
  );
}
```

## Full featured table

| Product           | Usage        | Price            | Charge    |
| ----------------- | ------------ | ---------------- | --------- |
| Brake Pads Set    | 100 sets     | $50 per set      | $5,000.00 |
| Oil Filters       | 200 filters  | $10 per filter   | $2,000.00 |
| Car Batteries     | 50 batteries | $100 per battery | $5,000.00 |
| Headlight Bulbs   | 300 bulbs    | $15 per bulb     | $4,500.00 |
| Windshield Wipers | 250 pairs    | $20 per pair     | $5,000.00 |
| Spark Plugs       | 500 sets     | $5 per set       | $2,500.00 |
| Subtotal          | $24,000.00   |

```tsx
import {
  Table,
  TableColgroup,
  TableCol,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableRoot,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  maximumFractionDigits: 2,
  currency: "usd",
});

function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

const items = [
  {
    product: "Brake Pads Set",
    usage: "100 sets",
    price: "$50 per set",
    charge: 5000,
  },
  {
    product: "Oil Filters",
    usage: "200 filters",
    price: "$10 per filter",
    charge: 2000,
  },
  {
    product: "Car Batteries",
    usage: "50 batteries",
    price: "$100 per battery",
    charge: 5000,
  },
  {
    product: "Headlight Bulbs",
    usage: "300 bulbs",
    price: "$15 per bulb",
    charge: 4500,
  },
  {
    product: "Windshield Wipers",
    usage: "250 pairs",
    price: "$20 per pair",
    charge: 5000,
  },
  {
    product: "Spark Plugs",
    usage: "500 sets",
    price: "$5 per set",
    charge: 2500,
  },
];

export function Component(): JSX.Element {
  return (
    <TableRoot>
      <Table>
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
        <TableBody interactive striped>
          {items.map((item) => (
            <TableRow key={item.product}>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.usage}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{formatCurrency(item.charge)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-gray-1000 font-medium" colSpan={3}>
              Subtotal
            </TableCell>
            <TableCell className="text-gray-1000 font-medium">
              {formatCurrency(items.reduce((sum, val) => sum + val.charge, 0))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableRoot>
  );
}
```

## Virtualized table

| Product        | Usage    | Price       | Charge    |
| -------------- | -------- | ----------- | --------- |
|                |
| Brake Pads Set | 100 sets | $50 per set | $5,000.00 |
|                |

```tsx
"use client";

import {
  ShowMore,
  Table,
  TableColgroup,
  TableCol,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableRoot,
} from "@vercel/geistcn/components";
import { memo, useState, type JSX } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  maximumFractionDigits: 2,
  currency: "usd",
});

function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

const items = [
  {
    product: "Brake Pads Set",
    usage: "100 sets",
    price: "$50 per set",
    charge: 5000,
  },
  {
    product: "Oil Filters",
    usage: "200 filters",
    price: "$10 per filter",
    charge: 2000,
  },
  {
    product: "Car Batteries",
    usage: "50 batteries",
    price: "$100 per battery",
    charge: 5000,
  },
  {
    product: "Headlight Bulbs",
    usage: "300 bulbs",
    price: "$15 per bulb",
    charge: 4500,
  },
  {
    product: "Windshield Wipers",
    usage: "250 pairs",
    price: "$20 per pair",
    charge: 5000,
  },
  {
    product: "Spark Plugs",
    usage: "500 sets",
    price: "$5 per set",
    charge: 2500,
  },
];

export function Component(): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <TableRoot>
        <Table>
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
          <TableBody interactive striped virtualize>
            {new Array(5_000).fill(null).map((_, index) => {
              if (!expanded && index >= 9) return null;
              const item = items[index % items.length];
              if (!item) return null;
              return <Row item={item} key={`${item.product}${index}`} />;
            })}
          </TableBody>
        </Table>
      </TableRoot>
      {expanded ? null : (
        <div className="from-background-100 pointer-events-none absolute bottom-0 left-0 h-[30%] w-full rounded bg-linear-to-t to-transparent opacity-80" />
      )}
      <div className={expanded ? "h-16" : "h-4"} />
      <div className="pointer-events-none absolute bottom-0 left-0 flex h-[calc(100%-160px)] w-full flex-col justify-end">
        <ShowMore
          className="pointer-events-auto sticky bottom-4 mb-4"
          expanded={expanded}
          noBorder
          onClick={() => setExpanded((x) => !x)}
        />
      </div>
    </div>
  );
}

const Row = memo(function Row({ item }: { item: (typeof items)[number] }): JSX.Element {
  return (
    <TableRow>
      <TableCell>{item.product}</TableCell>
      <TableCell>{item.usage}</TableCell>
      <TableCell>{item.price}</TableCell>
      <TableCell>{formatCurrency(item.charge)}</TableCell>
    </TableRow>
  );
});
```

## Best Practices

### When to use

- Use <Table> for tabular data where rows share the same shape and at least one column is sortable or comparable across rows.

- For a row of descriptive content paired with a single action (membership row, integration row), use Entity instead.

- For a key/value metadata block on a detail page, use Description, not a two-column table.

### Behavior

- When the underlying list is empty (filter cleared, never created), render Empty State outside the table rather than an empty <Table.Body>.

- Render — in cells where a value is unknown or not applicable. Don’t substitute N/A, null, or an empty string.

- Sortable column headers are buttons. The visible label stays Title Case; the sort-direction arrow is decorative and the button announces the next sort state to assistive tech.

- Apply tabular-nums (or Geist Mono) to numeric columns so digits align across rows for comparison.

### Content

- Column headers (<Table.Head>) are Title Case nouns or noun phrases: Last Used, Requests (7d), Created, Status. Never sentences.

- Use the canonical short relative-time form in cells (2m ago, 5h ago); switch to Mar 14, 2026 past 7 days. See Relative Time Card.

- Pagination labels are Previous and Next. Page-count copy reads Page 2 of 7 or 21–40 of 142 with an en-dash inside the range.

Was this helpful?
