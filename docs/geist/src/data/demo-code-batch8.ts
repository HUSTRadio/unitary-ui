/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— batch 8。
 *
 * 结构：DEMO_CODE_BATCH8[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集），
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 本批组件：clearable-input / combobox / entity / multi-select / search-input。
 * （error-card / middle-truncate / relative-time-card / split-button 在本地页面中
 * 无 data-demo-card 区块，无 key 可映射，已跳过。）
 */
export const DEMO_CODE_BATCH8: Record<string, Record<string, string>> = {
  "clearable-input": {
    default: `import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

const [value, setValue] = useState("");

<ClearableInput
  aria-label="Demo clearable input"
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    "with-label": `import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

const [value, setValue] = useState("");

<ClearableInput
  label="Email"
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter your email..."
  value={value}
/>`,
    "with-cmdk": `import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

const [value, setValue] = useState("");

<ClearableInput
  aria-label="Search with cmdk"
  cmdk
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Search..."
  value={value}
/>`,
    disabled: `import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

const [value, setValue] = useState("Some text");

<ClearableInput
  aria-label="Disabled clearable input"
  disabled
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    "with-clear-callback": `import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

const [value, setValue] = useState("");
const [clearCount, setClearCount] = useState(0);

<div className="flex flex-col gap-2">
  <ClearableInput
    aria-label="Clearable input with callback"
    onChange={(e) => {
      setValue(e.target.value);
    }}
    onClear={() => {
      setClearCount((prev) => prev + 1);
    }}
    placeholder="Enter some text and clear..."
    value={value}
  />
  <p className="text-copy-14 text-gray-900">Cleared {clearCount} times</p>
</div>`,
  },
  combobox: {
    uncontrolled: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    controlled: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const [value, setValue] = useState("b");

<Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    disabled: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" disabled placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    sizes: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

const options = [
  { value: "a", label: "One" },
  { value: "b", label: "Two" },
  { value: "c", label: "Three" },
];

<div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
  <Combobox aria-label="Search" placeholder="Search..." size="small" className="w-[235px]">
    <ComboboxInput />
    <ComboboxList>
      {options.map((option) => (
        <ComboboxOption key={option.value} value={option.value}>
          {option.label}
        </ComboboxOption>
      ))}
    </ComboboxList>
  </Combobox>

  <Combobox aria-label="Search" placeholder="Search..." className="w-[235px]">
    <ComboboxInput />
    <ComboboxList>
      {options.map((option) => (
        <ComboboxOption key={option.value} value={option.value}>
          {option.label}
        </ComboboxOption>
      ))}
    </ComboboxList>
  </Combobox>

  <Combobox aria-label="Search" placeholder="Search..." size="large" className="w-[257px]">
    <ComboboxInput />
    <ComboboxList>
      {options.map((option) => (
        <ComboboxOption key={option.value} value={option.value}>
          {option.label}
        </ComboboxOption>
      ))}
    </ComboboxList>
  </Combobox>
</div>`,
    "with-label": `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox label="Select your country" aria-label="Select your country" placeholder="Search countries…">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="us">United States</ComboboxOption>
    <ComboboxOption value="ca">Canada</ComboboxOption>
    <ComboboxOption value="uk">United Kingdom</ComboboxOption>
    <ComboboxOption value="de">Germany</ComboboxOption>
    <ComboboxOption value="fr">France</ComboboxOption>
    <ComboboxOption value="jp">Japan</ComboboxOption>
    <ComboboxOption value="au">Australia</ComboboxOption>
    <ComboboxOption value="br">Brazil</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    clearable: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const [value, setValue] = useState("two");

// 选中后出现清除按钮（X），点击即清空并回调 onValueChange。
<Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="one">One</ComboboxOption>
    <ComboboxOption value="two">Two</ComboboxOption>
    <ComboboxOption value="three">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
  },
  entity: {
    default: `import { Avatar } from "@/components/ui/avatar";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityMedia, EntityTitle } from "@/components/ui/entity";

<Entity>
  <EntityMedia>
    <Avatar size={32} username="evilrabbit" />
  </EntityMedia>
  <EntityContent fill>
    <EntityTitle>Evil Rabbit</EntityTitle>
    <EntityDescription>Glenn Hitchcock (@gln)</EntityDescription>
  </EntityContent>
  <EntityAction>
    <p className="text-copy-14 text-gray-900">Connected 1h ago</p>
  </EntityAction>
</Entity>`,
    "entity-with-skeleton": `import { Entity } from "@/components/ui/entity";
import { Skeleton } from "@/components/ui/skeleton";

<Entity>
  <div className="flex flex-col items-stretch justify-start gap-2 flex-1">
    <Skeleton height={20} width="100%" />
    <div className="flex flex-row items-center justify-start gap-2 flex-initial">
      <Skeleton height={20} width={70} />
      <Skeleton height={20} width={60} />
      <Skeleton height={20} width={68} />
    </div>
  </div>
</Entity>`,
    "entity-with-list": `import { Button } from "@/components/ui/button";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityTitle } from "@/components/ui/entity";

<ul className="flex flex-col">
  <Entity>
    <EntityContent>
      <EntityTitle>GitHub Desktop on MacBook Pro</EntityTitle>
      <EntityDescription>Last used just now</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
  <Entity>
    <EntityContent>
      <EntityTitle>VS Code on Windows 11</EntityTitle>
      <EntityDescription>Last used 10min ago</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
  <Entity>
    <EntityContent>
      <EntityTitle>Terminal on Ubuntu 24.04</EntityTitle>
      <EntityDescription>Last used 25min ago</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
</ul>`,
    "entity-with-list-and-checkbox": `import { Checkbox } from "@/components/ui/checkbox";
import { Entity, EntityContent, EntityDescription, EntityMedia, EntityTitle } from "@/components/ui/entity";
import { useState } from "react";

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

<ul className="flex flex-col">
  {items.map((item) => (
    <Entity key={item.id} onClick={() => handleCheckboxChange(item.id)}>
      <EntityMedia>
        <Checkbox
          aria-label={item.title}
          checked={checkedStates[item.id]}
          onChange={() => handleCheckboxChange(item.id)}
        />
      </EntityMedia>
      <EntityContent>
        <EntityTitle>{item.title}</EntityTitle>
        <EntityDescription>{item.description}</EntityDescription>
      </EntityContent>
    </Entity>
  ))}
</ul>`,
    "entity-with-fill": `import { Entity, EntityContent, EntityDescription } from "@/components/ui/entity";

<ul className="flex flex-col">
  <Entity>
    <EntityContent fill>
      <EntityDescription>This is a simple description</EntityDescription>
    </EntityContent>
    <EntityContent>
      <EntityDescription>This is a simple description</EntityDescription>
    </EntityContent>
  </Entity>
</ul>`,
    "entity-with-column-class-names": `import { Avatar } from "@/components/ui/avatar";
import { Entity, EntityAction, EntityContent, EntityDescription, EntityMedia } from "@/components/ui/entity";

<ul className="flex flex-col">
  <Entity
    leftClassName="border border-dashed border-gray-300 rounded-md p-2"
    rightClassName="border border-dashed border-gray-300 rounded-md p-2"
  >
    <EntityMedia>
      <Avatar placeholder size={50} />
    </EntityMedia>
    <EntityContent>
      <EntityDescription>Entity with dashed borders</EntityDescription>
    </EntityContent>
    <EntityAction>
      <span className="text-copy-14 text-gray-900">[some action]</span>
    </EntityAction>
  </Entity>
</ul>`,
  },
  "multi-select": {
    "select-actions": `import { useState } from "react";
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
          : \`\${selectedItems.size} items selected\`}
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
          count={item.count}
        />
      ))}
    </MultiSelectContent>
  </MultiSelectRoot>
  <p className="text-copy-14 text-gray-900">
    Hover over items to see action labels. Different actions appear based on selection state.
  </p>
</div>`,
    "keyboard-navigation": `import { useState } from "react";
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
            : \`\${selectedItems.size} categories selected\`}
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
          count={item.count}
        />
      ))}
    </MultiSelectContent>
  </MultiSelectRoot>
  <p className="text-copy-14 text-gray-900">
    Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through
    all elements
  </p>
</div>`,
    "controlled-state": `import { useState } from "react";
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
          : \`Selected: \${Array.from(selectedItems).join(", ")}\`}
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
</div>`,
  },
  "search-input": {
    default: `import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

const [value, setValue] = useState("");

<SearchInput
  aria-label="Search"
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    "with-cmdk": `import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

const [value, setValue] = useState("");

<SearchInput
  aria-label="Search"
  cmdk
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    disabled: `import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

const [value, setValue] = useState("");

<SearchInput
  aria-label="Search"
  cmdk
  disabled
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    loading: `import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

const [value, setValue] = useState("Project A");

<SearchInput
  aria-label="Search"
  loading
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  value={value}
/>`,
    "custom-prefix": `import { Sparkles } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

const [value, setValue] = useState("");

<SearchInput
  aria-label="Search"
  onChange={(e) => {
    setValue(e.target.value);
  }}
  placeholder="Enter some text..."
  prefix={<Sparkles className="size-4" aria-hidden />}
  value={value}
/>`,
  },
};
