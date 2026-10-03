# 输入框

> Route: `/components/input`

输入名称、邮箱等单行文本。

[返回组件](#/components)

# 输入框

input

输入名称、邮箱等单行文本。

## 何时使用

- 用户需要输入单行自由格式文本时，如项目名称、邮箱地址、API 密钥或域名。
- 需要进行字段级验证并以即时反馈告诉用户输入是否有效的场景。
- 作为表单的一部分，与其他控件一起提交到后端。

## 何时不应使用

- 当内容可能换行为多行时，应使用 Textarea 而非 Input，因为 Input 的 single-line 语义不适合块状文本。
- 当值来自预定义的列表供用户筛选选择时，应使用 Combobox 而非自由输入。
- 不要将带标签的 Input 包裹在 Tooltip 中——应将解释说明放在旁边的图标按钮上，以确保标签能被屏幕阅读器正确播报。

## 示例

### 默认输入框

基本输入框用法，包含占位符提示和标准的外观样式，适用于大多数通用文本输入场景。

### 前缀和后缀

在输入框内部添加前缀和后缀元素，如在 URL 输入框中添加 'https://' 前缀或在用户名后添加域名后缀。

### 错误状态

通过 error prop 传递验证消息字符串来展示字段的校验失败状态，红色边框和错误文本提供清晰的视觉反馈。

### 带标签的输入框

配合可见 label 的正确用法；组件会关联标签与输入，并在未提供 id 时自动生成。

## 无障碍

- 传入 label 时，Input 通过 htmlFor/id 关联标签与字段；未提供 id 时会自动生成。
- 错误状态通过 error prop 传递的消息会被添加到 aria-describedby 中，帮助器文本也应通过此机制关联。

## 受控行为

- Input 接受 value 和 onChange 来控制受控行为，也可使用未受控方式通过默认值初始化。
- 提交前去除首尾空格，避免相同输入被识别为不同值。

## 响应式行为

- Input 会遵循调用方提供的宽度与父容器约束；组件本身不包含视口断点或自动字号调整。
- 前缀和后缀保持固定的内联布局；窄屏下的宽度、换行与重排由调用方容器负责。

## 主题行为

- 输入框的边框颜色、背景色和聚焦状态均遵循主题变量，包括深色模式的适配。
- 错误状态的红色边框和正常状态的颜色区分遵循设计系统的色彩规范。

## 实时示例

```tsx
import { Input } from "@/components/ui/input";

export function InputDefault37A8EEC1Example() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
      <Input size="small" placeholder="Small" />
      <Input placeholder="Default" />
      <Input size="large" placeholder="Large" />
    </div>
  );
}
```

## 前缀与后缀

https://.com

unitary/

```tsx
import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

export function InputPrefixAndSuffix99076368Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
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
      <Input placeholder="Default" prefix="unitary/" suffix={icon} suffixStyling={false} />
    </div>
  );
}
```

## 禁用

https://.com

```tsx
import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";

export function InputDisabled17EB3C01Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <Input disabled placeholder="Disabled with placeholder" />
      <Input disabled defaultValue="Disabled with value" />
      <Input disabled placeholder="Disabled with prefix" prefix={icon} />
      <Input disabled placeholder="Disabled with suffix" suffix={icon} />
      <Input
        disabled
        placeholder="Disabled with prefix and suffix"
        prefix="https://"
        suffix=".com"
      />
      <Input
        disabled
        placeholder="Disabled with prefix and suffix"
        prefix={icon}
        prefixStyling={false}
        suffix={icon}
        suffixStyling={false}
      />
    </div>
  );
}
```

## 错误

An error message.

An error message.

An error message.

```tsx
import { Input } from "@/components/ui/input";

export function InputErrorCA00FCCFExample() {
  return (
    <div className="flex flex-col items-start justify-start gap-8">
      <Input size="small" error="An error message." placeholder="long-error@gmail.com" />
      <Input error="An error message." placeholder="long-error@gmail.com" />
      <Input size="large" error="An error message." placeholder="long-error@gmail.com" />
    </div>
  );
}
```

## 标签

Label

```tsx
import { Input } from "@/components/ui/input";

export function InputLabel1ACA80E8Example() {
  return <Input label="Label" placeholder="Label" />;
}
```

## 圆角前缀与后缀

www..com

```tsx
import { Input } from "@/components/ui/input";

export function InputRoundedPrefixAndSuffix04A5C184Example() {
  return <Input rounded prefix="www." suffix=".com" placeholder="Label example" />;
}
```

## 圆角前缀与后缀（无装饰样式）

www..com

```tsx
import { Input } from "@/components/ui/input";

export function InputRoundedPrefixAndSuffixWithoutStyling437B8F06Example() {
  return (
    <Input
      rounded
      prefix="www."
      prefixStyling={false}
      suffix=".com"
      suffixStyling={false}
      placeholder="Label example"
    />
  );
}
```

## 状态

```tsx
import { Input } from "@/components/ui/input";

export function InputStates2F6E9DAEExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Disabled" disabled placeholder="Disabled" />
      <Input aria-label="With value" defaultValue="unitary-docs" placeholder="With value" />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Input } from "@/components/ui/input";
```

还支持以下类型中定义的属性：`InputHTMLAttributes<HTMLInputElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large" | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">输入框高度；数字会透传给原生 size 属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">字段下方渲染的校验消息。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">与输入框关联的可见标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">输入框前缀装饰内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefixStyling</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为前缀添加样式和分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">输入框后缀装饰内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffixStyling</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为后缀添加样式和分隔线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rounded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染胶囊形输入框表面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">设置宽高、尺寸上下限和 flex。数字以像素为单位，字符串可使用 CSS 值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单行自由文本（名称、域名、token）用 <Input>。
- 内容可能换行成多行的瞬间改用 Textarea。
- 当值来自已知列表、用户通过输入过滤时用 Combobox。
- 内联搜索框用 <SearchInput> 并带限定范围的 placeholder（Search projects）；不要把它嵌进无关表单。
- 失焦时校验而非每次按键；通过向 error 传字符串显示消息。
- 提交前去除首尾空格，避免相同输入被识别为不同值。
- 保存期间保持字段可聚焦；仅当输入确实不可能时把 disabled 与 spinner 搭配。
- 不要用 Tooltip 包裹带标签的 <Input>；把说明放在兄弟图标按钮上，让标签保持被播报。
- 标签是简短的首字母大写名词：Project Name、Domain、Environment Variable Name。
- placeholder 展示示例值（my-awesome-project、example.com），绝不是 Enter your project name 这类指示。
- 辅助文本句首大写、一句且带句号，放在经 aria-describedby 关联的兄弟元素上。
- 校验消息点名字段与约束、以句号结尾并省略 please（Project name is required.、Code must be 6 digits.）。
- 传入 label 会渲染关联标签，并在未提供 id 时自动生成；只有需要被其他元素引用字段时才显式提供 id。
- SearchInput 的 placeholder 限定范围（Search projects），让无视觉上下文也能明确其角色。
- 输入行内的纯图标功能用 <Button shape="circle" svgOnly>（如清除或显示/隐藏），保持控件行对齐。
