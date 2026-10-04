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

### 活动项滚动跟踪

比较三档跟踪模式及条目／分类小标题对齐；选择活动条目、重新载入或手动滚动。

## 无障碍

- 链接保持原生锚点语义；当前项设置 aria-current，折叠组标题可用键盘操作。
- 滚动跟踪不会转移焦点；系统请求减少动画时直接完成定位。

## 受控行为

- activeTo 由调用方传入；onNavigate 拦截普通点击，修饰键点击仍沿用原生锚点行为。
- scrollTracking 是可选的 Unitary 扩展，类型为 ScrollTrackingMode，默认 disabled；on-reload 在首次挂载、DOM 布局就绪后尝试一次，之后的 activeTo 变化不会触发跟踪；always 在进入该模式及 activeTo 变化时更新位置。
- scrollTrackingTarget 默认 item，定位当前条目；category 定位所属二级分类的小标题，没有 subgroups 时定位一级分组标题。文档侧栏使用 on-reload + category。always 也响应对齐目标的切换；on-reload 已执行后切换目标需要重新挂载。
- 调用方从路由或锚点恢复 activeTo；组件跟踪对应的活动链接。手动滚动会中断当前动画，on-reload 的这次尝试仍视为已用。always 也不会持续锁定同一个活动值的位置。

## 响应式行为

- 宽度由外部布局决定；触控行使用更大的命中区。
- 跟踪只滚动最近的纵向滚动容器，首选顶部下方 16px；若会露出前一条目或分组标题的文字、图标，按 spacing 尺度缩小为 8px、4px 等。目标被限制在可滚动范围内，不会带动外层页面。

## 主题行为

- 链接、焦点与选中态使用语义颜色 token。
- 滚动跟踪复用 --uni-motion-state（默认 250ms）与 --ease-in-out 非线性曲线；两种主题使用相同的动效 token。

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

## 活动项滚动跟随

跟踪模式

对齐目标

活动条目

选择活动条目和对齐目标，比较跟踪模式。文档侧栏在载入时对齐所属分类小标题；此演示默认对齐条目。重新载入保留当前选择，你也可以手动滚动。

横向活动项的相同能力参见 [标签页文档](#/components/tabs)。

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Select, SelectItem } from "@/components/ui/select";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useI18n } from "@/lib/i18n";
import type { ScrollTrackingMode, SidebarNavScrollTrackingTarget } from "@/lib";

export default function SidebarNavScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [target, setTarget] = useState<SidebarNavScrollTrackingTarget>("item");
  const [activeTo, setActiveTo] = useState("/page-6");
  const [mount, setMount] = useState(0);
  const items = Array.from({ length: 12 }, (_, index) => ({
    label: `${zh ? "页面" : "Page"} ${index + 1}`,
    to: `/page-${index + 1}`,
  }));

  return (
    <div data-slot="sidebar-nav-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div data-slot="scroll-tracking-mode">
          <Select
            label={zh ? "跟踪模式" : "Tracking mode"}
            value={mode}
            onValueChange={(value) => setMode(value as ScrollTrackingMode)}
          >
            <SelectItem value="disabled">{zh ? "禁用" : "Disabled"}</SelectItem>
            <SelectItem value="on-reload">{zh ? "载入时" : "On reload"}</SelectItem>
            <SelectItem value="always">{zh ? "始终跟踪" : "Always"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-alignment">
          <Select
            label={zh ? "对齐目标" : "Alignment target"}
            value={target}
            onValueChange={(value) => setTarget(value as SidebarNavScrollTrackingTarget)}
          >
            <SelectItem value="item">{zh ? "当前条目" : "Current item"}</SelectItem>
            <SelectItem value="category">{zh ? "所属分类小标题" : "Category heading"}</SelectItem>
          </Select>
        </div>
        <div data-slot="scroll-tracking-target">
          <Select
            label={zh ? "活动条目" : "Active item"}
            value={activeTo}
            onValueChange={setActiveTo}
          >
            {items.map((item) => (
              <SelectItem key={item.to} value={item.to}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Button
          data-slot="scroll-tracking-remount"
          type="secondary"
          typeName="button"
          onClick={() => setMount((value) => value + 1)}
        >
          {zh ? "重新载入演示" : "Reload demo"}
        </Button>
        <Button
          data-slot="scroll-tracking-reset"
          type="tertiary"
          typeName="button"
          onClick={() => {
            setMode("on-reload");
            setTarget("item");
            setActiveTo("/page-6");
            setMount((value) => value + 1);
          }}
        >
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "选择活动条目和对齐目标，比较跟踪模式。文档侧栏在载入时对齐所属分类小标题；此演示默认对齐条目。重新载入保留当前选择，你也可以手动滚动。"
          : "Choose an active item and alignment target to compare modes. The docs sidebar aligns its category heading on load; this demo starts with item alignment. Reload keeps your selection, and manual scrolling remains available."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "横向活动项的相同能力参见 " : "For the horizontal equivalent, see "}
        <Link href="#/components/tabs">{zh ? "标签页文档" : "Tabs documentation"}</Link>
        {zh ? "。" : "."}
      </p>
      <div
        key={mount}
        data-slot="scroll-tracking-viewport"
        tabIndex={0}
        aria-label={zh ? "侧栏跟踪演示" : "Sidebar tracking demo"}
        className="nav-scroll h-48 w-full max-w-64 overflow-y-auto rounded-xl border border-border bg-background p-4 focus-ring"
      >
        <SidebarNav
          groups={[
            {
              label: zh ? "页面导航" : "Pages",
              items,
              subgroups: [0, 1, 2].map((index) => ({
                label: `${zh ? "分类" : "Category"} ${index + 1}`,
                items: items.slice(index * 4, index * 4 + 4),
              })),
            },
          ]}
          activeTo={activeTo}
          onNavigate={setActiveTo}
          scrollTracking={mode}
          scrollTrackingTarget={target}
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
import { SidebarNav } from "@/components/ui/sidebar-nav";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">groups</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SidebarNavGroup[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">导航分组和链接。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">activeTo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前活动条目的路径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onNavigate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(to: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拦截无修饰键的链接激活；修饰键点击仍走原生导航。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">右侧形态增加左分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">collapsible</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">允许分组标题切换展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">persistKey</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提供时将折叠状态保存在 localStorage。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTracking</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled" | "on-reload" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在最近纵向滚动容器顶部下方对齐所选目标，首选 16px 留白；若会露出前方文字或图标，按 spacing 尺度缩小。on-reload 在挂载后执行一次，always 在进入该模式、activeTo 或 scrollTrackingTarget 变化时执行。类型为 ScrollTrackingMode；受滚动边界限制，仍可手动滚动。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTrackingTarget</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"item" | "category"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择当前链接或所属二级分类小标题；category 在没有 subgroups 时使用一级分组标题。类型为 SidebarNavScrollTrackingTarget。文档侧栏使用 category + on-reload。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"item"</td></tr></tbody></table>
