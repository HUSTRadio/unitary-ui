# 空状态

> Route: `/components/empty-state`

在尚未添加内容或视图为空时填充空间。

[返回组件](#/components)

# 空状态

Empty State

在尚未添加内容或视图为空时填充空间。

## 何时使用

- 列表过滤后返回零条结果时使用 no-results 变体，或资源尚未创建时使用 blank slate。
- 用户访问了其无权查看的路由时，以全屏方式渲染权限不足变体并提供导航建议。
- 数据完成加载后的清空视图或已完成工作的 cleared 状态。

## 何时不应使用

- 不要在 Empty State 中放置关键持续性警告——空状态随列表填充而消失，持续性警告应放在 Note 或页面头部。
- 已加载但有数据的正常视图中不需要 Empty State；异步网络错误的空列表应使用 Error 组件。
- 三个以上的 CTAs 会使空状态变得臃肿——最多一个主行动加一个次行动。

## 示例

### 空状态设计框架

完整的空状态设计方法论——按用户需求选择变体（no-results、blank slate、informational）。

### 空白画布

用户尚未创建任何资源时的初始空状态，搭配一个主 CTA 引导创建。

### 信息型空状态

向用户提供额外上下文信息的空状态变体，帮助理解当前状态而非盲目等待。

## 无障碍

- 异步筛选变更后使用 aria-live="polite" 包裹区域以确保屏幕阅读器播报新状态。
- 标题使用 Title Case；描述使用 sentence case 并补充标题之外的新信息。
- 图标装饰性标记 aria-hidden，真正可访问的名称在文字内容中。

## 受控行为

不适用: Empty State 是展示型组件，根据数据源的有无决定渲染何种空状态，没有受控开关。内容由父组件传入的 props 驱动，不存在 open/close 状态。

## 响应式行为

- CTA 按钮在窄屏下单列堆叠，宽屏中可水平排列。
- 插图尺寸和间距在不同断点下自动缩放以保持可读性。

## 主题行为

- 色彩方案基于语义状态映射——成功绿色、警告琥珀色、错误红色。
- 暗色主题下的插图和文字配色经过专门调优以保证可读性。

## 实时示例

标题

传达产品状态的信息。

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

<EmptyState
  description="A message conveying the state of the product."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
/>;
```

标题

传达产品状态的信息。

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

<EmptyState
  description="A message conveying the state of the product."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
/>;
```

标题

这里应说明你可以在此屏幕执行的操作，以及这些操作的价值。

[了解更多](/)

```tsx
import { Button } from "@/components/ui/button";
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ArrowRight, ChartColumn } from "lucide-react";

<EmptyState
  description="This should detail the actions you can take on this screen, as well as why it’s valuable."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
>
  <Button type="default" typeName="button">
    Primary Action
  </Button>
  <a
    href="/"
    className="inline-flex cursor-pointer items-center gap-0.5 text-label-14 text-muted-foreground no-underline"
  >
    Learn more
    <ArrowRight className="size-4" aria-hidden />
  </a>
</EmptyState>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">说明当前为空的原因。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 按用户所需选择变体：过滤列表返回零行的 no-results、用户尚未创建资源的 blank slate 或 informational、已完成工作的 cleared、加载失败的 error。
- 当用户落在无权查看的路由时，全页渲染权限与套餐拒绝变体。
- 不要在这里放关键持久警告。列表填充后空态会消失；持久警告属于 Note 或页头。
- title 首字母大写；description 句首大写并补充新信息，而非复述标题。
- 最多一个主 CTA 加一个次 CTA。三个 CTA 是坏味道。
- 异步过滤变化后用 aria-live="polite" 包裹区域，让屏幕阅读器播报结果更新。
