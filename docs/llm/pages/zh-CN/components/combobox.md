# 组合框

> Route: `/components/combobox`

可搜索的单选列表。

[返回组件](#/components)

# 组合框

Combobox

可搜索的单选列表。

## 何时使用

-   当一个选项列表很长，通过输入过滤能显著提升用户找到目标的效率时；对于短小有固定数量的列表，Select 更合适。
-   需要在选择的同时保持搜索查询的独立状态，这样重新打开列表不会擦除已选值。

## 何时不应使用

-   对于简单的二元选择（开关/启用/禁用），应该使用 Toggle 而不是 Combobox；组合框的交互成本过高。
-   当用户需要从已知列表中多选时；请使用 Multi Select 组合框是单选专用组件。

## 示例

### 非受控组合框

基础的非受控 Combobox，内部状态自行管理选择和查询值。

### 受控组合框

通过外部控制的值和查询展示 Combobox 的受控用法，适用于集成到全局状态管理时。

### 禁用的组合框

展示 Combobox 不可交互时的视觉状态，防止用户进行选择。

### 不同尺寸的组合框

展示 Combobox 提供的尺寸变体（sm、default、lg），以便在不同密度场景中使用。

### 带标签的组合框

Label 与输入关联，保证辅助技术正确读出字段名称。

### 可清空的组合框

清除模式下，用户可以清空已选值回到初始状态。

### 带错误状态的组合框

在无效选择或验证失败时展示红色边框和错误提示。

## 无障碍

-   Combobox 结合输入和列表的原生语义，支持键盘导航：上/下箭头移动焦点，Home/End 跳转首尾项，Enter 激活。
-   搜索建议具有类型 ahead 功能——按输入字符跳转到下一个匹配标签的项目，确保键盘用户也能高效定位选项。

## 受控行为

-   Combobox 支持受控和非受控两种模式；受控模式下通过 value/query props 和 onChange 回调实现完全外部状态管理。
-   已选值和搜索查询被独立追踪，这样重新打开下拉列表时不会丢失之前的选择。

## 响应式行为

-   下拉列表根据窗口边界自动定位位置，避免在窄视口上溢出屏幕。
-   输入框宽度可在自定义宽度和全宽之间切换，下拉列表宽度也跟随输入框大小自适应。

## 主题行为

-   边框、焦点环、选中项背景和下拉列表阴影均自动适配设计系统的颜色和令牌变量。
-   深色主题下的高对比度配色确保文本可阅读性。

## 实时示例

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const [value, setValue] = useState("b");

<Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" disabled placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>
```

-   One
-   Two
-   Three

-   One
-   Two
-   Three

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

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
</div>
```

选择国家或地区

-   United States
-   Canada
-   United Kingdom
-   Germany
-   France
-   Japan
-   Australia
-   Brazil

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

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
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
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
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" errored placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>
```

-   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
-   Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
-   Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

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
</Combobox>
```

```tsx
import { Combobox, ComboboxInput, ComboboxList } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList emptyMessage="Nothing to see here..." />
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
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
</Combobox>
```

-   One
-   Two
-   Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
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
</Combobox>
```

```tsx
import { Button } from "@/components/ui/button";
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
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
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
          {SHARED_VARS.filter((v) => !linked.includes(`${v.key}::${v.target}`)).map((v) => (
            <ComboboxOption
              ignoreDefaultHeight
              key={`${v.key}::${v.target}`}
              value={`${v.key}::${v.target}`}
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
</Sheet>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选择值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收选择变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   过滤能显著帮助用户找到某一选项时用 Combobox；短而固定的列表用 Select。
-   让选中值与搜索查询保持独立，重开列表时不擦除选择。
