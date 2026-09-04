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
