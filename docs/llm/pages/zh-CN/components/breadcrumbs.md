# 面包屑

> Route: `/components/breadcrumbs`

显示用户在网站层级中当前位置的导航辅助。

[返回组件](#/components)

# 面包屑

Breadcrumbs

显示用户在网站层级中当前位置的导航辅助。

## 何时使用

-   在具有多层级结构的应用中展示面包屑导航，帮助用户理解当前所在位置并快速跳转至上层节点。
-   当 URL 路径反映了资源的层级关系时（如 /projects/space/documents），面包屑是自然的同步展现方式。
-   在页面标题上方放置面包屑，作为标题的前置上下文引导。

## 何时不应使用

-   不要在扁平结构中滥用面包屑——如果只有两层路径，简单的页面导航菜单就足够了。
-   不要将面包屑用于过滤器和排序选项的展示——它们不是层级关系，应使用过滤器栏或标签切换。
-   不要在移动端强制展示完整面包屑链——空间有限时应裁剪为非核心层级或使用抽屉式导航。

## 示例

### 默认面包屑

展示默认的面包屑导航，包含分隔符和多级层级。

### 激活状态

展示最后一项的激活/禁用样式，标识当前所在路径。

## 无障碍

-   面包屑包裹在 <nav> 元素中并带有 aria-label='Breadcrumb' 角色，帮助屏幕阅读器识别。
-   当前页面的最后一个条目（激活态）不应是可链接的，应设置为 aria-current='page'。
-   禁用态的面包屑项仍保留在 DOM 中但跳过 tabindex，确保键盘导航的一致性。

## 受控行为

不适用: 面包屑是展示型的导航指示器，由路由状态驱动渲染；本身不接受受控属性或交互控制。

## 响应式行为

-   面包屑在窄屏上自动截断中间层级（Home › ... › Current），保持最末端的当前位置可见。
-   分隔符在各屏幕尺寸下保持一致的间距比例，确保可读性不因缩放而受损。

## 主题行为

-   面包屑的文字颜色、悬停态和当前页高亮跟随主题变量的文本色板和焦点指示。
-   分隔符的颜色也来自主题变量，确保在暗色/亮色模式下均有足够的对比度。

## 实时示例

## 默认

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<div className="flex w-full max-w-md flex-col gap-4">
  <Breadcrumb type="text">
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
    <BreadcrumbItem>Overview</BreadcrumbItem>
  </Breadcrumb>
  <Breadcrumb type="menu">
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
    <BreadcrumbItem>Overview</BreadcrumbItem>
  </Breadcrumb>
</div>
```

## 激活

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<Breadcrumb>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem active>Dashboard</BreadcrumbItem>
  <BreadcrumbItem>Overview</BreadcrumbItem>
</Breadcrumb>
```

## 禁用

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

<Breadcrumb>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
  <BreadcrumbItem>Overview</BreadcrumbItem>
</Breadcrumb>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">条目的导航目标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
