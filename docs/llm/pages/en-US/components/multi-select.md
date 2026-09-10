# Multi Select

> Route: `/components/multi-select`

A composed menu for selecting multiple externally managed options.

[Back to Components](#/components)

# Multi Select

Multi Select

A composed menu for selecting multiple externally managed options.

## When to use

- When more than one option may be active, such as multi-value filters, tag selection, or multi-field configuration.
- When each row needs Only or Check All shortcuts and the page owns the selected state.

## When not to use

- When only a single searchable selection is needed, use Combobox; Multi Select's semantics are designed for multiple values and should not be mixed.
- When there are very few (2–3) mutually exclusive options, a Toggle or Switch is more intuitive and doesn't require a complex dropdown-multi select component.

## Examples

### Select actions

Shows MultiSelectRow toggle, select-only, and select-all callbacks; the page derives the trigger summary from external state.

### Keyboard navigation

Demonstrates navigating the option list via keyboard arrow keys, Tab, and Space for toggling selections, ensuring non-mouse users can interact efficiently.

### Controlled state

The page owns the selected array and passes checked, onChange, onSelectOnly, and onSelectAll to each row for form or query integration.

## Accessibility

- Each row checkbox and shortcut action has an aria-label containing the option name, so screen readers distinguish toggle, select-only, and select-all actions.
- Focus enters the dialog on open; Up/Down move across rows, Left/Right switch between checkbox and action, Tab cycles controls, and Popover handles Escape dismissal.

## Controlled behavior

- Multi Select does not own a selected array; the page passes checked and action callbacks to every MultiSelectRow.
- MultiSelectRoot controls only popover visibility through Radix Root open/defaultOpen/onOpenChange props.

## Responsive behavior

- The root fills available width on small screens; content is at least trigger-width and caps its scroll area to the available viewport height.
- The trigger summary truncates to one line so long content cannot displace the trailing disclosure icon.

## Theme behavior

- Highlighted color, border, and background of selected items are drawn from theme tokens; contrast meets accessibility requirements in both light and dark modes.
- Dropdown list background, scrollbar, and hover effects follow the current theme for a consistent visual style.

## Live Demo

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
      <p className="text-copy-14 text-gray-900">
        Hover over items to see action labels. Different actions appear based on selection state.
      </p>
    </div>
  );
}
```

## Keyboard navigation

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
      <p className="text-copy-14 text-gray-900">
        Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through
        all elements
      </p>
    </div>
  );
}
```

## Controlled state

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
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
} from "@/components/ui/multi-select";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled popover state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives popover state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">className</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Additional classes for the root container.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls root width and flex behavior.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">name</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Row label used for visible and accessible text.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Whether a row is selected.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Toggles the row selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectOnly</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Selects only this row.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelectAll</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Selects all rows.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">count</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional count displayed beside the row name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Multi Select only when more than one option may be active; use Combobox for searchable single selection.
- Keep the trigger summary concise and expose the full selection list inside the open control.
