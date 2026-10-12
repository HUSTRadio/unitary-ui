# 汉堡导航菜单

> Route: `/components/hamburger-menu`

An expandable navigation menu with grouped links and built-in search.

[返回组件](#/components)

# 汉堡导航菜单

hamburger-menu

An expandable navigation menu with grouped links and built-in search.

## 何时使用

- 小屏或紧凑顶栏需要可展开导航时。

## 何时不应使用

- 常驻桌面侧栏应使用 SidebarNav；命令列表应使用 MenuBar。

## 示例

### 展开导航

打开菜单，切换项目／空数据／加载状态，并试用无匹配搜索。

## 无障碍

- 触发按钮提供无障碍名称；菜单打开后支持 Escape 关闭与焦点归还。
- 空数据与无匹配搜索通过 role=status 报告；加载时导航区标记 aria-busy 并显示状态指示。
- 选中指示条不获取焦点；减少动画时直接定位，运行期间启用该偏好会取消当前滑动。

## 受控行为

- 使用 open + onOpenChange 受控；不传 open 时由组件管理展开状态。
- 调用方传入 loading 显示加载态，emptyMessage 可覆盖空数据及无匹配搜索的默认提示。
- 菜单保持打开、常规列表显示且入场动画结束时，activeTo 在同一最基层列表内变化会让指示条平滑滑动，沿移动方向非线性伸长后再收回目标高度，保持厚度：有 subgroups 时以子分类为边界，否则以一级分组为边界；扁平 items 共用一个列表。首次显示、跨组或搜索状态切换时直接定位，快速切换从当前可见位置与长度继续。

## 响应式行为

- topbar 默认向下展开，sidebar 也默认向下；可显式指定左或右，maxExpandedWidth 和 maxExpandedHeight 可约束面板。传入已定位的 container 可在局部容器内展开并限制遮罩范围。

## 主题行为

- 面板和导航条目沿用共享语义颜色 token。
- 指示条静止时为 3×14px，位于条目 14px 前导留白内，距药丸左缘 6px，并按行高垂直居中。沿用主题强调色，滑动与拉伸复用 --uni-motion-state（默认 250ms）与 --ease-snap 非线性曲线。

## 实时示例

Open the menu to explore the links or search for a missing item.

```tsx
import { useState } from "react";
import { HamburgerMenu } from "@hustradio/unitary-ui";

const items = [
  { label: "Overview", to: "/overview" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" },
];

export default function HamburgerMenuExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  const [state, setState] = useState<"ready" | "empty" | "loading">("ready");
  return (
    <div className="flex min-h-72 w-full flex-col gap-4 rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-4">
        <HamburgerMenu
          anchor="topbar"
          items={state === "ready" ? items : []}
          loading={state === "loading"}
          activeTo={activeTo}
          onNavigate={setActiveTo}
        />
        <span className="text-sm text-muted-foreground">
          Open the menu to explore the links or search for a missing item.
        </span>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Navigation data state">
        {(["ready", "empty", "loading"] as const).map((next) => (
          <button
            key={next}
            type="button"
            aria-pressed={state === next}
            onClick={() => setState(next)}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground aria-pressed:bg-gray-100"
          >
            {next === "ready" ? "Items" : next === "empty" ? "Empty" : "Loading"}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { HamburgerMenu, NAV_CONTENT_INSET } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchor</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"topbar" | "sidebar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择触发场景和默认展开方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">anchorElement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于将面板定位到顶栏下方的元素。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板与遮罩的可选定位容器；默认相对视口。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">direction</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"down" | "left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">展开方向；顶栏默认为 down。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">items</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuItem[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">扁平导航与搜索数据源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">分组导航与搜索数据源。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">数据加载时显示加载状态并标记导航区域忙碌。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyMessage</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">空导航或搜索无结果时的自定义文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于 aria-current 与高亮的当前路径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择导航条目时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">回报打开状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disableSearch</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隐藏内建搜索框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">searchMode</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query" | "toolbar"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按输入内容或焦点进入搜索。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"query"</td></tr></tbody></table>

NAV\_CONTENT\_INSET 是 HamburgerMenu 使用的共用 px-6 py-4 类名字符串：默认 spacing 尺度下水平留白 24px、垂直留白 16px。可在调用方拥有的 SidebarNav 滚动容器上复用，以保持内容留白一致。
