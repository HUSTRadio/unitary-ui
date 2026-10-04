# 柱状图

> Route: `/charts/bar-chart`

用柱形比较不同类别的数值，支持堆叠、百分比和横向布局。

[返回图表](#/charts)

# 柱状图

bar-chart

用柱形比较不同类别的数值，支持堆叠、百分比和横向布局。

## 何时使用

- 跨类目比较离散数值。
- 表达份额（percent）或构成（stacked）。
- 类目标签较长时使用垂直布局。

## 何时不应使用

- 连续时间趋势——用面积图或折线图。
- 占比只有两三段且空间紧张——用 CategoryBar。

## 示例

### 默认柱状图

分组双系列，valueFormatter 输出货币。

### 堆叠柱状

type="stacked" 表达平台构成。

### 垂直布局

layout="vertical" 适配长类目标签。

## 无障碍

- 图例与 tooltip 提供数值；颜色仅用于区分系列。
- 柱体与图例均可键盘访问。

## 受控行为

不适用: 展示型组件；onValueChange 仅回报交互选择，不提供受控值。

## 响应式行为

- 宽度自适应；类目过多时建议减少类目或开启 startEndOnly。

## 主题行为

- 网格、坐标轴与提示卡片走语义 token，明暗主题自动适配。

## 实时示例

- sales

- profit

```tsx
import { BarChart } from "@/components/ui/charts/bar-chart";

const chartData = [
  { month: "Jan", sales: 4400, profit: 2605 },
  { month: "Feb", sales: 4305, profit: 2410 },
  { month: "Mar", sales: 5230, profit: 3215 },
  { month: "Apr", sales: 5490, profit: 3460 },
  { month: "May", sales: 6102, profit: 3922 },
  { month: "Jun", sales: 6204, profit: 4015 },
];

export function BarChartDefault37A8EEC1Example() {
  return (
    <BarChart
      data={chartData}
      index="month"
      categories={["sales", "profit"]}
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
    />
  );
}
```

## 堆叠布局

- desktop

- mobile

- embedded

```tsx
import { BarChart } from "@/components/ui/charts/bar-chart";

const chartData = [
  { month: "Jan", desktop: 1243, mobile: 954, embedded: 312 },
  { month: "Feb", desktop: 1101, mobile: 1001, embedded: 367 },
  { month: "Mar", desktop: 1452, mobile: 1213, embedded: 420 },
  { month: "Apr", desktop: 1390, mobile: 1345, embedded: 452 },
  { month: "May", desktop: 1612, mobile: 1490, embedded: 511 },
  { month: "Jun", desktop: 1705, mobile: 1621, embedded: 598 },
];

export function BarChartStacked6B2E8D3AExample() {
  return (
    <BarChart
      className="h-72"
      data={chartData}
      index="month"
      categories={["desktop", "mobile", "embedded"]}
      type="stacked"
    />
  );
}
```

## 垂直

- visits

```tsx
import { BarChart } from "@/components/ui/charts/bar-chart";

const verticalData = [
  { browser: "Chrome", visits: 4245 },
  { browser: "Safari", visits: 2100 },
  { browser: "Firefox", visits: 1301 },
  { browser: "Edge", visits: 876 },
];

export function BarChartVertical9F0A3C5EExample() {
  return (
    <BarChart
      className="h-64"
      data={verticalData}
      index="browser"
      categories={["visits"]}
      layout="vertical"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { BarChart } from "@/components/ui/bar-chart";
```

还支持以下类型中定义的属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每个索引值一条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">类目轴所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染为柱系列的字段名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "stacked" | "percent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">柱状组合模式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal" | "vertical"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">柱状方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"horizontal"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">系列取色顺序。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">格式化坐标轴与提示数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: BarChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报柱 / 图例交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替换内置提示卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 柱状图适合跨类目比较；类目标签较长时改用 layout="vertical"。
- 限制每个系列的类目数量，保证窄容器中柱体仍可读。
- 用 type="percent" 表达份额而非绝对值。
