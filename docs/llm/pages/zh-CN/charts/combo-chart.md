# 组合图

> Route: `/charts/combo-chart`

在同一图表中组合柱与折线系列，可选双轴。

[返回组件](#/components)

# 组合图

combo-chart

在同一图表中组合柱与折线系列，可选双轴。

## 何时使用

- 两个相关指标共享同一类目轴（如收入与利润率）。
- 两系列数值范围不可比时开启 enableBiaxial。

## 何时不应使用

- 指标多于两条主线——拆成多图或用图卡组合。
- 只需要单一图表形态——直接用 BarChart / LineChart。

## 示例

### 默认组合

柱（收入）+ 线（成本）共轴。

### 双轴

enableBiaxial 让金额与百分比共存。

## 无障碍

- 图例形状区分柱与线；数值经 tooltip 提供。

## 受控行为

不适用: 展示型组件。

## 响应式行为

- 宽度自适应；双轴时右轴标签占位，注意窄屏留白。

## 主题行为

- 网格、轴与提示卡片走语义 token。

## 实时示例

- revenue

- operatingCosts

```tsx
import { ComboChart } from "@/components/ui/charts/combo-chart";

const chartData = [
  { month: "Jan", revenue: 4400, operatingCosts: 2205 },
  { month: "Feb", revenue: 4305, operatingCosts: 2310 },
  { month: "Mar", revenue: 5230, operatingCosts: 2144 },
  { month: "Apr", revenue: 5490, operatingCosts: 2360 },
  { month: "May", revenue: 6102, operatingCosts: 2278 },
  { month: "Jun", revenue: 6204, operatingCosts: 2465 },
];

export function ComboChartDefault37A8EEC1Example() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["operatingCosts"],
        colors: ["amber"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
    />
  );
}
```

## 双轴

- revenue

- margin

```tsx
import { ComboChart } from "@/components/ui/charts/combo-chart";

const chartData = [
  { month: "Jan", revenue: 4400, margin: 0.18 },
  { month: "Feb", revenue: 4305, margin: 0.16 },
  { month: "Mar", revenue: 5230, margin: 0.21 },
  { month: "Apr", revenue: 5490, margin: 0.24 },
  { month: "May", revenue: 6102, margin: 0.26 },
  { month: "Jun", revenue: 6204, margin: 0.25 },
];

export function ComboChartBiaxial2A9F5C3EExample() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      enableBiaxial
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["margin"],
        colors: ["emerald"],
        valueFormatter: (value) => `${(value * 100).toFixed(0)}%`,
      }}
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ComboChart } from "@/components/ui/combo-chart";
```

原生属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每个索引值一条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">类目轴所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">barSeries</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChartSeries &amp; { type?: "default" | "stacked" }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">柱系列配置（categories、colors、valueFormatter、轴）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">lineSeries</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChartSeries &amp; { connectNulls?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">折线系列配置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">enableBiaxial</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将折线系列渲染到第二 y 轴。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: ComboChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报柱 / 数据点 / 图例交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替换内置提示卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 两个相关指标（如收入与利润率）共享同一类目轴时使用组合图。
- 两个系列数值范围不可比时开启 enableBiaxial。
- 为两个系列显式配色，保证图例与提示可区分。
