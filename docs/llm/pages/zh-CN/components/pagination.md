# 分页

> Route: `/components/pagination`

在数据集的编号页面之间导航。

[返回组件](#/components)

# 分页

pagination

在数据集的编号页面之间导航。

## 何时使用

- 在相邻文档、文章或引导步骤间前进和后退时使用 Pagination。
- 搜索结果、商品列表或数据集需要跳到特定页码时使用 NumberedPagination。

## 何时不应使用

- 揭示同一列表的更多内容时使用 ShowMore。
- 总页数未知且需要连续加载时，使用 LoadMoreButton 或 LazyLoad，而不是数字分页。

## 示例

### 相邻文章导航

Pagination 的 previous/next 提供相邻页面标题及目标链接。

### 数字页码

使用受控页码展示 1、当前页邻居、末页及省略号。

## 无障碍

- Pagination 是带标签的导航区域，链接名称包含目标文章标题。
- NumberedPagination 自动为当前页设置 aria-current="page"；首尾方向按钮会禁用，省略号不可交互。
- 提供 getPageHref 时使用真实链接，保留在新标签页打开的行为；未提供时使用按钮。

## 受控行为

- Pagination 的 previous/next 由路由状态提供。
- NumberedPagination 支持受控 page 或非受控 defaultPage，页码从 1 开始；onPageChange 报告新页码。totalPages 缩小时显示范围会被限制。

## 响应式行为

- Pagination 的 children 居中区在 xl 以下隐藏，相邻文章链接保持可见。
- NumberedPagination 保留首尾页及当前页邻居，用省略号表示较大的间隔；窄屏按钮自然换行。

## 主题行为

- 链接、方向图标、页码和当前页状态使用主题 token。
- Pagination 的自定义 children 链接由调用方设置样式；NumberedPagination 内置当前页样式。

## 实时示例

搜索结果：第 6 页，共 24 页

```tsx
import { useState } from "react";
import { NumberedPagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n";

export default function NumberedExample() {
  const [page, setPage] = useState(6);
  const { locale } = useI18n();
  return (
    <div className="w-full space-y-4">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {locale === "zh-CN"
          ? `搜索结果：第 ${page} 页，共 24 页`
          : `Search results: page ${page} of 24`}
      </p>
      <NumberedPagination totalPages={24} page={page} onPageChange={setPage} />
    </div>
  );
}
```

## 默认

```tsx
import { Pagination } from "@/components/ui/pagination";

export function PaginationDefault21B111CBExample() {
  return (
    <Pagination
      previous={{ title: "Avatar", href: "#/components/avatar" }}
      next={{ title: "Device", href: "#/components/device" }}
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Pagination, NumberedPagination } from "@/components/ui/pagination";
```

原生属性：`ComponentProps<"nav">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.totalPages</code><span class="ml-1 text-destructive">*</span><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">总页数（必填）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.page</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的从 1 起始的当前页。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.defaultPage</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控模式的初始页。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.onPageChange</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">报告选择的新页码。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.siblingCount</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前页两侧邻居页码的数量（0–10）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.getPageHref</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(page: number) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提供真实页面链接；未提供时渲染按钮。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">NumberedPagination.disabled</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用所有翻页控件。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previous</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">上一页标题与目标地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">next</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PaginationRailLink</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">下一页标题与目标地址。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">宽屏时可选的居中分页内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- Pagination 用于相邻文章导航；NumberedPagination 用于搜索结果等数字跳页场景。
- 作为上一篇/下一篇文档轨使用 Pagination；需要跳到编号页面时使用 NumberedPagination。
- 序列首尾的 Previous / Next 槽位用隐藏而非禁用；空的导轨比一个无处可去的暗淡链接更干净。
- 通过 children 添加页码时，由调用方为当前项设置 aria-current="page" 并提供选中样式；Pagination 没有 isActive prop。
- 页面标签保持简短——数字或 1–2 个词。不要在链接内复述如 Page 3 of 10 这样的序号位置。
