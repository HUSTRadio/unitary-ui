# 面积图

> Route: `/charts/area-chart`

渲染分层面积趋势，支持堆叠与百分比变体。

[返回组件](#/components)

# 面积图

Tremor Raw

渲染分层面积趋势，支持堆叠与百分比变体。

## 何时使用

- 展示一个或多个序列随时间的趋势，且希望填充增强量感。
- 需要表达总量（stacked）或份额（percent）而非单序列数值。

## 何时不应使用

- 只需要干净的走势对比——用 LineChart。
- 跨类目比较——用 BarChart。

## 示例

### 默认面积图

双系列渐变填充，valueFormatter 统一货币格式。

### 堆叠面积

type="stacked" 表达渠道构成的总访问量。

### 自定义提示

customTooltip 汇总两系列为合计卡片。

### 图表卡模式

卡片头部承载标题与区间筛选，图表用 customTooltip 输出合计卡片。

## 无障碍

- 数值经由 tooltip 与 valueFormatter 提供，不单靠颜色承载语义。
- 图表容器保留语义化容器类名，可被读屏跳过或标注 aria-label。

## 受控行为

不适用: 图表为展示型组件，内部状态仅用于交互高亮，不提供受控值。

## 响应式行为

- 宽度随 ResponsiveContainer 自适应父容器；示例容器需显式高度（默认 h-80）。

## 主题行为

- 坐标轴、网格与提示卡片使用语义 token，明暗主题自动适配；系列色为固定 9 色调色板。

## 实时示例

- sales

- successfulPayments

```tsx
import { AreaChart } from "@/components/ui/charts/area-chart";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

export function AreaChartDefault37A8EEC1Example() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
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
import { AreaChart } from "@/components/ui/charts/area-chart";

const chartData = [
  { month: "Jan", desktop: 1243, mobile: 954, embedded: 312 },
  { month: "Feb", desktop: 1101, mobile: 1001, embedded: 367 },
  { month: "Mar", desktop: 1452, mobile: 1213, embedded: 420 },
  { month: "Apr", desktop: 1390, mobile: 1345, embedded: 452 },
  { month: "May", desktop: 1612, mobile: 1490, embedded: 511 },
  { month: "Jun", desktop: 1705, mobile: 1621, embedded: 598 },
];

export function AreaChartStacked5E4F2A9BExample() {
  return (
    <AreaChart
      className="h-72"
      data={chartData}
      index="month"
      categories={["desktop", "mobile", "embedded"]}
      type="stacked"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
```

## 自定义提示

- sales

- successfulPayments

```tsx
import { AreaChart, type TooltipProps } from "@/components/ui/charts/area-chart";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, item) => sum + (item.value ?? 0), 0);
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground tabular-nums">
        Total:{" "}
        <span className="font-medium text-foreground">{Intl.NumberFormat("us").format(total)}</span>
      </p>
    </div>
  );
}

export function AreaChartCustomTooltip8C1D4E7FExample() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
      customTooltip={CustomTooltip}
    />
  );
}
```

## 图表卡片

### Sessions by device

Desktop and mobile sessions, last 6 months

- desktop

- mobile

```tsx
import * as React from "react";

import { AreaChart, type TooltipProps } from "@/components/ui/charts/area-chart";
import { getColorClassName } from "@/components/ui/charts/chart-colors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 图表卡模式：卡片头部承载标题与区间筛选，图表用 customTooltip 输出合计卡片。
 * 数据与筛选逻辑都在示例内，组件本身保持展示型契约。
 */

const SERIES = [
  { month: "Jan", desktop: 1860, mobile: 1240 },
  { month: "Feb", desktop: 2010, mobile: 1390 },
  { month: "Mar", desktop: 2240, mobile: 1610 },
  { month: "Apr", desktop: 2120, mobile: 1740 },
  { month: "May", desktop: 2480, mobile: 1980 },
  { month: "Jun", desktop: 2690, mobile: 2210 },
  { month: "Jul", desktop: 2810, mobile: 2350 },
  { month: "Aug", desktop: 3040, mobile: 2520 },
];

const RANGES = [
  { id: "3m", label: "3 months", months: 3 },
  { id: "6m", label: "6 months", months: 6 },
  { id: "all", label: "All time", months: SERIES.length },
] as const;

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

/** 合计提示卡：把两条系列汇总成一个总量 + 明细行。 */
function TotalTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-13 shadow-[var(--material-shadow-menu)]">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground">
        Sessions <span className="ml-2 font-medium tabular-nums text-foreground">{total}</span>
      </p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((item) => (
          <li key={item.category} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", getColorClassName(item.color, "bg"))}
            />
            <span className="text-muted-foreground">{item.category}</span>
            <span className="ml-auto tabular-nums text-foreground">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AreaChartChartCardE6B2D9F1Example() {
  const [rangeId, setRangeId] = React.useState<(typeof RANGES)[number]["id"]>("6m");
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[1];
  const data = SERIES.slice(-range.months);

  return (
    <article className="rounded-lg border border-border bg-background-100">
      <header className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-label-16 font-medium text-foreground">Sessions by device</h3>
          <p className="mt-0.5 text-copy-13 text-muted-foreground">
            Desktop and mobile sessions, last {range.months} months
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((item) => (
            <Button
              key={item.id}
              typeName="button"
              size="small"
              type={item.id === rangeId ? "secondary" : "tertiary"}
              aria-pressed={item.id === rangeId}
              onClick={() => setRangeId(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </header>
      <div className="p-4">
        <AreaChart
          key={range.id}
          data={data}
          index="month"
          categories={["desktop", "mobile"]}
          colors={["blue", "violet"]}
          valueFormatter={(value) => compact.format(value)}
          customTooltip={TotalTooltip}
          className="h-72"
        />
      </div>
    </article>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { AreaChart } from "@/components/ui/area-chart";
```

原生属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每个索引值一条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">x 轴所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染为面积系列的字段名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">系列取色顺序。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "stacked" | "percent"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">系列组合模式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fill</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gradient" | "solid" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面积填充形态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gradient"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">格式化坐标轴与提示数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: AreaChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报数据点 / 图例交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替换内置提示卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 面积图适合表达时间趋势的构成；当总量或占比比单系列更重要时，切换 type="stacked" 或 "percent"。
- 给图表容器显式高度（默认 h-80），避免 ResponsiveContainer 塌缩为零高。
- 提供 valueFormatter 统一单位或货币格式，让坐标轴与提示保持一致。
