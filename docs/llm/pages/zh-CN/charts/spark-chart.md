# 迷你趋势图

> Route: `/charts/spark-chart`

用迷你面积图、折线图或柱状图显示卡片和表格中的趋势。

[返回图表](#/charts)

# 迷你趋势图

spark-chart

用迷你面积图、折线图或柱状图显示卡片和表格中的趋势。

## 何时使用

- 在紧凑空间传达单一序列的走势方向。
- 与显式数值配对使用（数值负责精确，小图负责形状）。

## 何时不应使用

- 需要坐标轴、图例或 tooltip 的完整图表场景。
- 多系列对比。

## 示例

### 三种迷你图

面积、折线、柱形三列并排展示。

### KPI 统计卡模式

指标大字号 + 趋势微图 + 涨跌标注，第三张卡用环形微图表达占比。

## 无障碍

- 迷你图不承载精确数值，须搭配文本数值；可用 aria-label 标注趋势摘要。

## 受控行为

不适用: 展示型组件。

## 响应式行为

- 宽度自适应父容器，高度固定紧凑。

## 主题行为

- 颜色沿用图表调色板，容器无底色依赖。

## 实时示例

Visitors

+15.3% vs last half

Revenue

$4,012 this month

Orders

1,705 orders

```tsx
import { SparkAreaChart, SparkBarChart, SparkLineChart } from "@/components/ui/charts/spark-chart";

const visitorsData = [
  { month: "Jan", visitors: 3911 },
  { month: "Feb", visitors: 4011 },
  { month: "Mar", visitors: 4120 },
  { month: "Apr", visitors: 3890 },
  { month: "May", visitors: 4321 },
  { month: "Jun", visitors: 4510 },
];

const revenueData = [
  { month: "Jan", revenue: 2900 },
  { month: "Feb", revenue: 2755 },
  { month: "Mar", revenue: 3322 },
  { month: "Apr", revenue: 3410 },
  { month: "May", revenue: 3870 },
  { month: "Jun", revenue: 4012 },
];

const ordersData = [
  { month: "Jan", orders: 1243 },
  { month: "Feb", orders: 1101 },
  { month: "Mar", orders: 1452 },
  { month: "Apr", orders: 1390 },
  { month: "May", orders: 1612 },
  { month: "Jun", orders: 1705 },
];

export function SparkChartDefault37A8EEC1Example() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Visitors</p>
        <SparkAreaChart
          data={visitorsData}
          index="month"
          categories={["visitors"]}
          colors={["blue"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">+15.3% vs last half</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Revenue</p>
        <SparkLineChart
          data={revenueData}
          index="month"
          categories={["revenue"]}
          colors={["emerald"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">$4,012 this month</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Orders</p>
        <SparkBarChart
          data={ordersData}
          index="month"
          categories={["orders"]}
          colors={["violet"]}
        />
        <p className="text-copy-13 text-muted-foreground tabular-nums">1,705 orders</p>
      </div>
    </div>
  );
}
```

## 指标卡组合

Monthly recurring revenue

$48,120

+12.4%vs. last month

New signups

351

+9.1%vs. last month

Spend by service

- Compute62%
- Storage38%

```tsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { DonutChart } from "@/components/ui/charts/donut-chart";
import { SparkAreaChart, SparkBarChart } from "@/components/ui/charts/spark-chart";
import { cn } from "@/lib/utils";

/**
 * KPI 统计卡模式：指标值大字号 + 趋势微图 + 涨跌标注。
 * 只借鉴组合模式，容器与排版全部走本项目 token 与语义类。
 */

const REVENUE = [
  { week: "W1", revenue: 3980 },
  { week: "W2", revenue: 4210 },
  { week: "W3", revenue: 4090 },
  { week: "W4", revenue: 4460 },
  { week: "W5", revenue: 4720 },
  { week: "W6", revenue: 4812 },
];

const SIGNUPS = [
  { week: "W1", signups: 212 },
  { week: "W2", signups: 268 },
  { week: "W3", signups: 241 },
  { week: "W4", signups: 296 },
  { week: "W5", signups: 322 },
  { week: "W6", signups: 351 },
];

const STORAGE = [
  { name: "Compute", value: 62 },
  { name: "Storage", value: 38 },
];

function Trend({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <p
      className={cn(
        "mt-1 inline-flex items-center gap-1 text-copy-13 font-medium",
        positive ? "text-success" : "text-danger",
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-4" aria-hidden />
      ) : (
        <ArrowDownRight className="size-4" aria-hidden />
      )}
      <span className="tabular-nums">
        {positive ? "+" : "−"}
        {Math.abs(delta)}%
      </span>
      <span className="font-normal text-muted-foreground">vs. last month</span>
    </p>
  );
}

export function SparkChartKpiCardC3F1A8D4Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Monthly recurring revenue</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">$48,120</p>
        <Trend delta={12.4} />
        <div className="mt-3 h-12">
          <SparkAreaChart data={REVENUE} index="week" categories={["revenue"]} colors={["blue"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">New signups</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">351</p>
        <Trend delta={9.1} />
        <div className="mt-3 h-12">
          <SparkBarChart data={SIGNUPS} index="week" categories={["signups"]} colors={["violet"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Spend by service</p>
        <div className="mt-2 flex items-center gap-4">
          <DonutChart
            data={STORAGE}
            category="name"
            value="value"
            colors={["blue", "violet"]}
            showTooltip={false}
            className="h-20 w-20 shrink-0"
          />
          <ul className="min-w-0 space-y-1 text-copy-13">
            {STORAGE.map((slice, index) => (
              <li key={slice.name} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    index === 0 ? "bg-blue-500" : "bg-violet-500",
                  )}
                />
                <span className="truncate text-muted-foreground">{slice.name}</span>
                <span className="ml-auto tabular-nums text-foreground">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { SparkAreaChart, SparkLineChart, SparkBarChart } from "@/components/ui/spark-chart";
```

还支持以下类型中定义的属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, any&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每个索引值一条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">index</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">x 轴所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">categories</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">单系列字段名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">系列颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr></tbody></table>

## 最佳实践

- 迷你趋势图用于卡片和表格单元格内，不作为独立图表使用。
- 每个迷你图只保留一个系列；多系列会破坏紧凑形态。
- 搭配显式数值，让形状不必承担精确数字的表达。
