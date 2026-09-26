import { Checkbox } from "@/components/ui/checkbox";
import { Entity, EntityContent, EntityDescription, EntityMedia, EntityTitle } from "@/components/ui/entity";
import { useState } from "react";

export function EntityEntityWithListAndCheckbox26EB60A8Example() {
  const items = [
    {
      id: "github",
      title: "GitHub Desktop on MacBook Pro",
      description: "Last used just now",
    },
    {
      id: "vscode",
      title: "VS Code on Windows 11",
      description: "Last used 10min ago",
    },
    {
      id: "terminal",
      title: "Terminal on Ubuntu 24.04",
      description: "Last used 25min ago",
    },
  ];

  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({
    github: true,
    vscode: false,
    terminal: false,
  });

  const handleCheckboxChange = (id: string): void => {
    setCheckedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <Entity key={item.id} onClick={() => handleCheckboxChange(item.id)}>
          <EntityMedia>
            <Checkbox
              aria-label={item.title}
              checked={checkedStates[item.id]}
              onClick={(event) => event.stopPropagation()}
              onChange={() => handleCheckboxChange(item.id)}
            />
          </EntityMedia>
          <EntityContent>
            <EntityTitle>{item.title}</EntityTitle>
            <EntityDescription>{item.description}</EntityDescription>
          </EntityContent>
        </Entity>
      ))}
    </ul>
  );
}
