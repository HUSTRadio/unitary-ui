# 环形图

> Route: `/charts/donut-chart`

用环形或饼形显示各部分占比，环形中心可显示主指标。

[返回图表](#/charts)

# 环形图

donut-chart

用环形或饼形显示各部分占比，环形中心可显示主指标。

## 何时使用

- 占比结构 ≤5 段。
- 中心主指标无需悬停即可读。

## 何时不应使用

- 精确数值比较——柱状图或条形列表更易读。
- 扇区很多——合并为「其他」或改用 BarList。

## 示例

### 默认环形

四城访客占比带中心合计。

### 饼形

variant="pie" 去除中心留白。

## 无障碍

- 扇区与图例均可交互，tooltip 提供精确值。

## 受控行为

不适用: 展示型组件。

## 响应式行为

- 固定 h-40 w-40 方形容器，横向排列时注意留白。

## 主题行为

- 提示卡片与图例走语义 token；扇区色为固定调色板。

## 实时示例

```tsx
import { DonutChart } from "@/components/ui/charts/donut-chart";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartDefault37A8EEC1Example() {
  return (
    <DonutChart
      data={cityData}
      category="name"
      value="value"
      colors={["blue", "cyan", "violet", "amber"]}
    >
      <p className="text-copy-14 font-medium text-foreground">222,707</p>
      <p className="text-copy-13 text-muted-foreground">Total Visitors</p>
    </DonutChart>
  );
}
```

## 饼形

```tsx
import { DonutChart } from "@/components/ui/charts/donut-chart";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartPie7E3C1B6DExample() {
  return (
    <DonutChart
      variant="pie"
      data={cityData}
      category="name"
      value="value"
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
      colors={["blue", "cyan", "violet", "amber"]}
    />
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { DonutChart } from "@/components/ui/donut-chart";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">any[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据记录；每条一个扇区。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">category</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">扇区标签所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">扇区大小所用字段。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"donut" | "pie"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">环形或完整饼形渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"donut"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">格式化提示数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: DonutChartEventProps) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报扇区 / 图例交互。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">中心指标（仅 donut 形态）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">customTooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ComponentType&lt;TooltipProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替换内置提示卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 扇区控制在 5 个以内，其余合并为「其他」。
- 中心内容（数值 + 标签）让主指标无需悬停即可读出。
- 仅在不需要中心指标时使用 variant="pie"。
