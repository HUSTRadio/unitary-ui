/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— batch 5。
 *
 * 结构：DEMO_CODE_BATCH5[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - 本地无 data-demo-card 区块的组件（pagination / device / pill / progress /
 *   project-banner / scroller）不在此映射中。
 */

export const DEMO_CODE_BATCH5: Record<string, Record<string, string>> = {
  radio: {
    default: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

const [value, setValue] = useState("one");

<RadioGroup label="Default Radio Example" onChange={setValue} value={value}>
  <div className="flex flex-col items-stretch justify-start gap-6">
    <RadioGroupItem value="one">Option 1</RadioGroupItem>
    <RadioGroupItem value="two">Option 2</RadioGroupItem>
  </div>
</RadioGroup>`,
    "radio-disabled": `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

const [value, setValue] = useState("one");

<RadioGroup disabled label="Disabled Radio Example" onChange={setValue} value={value}>
  <div className="flex flex-col items-stretch justify-start gap-6">
    <RadioGroupItem value="one">Option 1</RadioGroupItem>
    <RadioGroupItem value="two">Option 2</RadioGroupItem>
  </div>
</RadioGroup>`,
    "radio-required": `import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

const [value, setValue] = useState("");

<form className="flex flex-col items-start justify-start gap-6">
  <RadioGroup label="Required Radio Example" onChange={setValue} required value={value}>
    <div className="flex flex-col items-stretch justify-start gap-4">
      <RadioGroupItem value="one">Option 1</RadioGroupItem>
      <RadioGroupItem value="two">Option 2</RadioGroupItem>
    </div>
  </RadioGroup>
  <Button size="small" typeName="submit">
    Submit
  </Button>
</form>`,
    "radio-headless": `import { RadioGroup, useRadio } from "@/components/ui/radio";
import { useState } from "react";

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
    "radio-standalone": `import { Radio } from "@/components/ui/radio";
import { useState } from "react";

const [value, setValue] = useState("one");

<li className="flex w-full items-center gap-2">
  <span className="text-base leading-6 text-foreground">Option 1</span>
  <Radio
    aria-label="Option 1"
    checked={value === "one"}
    onChange={() => setValue("one")}
    value="one"
  />
</li>`,
  },
  switch: {
    default: `import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="default">
  <SwitchControl defaultChecked label="Source" value="source" />
  <SwitchControl label="Output" value="output" />
</Switch>`,
    disabled: `import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="view-mode">
  <SwitchControl defaultChecked disabled label="Source" value="source" />
  <SwitchControl disabled label="Output" value="output" />
</Switch>`,
    sizes: `import { Switch, SwitchControl } from "@/components/ui/switch";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="sizes-small" size="small">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="sizes-default">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="sizes-large" size="large">
      <SwitchControl defaultChecked label="Source" value="source" />
      <SwitchControl label="Output" value="output" />
    </Switch>
  </div>
</div>`,
    "full-width": `import { Switch, SwitchControl } from "@/components/ui/switch";

<Switch name="full-width" style={{ width: "100%" }}>
  <SwitchControl defaultChecked label="Source" size="large" value="source" />
  <SwitchControl label="Output" size="large" value="output" />
</Switch>`,
    tooltip: `import { Switch, SwitchControl } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";

<Switch name="view-mode">
  <Tooltip text="View Source">
    <SwitchControl defaultChecked label="Source" size="large" value="source" />
  </Tooltip>
  <Tooltip text="View Output">
    <SwitchControl label="Output" size="large" value="output" />
  </Tooltip>
</Switch>`,
    icon: `import { Switch, SwitchControl } from "@/components/ui/switch";
import { LayoutGrid, List } from "lucide-react";

<div className="flex w-full flex-col lg:flex-row lg:flex-wrap">
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="icons-small" size="small">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid aria-hidden />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="icons-default">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid aria-hidden />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
    </Switch>
  </div>
  <div className="relative flex min-w-px max-w-full flex-1 flex-col items-start">
    <Switch name="icons-large" size="large">
      <SwitchControl
        defaultChecked
        icon={<LayoutGrid aria-hidden />}
        label="Source"
        value="source"
      />
      <SwitchControl icon={<List aria-hidden />} label="Output" value="output" />
    </Switch>
  </div>
</div>`,
  },
  sheet: {
    default: `import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

<Sheet modal>
  <SheetTrigger asChild>
    <Button type="default" typeName="button">
      Open Sheet
    </Button>
  </SheetTrigger>
  <SheetContent className="m-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] rounded-2xl bg-background-100 p-0 lg:w-[512px] sm:max-w-[auto] flex flex-col">
    <SheetHeader className="p-6 text-left">
      <SheetTitle>Sheet Title</SheetTitle>
      <p className="text-copy-14 text-foreground">Sheet description</p>
    </SheetHeader>
    <SheetDescription className="px-6 py-4 text-copy-14">Sheet body</SheetDescription>
    <SheetFooter className="p-6 gap-2 flex-row justify-end mt-auto">
      <SheetClose asChild>
        <Button type="secondary" typeName="button">
          Close
        </Button>
      </SheetClose>
      <Button typeName="button">Next</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
    "with-side": `import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

<div className="flex items-center justify-center gap-4">
  {sides.map((side) => (
    <Sheet key={side} modal>
      <SheetTrigger asChild>
        <Button type="default" typeName="button">
          Open {side}
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Sheet from {side}</SheetTitle>
          <p className="text-copy-14 text-foreground">This sheet slides in from the {side}.</p>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ))}
</div>`,
  },
};
