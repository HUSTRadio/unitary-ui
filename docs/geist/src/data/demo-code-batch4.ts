/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— batch 4。
 *
 * 结构：DEMO_CODE_BATCH4[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 覆盖组件：gauge / input / json-view / keyboard-input / loading-dots / label /
 * load-more-button / modal / note。仅收录本地存在 data-demo-card 区块的组件
 * （input、keyboard-input、label、modal）；gauge / json-view / loading-dots /
 * load-more-button / note 在 docs-components-page.tsx 中无 data-demo-card 区块
 * （demo 以 DemoSection 直接渲染、无 Show code），按映射规则跳过。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { ChevronLeft } from "lucide-react"`），不用
 *   @vercel/geistcn-assets；官方 IconArrowCircleUp → lucide ArrowUpCircle。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - Modal 官方 API（active/onClickOutside/sticky/initialFocusRef、ModalBody/
 *   ModalActions/ModalAction/ModalSubtitle/ModalInset）本地未实现，改用本地
 *   open/onOpenChange + ModalContent（className/bodyClassName）组合复刻；
 *   Input 官方 suffixContainer 本地未实现，省略该 prop。
 */

export const DEMO_CODE_BATCH4: Record<string, Record<string, string>> = {
  input: {
    default: `import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-between gap-4 md:flex-row">
  <Input size="small" placeholder="Small" />
  <Input placeholder="Default" />
  <Input size="large" placeholder="Large" />
</div>`,
    "prefix-and-suffix": `import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col items-start justify-start gap-6">
  <Input placeholder="Default" prefix={icon} />
  <Input placeholder="Default" suffix={icon} />
  <Input placeholder="Default" prefix="https://" suffix=".com" />
  <Input
    placeholder="Default"
    prefix={icon}
    prefixStyling={false}
    suffix={icon}
    suffixStyling={false}
  />
  <Input placeholder="Default" prefix="vercel/" suffix={icon} suffixStyling={false} />
</div>`,
    disabled: `import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

const icon = <ArrowUpCircle aria-hidden />;

<div className="flex flex-col items-start justify-start gap-4">
  <Input disabled placeholder="Disabled with placeholder" />
  <Input disabled defaultValue="Disabled with value" />
  <Input disabled placeholder="Disabled with prefix" prefix={icon} />
  <Input disabled placeholder="Disabled with suffix" suffix={icon} />
  <Input disabled placeholder="Disabled with prefix and suffix" prefix="https://" suffix=".com" />
  <Input
    disabled
    placeholder="Disabled with prefix and suffix"
    prefix={icon}
    prefixStyling={false}
    suffix={icon}
    suffixStyling={false}
  />
</div>`,
    error: `import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-start gap-8">
  <Input size="small" error="An error message." placeholder="long-error@gmail.com" />
  <Input error="An error message." placeholder="long-error@gmail.com" />
  <Input size="large" error="An error message." placeholder="long-error@gmail.com" />
</div>`,
    label: `import { Input } from "@/components/ui/input";

<Input label="Label" placeholder="Label" />`,
    "rounded-prefix-and-suffix": `import { Input } from "@/components/ui/input";

<Input rounded prefix="www." suffix=".com" placeholder="Label example" />`,
    "rounded-prefix-and-suffix-without-styling": `import { Input } from "@/components/ui/input";

<Input
  rounded
  prefix="www."
  prefixStyling={false}
  suffix=".com"
  suffixStyling={false}
  placeholder="Label example"
/>`,
  },
  "keyboard-input": {
    modifiers: `import { Kbd } from "@/components/ui/keyboard-input";

<>
  <Kbd meta />
  <Kbd shift />
  <Kbd alt />
  <Kbd ctrl />
</>`,
    combination: `import { Kbd } from "@/components/ui/keyboard-input";

<Kbd meta shift />`,
    small: `import { Kbd } from "@/components/ui/keyboard-input";

<Kbd small>/</Kbd>`,
  },
  label: {
    default: `import { Label } from "@/components/ui/label";

<Label id="label-default" value="This is a label" />`,
    "with-input": `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<>
  <Label id="test-input" value="Email Address" withInput />
  <Input aria-labelledby="test-input" id="test-input" />
</>`,
    "bypass-casing": `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<>
  <Label bypassCasing id="test-input" value="Email address" withInput />
  <Input aria-labelledby="test-input" id="test-input" />
</>`,
  },
  modal: {
    default: `import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <header className="mb-5">
      <h3 className="text-heading-20 text-foreground">Create Token</h3>
      <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
        Enter a unique name for your token to differentiate it from other tokens and then select
        the scope.
      </div>
    </header>
    <p className="text-copy-14">Some content contained within the modal.</p>
    <div className="h-px w-full" aria-hidden />
    <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
      <Button size="small" typeName="button" type="secondary">
        Cancel
      </Button>
      <Button size="small" typeName="button" type="default">
        Submit
      </Button>
    </footer>
  </ModalContent>
</Modal>`,
    sticky: `import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent className="sticky" bodyClassName="pt-0">
    <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 bg-background-200 px-5 py-5">
      <h3 className="text-heading-20 leading-6 text-foreground">Create Token</h3>
    </header>
    {Array.from({ length: 52 }).map((_, index) => (
      <p key={index} className="text-copy-14">
        Some content contained within the modal.
      </p>
    ))}
    <div className="h-px w-full" aria-hidden />
    <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
      <Button size="small" typeName="button" type="secondary">
        Cancel
      </Button>
      <Button
        size="small"
        typeName="button"
        type="secondary"
        prefix={<ChevronLeft className="size-3.5" aria-hidden />}
      >
        Previous
      </Button>
      <Button size="small" typeName="button" type="default">
        Submit
      </Button>
    </footer>
  </ModalContent>
</Modal>`,
    "single-button": `import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent className="sticky" bodyClassName="pt-0">
    <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 bg-background-200 px-5 py-5">
      <h3 className="text-heading-20 leading-6 text-foreground">Create Token</h3>
    </header>
    <p className="text-copy-14">Some content contained within the modal.</p>
    <div className="h-px w-full" aria-hidden />
    <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
      <Button size="small" typeName="button" type="secondary">
        Cancel
      </Button>
    </footer>
  </ModalContent>
</Modal>`,
    inset: `import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <header className="mb-5">
      <h3 className="text-heading-20 text-foreground">Modal</h3>
      <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">This is a modal.</div>
    </header>
    <div className="mx-[-20px] border-y border-gray-400 bg-background-200 px-5 py-6">
      <p className="text-copy-14">Content within the inset.</p>
    </div>
    <div className="pt-5">
      <p className="text-copy-14">Content outside the inset.</p>
    </div>
    <div className="h-px w-full" aria-hidden />
    <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
      <Button size="small" typeName="button" type="secondary">
        Cancel
      </Button>
      <Button size="small" typeName="button" type="default">
        Submit
      </Button>
    </footer>
  </ModalContent>
</Modal>`,
  },
};
