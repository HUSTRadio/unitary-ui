# 下拉选择器

> Route: `/components/select`

在下拉列表中呈现选项。

[返回组件](#/components)

# 下拉选择器

Select

在下拉列表中呈现选项。

## 何时使用

- 从简短固定的选项列表中快速选择一个值时，尤其适合大约十个以内的选项。
- 空间受限的设置面板、筛选器行或紧凑型表单中，需要使用下拉选择节省垂直空间。

## 何时不应使用

- 面对需要从大量选项中通过输入筛选的场景，组合框（Combobox）更合适。
- 需要同时选择多个选项时，应使用多选控件（Multi Select）。

## 示例

### 不同尺寸的 Select

展示 Select 组件的不同尺寸变体，从小号到大号的视觉效果对比。

### 带错误状态的 Select

输入校验失败时在 Select 下方展示错误提示信息。

## 无障碍

- 遵循 WAI-ARIA 的下拉列表语义，键盘用户可以流畅地上下遍历选项并通过 Enter 进行选择。
- 选中后屏幕阅读器会清晰地播报新的选项值及其对应的标签。

## 受控行为

- 通过 value 和 onValueChange 属性实现完全的外部状态控制，也可通过 defaultValue 使用非受控初始值。

## 响应式行为

- 支持多种内置尺寸，在狭窄视口中可通过减小字号和间距保持可用性。

## 主题行为

- 下拉弹出层的背景、边框和文字颜色随主题系统自动适配，确保暗色模式下同样可用。

## 实时示例

```tsx
import { Select, SelectItem } from "@/components/ui/select";

export function SelectSizes7C69F3FAExample() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <Select aria-label="Small" placeholder="Small" size="small">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
      <Select aria-label="Default" placeholder="Default">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
      <Select aria-label="Large" placeholder="Large" size="large">
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </Select>
    </div>
  );
}
```

## 前缀与后缀

```tsx
import { Select } from "@/components/ui/select";
import { ArrowUpCircle } from "lucide-react";

export function SelectPrefixAndSuffix99076368Example() {
  const icon = <ArrowUpCircle aria-hidden />;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <Select aria-label="Small" placeholder="Small" size="small" prefix={icon} suffix={icon} />
      <Select aria-label="Default" placeholder="Default" prefix={icon} suffix={icon} />
      <Select aria-label="Large" placeholder="Large" size="large" prefix={icon} suffix={icon} />
    </div>
  );
}
```

## 禁用

```tsx
import { Select } from "@/components/ui/select";

export function SelectDisabled17EB3C01Example() {
  return <Select aria-label="Disabled" disabled placeholder="Disabled with placeholder" />;
}
```

## 错误

Please select a value.

Please select a value.

Please select a value.

```tsx
import { Select } from "@/components/ui/select";

export function SelectErrorCA00FCCFExample() {
  return (
    <>
      <Select
        aria-label="Small with error"
        error="Please select a value."
        placeholder="Small"
        size="small"
      />
      <Select
        aria-label="Default with error"
        error="Please select a value."
        placeholder="Default"
      />
      <Select
        aria-label="Large with error"
        error="Please select a value."
        placeholder="Large"
        size="large"
      />
    </>
  );
}
```

## 标签

My label

```tsx
import { Select } from "@/components/ui/select";

export function SelectLabel1ACA80E8Example() {
  return <Select label="My label" placeholder="With label" />;
}
```

## 必填

Required field

```tsx
import { Select, SelectItem } from "@/components/ui/select";

export function SelectRequiredD0A36305Example() {
  return (
    <Select label="Required field" placeholder="Please select an option" required>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </Select>
  );
}
```

## 带选项

```tsx
import { Select, SelectItem } from "@/components/ui/select";

export function SelectWithOptions1AADC401Example() {
  return (
    <Select className="w-56" defaultValue="banana" aria-label="Select fruit">
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="grape">Grape</SelectItem>
    </Select>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Select, SelectItem, SelectGroup, SelectSeparator } from "@/components/ui/select";
```

原生属性：`React.ComponentProps<typeof SelectPrimitive.Root>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选择值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控的初始选择值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收选择变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">未选择值时显示的文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "default" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">选择触发器的高度和排版。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为触发器命名的可见标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给触发器的无障碍名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-labelledby</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">为触发器命名的外部元素 ID。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">字段下方渲染的校验消息。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发器前缀装饰内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">替代下拉箭头的触发器后缀装饰内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">应用共享控件布局契约。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 短而固定的列表（约 10 项以内）用 <Select>，输入过滤没有增益；需要过滤时改用 Combobox。
- 一次可选多个值时用 MultiSelect；2–3 选项的分段选择用 Switch。
- 相关选项用 <SelectGroup label="…"> 分组，组间用 <SelectSeparator /> 分隔；不支持原生 <option> 和 <optgroup> 子元素。
- 短选项首字母大写并匹配规范品牌（Next.js，而非 NextJS）；整个列表保持同一格调。
- 标签是简短的首字母大写名词（Framework、Region）；直接在 <Select> 上接受该 prop。
- placeholder 面向动作（Select a framework），绝不用 Choose one…、Pick 或复述标签。
- 失焦时校验并向 error 传字符串；消息点名字段并以句号结尾（Select a framework.）。
- 不要用 Tooltip 包裹带标签的 <Select>；把提示放在兄弟图标按钮上，让标签保持被播报。
