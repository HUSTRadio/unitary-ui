# 进度环

> Route: `/charts/progress-circle`

用圆环显示完成度或容量占比，中心可放数值和说明。

[返回图表](#/charts)

# 进度环

progress-circle

用圆环显示完成度或容量占比，中心可放数值和说明。

## 何时使用

- 单一比例指标的醒目表达。
- 中心数值 + 副标签的组合场景。

## 何时不应使用

- 表盘式仪表读数——用 Gauge。
- 多段占比——用分类条或环形图。

## 示例

### 默认进度环

显示带宽使用率，并在中心标注百分比。

## 无障碍

- 具体数值作为 children 渲染为文本，不依赖颜色读数。

## 受控行为

不适用: 纯展示组件，进度由 value/max props 决定。

## 响应式行为

- 尺寸由 radius 与 strokeWidth 决定，配合布局容器使用。

## 主题行为

- 轨道使用低对比 token，进度色可从调色板选择。

## 实时示例

75%

Bandwidth used

375 GB of 500 GB

```tsx
import { ProgressCircle } from "@hustradio/unitary-ui";

export function ProgressCircleDefault37A8EEC1Example() {
  return (
    <div className="flex items-center gap-3">
      <ProgressCircle value={75} max={100} radius={40} strokeWidth={6} color="blue">
        <p className="text-copy-14 font-medium text-foreground">75%</p>
      </ProgressCircle>
      <div className="flex flex-col">
        <p className="text-copy-14 font-medium text-foreground">Bandwidth used</p>
        <p className="text-copy-13 text-muted-foreground">375 GB of 500 GB</p>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { ProgressCircle } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前进度值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">max</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视为 100% 的值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">100</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">radius</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆环半径（像素）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">strokeWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆环描边宽度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">6</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆环颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"blue"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">中心内容（数值、标签）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 进度环表达单一比例（完成度、容量）；表盘式指标用 Gauge。
- 把具体数值作为 children 传入，保证不依赖颜色也能读数。
- 轨道使用低对比 token；不要脱离设计系统调色板改色。
