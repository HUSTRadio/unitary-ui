# 多选

> Route: `/components/multi-select`

用于选择多个外部受控选项的组合菜单。

[返回组件](#/components)

# 多选

multi-select

用于选择多个外部受控选项的组合菜单。

## 何时使用

- 当可能需要激活多个选项时，例如多值过滤器、标签选择或多字段配置。
- 需要为每行提供“仅选择此项”或“选择全部”等快捷操作，并由页面拥有选择状态时。

## 何时不应使用

- 当只需单选时可搜索列表时，请使用 Combobox——Multi Select 的语义是为多选设计的，不应混用。
- 当选项数量极少（如 2–3 个）且都是互斥选项时，使用 Toggle 或 Switch 更为直观，不必引入复杂的下拉多选组件。

## 示例

### 选择操作

展示 MultiSelectRow 的切换、仅选择此项和选择全部回调；触发器摘要由页面根据外部状态生成。

### 键盘导航

演示如何通过键盘方向键、Tab 键在选项列表中上下移动焦点并快速完成多选操作，确保不依赖鼠标的用户也能高效交互。

### 受控状态

页面维护选中数组，并把 checked、onChange、onSelectOnly 和 onSelectAll 传给各行，适合与表单提交或查询联动。

## 无障碍

- 每行的复选框和快捷操作都有包含选项名称的 aria-label，屏幕阅读器可区分切换、仅选择此项和选择全部操作。
- 打开后焦点落在 dialog；上下键跨行，左右键在复选框与快捷操作间切换，Tab 在控件间循环，Escape 由 Popover 关闭浮层。

## 受控行为

- Multi Select 不拥有选中数组；页面把 checked 和各操作回调传给每个 MultiSelectRow。
- MultiSelectRoot 仅通过 Radix Root 的 open/defaultOpen/onOpenChange 控制弹出层开闭。

## 响应式行为

- 根容器在小屏下占满可用宽度；浮层至少与触发器等宽，并以可用视口高度限制滚动区域。
- 触发器摘要使用单行截断，超长内容不会挤压右侧展开图标。

## 主题行为

- 选中项的高亮颜色、边框和背景均从主题令牌获取，浅色/深色模式下对比度均符合无障碍要求。
- 下拉列表的背景、滚动条和悬停效果跟随当前主题保持一致的视觉风格。

## 实时示例

Hover over items to see action labels. Different actions appear based on selection state.

```tsx
import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

export function MultiSelectSelectActionsC10A8A49Example() {
  const actionItems = [
    { id: "design", name: "Design System", count: 42 },
    { id: "components", name: "Components", count: 28 },
    { id: "tokens", name: "Design Tokens", count: 15 },
  ];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(["design", "components"]),
  );

  const handleItemToggle = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectOnly = (id: string) => {
    setSelectedItems(new Set([id]));
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(actionItems.map((item) => item.id)));
  };

  return (
    <div className="space-y-4">
      <MultiSelectRoot>
        <MultiSelectTrigger>
          {selectedItems.size === 0
            ? "No items selected"
            : selectedItems.size === actionItems.length
              ? "All items selected"
              : `${selectedItems.size} items selected`}
        </MultiSelectTrigger>
        <MultiSelectContent align="start">
          {actionItems.map((item) => (
            <MultiSelectRow
              key={item.id}
              name={item.name}
              checked={selectedItems.has(item.id)}
              onChange={() => handleItemToggle(item.id)}
              onSelectOnly={() => handleSelectOnly(item.id)}
              onSelectAll={handleSelectAll}
              count={item.count}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>
      <p className="text-copy-14 text-muted-foreground">
        Hover over items to see action labels. Different actions appear based on selection state.
      </p>
    </div>
  );
}
```

## 键盘导航

Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all elements

```tsx
import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

export function MultiSelectKeyboardNavigationE44E91F8Example() {
  const keyboardShortcuts = [
    { id: "frameworks", name: "Frameworks", count: 25 },
    { id: "libraries", name: "Libraries", count: 18 },
    { id: "tools", name: "Development Tools", count: 12 },
    { id: "databases", name: "Databases", count: 8 },
  ];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(["frameworks"]));

  const handleItemToggle = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectOnly = (id: string) => {
    setSelectedItems(new Set([id]));
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(keyboardShortcuts.map((item) => item.id)));
  };

  return (
    <div className="space-y-4">
      <MultiSelectRoot>
        <MultiSelectTrigger>
          {selectedItems.size === 0
            ? "No categories selected"
            : selectedItems.size === keyboardShortcuts.length
              ? "All categories selected"
              : selectedItems.size === 1
                ? "1 category selected"
                : `${selectedItems.size} categories selected`}
        </MultiSelectTrigger>
        <MultiSelectContent align="start">
          {keyboardShortcuts.map((item) => (
            <MultiSelectRow
              key={item.id}
              name={item.name}
              checked={selectedItems.has(item.id)}
              onChange={() => handleItemToggle(item.id)}
              onSelectOnly={() => handleSelectOnly(item.id)}
              onSelectAll={handleSelectAll}
              count={item.count}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>
      <p className="text-copy-14 text-muted-foreground">
        Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through
        all elements
      </p>
    </div>
  );
}
```

## 受控状态

, ,

```tsx
import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

export function MultiSelectControlledStateAE611285Example() {
  const controlledItems = [
    { id: "analytics", name: "Analytics", count: 24 },
    { id: "monitoring", name: "Monitoring", count: 18 },
    { id: "security", name: "Security", count: 12 },
    { id: "performance", name: "Performance", count: 9 },
  ];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(["analytics"]));

  const handleItemToggle = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectOnly = (id: string) => {
    setSelectedItems(new Set([id]));
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(controlledItems.map((item) => item.id)));
  };

  const handleClearAll = () => {
    setSelectedItems(new Set());
  };

  const handlePresetCore = () => {
    setSelectedItems(new Set(["analytics", "monitoring"]));
  };

  const handlePresetAdvanced = () => {
    setSelectedItems(new Set(["security", "performance"]));
  };

  return (
    <div className="space-y-4">
      <MultiSelectRoot>
        <MultiSelectTrigger>
          {selectedItems.size === 0
            ? "No features selected"
            : selectedItems.size === controlledItems.length
              ? "All features selected"
              : `Selected: ${Array.from(selectedItems).join(", ")}`}
        </MultiSelectTrigger>
        <MultiSelectContent align="start">
          {controlledItems.map((item) => (
            <MultiSelectRow
              key={item.id}
              name={item.name}
              checked={selectedItems.has(item.id)}
              onChange={() => handleItemToggle(item.id)}
              onSelectOnly={() => handleSelectOnly(item.id)}
              onSelectAll={handleSelectAll}
              count={item.count}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>

      <div className="flex flex-col gap-2 flex-wrap">
        <p className="text-copy-14 text-muted-foreground">
          <button
            type="button"
            className="cursor-pointer text-link hover:underline focus-ring"
            onClick={handleClearAll}
          >
            Clear All
          </button>
          ,{" "}
          <button
            type="button"
            className="cursor-pointer text-link hover:underline focus-ring"
            onClick={handlePresetCore}
          >
            Core Features
          </button>
          ,{" "}
          <button
            type="button"
            className="cursor-pointer text-link hover:underline focus-ring"
            onClick={handlePresetAdvanced}
          >
            Advanced Features
          </button>
        </p>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
} from "@/components/ui/multi-select";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控浮层状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收浮层状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">className</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">根容器的附加类名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控制根容器宽度和 flex 行为。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">name</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">用于可见文本和无障碍文本的行标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">行是否被选中。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">切换行选择状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectOnly</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅选择当前行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectAll</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择所有行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">count</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示在行名称旁的可选计数。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 仅当可同时激活多个选项时用 Multi Select；可搜索的单选用 Combobox。
- 保持触发器摘要简洁，并在打开控件内部暴露完整选择列表。
