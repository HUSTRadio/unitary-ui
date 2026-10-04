# 条形列表

> Route: `/charts/bar-list`

按数值排列名称、条形和读数，条目可带链接和图标。

[返回图表](#/charts)

# 条形列表

bar-list

按数值排列名称、条形和读数，条目可带链接和图标。

## 何时使用

- 需要行上下文（名称 + 数值 + 链接）的排名比较。
- 页面流量、来源榜等榜单场景。

## 何时不应使用

- 占比结构——用环形图或分类条。
- 连续趋势——用迷你趋势图。

## 示例

### 默认条形列表

页面访问量排行，数值格式化输出。

## 无障碍

- 名称与数值均为文本，读屏可读；颜色仅装饰。

## 受控行为

不适用: 纯展示组件。

## 响应式行为

- 宽度自适应；名称过长自动截断省略。

## 主题行为

- 文本与条形底色走语义 token。

## 实时示例

/home

/discover

/checkout

/search

/account

123,456

98,765

76,543

54,321

23,456

```tsx
import { BarList } from "@/components/ui/charts/bar-list";

const pagesData = [
  { name: "/home", value: 123456 },
  { name: "/discover", value: 98765 },
  { name: "/checkout", value: 76543 },
  { name: "/search", value: 54321 },
  { name: "/account", value: 23456 },
];

export function BarListDefault37A8EEC1Example() {
  return (
    <BarList
      data={pagesData}
      color="gray"
      valueFormatter={(value) => Intl.NumberFormat("us").format(value).toString()}
    />
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { BarList } from "@/components/ui/bar-list";
```

还支持以下类型中定义的属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ name: string; value: number; href?: string; icon?: React.ElementType; key?: string }[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">待渲染的排名条目。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">条形颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gray"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">valueFormatter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">格式化行尾数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showAnimation</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">挂载时播放条形动画。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sortOrder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"ascending" | "descending" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按数值排序条目。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"descending"</td></tr></tbody></table>

## 最佳实践

- 排名比较需要行上下文（名称 + 数值 + 链接）时使用条形列表。
- 提供 valueFormatter 以输出货币、百分比等单位。
- showAnimation 谨慎使用；静态条形已足够且降低动效开销。
