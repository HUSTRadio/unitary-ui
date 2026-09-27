# 侧栏导航

> Route: `/components/sidebar-nav`

Grouped sidebar navigation with active state and optional collapsible sections.

[返回组件](#/components)

# 侧栏导航

sidebar-nav

Grouped sidebar navigation with active state and optional collapsible sections.

## 何时使用

- 桌面应用需要分组侧栏导航并突出当前页面时。

## 何时不应使用

- 移动端需要可展开的全屏导航时，使用 HamburgerMenu。

## 示例

### 分组导航

选择条目更新当前页状态。

## 无障碍

- 链接保持原生锚点语义；当前项设置 aria-current，折叠组标题可用键盘操作。

## 受控行为

- activeTo 由调用方传入；onNavigate 拦截普通点击，修饰键点击仍沿用原生锚点行为。

## 响应式行为

- 宽度由外部布局决定；触控行使用更大的命中区。

## 主题行为

- 链接、焦点与选中态使用语义颜色 token。

## 实时示例

```tsx
import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

const groups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/overview" },
      { label: "Projects", to: "/projects" },
    ],
  },
];

export default function SidebarNavExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="w-full max-w-64 rounded-xl border border-border bg-background p-3">
      <SidebarNav groups={groups} activeTo={activeTo} onNavigate={setActiveTo} collapsible />
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { SidebarNav } from "@/components/ui/sidebar-nav";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SidebarNavGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">导航分组和链接。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前活动条目的路径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拦截无修饰键的链接激活；修饰键点击仍走原生导航。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">右侧形态增加左分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">允许分组标题切换展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">persistKey</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提供时将折叠状态保存在 localStorage。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
