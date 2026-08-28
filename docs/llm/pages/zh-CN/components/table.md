# 表格

> Route: `/components/table`

以行和列显示结构化数据。

[返回组件](#/components)

# 表格

Table

以行和列显示结构化数据。

## 何时使用

-   数据行具有相同形状且至少有一列可在行间排序或比较时使用。
-   需要展示密集的结构化数据（订单列表、成员表、部署日志等）。

## 何时不应使用

-   单行动作配对应使用 Entity 组件而非表格。
-   详情页面的键值元数据块应使用 Description 组件，不要用两列表格冒充。

## 示例

### 基础表格

标准的表头加表体的表格结构，展示核心用法。

### 表格边框变体

通过 border prop 切换是否有边框线的外观差异。

## 无障碍

-   可排序列的头应该是 button 元素，sortable 属性使表头变成可点击的排序按钮。
-   空单元格应填入 — 而不是 N/A 或空字符串，保证表格结构对齐。

## 受控行为

-   sortable 列支持受控排序：通过 sortKey 和 sortOrder 控制当前排序字段和方向。

## 响应式行为

-   窄视图中表格可以启用横向滚动，或切换为卡片堆叠布局以保持可读性。

## 主题行为

-   表格的背景色、分割线和 hover 高亮都继承主题 token，斑马纹（zebra）可选配。

## 实时示例

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

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
    </TableBody>
  </Table>
</TableRoot>
```

## 斑马纹表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
<Table><TableBody striped>…</TableBody></Table>
```

## 带边框表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
<Table><TableBody bordered>…</TableBody></Table>
```

## 可交互表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:transition-colors [&amp;_tr:hover]:bg-gray-100"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
<Table><TableBody interactive>…</TableBody></Table>
```

## 完整功能表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><colgroup class=""><col class="w-[44%]"><col class="w-[22%]"><col class="w-[22%]"><col class="w-[11%]"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Product</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Usage</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Price</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Charge</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200 [&amp;_tr]:transition-colors [&amp;_tr:hover]:bg-gray-100"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Headlight Bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">300 bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$15 per bulb</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$4,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Windshield Wipers</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">250 pairs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$20 per pair</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Spark Plugs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">500 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$5 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,500.00</td></tr></tbody><tfoot class="border-t border-gray-400 font-medium [&amp;&gt;tr]:last:border-b-0"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 text-left align-middle text-gray-1000 font-medium" colspan="3">Subtotal</td><td class="whitespace-nowrap px-2 py-2.5 [&amp;:has([role=checkbox])]:pr-0 align-middle text-gray-1000 font-medium tabular-nums text-right">$24,000.00</td></tr></tfoot></table>

```tsx
<Table>…full featured rows…</Table>
```

## 虚拟化表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><colgroup class=""><col class="w-[44%]"><col class="w-[22%]"><col class="w-[22%]"><col class="w-[11%]"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Product</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Usage</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Price</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Charge</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200 [&amp;_tr]:transition-colors [&amp;_tr:hover]:bg-gray-100"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Headlight Bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">300 bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$15 per bulb</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$4,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Windshield Wipers</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">250 pairs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$20 per pair</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Spark Plugs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">500 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$5 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr></tbody></table>

```tsx
<Table><TableBody interactive striped>…</TableBody></Table>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { TableRoot, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">striped</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">交替行背景。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">bordered</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">增加行分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">interactive</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">启用行悬停反馈。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   行共享同构型且至少一列可排序或可跨行比较的表格数据用 <Table>。
-   一行描述性内容配单个动作（成员行、集成行）用 Entity。
-   详情页的键/值元数据块用 Description，而非两列表格。
-   底层列表为空（过滤清空、从未创建）时，在表格外渲染 Empty State，而非空 <Table.Body>。
-   值未知或不适用时在单元格中渲染 —。不要用 N/A、null 或空字符串替代。
-   可排序列头是按钮。可见标签保持首字母大写；排序方向箭头是装饰性的，按钮向辅助技术播报下一排序状态。
-   数字列用 tabular-nums（或 Geist Mono），让数字跨行对齐便于比较。
-   列头（<Table.Head>）是首字母大写名词或名词短语：Last Used、Requests (7d)、Created、Status。绝不是句子。
-   单元格用规范短相对时间形式（2m ago、5h ago）；超过 7 天切换为 Mar 14, 2026。见 Relative Time Card。
-   分页标签是 Previous 和 Next。页码文案写作 Page 2 of 7 或 21–40 of 142，范围内用 en-dash。
