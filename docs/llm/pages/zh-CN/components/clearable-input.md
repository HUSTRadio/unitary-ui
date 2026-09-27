# 可清空输入框

> Route: `/components/clearable-input`

带内联 Esc 键帽、支持按 Escape 清除内容的输入框。

[返回组件](#/components)

# 可清空输入框

clearable-input

带内联 Esc 键帽、支持按 Escape 清除内容的输入框。

## 何时使用

- 用户在搜索、过滤或短查询字段中频繁需要清除当前输入值。
- 需要一种不增加额外按钮空间的快速回退方式，让用户一键还原到空白状态。

## 何时不应使用

- 表单字段的值不应轻易被清除，比如关键身份验证信息；应使用明确的 Delete 按钮来确认删除操作。
- 当输入内容较长且用户可能希望部分保留时；截断和粘贴（Middle Truncate）更适合展示型场景。

## 示例

### 默认可清空输入框

不带标签的基础 Clearable Input，展示输入区域及其内联清除键帽。

### 带标签的可清空输入框

将可见标签与原生日生输入关联以支持屏幕阅读器，同时保持 Escape 清除功能可用。

### 与命令菜单集成的可清空输入框

在 Command Menu 等命令面板场景中用作搜索输入框，提供 CmdK 风格的键盘交互。

### 禁用状态的可清空输入框

展示输入框不可编辑时的视觉状态；禁止交互而非仅仅隐藏清除图标。

### 带清空回调的可清空输入框

通过 onChange 处理程序监听值的变化，便于在清空后执行自定义逻辑，如重置搜索结果。

## 无障碍

- 为原生输入设置可见标签，确保屏幕阅读器能够正确读取。
- 清除按钮作为输入的一部分，不需要额外的 aria-label；Escape 键从输入本身即可触发清除。

## 受控行为

- Clearable Input 受控行为由其父级 input 的值和 onChange 驱动。
- 传入 value 和 onChange 可实现完全受控模式；点击清除键帽或按 Escape 会沿原生 input 事件路径清空，并在之后调用可选的 onClear。

## 响应式行为

- 宽度由父容器或 layout 控制，可设置固定宽度、最大/最小宽度或 flex。
- CmdK 快捷键后缀在窄视口隐藏；清除键帽按钮在粗指针设备隐藏，键盘用户仍可从输入框按 Escape 清空。

## 主题行为

- 跟随设计系统颜色变量，在不同主题下自动适配边框、文字和背景颜色。
- 清除键帽继承主题前景色，并在悬停和聚焦时使用同一套语义颜色令牌。

## 实时示例

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Demo clearable input"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## 带标签

Email

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithLabelBB9F6883Example() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      label="Email"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter your email..."
      value={value}
    />
  );
}
```

## 配合 cmdk 使用

Esc⌘K

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <ClearableInput
      aria-label="Search with cmdk"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Search..."
      value={value}
    />
  );
}
```

## 禁用

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("Some text");

  return (
    <ClearableInput
      aria-label="Disabled clearable input"
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## 清除回调

Cleared 0 times

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
import { useState } from "react";

export function ClearableInputWithClearCallback3538EFCAExample() {
  const [value, setValue] = useState("");

  const [clearCount, setClearCount] = useState(0);

  return (
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
      <p className="text-copy-14 text-muted-foreground">Cleared {clearCount} times</p>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ClearableInput } from "@/components/ui/clearable-input";
```

原生属性：`InputHTMLAttributes<HTMLInputElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">与原生输入框关联的可见标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cmdk</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示桌面端命令菜单快捷键后缀。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClear</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">点击清除控件时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控制根容器宽度和输入表面高度约束。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 搜索、过滤和短查询字段（重置当前值很频繁）用 Clearable Input。
- 把可见标签关联到原生 input，并让 Escape 清除可从 input 本身触发。
