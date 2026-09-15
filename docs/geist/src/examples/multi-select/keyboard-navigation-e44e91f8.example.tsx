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
