/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— batch 7。
 *
 * 覆盖组件：table / tabs / text-with-copy-button / textarea / toast / toggle / tooltip /
 * theme-switcher / video。仅收录本地存在 data-demo-card 区块的组件（textarea、toggle）；
 * 其余组件在 docs-components-page.tsx 中无 data-demo-card 区块，按映射规则跳过。
 *
 * 结构：DEMO_CODE_BATCH7[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { Lock, LockOpen } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 */

export const DEMO_CODE_BATCH7: Record<string, Record<string, string>> = {
  textarea: {
    default: `import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Default"
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>`,
    disabled: `import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Disabled"
  disabled
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>`,
    error: `import { Textarea } from "@/components/ui/textarea";

<div className="flex flex-col items-stretch justify-start gap-8">
  <Textarea
    aria-label="With error (small)"
    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    error="There has been an error."
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (medium)"
    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    error="There has been an error."
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (large)"
    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    error="There has been an error."
    size="large"
    style={{ minHeight: 100 }}
  />
</div>`,
    sizes: `import { Textarea } from "@/components/ui/textarea";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex flex-col gap-6">
  <Textarea
    aria-label="Textarea"
    defaultValue={loremIpsum}
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={loremIpsum}
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={loremIpsum}
    size="large"
    style={{ minHeight: 100 }}
  />
</div>`,
    "read-only": `import { Textarea } from "@/components/ui/textarea";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<Textarea
  aria-label="Read only"
  defaultValue={loremIpsum}
  readOnly
  style={{ minHeight: 100 }}
/>`,
    rows: `import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Textarea with fixed rows"
  placeholder="Textarea with fixed number of rows"
  rows={5}
/>`,
  },
  toggle: {
    default: `import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked2}
        onChange={() => setChecked2(!checked2)}
      />
    </div>
  );
}`,
    disabled: `import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-col">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly disabled />
  <Toggle aria-label="Enable Firewall" checked readOnly disabled />
</div>`,
    sizes: `import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-row flex-wrap">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="medium" />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />
</div>`,
    "custom-color": `import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
    </div>
  );
}`,
    "with-label": `import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle checked={checked} direction="rtl" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} size="large" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
    </div>
  );
}`,
  },
};
