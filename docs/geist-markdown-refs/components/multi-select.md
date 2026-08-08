# Multi Select

A keyboard-navigable dropdown for selecting multiple items with advanced focus management.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Select Actions**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "2 items selected" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Keyboard Navigation**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "1 category selected" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#171717 · bg:#ffffff · r:6px
> - **Controlled State**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Selected: analytics" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#171717 · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Select Actions**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "2 items selected" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Keyboard Navigation**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "1 category selected" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px
> - **Controlled State**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Selected: analytics" · .outline-none · h:36px · pad:0px 13px 0px 10px · 400 14px/21px · fg:#ededed · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Select Actions

The component provides different selection behaviors based on current state:

- Checkbox focus + Enter/Space: Toggle individual item

- Button focus + Enter/Space: Smart selection (Select Only, Select All, or Toggle based on context)

- Hidden action labels: Appear on hover/focus to show available actions

Hover over items to see action labels. Different actions appear based on selection state.

```tsx
import { useState } from "react";
import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

const actionItems = [
  { id: "design", name: "Design System", count: 42 },
  { id: "components", name: "Components", count: 28 },
  { id: "tokens", name: "Design Tokens", count: 15 },
];

export function Component(): JSX.Element {
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
              selectedCount={selectedItems.size}
              totalCount={actionItems.length}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>
      <p className="text-copy-14 text-gray-900">
        Hover over items to see action labels. Different actions appear based on selection state.
      </p>
    </div>
  );
}
```

## Keyboard Navigation

The Multi Select component supports comprehensive keyboard navigation:

- Up/Down arrows: Navigate between rows while maintaining checkbox/button focus state

- Left/Right arrows: Switch between checkbox and button focus within the current row

- Tab: Focus away from the menu (natural tab behavior)

- Enter/Space: Execute actions based on current focus (checkbox toggle or button click)

Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all elements

```tsx
import { useState } from "react";
import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

const keyboardShortcuts = [
  { id: "frameworks", name: "Frameworks", count: 25 },
  { id: "libraries", name: "Libraries", count: 18 },
  { id: "tools", name: "Development Tools", count: 12 },
  { id: "databases", name: "Databases", count: 8 },
];

export function Component(): JSX.Element {
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
              selectedCount={selectedItems.size}
              totalCount={keyboardShortcuts.length}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>
      <p className="text-copy-14 text-gray-900">
        Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through
        all elements
      </p>
    </div>
  );
}
```

## Controlled State

Use controlled state to manage selections programmatically.

Clear All, Core Features, Advanced Features

```tsx
import { useState } from "react";

import { Link } from "@vercel/geistcn/components";
import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
} from "@vercel/geistcn/components";
import type { JSX } from "react";

const controlledItems = [
  { id: "analytics", name: "Analytics", count: 24 },
  { id: "monitoring", name: "Monitoring", count: 18 },
  { id: "security", name: "Security", count: 12 },
  { id: "performance", name: "Performance", count: 9 },
];

export function Component(): JSX.Element {
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
              selectedCount={selectedItems.size}
              totalCount={controlledItems.length}
            />
          ))}
        </MultiSelectContent>
      </MultiSelectRoot>

      <div className="flex flex-col gap-2 flex-wrap">
        <p className="text-copy-14 text-gray-900">
          <Link type="highlight" onClick={handleClearAll}>
            Clear All
          </Link>
          ,{" "}
          <Link type="highlight" onClick={handlePresetCore}>
            Core Features
          </Link>
          ,{" "}
          <Link type="highlight" onClick={handlePresetAdvanced}>
            Advanced Features
          </Link>
        </p>
      </div>
    </div>
  );
}
```

## Best Practices

### When to use

- Pick <MultiSelect> when users pick more than one value from a known list (regions, scopes, tags).

- For a single value from a short list, use Select.

- When typing to filter is more important than seeing every option at once, use Combobox.

- Skip <MultiSelect> for boolean settings; Toggle handles those.

### Behavior

- Show the selected count in the trigger (3 regions selected); show the single name when only one is picked.

- Use controlled mode when state lives in the URL or syncs to the server so the trigger label and stored value stay in lockstep.

- Keep checkbox focus and button focus distinct so Up/Down navigates rows and Left/Right toggles between the row’s checkbox and action button.

- For empty filters, render No {items} match "{query}" rather than No results.

### Accessibility

- Each row checkbox needs an aria-label that names the item (Select us-east-1); a bare Select is unanchored for screen readers.

- The trigger button needs a stable accessible name even when zero items are selected; don’t rely on the placeholder alone.

- Trap focus inside the menu while it’s open and return focus to the trigger on close.

- Announce bulk actions (Select All, Select Only) through the visible button label so the action matches what the screen reader speaks.

Was this helpful?
