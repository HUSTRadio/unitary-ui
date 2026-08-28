# 输入框

> Route: `/components/input`

用于用户输入的单行文本字段。

[返回组件](#/components)

# 输入框

Input

用于用户输入的单行文本字段。

## 何时使用

-   用户需要输入单行自由格式文本时，如项目名称、邮箱地址、API 密钥或域名。
-   需要进行字段级验证并以即时反馈告诉用户输入是否有效的场景。
-   作为表单的一部分，与其他控件一起提交到后端。

## 何时不应使用

-   当内容可能换行为多行时，应使用 Textarea 而非 Input，因为 Input 的 single-line 语义不适合块状文本。
-   当值来自预定义的列表供用户筛选选择时，应使用 Combobox 而非自由输入。
-   不要将带标签的 Input 包裹在 Tooltip 中——应将解释说明放在旁边的图标按钮上，以确保标签能被屏幕阅读器正确播报。

## 示例

### 默认输入框

最基础的输入框用法，包含占位符提示和标准的外观样式，适用于大多数通用文本输入场景。

### 前缀和后缀

在输入框内部添加前缀和后缀元素，如在 URL 输入框中添加 'https://' 前缀或在用户名后添加域名后缀。

### 错误状态

通过 error prop 传递验证消息字符串来展示字段的校验失败状态，红色边框和错误文本提供清晰的视觉反馈。

### 带标签的输入框

配合 visible label 和关联 id 的正确用法，确保屏幕阅读器能够建立标签与输入的关联，符合无障碍规范。

## 无障碍

-   Input 关联对应的 <Label> 通过 htmlFor/id 配对，确保屏幕阅读器能正确播报字段名称。
-   错误状态通过 error prop 传递的消息会被添加到 aria-describedby 中，帮助器文本也应通过此机制关联。

## 受控行为

-   Input 接受 value 和 onChange 来控制受控行为，也可使用未受控方式通过默认值初始化。
-   应在提交前去除首尾空格，这样 example.com 和 example.com 会解析为同一个值。

## 响应式行为

-   输入框宽度在不同视口下会自动伸缩，在小屏设备上确保足够的点击区域和可读的字号。
-   前缀和后缀元素在不同尺寸下也会自适应调整位置和对齐方式。

## 主题行为

-   输入框的边框颜色、背景色和聚焦状态均遵循主题令牌，包括深色模式的适配。
-   错误状态的红色边框和正常状态的颜色区分遵循设计系统的色彩规范。

## 实时示例

```tsx
import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-between gap-4 md:flex-row">
  <Input size="small" placeholder="Small" />
  <Input placeholder="Default" />
  <Input size="large" placeholder="Large" />
</div>
```

https://.com

vercel/

```tsx
import { Input } from "@/components/ui/input";
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
</div>
```

https://.com

```tsx
import { Input } from "@/components/ui/input";
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
</div>
```

An error message.

An error message.

An error message.

```tsx
import { Input } from "@/components/ui/input";

<div className="flex flex-col items-start justify-start gap-8">
  <Input size="small" error="An error message." placeholder="long-error@gmail.com" />
  <Input error="An error message." placeholder="long-error@gmail.com" />
  <Input size="large" error="An error message." placeholder="long-error@gmail.com" />
</div>
```

标签

```tsx
import { Input } from "@/components/ui/input";

<Input label="Label" placeholder="Label" />
```

www..com

```tsx
import { Input } from "@/components/ui/input";

<Input rounded prefix="www." suffix=".com" placeholder="Label example" />
```

www..com

```tsx
import { Input } from "@/components/ui/input";

<Input
  rounded
  prefix="www."
  prefixStyling={false}
  suffix=".com"
  suffixStyling={false}
  placeholder="Label example"
/>
```

## 状态

```tsx
import { Input } from "@/components/ui/input";

<div className="flex w-full max-w-md flex-col gap-3">
  <Input aria-label="Default" placeholder="Default" />
  <Input aria-label="Disabled" disabled placeholder="Disabled" />
  <Input aria-label="With value" defaultValue="geist-docs" placeholder="With value" />
</div>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Input } from "@/components/ui/input"
```

原生属性：`InputHTMLAttributes<HTMLInputElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">输入框尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   单行自由文本（名称、域名、token）用 <Input>。
-   内容可能换行成多行的瞬间改用 Textarea。
-   当值来自已知列表、用户通过输入过滤时用 Combobox。
-   内联搜索框用 search 变体并带限定范围的 placeholder（Search projects）；不要把 <SearchInput> 嵌进无关表单。
-   失焦时校验而非每次按键；通过向 error 传字符串显示消息。
-   提交前修剪首尾空白，让 example.com 与 example.com 解析为同一值。
-   保存期间保持字段可聚焦；仅当输入确实不可能时把 disabled 与 spinner 搭配。
-   不要用 Tooltip 包裹带标签的 <Input>；把说明放在兄弟图标按钮上，让标签保持被播报。
-   标签是简短的首字母大写名词：Project Name、Domain、Environment Variable Name。
-   placeholder 展示示例值（my-awesome-project、example.com），绝不是 Enter your project name 这类指示。
-   辅助文本句首大写、一句且带句号，放在经 aria-describedby 关联的兄弟元素上。
-   校验消息点名字段与约束、以句号结尾并省略 please（Project name is required.、Code must be 6 digits.）。
-   向 label 传字符串需要 id；缺少时 InputPropsWithStringLabelAndId 联合类型无法编译，屏幕阅读器也会失去关联。
-   SearchInput 的 placeholder 限定范围（Search projects），让无视觉上下文也能明确其角色。
-   输入行内的纯图标功能用 <Button shape="circle" svgOnly>（如清除或显示/隐藏），保持控件行对齐。
