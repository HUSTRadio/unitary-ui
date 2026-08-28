# 多选

> Route: `/components/multi-select`

支持多项选择的可筛选列表。

[返回组件](#/components)

# 多选

Multi Select

支持多项选择的可筛选列表。

## 何时使用

- 当可能需要激活多个选项时，例如多值过滤器、标签选择或多字段配置。
- 需要从较长选项中筛选出多个条目，搜索和滚动结合的交互方式更适合复杂选择任务。

## 何时不应使用

- 当只需单选时可搜索列表时，请使用 Combobox——Multi Select 的语义是为多选设计的，不应混用。
- 当选项数量极少（如 2–3 个）且都是互斥选项时，使用 Toggle 或 Switch 更为直观，不必引入复杂的下拉多选组件。

## 示例

### 选择操作

展示 Multi Select 中内置的选择操作功能，用户可以在弹出的选项列表中勾选多个条目，组件会自动维护已选状态的聚合摘要。

### 键盘导航

演示如何通过键盘方向键、Tab 键在选项列表中上下移动焦点并快速完成多选操作，确保不依赖鼠标的用户也能高效交互。

### 受控状态

将 Multi Select 绑定到受控的选中数组状态，外部通过 value/onChange 精确管理选择集，适合与表单提交或搜索查询联动。

## 无障碍

- 每个复选选项都有语义化的 label 关联，屏幕阅读器能正确播报每个选项的名称及其选中状态。
- 键盘导航支持方向键移动焦点、空格键切换选中、Escape 关闭列表，符合 WAI-ARIA 复合组件规范。

## 受控行为

- 通过 value（已选数组）和 onChange 回调实现完全受控，父组件可在任意时刻更新选择集合。
- 支持 defaultSelected 初始化未受控状态，并在内部同步维护选中变化并通知外部。

## 响应式行为

- 在下拉列表展开后会根据视口大小自动调整宽度及位置，确保在小屏设备上也不会溢出屏幕边界。
- 触发器的摘要文本在不同尺寸下会优雅截断或折叠，保持紧凑外观。

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

const actionItems = [
  { id: "design", name: "Design System", count: 42 },
  { id: "components", name: "Components", count: 28 },
  { id: "tokens", name: "Design Tokens", count: 15 },
];

const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(["design", "components"]));

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
  <p className="text-copy-14 text-gray-900">
    Hover over items to see action labels. Different actions appear based on selection state.
  </p>
</div>;
```

Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all elements

```tsx
import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

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
  <p className="text-copy-14 text-gray-900">
    Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all
    elements
  </p>
</div>;
```

, ,

```tsx
import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

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
    <p className="text-copy-14 text-gray-900">
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
</div>;
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

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控浮层状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收浮层状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">行是否被选中。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 仅当可同时激活多个选项时用 Multi Select；可搜索的单选用 Combobox。
- 保持触发器摘要简洁，并在打开控件内部暴露完整选择列表。
