# 标签

> Route: `/components/label`

用于表单控件的无障碍文本标签。

[返回组件](#/components)

# 标签

Label

用于表单控件的无障碍文本标签。

## 何时使用

- 需要将可见文字标签与表单控件关联时，让屏幕阅读器播报字段名称。
- 通过 htmlFor 和控制器的 id 匹配标签，使点击标签时聚焦对应输入框。
- 使用简短的 Title Case 名词作为标签文本，例如 Project Name、Domain、Environment Variable Name。

## 何时不应使用

- 不要将带标签的 Input 包裹在 Tooltip 中——应将解释说明放在旁边的图标按钮上，以确保标签能被屏幕阅读器正确播报。
- 当不需要关联表单控件且没有无障碍播报需求时，直接使用普通文本段落即可。

## 示例

### 默认标签

最基础的 Label 用法：传入一个文本字符串作为可见标签，自动渲染为语义化的 <label> 元素并与关联的表单控件绑定。

### 带输入框的标签

Label 与 Input 配合的正确用法：通过 htmlFor/id 配对实现点击标签聚焦输入框的功能，确保键盘操作和屏幕阅读器的无障碍体验。

### 绕过大小写转换

当标签文本需要保留特定的大小写格式（如品牌名称或技术标识符）时使用 bypassCasing 属性，避免组件自动转换字母大小写。

## 无障碍

- Label 通过 htmlFor/id 与表单控件关联，屏幕阅读器能正确播报字段名称，确保残障用户可以理解每个字段的用途。
- 所有带标签的输入框都必须通过 aria-describedby 将辅助说明与输入控件关联起来。

## 受控行为

不适用: Label 是一个纯展示型组件，只负责渲染给定的标签文本并建立与目标表单控件的关联。它没有内部状态或用户交互能力，所有行为由传入的 props 决定。

## 响应式行为

不适用: Label 组件本身不涉及响应式布局逻辑。其视觉表现由所在表单行容器的上下文决定，在不同视口下跟随父容器自然流动。

## 主题行为

- 标签文字的颜色从主题令牌获取，确保浅色模式和深色模式下都有良好的可读性和对比度。
- 字体大小和字重遵循设计系统的排版规范，与相邻输入框保持一致的视觉层级。

## 实时示例

这是一个标签

```tsx
import { Label } from "@/components/ui/label";

<Label id="label-default" value="This is a label" />;
```

邮箱地址

邮箱地址

## 带输入框

Email Address

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label id="label-input" value="Email Address" withInput />
  <Input aria-labelledby="label-input" id="label-input" placeholder="Enter email address..." />
</div>;
```

## 忽略大小写

Email address

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="flex w-full max-w-sm flex-col">
  <Label bypassCasing id="label-input-bypass" value="Email address" withInput />
  <Input
    aria-labelledby="label-input-bypass"
    id="label-input-bypass"
    placeholder="Enter email address..."
  />
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Label } from "@/components/ui/label";
```

原生属性：`LabelHTMLAttributes<HTMLLabelElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">id</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">关联输入控件的 ID。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见标签文字。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">bypassCasing</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用自动首字母大写。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">withInput</code><span class="ml-2 text-label-12 text-muted-foreground">已弃用</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">已弃用的兼容标记。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 用 Label 把可见文本标签关联到表单控件，让屏幕阅读器播报字段名。
- 通过 htmlFor 与控件的 id 匹配标签与控件，点击标签即可聚焦字段。
- 标签保持简短的首字母大写名词：Project Name、Domain、Environment Variable Name。
