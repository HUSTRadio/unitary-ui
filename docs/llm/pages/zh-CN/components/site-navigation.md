# 官网导航

> Route: `/components/site-navigation`

Grouped website links with desktop panels and a modal mobile disclosure navigation.

[返回组件](#/components)

# 官网导航

site-navigation

Grouped website links with desktop panels and a modal mobile disclosure navigation.

## 何时使用

- 官网分组导航：桌面面板与移动模态目录共享链接数据。

## 何时不应使用

- 应用命令使用 MenuBar；常驻侧栏使用 SidebarNav。

## 示例

### 基础用法

官网分组导航：桌面面板与移动模态目录共享链接数据。

## 无障碍

- 保持 nav、button、a 语义，Escape 关闭桌面面板并归还触发器焦点；移动使用模态 Sheet，具备关闭入口。

## 受控行为

- 组件管理打开状态；onOpenChange 用于协调 Navbar.forceVisible，activeHref 变化或跨断点时关闭。

## 响应式行为

- desktopBreakpoint 支持 768/1024/1280px。触屏使用点击，长移动目录单独滚动，底部操作可触达；桌面面板定位至最近的已定位祖先。

## 主题行为

- 使用共享语义颜色和动效 token；双主题保持同一交互契约。

## 实时示例

```tsx
import { SiteNavigation } from "@/components/ui/site-navigation";

export default function SiteNavigationExample() {
  return (
    <div className="min-h-80 w-full rounded-md border border-gray-alpha-400">
      <div className="relative border-b border-gray-alpha-400 p-4">
        <SiteNavigation
          label="Site navigation"
          desktopBreakpoint={768}
          items={[
            {
              id: "research",
              label: "Research",
              groups: [
                {
                  title: "Explore",
                  links: [
                    { label: "Overview", href: "/research" },
                    {
                      label: "Projects",
                      href: "/projects",
                      description: "Discover our latest work",
                    },
                  ],
                },
              ],
            },
            { id: "news", label: "News", href: "/news" },
          ]}
          mobileActions={
            <a href="/contact" className="inline-flex min-h-11 items-center">
              Contact
            </a>
          }
        />
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { SiteNavigation } from "@/components/ui/site-navigation";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">items</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SiteNavigationItem[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">稳定 id、label、可选 href、groups 和 featured 内容；组含 title/links，链接支持 label/href/description/target/rel。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">导航与移动对话框的可访问名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeHref</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用 aria-current=page 标记匹配链接。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">desktopBreakpoint</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">768 | 1024 | 1280</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">桌面面板的最小视口宽度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">1024</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">mobileActions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">位于移动导航滚动区之外的操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">panelClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">桌面面板的额外布局类。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报桌面或移动导航打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
