/**
 * Batch 4 — Section 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SECTION_BATCH4[组件 slug][Section title] = 该 Section 的完整 TSX 源码。
 * 与 batch1-3 同一约定：import 路径 @/components/ui/*，prop 为本地实现子集，
 * 图标用 lucide-react，key 与 renderExtraSections 里 <Section title="X"> 的 title 原文一致。
 */

export const DEMO_CODE_SECTION_BATCH4: Record<string, Record<string, string>> = {
  button: {
    Variants: `import { Button } from "@/components/ui/button";

<div className="flex flex-wrap items-center gap-3">
  <Button typeName="button">Default</Button>
  <Button type="secondary" typeName="button">Secondary</Button>
  <Button type="tertiary" typeName="button">Outline</Button>
  <Button type="tertiary" typeName="button">Ghost</Button>
  <Button type="error" typeName="button">Destructive</Button>
</div>`,
    "Prefix and Suffix": `import { Button } from "@/components/ui/button";
import { Copy, Search } from "lucide-react";

<div className="flex flex-wrap items-center gap-3">
  <Button prefix={<Search />} typeName="button">Search</Button>
  <Button prefix={<Copy />} type="secondary" typeName="button">Copy</Button>
  <Button loading type="tertiary" typeName="button">Loading</Button>
  <Button disabled typeName="button">Disabled</Button>
</div>`,
  },
  input: {
    States: `import { Input } from "@/components/ui/input";

<div className="flex w-full max-w-md flex-col gap-3">
  <Input aria-label="Default" placeholder="Default" />
  <Input aria-label="Disabled" disabled placeholder="Disabled" />
  <Input aria-label="With value" defaultValue="geist-docs" placeholder="With value" />
</div>`,
  },
  select: {
    "With Options": `import { Select, SelectItem } from "@/components/ui/select";

<Select className="w-56" defaultValue="banana" aria-label="Select fruit">
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="orange">Orange</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
  <SelectItem value="grape">Grape</SelectItem>
</Select>`,
  },
  checkbox: {
    Indeterminate: `import { Checkbox } from "@/components/ui/checkbox";

<div className="flex flex-col gap-3">
  <label className="flex cursor-pointer items-center gap-2.5">
    <Checkbox indeterminate aria-label="Indeterminate" />
    <span className="text-copy-14 text-foreground">Indeterminate (partial selection)</span>
  </label>
  <label className="flex cursor-pointer items-center gap-2.5">
    <Checkbox checked readOnly aria-label="Checked" />
    <span className="text-copy-14 text-muted-foreground">Checked</span>
  </label>
  <label className="flex cursor-pointer items-center gap-2.5">
    <Checkbox aria-label="Unchecked" />
    <span className="text-copy-14 text-muted-foreground">Unchecked</span>
  </label>
</div>`,
  },
  radio: {
    "Radio disabled": `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

<RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
  <div className="flex flex-col items-stretch justify-start gap-6">
    <RadioGroupItem value="one">Option 1</RadioGroupItem>
    <RadioGroupItem value="two">Option 2</RadioGroupItem>
  </div>
</RadioGroup>`,
    "Radio required": `import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

<form className="flex flex-col items-start justify-start gap-6">
  <RadioGroup label="Required Radio Example" required defaultValue="">
    <div className="flex flex-col items-stretch justify-start gap-4">
      <RadioGroupItem value="one">Option 1</RadioGroupItem>
      <RadioGroupItem value="two">Option 2</RadioGroupItem>
    </div>
  </RadioGroup>
  <Button size="small">Submit</Button>
</form>`,
    "Radio headless": `import { useState } from "react";
import { RadioGroup, useRadio } from "@/components/ui/radio";

const [value, setValue] = useState("one");
const { component } = useRadio({ value: "one", disabled: false });
const { component: component2 } = useRadio({ value: "two", disabled: false });

<RadioGroup aria-label="Options" onChange={setValue} value={value}>
  <div className="flex w-full min-w-56 flex-col items-stretch justify-start gap-6">
    <label className="flex w-full items-center justify-between leading-6">
      <span className="text-copy-13 leading-6 text-foreground">Option 1</span>
      {component}
    </label>
    <label className="flex w-full items-center justify-between leading-6">
      <span className="text-copy-13 leading-6 text-foreground">Option 2</span>
      {component2}
    </label>
  </div>
</RadioGroup>`,
    "Radio standalone": `import { Radio } from "@/components/ui/radio";

<li className="flex w-full items-center gap-2">
  <span className="text-base leading-6 text-foreground">Option 1</span>
  <Radio aria-label="Option 1" defaultChecked value="one" />
</li>`,
  },
  switch: {
    Disabled: `import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full max-w-md flex-col items-start">
  <Switch name="reference-view-mode">
    <SwitchControl defaultChecked disabled label="Source" value="source" />
    <SwitchControl disabled label="Output" value="output" />
  </Switch>
</div>`,
    Sizes: `import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-small" size="small">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-default">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-sizes-large" size="large">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
</div>`,
    "Full width": `import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="reference-full-width" style={{ width: "100%" }}>
  <SwitchControl defaultChecked label="Source" value="source" />
  <SwitchControl label="Output" value="output" />
</Switch>`,
    Tooltip: `import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full max-w-md flex-col items-start">
  <Switch name="reference-tooltip">
    <Tooltip text="View Source">
      <SwitchControl defaultChecked label="Source" size="large" value="source" />
    </Tooltip>
    <Tooltip text="View Output">
      <SwitchControl label="Output" size="large" value="output" />
    </Tooltip>
  </Switch>
</div>`,
    Icon: `import { LayoutGrid, List } from "lucide-react";
import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-small" size="small">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-default">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="reference-icons-large" size="large">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List />} label="Output" value="output" />
    </Switch>
  </div>
</div>`,
  },
  textarea: {
    Error: `import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-8">
  <Textarea
    aria-label="With error (small)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (medium)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (large)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="large"
    style={{ minHeight: 100 }}
  />
</div>`,
    Sizes: `import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-6">
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="large"
    style={{ minHeight: 100 }}
  />
</div>`,
    "Read Only": `import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col">
  <Textarea
    aria-label="Read only"
    defaultValue={LOREM_IPSUM}
    readOnly
    style={{ minHeight: 100 }}
  />
</div>`,
    Rows: `import { Textarea } from "@/components/ui/textarea";

<div className="flex w-full max-w-md flex-col">
  <Textarea
    aria-label="Textarea with fixed rows"
    placeholder="Textarea with fixed number of rows"
    rows={5}
  />
</div>`,
  },
  label: {
    "With Input": `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label id="label-input" value="Email Address" withInput />
  <Input
    aria-labelledby="label-input"
    id="label-input"
    placeholder="Enter email address..."
  />
</div>`,
    "Bypass Casing": `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label bypassCasing id="label-input-bypass" value="Email address" withInput />
  <Input
    aria-labelledby="label-input-bypass"
    id="label-input-bypass"
    placeholder="Enter email address..."
  />
</div>`,
  },
  collapse: {
    Default: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<div className="flex w-full max-w-md flex-col gap-3">
  <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question A
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </CollapseContent>
  </Collapse>
  <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question B
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      fugiat nulla pariatur.
    </CollapseContent>
  </Collapse>
</div>`,
    Expanded: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<div className="flex w-full max-w-md flex-col gap-3">
  <Collapse className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question A
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </CollapseContent>
  </Collapse>
  <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question B
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      fugiat nulla pariatur.
    </CollapseContent>
  </Collapse>
</div>`,
    Multiple: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<div className="flex w-full max-w-md flex-col gap-3">
  <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question A
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua.
    </CollapseContent>
  </Collapse>
  <Collapse defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
    <CollapseTrigger className="text-label-14 text-foreground">
      Question B
    </CollapseTrigger>
    <CollapseContent className="pt-3 text-copy-14 text-muted-foreground">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      fugiat nulla pariatur.
    </CollapseContent>
  </Collapse>
</div>`,
    Small: `import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

<Collapse className="w-full max-w-sm rounded-[8px] border border-gray-alpha-400 p-3">
  <CollapseTrigger className="text-label-13 text-foreground">
    Question A
  </CollapseTrigger>
  <CollapseContent className="pt-2 text-copy-13 text-muted-foreground">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua.
  </CollapseContent>
</Collapse>`,
  },
  table: {
    Default: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRoot,
} from "@/components/ui/table";

<TableRoot>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Col 1</TableHead>
        <TableHead>Col 2</TableHead>
        <TableHead>Col 3</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Value 1.1</TableCell>
        <TableCell>Value 1.2</TableCell>
        <TableCell>Value 1.3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Value 2.1</TableCell>
        <TableCell>Value 2.2</TableCell>
        <TableCell>Value 2.3</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableRoot>`,
  },
};
