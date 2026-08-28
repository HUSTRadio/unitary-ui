# 模态框

> Route: `/components/modal`

显示会中断用户流程的对话框。

[返回组件](#/components)

# 模态框

Modal

显示会中断用户流程的对话框。

## 何时使用

-   当一个决策必须阻止用户继续操作整个页面时（如确认删除、转移项目等）。
-   需要确认破坏性操作时——Drawer 和 Sheet 不会完全遮住页面，因此对删除或撤销等操作显得力度不够。
-   需要弹窗内包含表单输入、Combobox 或其他复杂交互元素时。

## 何时不应使用

-   对于有独立页面的常规创建流程，应路由到该页面而非使用 Modal。
-   当只需要展示持久性关联上下文且底层页面仍可读时，桌面端请使用 Sheet，移动端请使用 Drawer。
-   不要把 Modal 用于低风险的日常确认（保存草稿、丢弃更改），这会带来不必要的摩擦感。

## 示例

### 默认模态框

最基础的 Modal 用法：展示一个带有标题、主体文案和操作按钮的标准对话框，覆盖在遮罩层之上以中断用户的当前操作。

### 粘性模式

使用 sticky 变体让 Modal 的底部操作栏始终固定在可视区域底部，即使内容区域很长也能确保操作按钮随时可点击。

### 内联间距

通过 inset prop 控制 Modal 内部的内边距，适用于需要在紧凑空间中使用模态框但仍保持适当呼吸感的场景。

### 禁用操作按钮

展示如何将 Modal 的主操作按钮设为禁用状态，通常在等待验证结果或未满足前置条件时使用，配合视觉反馈传达当前不可操作的原因。

## 无障碍

-   Modal 将焦点困在对话框内部直至关闭，并将焦点返回给触发元素，确保键盘用户不会迷失在页面上。
-   通过 aria-labelledby 指向 Modal.Title 的 id，屏幕阅读器在打开时会正确播报标题。
-   Enter 键永远不应该在未输入确认文本的情况下触发破坏性操作；应先聚焦 Cancel 按钮以防止误触。

## 受控行为

-   父组件通过 open 属性完全控制 Modal 的显示与隐藏；关闭应在 API 响应后或在错误时保持打开以便重试。
-   支持设置初始焦点目标（如 focus-input-on-open），可以将焦点直接定位到模态框内的某个输入控件上。

## 响应式行为

-   在小视口下 Modal 可以切换为类似 Sheet 的移动底面板行为，确保移动设备上的操作体验流畅。
-   针对移动端的输入场景做了特殊处理（如 mobile-sheet-inputs），避免虚拟键盘遮挡操作按钮。

## 主题行为

-   Modal 的背景遮罩色、内容区域的背景以及按钮颜色均遵循主题令牌，自动适配浅色和深色模式。
-   自定义配色可以与设计系统的 Token 变量无缝配合，保持一致的品牌视觉。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";
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
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
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
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
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
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
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
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
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

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal</ModalTitle>
      <ModalDescription>This is a modal.</ModalDescription>
    </ModalHeader>
    <p className="text-copy-14">Some content contained within the modal.</p>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" disabled onClick={() => setOpen(false)}>
        Submit
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useRef, useState } from "react";

const [open, setOpen] = useState(false);
const initialFocusRef = useRef<HTMLButtonElement>(null);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent
    onOpenAutoFocus={(event) => {
      event.preventDefault();
      initialFocusRef.current?.focus();
    }}
  >
    <ModalHeader>
      <ModalTitle>Initial Focus</ModalTitle>
      <ModalDescription>
        This Modal is set up to programmatically move the focus onto the Submit button, making it
        possible to promptly continue with the Enter key.
      </ModalDescription>
    </ModalHeader>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" ref={initialFocusRef} onClick={() => setOpen(false)}>
        Submit
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useRef, useState } from "react";

const [open, setOpen] = useState(false);
const [name, setName] = useState("");
const initialFocusRef = useRef<HTMLInputElement>(null);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent
    onOpenAutoFocus={(event) => {
      event.preventDefault();
      initialFocusRef.current?.focus();
    }}
  >
    <ModalHeader>
      <ModalTitle>Invite Member</ModalTitle>
      <ModalDescription>
        On both desktop and the mobile bottom sheet, the Name field receives focus when the Modal
        opens so the user can start typing immediately.
      </ModalDescription>
    </ModalHeader>
    <div className="flex flex-col gap-3">
      <Input
        label="Name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        ref={initialFocusRef}
        value={name}
      />
    </div>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" onClick={() => setOpen(false)}>
        Send Invite
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const [name, setName] = useState("");
const [email, setEmail] = useState("");

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Invite Member</ModalTitle>
      <ModalDescription>
        On a mobile viewport this opens as a bottom sheet. Verify that both inputs receive focus
        and accept keyboard input.
      </ModalDescription>
    </ModalHeader>
    <div className="flex flex-col gap-3">
      <Input
        label="Name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        value={name}
      />
      <Input
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jane@example.com"
        value={email}
      />
    </div>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" onClick={() => setOpen(false)}>
        Send Invite
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from "@/components/ui/combobox";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useState } from "react";

const regions = [
  { value: "iad1", label: "Washington, D.C., USA (East) – iad1" },
  { value: "sfo1", label: "San Francisco, USA (West) – sfo1" },
  { value: "lhr1", label: "London, UK (London) – lhr1" },
  { value: "fra1", label: "Frankfurt, Germany (Central EU) – fra1" },
  { value: "sin1", label: "Singapore (Southeast Asia) – sin1" },
];

const [open, setOpen] = useState(false);
const [region, setRegion] = useState<string | null>(null);

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Create Database</ModalTitle>
      <ModalDescription>
        Choose a region for your database. Reads and writes will take place in this region.
      </ModalDescription>
    </ModalHeader>
    <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
      <Combobox
        aria-label="Region"
        label="Region"
        onValueChange={setRegion}
        placeholder="Search regions..."
        size="small"
        value={region}
      >
        <ComboboxInput />
        <ComboboxList>
          {regions.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button typeName="button" onClick={() => setOpen(false)}>
        Create Database
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

```tsx
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useToasts } from "@/components/ui/toast";
import { useState } from "react";

const [open, setOpen] = useState(false);
const toasts = useToasts();

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Toasts and Focus Trap</ModalTitle>
      <ModalDescription>
        The Modal traps focus, so Tab stays within it. Toasts still render above the Modal and
        remain interactive — trigger one, then click its action. The Modal stays open and focus
        returns to it.
      </ModalDescription>
    </ModalHeader>
    <div className="flex flex-col gap-3">
      <Button
        onClick={() =>
          toasts.message({
            text: "Project link copied",
            action: "Undo",
            onAction: () => toasts.message({ text: "Copy reverted" }),
          })
        }
        size="small"
        type="secondary"
        typeName="button"
      >
        Show Toast
      </Button>
    </div>
    <div className="h-px w-full" aria-hidden />
    <ModalFooter>
      <Button typeName="button" onClick={() => setOpen(false)}>
        Done
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Modal, ModalContent, ModalTitle, ModalDescription, ModalClose } from "@/components/ui/modal"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控对话框状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控初始状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收打开状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   当决定必须阻断页面其余部分时用 Modal。需要持久关联上下文且底层页面保持可读时，桌面用 Sheet、移动端用 Drawer。
-   在 Modal 中确认破坏性动作。Drawer 和 Sheet 不完全遮罩页面，对删除或撤销来说太软。
-   有专门页面的常规创建流程不要用 Modal；直接路由到页面。
-   任何破坏性 Modal 的默认焦点落在 Cancel。没有输入确认时，Enter 绝不能触发破坏性动作。
-   非破坏性 Modal 允许 Escape 与外部点击关闭；有未保存输入的破坏性 Modal 要门控关闭。
-   Modal 打开时困住焦点，关闭时还给触发器。在 Modal 卸载的同一帧恢复 body 滚动。
-   高风险破坏性动作（删除生产资源、轮换签名密钥、降级套餐）用资源名称的输入匹配门控主按钮。
-   Modal.Title 是首字母大写陈述句，绝不是疑问句。Transfer Project 正确；Transfer Project? 错误。
-   Modal 正文句首大写、1–3 句。先说后果，再说任何级联。
-   主按钮是 动词 + 名词 且与标题动词匹配（Transfer Project 标题配 Transfer Project 按钮）。破坏性主按钮绝不用 Confirm、OK 或裸动词。
-   Cancel 字面保持 Cancel。纯确认型 Modal（密钥揭示后、一次性展示后）用 Done，绝不用 OK 或 Close。
-   不可逆正文用 This cannot be undone.；仅级联正文用 Some effects cannot be undone.。对部分级联不要宣称完全不可逆。
-   成功 toast 动词与主按钮 1:1 配对：Delete Project 按钮，Project deleted toast。
-   把 aria-labelledby 设为 Modal.Title 的 id，让屏幕阅读器打开即播报标题。
-   Cancel 按钮字面保持 Cancel，让读屏用户在跨破坏性流程中听到稳定的关闭标签。
-   Modal 内出错后保持焦点在内部让用户重试；成功后把焦点还给触发器。
