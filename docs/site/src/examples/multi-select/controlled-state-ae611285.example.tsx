import { useState } from "react";
import {
  MultiSelectContent,
  MultiSelectRoot,
  MultiSelectRow,
  MultiSelectTrigger,
} from "@hustradio/unitary-ui";

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
