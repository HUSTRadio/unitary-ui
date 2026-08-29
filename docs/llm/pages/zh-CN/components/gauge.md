# 仪表

> Route: `/components/gauge`

用于表示百分比的圆形可视化。

[返回组件](#/components)

# 仪表

Gauge

用于表示百分比的圆形可视化。

## 何时使用

- 在固定最大值的 0–100 比率中传达数值，例如配额使用率、构建缓存命中率、运行时间或计费周期消耗。
- 需要一个紧凑的视觉指标来替代数字文本以快速扫描页面时。
- 与进度条相比，这里关注的是整体容量中的占比而非任务完成进度。

## 何时不应使用

- 确定性的任务进度（如文件上传、多步设置）应使用 Progress，因为它有已知总量和明确的完成语义。
- 二元或枚举状态请使用 Status Dot（部署状态）或 Badge（其他元数据），而非环形仪表。

## 示例

### 带标签的仪表盘

最基本的用法：传入一个百分比值并配以描述性标签，让屏幕阅读器和可见读者都能理解该数值所代表的含义。

### 自定义颜色范围

通过定义分段阈值来自定义弧线的颜色分布，适用于需要语义化分段的场景，如配额用量进入警告区间时改变色调。

### 弧线优先级

在同一组件上渲染多条弧线以展示多个度量，外圈覆盖内圈，用于同时呈现主指标与辅助指标的场景。

### 不确定状态

当数据正在加载且具体百分比尚不可用时，用不确定的旋转动画代替静态弧线，向用户传达系统仍在处理中。

## 无障碍

- 组件设置 role="progressbar"，并提供 aria-valuemin、aria-valuemax 和 aria-valuenow 属性，屏幕阅读器会正确播报当前进度。
- 必须始终为仪表盘搭配相邻标签或 Tooltip 来说明数值代表的内容；仅靠图形是自我说明不足的。

## 受控行为

不适用: Gauge 是一个纯展示型组件，只负责渲染给定的百分比值和颜色配置，没有内部交互状态概念。父组件通过传递 value 和其他 props 直接控制其外观。

## 响应式行为

- 仪表盘弧线会在不同视口下自动适配宽度，确保在任何屏幕上都能清晰可读。
- 标签文字大小跟随容器缩放，在小屏设备上保持适当的对比度和可读性。

## 主题行为

- 弧线颜色和背景色遵循当前主题的颜色令牌，包括深色模式下的自动适配。
- 支持自定义渐变和描边颜色，可与设计系统的主题变量配合实现品牌一致性。

## 实时示例

## 标签

80

100

80

100

80

100

```tsx
import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
  <Gauge showValue size="tiny" value={80} />
  <Gauge showValue size="small" value={80} />
  <Gauge showValue size="small" value={100} />
  <Gauge showValue size="medium" value={80} />
  <Gauge showValue size="medium" value={100} />
  <Gauge showValue size="large" value={80} />
  <Gauge showValue size="large" value={100} />
</div>;
```

## 默认颜色刻度

```tsx
import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-8">
  <Gauge size="small" value={14} />
  <Gauge size="small" value={34} />
  <Gauge size="small" value={68} />
</div>;
```

## 自定义颜色范围

```tsx
import { Gauge } from "@/components/ui/gauge";

const PINK_SCALE = {
  "0": "var(--pink-100)",
  "10": "var(--pink-200)",
  "20": "var(--pink-300)",
  "30": "var(--pink-400)",
  "50": "var(--pink-500)",
  "60": "var(--pink-600)",
  "70": "var(--pink-700)",
  "80": "var(--pink-800)",
  "90": "var(--pink-900)",
  "100": "var(--pink-1000)",
};

<div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
    <Gauge key={value} colors={PINK_SCALE} size="small" value={value} />
  ))}
</div>;
```

## 自定义辅助颜色

```tsx
import { Gauge } from "@/components/ui/gauge";

<div className="flex justify-start">
  <Gauge
    colors={{ primary: "var(--blue-700)", secondary: "var(--blue-300)" }}
    size="medium"
    value={50}
  />
</div>;
```

## 弧线优先级

50

```tsx
import { Gauge } from "@/components/ui/gauge";

<div className="flex justify-start">
  <Gauge
    arcPriority="equal"
    colors={{ primary: "var(--blue-700)", secondary: "var(--red-700)" }}
    showValue
    size="medium"
    value={50}
  />
</div>;
```

## 半选

```tsx
import { Gauge } from "@/components/ui/gauge";

<div className="flex flex-row flex-wrap items-stretch justify-start gap-2">
  <Gauge indeterminate size="tiny" value={25} />
  <Gauge indeterminate size="small" value={25} />
  <Gauge indeterminate size="medium" value={25} />
  <Gauge indeterminate size="large" value={25} />
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Gauge } from "@/components/ui/gauge";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前数值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">max</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">上限。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">100</td></tr></tbody></table>

## 最佳实践

- 对固定最大值做 0–100 比率、且比较是重点的场合（配额用量、构建缓存命中率、可用性、计费周期消耗）用 Gauge。
- 有已知总量的确定性任务进度（上传、多步设置）用 Progress。
- 二进制或枚举状态用 Status Dot（部署）或 Badge（其余）。
- 始终在 gauge 旁放相邻标签或 Tooltip，说明数字代表什么（Build Cache Hit Rate）。单独一个 gauge 无法自我描述。
- 不要把单位放进 children；标签承载单位（Uptime · 99.97%）。children 保留给图标覆盖层。
- 组件设置 role="progressbar" 及 aria-valuemin、aria-valuemax、aria-valuenow；不要覆盖它们。
