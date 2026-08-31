# 显示更多

> Route: `/components/show-more`

通过渐进披露触发器展开或折叠内容。

[返回组件](#/components)

# 显示更多

Show More

通过渐进披露触发器展开或折叠内容。

## 何时使用

- 对单个长列表或内容块进行渐进式披露，如最近活动、仓库分支、附件资源等。
- 需要在截断前展示足够多的行数以传达列表形状（通常 5–10 行），让用户了解完整列表的全貌。
- 配合隐藏项数量提示用户展开的成本（“显示 12 条更多”，展开后变为“显示更少”）。

## 何时不应使用

- 同一数据集的平行分页应使用 Pagination 而非 ShowMore；可选区块应使用 Collapse。
- 不要在截断仅 2 行的数据时使用——这会让人感到敷衍。至少展示 5 行再截断。
- 不要在同一数据集中先展开又立即折叠——折叠已展开的行会让阅读位置丢失。

## 示例

### 默认状态

展示 ShowMore 默认的收起外观和触发按钮。

### 展开状态

展示点击后的完全展开效果，触发按钮切换为“显示更少”。

### 无边框变体

展示去掉边框装饰的简洁样式，适用于需要融入页面的场景。

## 无障碍

- 触发按钮必须使用 <button> 元素并设置 aria-expanded，配合 aria-controls 指向目标列表区域。
- 展开后将焦点移动到第一个新揭示的行，以便屏幕阅读器用户和键盘用户快速定位到新增内容。
- 在展开完成后用 aria-live="polite" 通知辅助技术内容的变化。

## 受控行为

- 支持通过受控属性编程式管理展开/收起状态，开发者可决定何时自动展开或折叠。
- 展开动画完成后将焦点转移到第一条新行，确保键盘用户的导航连贯性。

## 响应式行为

- ShowMore 在前置行数较少时仍然展示截断提示，窄屏上每行内容自适应宽度而不会溢出。
- 触发按钮在全屏幕上保持固定的最小尺寸，确保触摸操作的可点性。

## 主题行为

- 按钮颜色、悬停态和高亮跟随 Geist 主题变量，暗色/亮色模式下自动适配。
- 可通过 props 自定义边框颜色和背景，与全局主题保持一致。

## 实时示例

Unitary provides reusable tokens, primitives, and component patterns for building consis…

```tsx
import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function Component() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}
```

```tsx
import { ShowMore } from "@/components/ui/show-more";

<ShowMore expanded />;
```

```tsx
import { ShowMore } from "@/components/ui/show-more";

<ShowMore noBorder />;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ShowMore } from "@/components/ui/show-more";
```

原生属性：`ButtonHTMLAttributes<HTMLButtonElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">expanded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">由文案和箭头反映的受控展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noBorder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">移除触发器边框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MouseEventHandler&lt;HTMLButtonElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">处理展开请求。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单个长列表或区块的渐进揭示用 ShowMore（近期活动、仓库分支、附加资源）。同一数据集的兄弟页面用 Pagination；可选区块用 Collapse。
- 截断前展示足够行数来传达列表形态（通常 5–10）。截到 2 会让该机制显得做作。
- 触发器配隐藏项数量，让用户知道展开的成本（Show 12 More，展开后 Show Less）。两个标签都首字母大写。
- 不要在同一个数据集上中途来回 Show More / Show Less；用户展开后折叠行会把他们从阅读位置滚走。
- 数量少时在 DOM 中渲染隐藏行，让页内查找可用；仅当数据集大到影响初始渲染时才惰性加载。
- 触发器是带 aria-expanded 的 button，并用 aria-controls 指向列表。展开后把焦点移到首个新揭示的行，让屏幕阅读器和键盘用户落在新内容中。
