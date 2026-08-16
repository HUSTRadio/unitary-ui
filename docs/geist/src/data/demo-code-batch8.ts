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
<Combobox aria-label="Search" clearable onValueChange={setValue} placeholder="Search..." value={value}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="one">One</ComboboxOption>
    <ComboboxOption value="two">Two</ComboboxOption>
    <ComboboxOption value="three">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    errored: `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" errored placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    "custom-width-input": `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>`,
    "custom-width-list": `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList maxWidth={500}>
    <ComboboxOption value="a">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </ComboboxOption>
    <ComboboxOption value="b">
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur.
    </ComboboxOption>
    <ComboboxOption value="c">
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
      id est laborum.
    </ComboboxOption>
  </ComboboxList>
</Combobox>`,
    "custom-empty-message": `import { Combobox, ComboboxInput, ComboboxList } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList emptyMessage="Nothing to see here..." />
</Combobox>`,
    "with-prefix-icons": `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

<Combobox aria-label="Search" className="w-fit" placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a" prefix={<Triangle className="size-4" aria-hidden />}>
      One
    </ComboboxOption>
    <ComboboxOption value="b" prefix={<Triangle className="size-4" aria-hidden />}>
      Two
    </ComboboxOption>
    <ComboboxOption value="c" prefix={<Triangle className="size-4" aria-hidden />}>
      Three
    </ComboboxOption>
  </ComboboxList>
</Combobox>`,
    "with-suffix-icons": `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

<Combobox aria-label="Search" className="w-fit" placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a" suffix={<Triangle className="size-4" aria-hidden />}>
      One
    </ComboboxOption>
    <ComboboxOption value="b" suffix={<Triangle className="size-4" aria-hidden />}>
      Two
    </ComboboxOption>
    <ComboboxOption value="c" suffix={<Triangle className="size-4" aria-hidden />}>
      Three
    </ComboboxOption>
  </ComboboxList>
</Combobox>`,
    "used-inside-modal": `import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

const options = [
  { value: "a", label: "One" },
  { value: "b", label: "Two" },
  { value: "c", label: "Three" },
];

<Button onClick={() => setOpen(true)} size="small" typeName="button">
  Open Modal
</Button>

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Create Token</ModalTitle>
      <ModalDescription>
        Enter a unique name for your token to differentiate it from other tokens and then select
        the scope.
      </ModalDescription>
    </ModalHeader>
    <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
      <div className="flex flex-col gap-2.5">
        <Combobox aria-label="Region" label="Region" placeholder="Search..." size="small">
          <ComboboxInput />
          <ComboboxList>
            {options.map((option) => (
              <ComboboxOption key={option.value} value={option.value}>
                {option.label}
              </ComboboxOption>
            ))}
          </ComboboxList>
        </Combobox>
        <p className="text-copy-13 text-gray-900">
          This is the region where your database reads and writes will take place.
        </p>
      </div>
    </div>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" onClick={() => setOpen(false)}>
        Submit
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>`,
    "inside-sheet": `import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";

const SHARED_VARS = [
  { key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", target: "Preview and Production" },
  { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
  { key: "DATABASE_URL", target: "Production" },
  // ...
];

const [linked, setLinked] = useState<string[]>([]);
const [search, setSearch] = useState("");

<Sheet modal>
  <SheetTrigger asChild>
    <Button size="small" typeName="button">
      Link Shared Variable
    </Button>
  </SheetTrigger>
  <SheetContent
    side="right"
    className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-clip rounded-2xl bg-background-100 p-0 lg:w-5/6 sm:max-w-[auto]"
  >
    <div className="flex flex-shrink-0 items-center justify-between pt-3 pl-4 pr-3">
      <SheetTitle className="text-heading-20">Link Shared Variable</SheetTitle>
      <SheetClose asChild>
        <Button aria-label="Close" shape="square" svgOnly type="tertiary" typeName="button">
          <X className="size-4" aria-hidden />
        </Button>
      </SheetClose>
    </div>
    <p className="px-4 pb-2 text-copy-14 text-gray-900">
      Changes to shared variables sync automatically across all linked projects.
    </p>
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
      <Combobox
        aria-label="Search for shared environment variables"
        placeholder="Search for shared environment variables…"
        value={search}
      >
        <ComboboxInput />
        <ComboboxList>
          {SHARED_VARS.filter((v) => !linked.includes(\`\${v.key}::\${v.target}\`)).map((v) => (
            <ComboboxOption
              ignoreDefaultHeight
              key={\`\${v.key}::\${v.target}\`}
              value={\`\${v.key}::\${v.target}\`}
            >
              <div className="flex flex-col items-stretch justify-start py-[15px] px-2">
                <p className="font-mono text-sm font-medium">{v.key}</p>
                <p className="mt-[3px] text-xs text-gray-900">{v.target}</p>
              </div>
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  </SheetContent>
</Sheet>`,
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
