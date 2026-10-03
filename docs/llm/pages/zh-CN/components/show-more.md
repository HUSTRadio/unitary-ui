# 显示更多

> Route: `/components/show-more`

用按钮请求展开或收起内容；内容本身由页面管理。

[返回组件](#/components)

# 显示更多

show-more

用按钮请求展开或收起内容；内容本身由页面管理。

## 何时使用

- 对单个长列表或内容块进行按需展开，如最近活动、仓库分支、附件资源等。
- 需要在截断前展示足够多的行数以传达列表形状（通常 5–10 行），让用户了解完整列表的全貌。
- 组件文案固定为“显示更多”/“显示更少”；如需提示隐藏项数量，应在相邻内容中由调用方展示。

## 何时不应使用

- 同一数据集的平行分页应使用 Pagination 而非 ShowMore；可选区块应使用 Collapse。
- 短列表直接显示；较长列表可先显示 5–10 行再提供展开按钮。
- 展开后不要自动收起，避免打断用户的阅读位置。

## 示例

### 默认状态

展示 ShowMore 默认的收起外观和触发按钮。

### 展开状态

展示点击后的完全展开效果，触发按钮切换为“显示更少”。

### 无边框变体

展示去掉边框装饰的简洁样式，适用于需要融入页面的场景。

## 无障碍

- 触发按钮必须使用 <button> 元素并设置 aria-expanded，配合 aria-controls 指向目标列表区域。
- 组件提供原生 button 和 aria-expanded；调用方应通过 aria-controls 将它关联到被展开的内容区域。
- 组件不会移动焦点或创建 live region；如果新增内容必须被主动播报，应由调用方在内容区域实现。

## 受控行为

- expanded 决定按钮文案、箭头方向和 aria-expanded；onClick 等原生按钮事件由调用方更新外部状态。
- 组件只渲染触发器，不管理目标内容、展开动画或焦点位置。

## 响应式行为

不适用: ShowMore 只渲染固定 32px 高的触发按钮，不管理目标行的布局或断点行为；目标内容的响应式布局由调用方负责。

## 主题行为

- 按钮颜色、悬停态和高亮跟随 Unitary 主题变量，暗色/亮色模式下自动适配。
- noBorder 只移除默认边框；没有专用的边框色或背景色 prop，额外视觉调整通过 className 完成。

## 实时示例

```tsx
import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function ShowMoreDefault21B111CBExample() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
```

## 展开

```tsx
import { ShowMore } from "@/components/ui/show-more";

export function ShowMoreExpandedE72D5D8DExample() {
  return <ShowMore expanded />;
}
```

## 无边框

```tsx
import { ShowMore } from "@/components/ui/show-more";

export function ShowMoreNoBorder5DEDD0A8Example() {
  return <ShowMore noBorder />;
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { ShowMore } from "@/components/ui/show-more";
```

还支持以下类型中定义的属性：`ButtonHTMLAttributes<HTMLButtonElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">expanded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">由文案和箭头反映的受控展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noBorder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">移除触发器边框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MouseEventHandler&lt;HTMLButtonElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">处理展开请求。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单个长列表或区块的渐进揭示用 ShowMore（近期活动、仓库分支、附加资源）。同一数据集的兄弟页面用 Pagination；可选区块用 Collapse。
- 截断前展示足够行数来传达列表形态（通常 5–10）。截到 2 会让该机制显得做作。
- ShowMore 使用固定的 Show More / Show Less 文案；隐藏项数量需要在相邻的调用方内容中展示。
- 不要在同一个数据集上中途来回 Show More / Show Less；用户展开后折叠行会把他们从阅读位置滚走。
- 数量少时在 DOM 中渲染隐藏行，让页内查找可用；仅当数据集大到影响初始渲染时才惰性加载。
- 触发器是带 aria-expanded 的 button；通过 aria-controls 指向被展开的区域。ShowMore 不管理目标内容、焦点移动或 live region。
