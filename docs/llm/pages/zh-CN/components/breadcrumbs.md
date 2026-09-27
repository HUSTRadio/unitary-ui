# 面包屑

> Route: `/components/breadcrumbs`

显示用户在网站层级中当前位置的导航辅助。

[返回组件](#/components)

# 面包屑

breadcrumbs

显示用户在网站层级中当前位置的导航辅助。

## 何时使用

- 在具有多层级结构的应用中展示面包屑导航，帮助用户理解当前所在位置并快速跳转至上层节点。
- 当 URL 路径反映了资源的层级关系时（如 /projects/space/documents），面包屑是自然的同步展现方式。
- 在页面标题上方放置面包屑，作为标题的前置上下文引导。

## 何时不应使用

- 不要在扁平结构中滥用面包屑——如果只有两层路径，简单的页面导航菜单就足够了。
- 不要将面包屑用于过滤器和排序选项的展示——它们不是层级关系，应使用过滤器栏或标签切换。
- 不要在移动端强制展示完整面包屑链——空间有限时应裁剪为非核心层级或使用抽屉式导航。

## 示例

### 默认面包屑

以 type='text'（<nav> 列表 + 分隔符）与 type='menu'（芯片按钮组）两种变体呈现同一组层级。

### 激活状态

展示最后一项的激活/禁用样式，标识当前所在路径。

## 无障碍

- type='text'（默认）渲染带 aria-label='Breadcrumb' 的 <nav>；type='menu' 渲染带 role='navigation' 与同一 aria-label 的 <div>，两者都对屏幕阅读器暴露为导航区域。
- active 会在条目上设置 aria-current='page'；若同时传入 href，条目仍会渲染为链接。需要不可点击的当前页时应省略 href。
- 禁用态的面包屑项仍保留在 DOM 中但跳过 tabindex，确保键盘导航的一致性。

## 受控行为

不适用: 面包屑是展示型的导航指示器，由路由状态驱动渲染；本身不接受受控属性或交互控制。

## 响应式行为

- 窄屏下组件保持单行并允许横向滚动；如需省略中间层级，调用方应显式构造对应条目。
- 分隔符在各屏幕尺寸下保持一致的间距比例，确保可读性不因缩放而受损。

## 主题行为

- 面包屑的文字颜色、悬停态和当前页高亮跟随主题变量的文本色板和焦点指示。
- 分隔符的颜色也来自主题变量，确保在暗色/亮色模式下均有足够的对比度。

## 实时示例

[Home](#/)[Dashboard](#/components)[Overview](#/components/breadcrumbs)

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Breadcrumb type="text">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb type="menu">
        <BreadcrumbItem href="#/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#/components">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#/components/breadcrumbs">Overview</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
```

## 激活

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsActive92340695Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem active>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## 禁用

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function BreadcrumbsDisabled75081B59Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Overview</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"text" | "menu"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">"text"：渲染 &lt;nav&gt; 与 chevron 分隔符；"menu"：渲染 role="navigation" 的 &lt;div&gt; 芯片按钮组，可传入的原生属性也从 &lt;nav&gt; 换成 &lt;div&gt;。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"text"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">条目的导航目标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
