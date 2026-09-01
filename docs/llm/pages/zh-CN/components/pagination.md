# 分页

> Route: `/components/pagination`

在数据集的编号页面之间导航。

[返回组件](#/components)

# 分页

Pagination

在数据集的编号页面之间导航。

## 何时使用

- 在兄弟页面之间进行顺序导航（如文档文章、博客帖子、引导步骤），用户一次只阅读一页内容。
- 作为上一个/下一个文档导航轨道，当用户需要在系列页面间前进或后退时。

## 何时不应使用

- 如果要揭示同一数据集的更多行数据，应使用 Show More 或编号翻页器而非 Pagination 组件。
- 当用户必须跳转到特定编号页面时，应使用数据表专用的数字翻页器。

## 示例

### 默认分页

最基础的分页用法：用 previous 和 next 渲染相邻页面链接；调用方可在中间 children 区域传入自定义导航内容。

## 无障碍

- 组件渲染带 navigation 标签的 nav；Previous / Next 链接包含方向和目标标题的可访问名称。
- 如通过 children 添加页码或其他导航，调用方负责为当前项设置 aria-current 并保留原生链接语义。

## 受控行为

不适用: Pagination 不管理当前页或总页数；previous、next 和可选 children 全部由调用方根据路由状态传入。

## 响应式行为

- 中间的 children 导航区在 xl 以下隐藏，Previous / Next 轨道链接保持可见。
- 在序列首尾省略对应的 previous 或 next prop，组件会保留两端布局而不渲染不可用链接。

## 主题行为

- 当前页高亮的背景色和文字颜色跟随主题令牌，在深色模式下也保持清晰可辨。
- 分隔符和对齐样式均从主题令牌获取，与整体设计系统保持一致。

## 实时示例

```tsx
import { Pagination } from "@/components/ui/pagination";

<Pagination
  previous={{ title: "Avatar", href: "#/components/avatar" }}
  next={{ title: "Phone", href: "#/components/phone" }}
/>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Pagination } from "@/components/ui/pagination";
```

原生属性：`ComponentProps<"nav">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previous</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">上一页标题与目标地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">next</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">下一页标题与目标地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">宽屏时可选的居中分页内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 兄弟页面间的顺序导航（文档文章、博客帖子、引导步骤）用 Pagination。同一数据集内揭示更多行用 Show More 或数字分页器。
- 作为上一篇/下一篇文档轨使用 Pagination；需要跳到编号页面时用数据表格专用分页器。
- 序列首尾的 Previous / Next 槽位用隐藏而非禁用；空的导轨比一个无处可去的暗淡链接更干净。
- 用 isActive 标记当前页，使其渲染 aria-current="page" 且不渲染为链接。
- 页面标签保持简短——数字或 1–2 个词。不要在链接内复述如 Page 3 of 10 这样的序号位置。
