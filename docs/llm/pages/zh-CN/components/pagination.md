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

最基础的分页用法：渲染一组页码链接和一个上一个/下一个轨道，高亮当前活动页，其他页码为普通锚点链接。

## 无障碍

- 当前页通过 isActive 属性渲染，带有 aria-current="page" 属性，屏幕阅读器会标注当前页码。
- 所有页码均为锚点按钮元素，支持键盘导航和回车跳转，确保无障碍用户能够流畅浏览。

## 受控行为

- 通过 activePage 属性控制当前活动页码，父组件可在页码变更时监听回调以更新路由或发起数据请求。
- 总页数可以通过 total 属性传入，组件会根据该值自动渲染对应的页码按钮组。

## 响应式行为

- 在小视口下自动隐藏中间的页码按钮，仅保留第一个、最后一个和当前页附近的按钮以保持布局紧凑。
- Previous / Next 按钮在序列首尾自动隐藏而不过度禁用，空轨道比暗淡的按钮看起来更干净。

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

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">page</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前页。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPageChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收翻页请求。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 兄弟页面间的顺序导航（文档文章、博客帖子、引导步骤）用 Pagination。同一数据集内揭示更多行用 Show More 或数字分页器。
- 作为上一篇/下一篇文档轨使用 Pagination；需要跳到编号页面时用数据表格专用分页器。
- 序列首尾的 Previous / Next 槽位用隐藏而非禁用；空的导轨比一个无处可去的暗淡链接更干净。
- 用 isActive 标记当前页，使其渲染 aria-current="page" 且不渲染为链接。
- 页面标签保持简短——数字或 1–2 个词。不要在链接内复述如 Page 3 of 10 这样的序号位置。
