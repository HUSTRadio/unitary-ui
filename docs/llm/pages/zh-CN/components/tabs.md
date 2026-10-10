# 标签页

> Route: `/components/tabs`

在同一页面内切换概览、日志等相关视图。

[返回组件](#/components)

# 标签页

tabs

在同一页面内切换概览、日志等相关视图。

## 何时使用

- 在同一页面中切换概览、日志、设置等相关视图。
- 多个视图共享同一个 URL 父级和数据模型时，使用标签页保持上下文同步。
- 需要通过 URL 状态实现深度链接和刷新恢复（如 query param 或路径映射）的场景。

## 何时不应使用

- 不要在无关页面之间的导航中使用 Tab 标签——应使用子菜单或普通链接替代。
- 不要把大量标签塞进一行；桌面端超过 5–7 个或移动端超过 3–4 个时应整合或折叠到菜单后。
- 不要用 Tab 作为主要的全局导航；它只适用于页面内部的局部视图切换。

## 示例

### 默认标签页

展示带有默认样式的多标签面板切换效果。

### 带图标

演示在每个标签上添加图标的用法，增强视觉识别度。

### 次要样式

展示 Secondary 模式下的标签页，用于弱化次要分组的内容切换。

### 活动标签滚动跟踪

比较禁用、载入时和始终跟踪；外部选择活动标签后重新载入演示，并切换文字方向。

## 无障碍

- 每个 tablist 应在没有可见标题的情况下使用 aria-label 标注（如 aria-label='Sections'），帮助屏幕阅读器识别功能。
- 使用左右方向键在标签之间移动焦点，Enter 或 Space 激活当前标签，不要劫持这些键盘快捷键用于全局操作。
- 活动标签必须始终保持可见的焦点环样式，不能为追求视觉效果而移除焦点指示。
- 滚动跟踪不会转移键盘焦点；系统请求减少动画时直接完成定位。
- 下划线不获取焦点；减少动画时直接定位，运行期间启用该偏好会取消当前滑动。

## 受控行为

- 通过必填的 selected 与 setSelected 控制当前标签；selected 使用标签项的 value，而不是数组索引。
- primary 下划线在同一标签行内平滑滑动，沿移动方向非线性拉长后再收回目标标签宽度，保持厚度；首次显示直接定位，快速切换从当前可见位置与长度继续。标签选中状态立即更新，动效无需额外 props。
- 需要 URL 持久化时，由调用方在 setSelected 更新路径中同步路由状态。
- 禁用态的标签通过 disabled 属性隐藏交互能力，配合 Tooltip 说明禁用原因（权限不足或数据为空）。
- scrollTracking 是可选的 Unitary 扩展，类型为 ScrollTrackingMode，默认 disabled；on-reload 在首次挂载、DOM 布局就绪后尝试一次，之后的 selected 变化不会触发跟踪；always 在进入该模式及 selected 值变化时更新位置。
- 调用方先从 URL 恢复 selected，再让组件跟踪活动标签；组件不解析路由或锚点。手动滚动会中断当前动画；on-reload 的这次尝试仍视为已用，不会重新开始。always 也不会持续锁定同一个活动值的位置。

## 响应式行为

- 移动端建议限制在 3–4 个标签以内；超出范围应将次要视图移至 Menu 下拉中。
- 标签行保持固定字号和间距，并在内容超出可用宽度时提供水平滚动；组件不会自动压缩排版。
- 跟踪首选标签行水平起始边内侧 16px；若会露出前一标签的文字或图标，按 spacing 尺度将间距缩小为 8px、4px 等。RTL 使用右侧起始边。目标位置被限制在可滚动范围内，靠近末端时允许无法完全对齐。

## 主题行为

- 标签页的颜色、下划线和激活高亮跟随主题变量变化，在暗色/亮色模式下各有对应的配色方案。
- Secondary 模式在不同主题下会自动调整为对比度更低的变体颜色。
- primary 下划线沿用前景色，滑动与拉伸复用 --uni-motion-state（默认 250ms）与 --ease-snap 非线性曲线。
- 滚动跟踪复用 --uni-motion-state（默认 250ms）与 --ease-in-out 非线性曲线；两种主题使用相同的动效 token。

## 实时示例

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDefault21B111CBExample() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="w-full max-w-xl">
      <Tabs
        tabs={[
          { value: "overview", title: "Overview" },
          { value: "usage", title: "Usage" },
          { value: "api", title: "API" },
        ]}
        selected={tab}
        setSelected={setTab}
        ariaLabel="Component documentation"
      />
    </div>
  );
}
```

## 禁用

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDisabled75081B59Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      disabled
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
      ariaLabel="Disabled tabs"
    />
  );
}
```

## 禁用指定标签页

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDisableSpecificTabsA4195A7DExample() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
      ]}
      ariaLabel="Tabs with disabled tab"
    />
  );
}
```

## 带图标

```tsx
import { Tabs } from "@/components/ui/tabs";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

export function TabsWithIcons1F71F4BCExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github", icon: <LayoutGrid className="size-4" aria-hidden /> },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket" },
      ]}
      ariaLabel="Tabs with icons"
    />
  );
}
```

## 次要

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsSecondary62F2CCFFExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      variant="secondary"
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github" },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket", disabled: true },
      ]}
      ariaLabel="Secondary tabs"
    />
  );
}
```

## 紧凑布局

```tsx
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsCompactB6B54201Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "Apple", value: "apple" },
          { title: "Orange", value: "orange" },
          { title: "Mango", value: "mango" },
        ]}
        compact
        ariaLabel="Compact tabs"
      />
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "GitHub", value: "github" },
          { title: "GitLab", value: "gitlab" },
          { title: "Bitbucket", value: "bitbucket" },
        ]}
        variant="secondary"
        compact
        ariaLabel="Compact secondary tabs"
      />
    </div>
  );
}
```

## 活动项滚动跟随

跟踪模式

活动标签

文字方向

从上方选择活动标签，比较跟踪模式；切换文字方向后重新载入，观察起始边对齐。你也可以手动滚动标签行。

纵向活动项的相同能力参见 [侧栏导航文档](#/components/sidebar-nav)。

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import type { ScrollTrackingMode } from "@/lib";

export default function TabsScrollTrackingExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [mode, setMode] = useState<ScrollTrackingMode>("on-reload");
  const [selected, setSelected] = useState("view-6");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [mount, setMount] = useState(0);
  const tabs = Array.from({ length: 12 }, (_, index) => ({
    title: `${zh ? "视图" : "View"} ${index + 1}`,
    value: `view-${index + 1}`,
  }));

  return (
    <div data-slot="tabs-scroll-tracking-demo" className="w-full max-w-xl space-y-4">
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
        <div data-slot="scroll-tracking-target">
          <Select
            label={zh ? "活动标签" : "Active tab"}
            value={selected}
            onValueChange={setSelected}
          >
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.title}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div data-slot="scroll-tracking-direction">
          <Select
            label={zh ? "文字方向" : "Direction"}
            value={direction}
            onValueChange={(value) => setDirection(value as "ltr" | "rtl")}
          >
            <SelectItem value="ltr">{zh ? "从左到右" : "Left to right"}</SelectItem>
            <SelectItem value="rtl">{zh ? "从右到左" : "Right to left"}</SelectItem>
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
            setSelected("view-6");
            setDirection("ltr");
            setMount((value) => value + 1);
          }}
        >
          {zh ? "重置演示" : "Reset demo"}
        </Button>
      </div>
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "从上方选择活动标签，比较跟踪模式；切换文字方向后重新载入，观察起始边对齐。你也可以手动滚动标签行。"
          : "Choose an active tab above to compare modes. Change direction and reload to observe start-edge alignment. You can also scroll the tab row manually."}
      </p>
      <p className="text-copy-14 text-muted-foreground">
        {zh ? "纵向活动项的相同能力参见 " : "For the vertical equivalent, see "}
        <Link href="#/components/sidebar-nav">
          {zh ? "侧栏导航文档" : "SidebarNav documentation"}
        </Link>
        {zh ? "。" : "."}
      </p>
      <div
        key={mount}
        data-slot="scroll-tracking-viewport"
        dir={direction}
        className="w-full max-w-xs min-w-0"
      >
        <Tabs
          tabs={tabs}
          selected={selected}
          setSelected={setSelected}
          scrollTracking={mode}
          ariaLabel={zh ? "视图跟踪演示" : "View tracking demo"}
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
import { Tabs } from "@/components/ui/tabs";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">selected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选中的标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setSelected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收标签选择。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">scrollTracking</code><span data-slot="docs-api-extension-badge" class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled" | "on-reload" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在水平起始边对齐活动标签，首选 16px 留白；若会露出前一标签的文字或图标，按 spacing 尺度缩小。on-reload 在挂载后执行一次，always 在进入该模式或 selected 值变化时执行。类型为 ScrollTrackingMode；受滚动边界限制，仍可手动滚动。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"disabled"</td></tr></tbody></table>

## 最佳实践

- 单个页面内的兄弟视图切换用 Tabs（Overview、Logs、Settings）。
- 无关页面间的导航用子菜单而非 Tabs。Tabs 暗示视图共享范围、URL 父级与数据模型。
- Tabs 行桌面端 5–7 项、移动端 3–4 项封顶。超过则合并，或把次视图移进 Menu。
- 选 tab 即时生效；切换时不要触发网络确认或 toast。
- 把活动 tab 反映到 URL（查询参数或路径），让深链与刷新恢复状态。
- 仅因权限或空态原因禁用单个 tab；禁用 tab 配说明约束的 tooltip。
- tabs\[\].title 首字母大写、1–2 个词，命名目标名词（Overview、Logs、Settings）。动词属于按钮；View Logs 作为 tab 是错的。
- tabs\[\].tooltip 句首大写并解释约束（Only visible to project owners.），而非 tab 的用途。
- 不要在标题后追加计数（Logs (12)）；用 badge 槽并在归零时去掉 badge。
- 让 Left/Right 箭头在 tab 间移动焦点、Enter/Space 激活；不要用全局快捷键劫持。
- 活动 tab 保持可见焦点环；不要为视觉美观压制焦点样式。
- 上方没有可见标题时用 aria-label 标记 tablist（如 aria-label="Reference view"）。
