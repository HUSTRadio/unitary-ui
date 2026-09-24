# 汉堡导航菜单

> Route: `/components/hamburger-menu`

An expandable navigation menu with grouped links and built-in search.

[返回组件](#/components)

# 汉堡导航菜单

Unitary Hamburger Menu

An expandable navigation menu with grouped links and built-in search.

## 何时使用

- 小屏或紧凑顶栏需要可展开导航时。

## 何时不应使用

- 常驻桌面侧栏应使用 SidebarNav；命令列表应使用 MenuBar。

## 示例

### 展开导航

打开菜单并选择导航条目。

## 无障碍

- 触发按钮提供可访问名称；菜单打开后支持 Escape 关闭与焦点归还。

## 受控行为

- 使用 open + onOpenChange 受控；不传 open 时由组件管理展开状态。

## 响应式行为

- topbar 默认向下展开，sidebar 也默认向下；可显式指定左或右，maxExpandedWidth 和 maxExpandedHeight 可约束面板。

## 主题行为

- 面板和导航条目沿用共享语义颜色 token。

## 实时示例

Open the menu to explore the links.

```tsx
import { useState } from "react";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

const items = [
  { label: "Overview", to: "/overview" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" },
];

export default function HamburgerMenuExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="flex min-h-72 w-full items-start rounded-xl border border-border bg-background p-5">
      <HamburgerMenu anchor="topbar" items={items} activeTo={activeTo} onNavigate={setActiveTo} />
      <span className="ml-4 text-sm text-muted-foreground">
        Open the menu to explore the links.
      </span>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchor</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"topbar" | "sidebar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择触发场景和默认展开方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchorElement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于将面板定位到顶栏下方的元素。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">direction</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"down" | "left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">展开方向；顶栏默认为 down。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">items</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuItem[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">扁平导航与搜索数据源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">分组导航与搜索数据源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于 aria-current 与高亮的当前路径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择导航条目时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报打开状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disableSearch</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隐藏内建搜索框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">searchMode</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query" | "toolbar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按输入内容或焦点进入搜索。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query"</td></tr></tbody></table>
