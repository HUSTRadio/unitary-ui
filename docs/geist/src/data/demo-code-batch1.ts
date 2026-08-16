/**
 * Batch 1 — 组件 demo 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_BATCH1[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - 本地无 data-demo-card 区块的组件（avatar / badge / banner / book / browser /
 *   breadcrumbs）不在此映射内，其 demo 区块在页面里以 Section 直接渲染、无 Show code。
 * - Button 官方 `variant` prop 本地对应为 `type`（视觉变体），HTML type 属性用 `typeName`。
 */

export const DEMO_CODE_BATCH1: Record<string, Record<string, string>> = {
  button: {
    sizes: `import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button size="small" typeName="button">Upload</Button>
  <Button typeName="button">Upload</Button>
  <Button size="large" typeName="button">Upload</Button>
</div>`,
    "all-types-and-sizes-in-comparison": `import { Button } from "@/components/ui/button";

<div className="flex flex-col gap-6">
  <div className="flex items-center gap-3">
    <Button size="small" type="default" typeName="button">Upload</Button>
    <Button size="small" type="error" typeName="button">Upload</Button>
    <Button size="small" type="warning" typeName="button">Upload</Button>
    <Button size="small" type="secondary" typeName="button">Upload</Button>
    <Button size="small" type="tertiary" typeName="button">Upload</Button>
  </div>
  <div className="flex items-center gap-3">
    <Button type="default" typeName="button">Upload</Button>
    <Button type="error" typeName="button">Upload</Button>
    <Button type="warning" typeName="button">Upload</Button>
    <Button type="secondary" typeName="button">Upload</Button>
    <Button type="tertiary" typeName="button">Upload</Button>
  </div>
  <div className="flex items-center gap-3">
    <Button size="large" type="default" typeName="button">Upload</Button>
    <Button size="large" type="error" typeName="button">Upload</Button>
    <Button size="large" type="warning" typeName="button">Upload</Button>
    <Button size="large" type="secondary" typeName="button">Upload</Button>
    <Button size="large" type="tertiary" typeName="button">Upload</Button>
  </div>
</div>`,
    shapes: `import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button aria-label="Upload" shape="square" size="tiny" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" size="small" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="square" size="large" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="tiny" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="small" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" svgOnly typeName="button">
    <ArrowUp />
  </Button>
  <Button aria-label="Upload" shape="circle" size="large" svgOnly typeName="button">
    <ArrowUp />
  </Button>
</div>`,
    "prefix-and-suffix": `import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button prefix={<ArrowLeft />} typeName="button">Upload</Button>
  <Button suffix={<ArrowRight />} typeName="button">Upload</Button>
  <Button prefix={<ArrowLeft />} suffix={<ArrowRight />} typeName="button">Upload</Button>
</div>`,
    rounded: `import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button shadow shape="rounded" size="small" type="secondary" typeName="button">Upload</Button>
  <Button shadow shape="rounded" type="secondary" typeName="button">Upload</Button>
  <Button shadow shape="rounded" size="large" type="secondary" typeName="button">Upload</Button>
</div>`,
    loading: `import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button loading size="small" typeName="button">Upload</Button>
  <Button loading typeName="button">Upload</Button>
  <Button loading size="large" typeName="button">Upload</Button>
</div>`,
    disabled: `import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button disabled size="small" typeName="button">Upload</Button>
  <Button disabled typeName="button">Upload</Button>
  <Button disabled size="large" typeName="button">Upload</Button>
</div>`,
    "disabled-variants": `import { Button } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <Button disabled typeName="button">Default</Button>
  <Button disabled type="secondary" typeName="button">Secondary</Button>
  <Button disabled type="tertiary" typeName="button">Tertiary</Button>
  <Button disabled type="error" typeName="button">Error</Button>
  <Button disabled type="warning" typeName="button">Warning</Button>
</div>`,
    link: `import { ButtonLink } from "@/components/ui/button";

<ButtonLink className="w-fit" href="#">
  Sign Up
</ButtonLink>`,
    custom: `import { CustomButton } from "@/components/ui/button";

<div className="flex flex-col items-start gap-4 md:flex-row">
  <CustomButton
    active={{
      foreground: "#fff",
      background: "var(--blue-700)",
      border: "var(--blue-700)",
    }}
    hover={{
      foreground: "#fff",
      background: "#0B7BFE",
      border: "var(--blue-700)",
    }}
    normal={{
      foreground: "#fff",
      background: "var(--blue-700)",
      border: "var(--blue-700)",
    }}
    width={160}
  >
    Upgrade to Pro
  </CustomButton>
</div>`,
  },
  checkbox: {
    default: `import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onChange={(): void => setChecked((b) => !b)}>
  Option 1
</Checkbox>`,
    disabled: `import { Checkbox } from "@/components/ui/checkbox";

<div className="flex flex-col items-stretch justify-start gap-4">
  <Checkbox disabled>Disabled</Checkbox>
  <Checkbox checked disabled>Disabled Checked</Checkbox>
  <Checkbox disabled indeterminate>Disabled Indeterminate</Checkbox>
</div>`,
    indeterminate: `import { Checkbox } from "@/components/ui/checkbox";

<Checkbox indeterminate>Option 1</Checkbox>`,
  },
  choicebox: {
    "single-select": `import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("trial");

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="radio"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
</ChoiceboxGroup>`,
    "multi-select": `import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState([] as string[]);

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="checkbox"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
</ChoiceboxGroup>`,
    disabled: `import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("");
const [value2, setValue2] = useState([] as string[]);

<div className="flex flex-col items-stretch justify-start gap-6">
  <ChoiceboxGroup
    disabled
    label="Choicebox group disabled"
    listClassName="flex-row"
    onChange={setValue}
    showLabel
    type="radio"
    value={value}
  >
    <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial" />
    <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
  </ChoiceboxGroup>

  <ChoiceboxGroup
    label="Single input disabled"
    listClassName="flex-row"
    onChange={setValue2}
    showLabel
    type="checkbox"
    value={value2}
  >
    <ChoiceboxGroupItem description="Free for two weeks" disabled title="Pro Trial" value="trial" />
    <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro" />
  </ChoiceboxGroup>
</div>`,
    "custom-content": `import { Badge } from "@/components/ui/badge";
import { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
import { useState } from "react";

const [value, setValue] = useState("trial");

<ChoiceboxGroup
  label="select a plan"
  listClassName="flex-row"
  onChange={setValue}
  type="radio"
  value={value}
>
  <ChoiceboxGroupItem description="Free for two weeks" title="Pro Trial" value="trial">
    <div className="flex justify-center p-2">
      <Badge variant="purple">Trial</Badge>
    </div>
  </ChoiceboxGroupItem>
  <ChoiceboxGroupItem description="Get started now" title="Pro" value="pro">
    <div className="flex justify-center p-2">
      <Badge variant="blue">Pro</Badge>
    </div>
  </ChoiceboxGroupItem>
</ChoiceboxGroup>`,
  },
};
