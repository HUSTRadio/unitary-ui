# 表格

> Route: `/components/table`

以行列显示结构化数据，便于逐项比较。

[返回组件](#/components)

# 表格

table

以行列显示结构化数据，便于逐项比较。

## 何时使用

- 数据行具有相同形状且至少有一列可在行间排序或比较时使用。
- 需要展示密集的结构化数据（订单列表、成员表、部署日志等）。

## 何时不应使用

- 单行动作配对应使用 Entity 组件而非表格。
- 详情页面的键值元数据块应使用 Description 组件，不要用两列表格冒充。

## 示例

### 基础表格

标准的表头加表体的表格结构，展示核心用法。

### 表格边框变体

通过 Table 的 colorScheme="bordered" 显示行间分隔线。

## 无障碍

- 需要排序时，由调用方在 TableHead 内渲染 button，并自行维护排序状态与 aria-sort。
- 空单元格应填入 — 而不是 N/A 或空字符串，保证表格结构对齐。

## 受控行为

不适用: Table 不提供内置排序状态或排序回调；需要排序时，由调用方在渲染前整理 rows，并自行给表头按钮添加状态和事件。

## 响应式行为

- TableRoot 在内容超宽时提供横向滚动；组件不会自动切换为卡片布局。

## 主题行为

- 表格的背景色、分割线和 hover 高亮都继承主题变量，斑马纹（zebra）可选配。

## 实时示例

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
} from "@hustradio/unitary-ui";

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

## 斑马纹表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hustradio/unitary-ui";

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

## 行间分隔线表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hustradio/unitary-ui";

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

## 带外框表格

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
} from "@hustradio/unitary-ui";

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

## 可交互表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 1</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 2</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Col 3</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr]:transition-colors [&amp;_tr:hover]:bg-gray-100"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 1.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 2.3</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.1</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.2</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Value 3.3</td></tr></tbody></table>

```tsx
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
```

## 完整功能表格

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
```

## 虚拟化表格

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><colgroup class=""><col class="w-[44%]"><col class="w-[22%]"><col class="w-[22%]"><col class="w-[11%]"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400"><tr class="transition-colors data-[state=selected]:bg-gray-100"><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Product</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Usage</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Price</th><th class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Charge</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Headlight Bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">300 bulbs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$15 per bulb</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$4,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Windshield Wipers</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">250 pairs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$20 per pair</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Spark Plugs</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">500 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$5 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,500.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Brake Pads Set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">100 sets</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$50 per set</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Oil Filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">200 filters</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$10 per filter</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$2,000.00</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Car Batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">50 batteries</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">$100 per battery</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 align-middle tabular-nums text-right">$5,000.00</td></tr></tbody></table>

```tsx
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
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

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
} from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MaybeAlign</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">默认的单元格水平和垂直对齐。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowHeight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | "auto"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">固定像素行高或内容自适应行高。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto" | "fit"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">保持响应式列宽，或测量后一次性锁定列宽。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colorScheme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TableColorScheme</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">基础、斑马纹、行间分隔线或可交互行样式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控制 TableRoot 外框；超出圆角范围的内容仍会被裁切。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columnDividers</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为每行第二个及后续单元格添加逻辑 inline-start 列分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerRow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为表头行添加列头 scope 语义。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerCol</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将正文首列渲染为行头。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 行共享同构型且至少一列可排序或可跨行比较的表格数据用 <Table>。
- 一行描述性内容配单个动作（成员行、集成行）用 Entity。
- 详情页的键/值元数据块用 Description，而非两列表格。
- 底层列表为空（过滤清空、从未创建）时，在表格外渲染 Empty State，而非空 <Table.Body>。
- 值未知或不适用时在单元格中渲染 —。不要用 N/A、null 或空字符串替代。
- 可排序列头是按钮。可见标签保持首字母大写；排序方向箭头是装饰性的，按钮向辅助技术播报下一排序状态。
- 数字列用 tabular-nums（或 JetBrains Maple Mono），让数字跨行对齐便于比较。
- 列头（<Table.Head>）是首字母大写名词或名词短语：Last Used、Requests (7d)、Created、Status。绝不是句子。
- 单元格用规范短相对时间形式（2m ago、5h ago）；超过 7 天切换为 Mar 14, 2026。见 Relative Time Card。
- 分页标签是 Previous 和 Next。页码文案写作 Page 2 of 7 或 21–40 of 142，范围内用 en-dash。
