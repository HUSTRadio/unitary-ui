# 标签页

> Route: `/components/tabs`

将内容组织成可切换面板。

[返回组件](#/components)

# 标签页

tabs

将内容组织成可切换面板。

## 何时使用

- 在单个页面内用于在不同但属于同一范围的视图间切换（如概览、日志、设置）。
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

## 无障碍

- 每个 tablist 应在没有可见标题的情况下使用 aria-label 标注（如 aria-label='Sections'），帮助屏幕阅读器识别功能。
- 使用左右方向键在标签之间移动焦点，Enter 或 Space 激活当前标签，不要劫持这些键盘快捷键用于全局操作。
- 活动标签必须始终保持可见的焦点环样式，不能为追求视觉效果而移除焦点指示。

## 受控行为

- 通过必填的 selected 与 setSelected 控制当前标签；selected 使用标签项的 id，而不是数组索引。
- 需要 URL 持久化时，由调用方在 setSelected 更新路径中同步路由状态。
- 禁用态的标签通过 disabled 属性隐藏交互能力，配合 Tooltip 说明禁用原因（权限不足或数据为空）。

## 响应式行为

- 移动端建议限制在 3–4 个标签以内；超出范围应将次要视图移至 Menu 下拉中。
- 标签行保持固定字号和间距，并在内容超出可用宽度时提供水平滚动；组件不会自动压缩排版。

## 主题行为

- 标签页的颜色、下划线和激活高亮跟随主题变量变化，在暗色/亮色模式下各有对应的配色方案。
- Secondary 模式在不同主题下会自动调整为对比度更低的变体颜色。

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

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Tabs } from "@/components/ui/tabs";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">selected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选中的标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setSelected</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收标签选择。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

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
