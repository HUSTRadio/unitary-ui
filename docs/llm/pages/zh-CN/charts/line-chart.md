# 折线图

> Route: `/charts/line-chart`

渲染连续折线趋势，支持可选坐标轴标题。

[返回组件](#/components)

# 折线图

line-chart

渲染连续折线趋势，支持可选坐标轴标题。

## 何时使用

- 连续趋势且不希望面积填充带来量感干扰。
- 需要标注坐标轴语义（xAxisLabel / yAxisLabel）。

## 何时不应使用

- 强调构成或总量——用面积图。
- 类目比较——用柱状图。

## 示例

### 默认折线

双指标趋势带坐标轴标题。

### 自定义提示

customTooltip 输出自定义样式的数值卡。

## 无障碍

- 数值由 tooltip 与格式化器提供，颜色不单独承载语义。

## 受控行为

不适用: 展示型组件。

## 响应式行为

- 宽度自适应父容器；容器需显式高度。

## 主题行为

- 坐标轴、网格与提示卡片使用语义 token。

## 实时示例

- temperature

- precipitation

```tsx
import { LineChart } from "@/components/ui/charts/line-chart";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

export function LineChartDefault37A8EEC1Example() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      valueFormatter={(value) => `${value.toFixed(1)} units`}
      xAxisLabel="Month"
      yAxisLabel="Measurement"
    />
  );
}
```

## 自定义提示

- temperature

- precipitation

```tsx
import { LineChart, type TooltipProps } from "@/components/ui/charts/line-chart";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.category} className="mt-1 flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-xs bg-blue-500" aria-hidden="true" />
          {item.category}:{" "}
          <span className="font-medium text-foreground tabular-nums">{item.value?.toFixed(1)}</span>
        </p>
      ))}
    </div>
  );
}

export function LineChartCustomTooltip4D7B2E8AExample() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      customTooltip={CustomTooltip}
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { LineChart } from "@/components/ui/line-chart";
```

原生属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每个索引值一条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">x 轴所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染为折线的字段名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">connectNulls</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">跨接系列中的缺失值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">xAxisLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的 x 轴标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">yAxisLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的 y 轴标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">格式化坐标轴与提示数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: LineChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报数据点 / 图例交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替换内置提示卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 趋势连续但不需要面积填充时使用折线图，避免面积图带来的视觉噪音。
- 当索引值本身不足以说明维度时，补充 xAxisLabel / yAxisLabel。
- 系列数量控制在 2-4 条；更多时考虑分面或表格。
