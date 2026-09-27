# 分类条

> Route: `/charts/category-bar`

渲染分段横向条，展示各部分占总体的比例。

[返回组件](#/components)

# 分类条

category-bar

渲染分段横向条，展示各部分占总体的比例。

## 何时使用

- 占比上下文需要紧凑呈现（如卡片内）。
- 需要标记目标线或阈值（marker）。

## 何时不应使用

- 精确数值或排名——用 BarList。
- 扇区语义或中心指标——用环形图。

## 示例

### 默认分类条

三段占比加目标标记。

## 无障碍

- 累计标签提供数值锚点；marker 带悬停提示。

## 受控行为

不适用: 纯展示组件。

## 响应式行为

- 宽度自适应父容器。

## 主题行为

- 分段色为调色板色；标签文字用语义 token。

## 实时示例

0

62

80

100

```tsx
import { CategoryBar } from "@/components/ui/charts/category-bar";

export function CategoryBarDefault37A8EEC1Example() {
  return (
    <CategoryBar
      values={[62, 18, 20]}
      colors={["blue", "cyan", "gray"]}
      marker={{ value: 78, tooltip: "Target: 78%" }}
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { CategoryBar } from "@/components/ui/category-bar";
```

原生属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">values</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">分段数值；宽度按总和等比分配。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colors</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColorsKeys[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">分段取色顺序。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvailableChartColors</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">marker</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ value: number; tooltip?: string; className?: string }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选标记及其悬停提示。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showLabels</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示累计数值标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr></tbody></table>

## 最佳实践

- 在环形图过重的场景下，用分类条紧凑表达占比结构。
- 数值应归一到有意义的总量；组件按比例渲染分段宽度。
- 分段控制在 3-5 段，保证每段视觉可辨。
