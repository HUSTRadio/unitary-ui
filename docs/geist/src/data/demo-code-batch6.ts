/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— batch 6。
 *
 * 结构：DEMO_CODE_BATCH6[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - 本地无 data-demo-card 区块的组件（show-more / skeleton / snippet / spinner /
 *   status-dot / step-point）不在此映射中。
 */

export const DEMO_CODE_BATCH6: Record<string, Record<string, string>> = {
  select: {
    sizes: `import { Select, SelectItem } from "@/components/ui/select";

<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
  <Select aria-label="Small" placeholder="Small" size="small">
    <SelectItem value="option-1">Option 1</SelectItem>
    <SelectItem value="option-2">Option 2</SelectItem>
    <SelectItem value="option-3">Option 3</SelectItem>
  </Select>
  <Select aria-label="Default" placeholder="Default">
    <SelectItem value="option-1">Option 1</SelectItem>
    <SelectItem value="option-2">Option 2</SelectItem>
    <SelectItem value="option-3">Option 3</SelectItem>
  </Select>
  <Select aria-label="Large" placeholder="Large" size="large">
    <SelectItem value="option-1">Option 1</SelectItem>
    <SelectItem value="option-2">Option 2</SelectItem>
    <SelectItem value="option-3">Option 3</SelectItem>
  </Select>
</div>`,
    "prefix-and-suffix": `import { Select } from "@/components/ui/select";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
  <Select aria-label="Small" placeholder="Small" size="small" prefix={icon} suffix={icon} />
  <Select aria-label="Default" placeholder="Default" prefix={icon} suffix={icon} />
  <Select aria-label="Large" placeholder="Large" size="large" prefix={icon} suffix={icon} />
</div>`,
    disabled: `import { Select } from "@/components/ui/select";

<Select aria-label="Disabled" disabled placeholder="Disabled with placeholder" />`,
    error: `import { Select } from "@/components/ui/select";

<Select aria-label="Small with error" error="Please select a value." placeholder="Small" size="small" />
<Select aria-label="Default with error" error="Please select a value." placeholder="Default" />
<Select aria-label="Large with error" error="Please select a value." placeholder="Large" size="large" />`,
    label: `import { Select } from "@/components/ui/select";

<Select label="My label" placeholder="With label" />`,
    "with-options": `import { Select, SelectItem } from "@/components/ui/select";

<Select aria-label="Fruit" placeholder="Select a fruit">
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="orange">Orange</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
  <SelectItem value="grape">Grape</SelectItem>
</Select>
<Select aria-label="Fruit with default value" defaultValue="banana" placeholder="With default value">
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="orange">Orange</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
  <SelectItem value="grape">Grape</SelectItem>
</Select>`,
    required: `import { Select, SelectItem } from "@/components/ui/select";

<Select label="Required field" placeholder="Please select an option" required>
  <SelectItem value="option1">Option 1</SelectItem>
  <SelectItem value="option2">Option 2</SelectItem>
  <SelectItem value="option3">Option 3</SelectItem>
</Select>`,
  },
  separator: {
    horizontal: `import { Separator } from "@/components/ui/separator";

<div className="space-y-4">
  <div>
    <h3 className="text-label-16">Section 1</h3>
    <p className="text-copy-14 text-gray-900">This is the first section of content.</p>
  </div>
  <Separator />
  <div>
    <h3 className="text-label-16">Section 2</h3>
    <p className="text-copy-14 text-gray-900">This is the second section of content.</p>
  </div>
</div>`,
    vertical: `import { Separator } from "@/components/ui/separator";

<div className="flex h-8 items-center space-x-4">
  <p className="text-copy-14 text-gray-1000">Home</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">About</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">Services</p>
  <Separator orientation="vertical" />
  <p className="text-copy-14 text-gray-1000">Contact</p>
</div>`,
    "orientation-variants": `import { Separator } from "@/components/ui/separator";

<div className="space-y-8">
  <div>
    <h4 className="mb-2 text-label-14">Horizontal Separators</h4>
    <div className="space-y-2">
      <p className="text-copy-14">Content above separator</p>
      <Separator orientation="horizontal" />
      <p className="text-copy-14">Content below separator</p>
    </div>
  </div>
  <div>
    <h4 className="mb-2 text-label-14">Vertical Separators</h4>
    <div className="flex h-6 items-center space-x-2">
      <span className="text-copy-14">Left</span>
      <Separator orientation="vertical" />
      <span className="text-copy-14">Center</span>
      <Separator orientation="vertical" />
      <span className="text-copy-14">Right</span>
    </div>
  </div>
</div>`,
  },
  slider: {
    default: `import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);

<Slider value={value} onValueChange={setValue} aria-label="Value" />`,
    "step-max": `import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[20]} step={10} max={50} marks aria-label="Value in steps of 10" />`,
    "with-label": `import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([40]);

<Slider label="Volume" value={value} onValueChange={setValue} />`,
    "range-with-inputs": `import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50, 75]);

<Slider showStartInput showEndInput value={value} onValueChange={setValue} aria-label="Range" />`,
    "disabled-range-with-inputs": `import { Slider } from "@/components/ui/slider";

<Slider disabled showStartInput showEndInput value={[50, 75]} aria-label="Range" />`,
    "commit-on-release": `import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const [value, setValue] = useState([50]);
const [committed, setCommitted] = useState<number | null>(null);

<Slider
  label="Drag then release"
  value={value}
  onValueChange={setValue}
  onValueCommitted={(value) => setCommitted(value[0] ?? null)}
/>
<p className="mt-2 text-copy-13 text-gray-900">
  Last committed: {committed === null ? "—" : committed}
</p>`,
  },
};
