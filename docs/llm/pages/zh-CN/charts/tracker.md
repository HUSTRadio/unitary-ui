# 状态跟踪条

> Route: `/charts/tracker`

用一系列状态块显示可用性、构建结果等事件历史。

[返回图表](#/charts)

# 状态跟踪条

tracker

用一系列状态块显示可用性、构建结果等事件历史。

## 何时使用

- 离散事件历史（uptime、构建结果）。
- 需要紧凑的时间线状态概览。

## 何时不应使用

- 连续指标——用面积图或折线图。
- 需要精确数值标签——用表格。

## 示例

### 默认跟踪条

29 天状态块序列。

## 无障碍

- 每块颜色必须搭配 tooltip 文本，避免仅靠颜色传达语义。

## 受控行为

不适用: 纯展示组件。

## 响应式行为

- 块数量与容器宽度相称，超长横向滚动。

## 主题行为

- 状态色沿用功能色 token；空槽使用低对比色。

## 实时示例

```tsx
import { Tracker } from "@hustradio/unitary-ui";

function createRandomData(days: number) {
  const colors = ["emerald", "amber", "rose"] as const;
  return Array.from({ length: days }, (_, index) => ({
    color: colors[index % 7 === 6 ? (index % 11 === 6 ? 1 : 0) : index % 13 === 5 ? 2 : 0],
    tooltip: `Day ${index + 1}`,
  }));
}

export function TrackerDefault37A8EEC1Example() {
  return <Tracker data={createRandomData(29)} />;
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Tracker } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TrackerBlockProps[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">从左到右渲染的状态块。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的覆盖内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 跟踪条用于离散事件历史（可用性、CI 运行），不适合连续指标。
- 每个状态块颜色搭配 tooltip，避免仅靠颜色传达语义。
- 块数量与容器宽度相称；超长历史可横向滚动。
