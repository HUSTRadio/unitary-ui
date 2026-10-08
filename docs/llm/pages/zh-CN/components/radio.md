# 单选按钮

> Route: `/components/radio`

从一组互斥选项中选择一个。

[返回组件](#/components)

# 单选按钮

radio

从一组互斥选项中选择一个。

## 何时使用

- 需要从 2-6 个互斥选项中做单一选择时使用 Radio，且用户必须看到所有选项才能做出决定，如部署区域、计划层级或计费周期。
- 为相关联的单选按钮设置 <fieldset> + <legend> 包裹，这样屏幕阅读器在每个选项前播报组名。
- 适合预选时，提供一个安全的默认选项。

## 何时不应使用

- 当选项数量超过 6 个时，切换至 Select 或 Combobox 以避免列表占据过多表单空间。
- 对于二进制开/关设置，使用 Toggle 而非 Radio——单一的 on/off 用开关机制更直观。
- 当每个选项需要丰富的额外内容（如图标、详细描述、徽章）时，改用 Choicebox 获得更大的点击目标和更好的信息层次。

## 示例

### 默认单选

展示基本的 Radio 用法，包含一组互斥选项和默认选中状态。

### 禁用状态

展示如何禁用特定的单选选项，让用户无法选择。

### 必填验证

展示 RadioGroup 的必填标记和验证反馈，帮助用户识别未完成的表单。

## 无障碍

- 相关单选按钮应在 <fieldset> 内并用 <legend> 标注组名称，确保屏幕阅读器先报组名再报选项。
- Required 状态应设置在 RadioGroup 级别而非单个选项上，避免重复宣告。
- 键盘用户可通过方向键切换选项，并用 Space 选择当前聚焦项。
- 焦点环仅在 :focus-visible 时显示，保留键盘导航提示；鼠标或触摸选择不额外显示该环。

## 受控行为

- Radio 接受 controlled checked 属性，开发者可通过 onChange 回调管理选中状态并在外部驱动。
- 受控模式下 radio-group 的行为与原生 HTML <input type='radio'> 一致，但由 React 状态精确驱动。

## 响应式行为

- Radio 控件使用固定尺寸与间距，不会根据视口自动放大；触控目标和组选项间距由外层布局负责。
- 垂直堆叠的 Radio 组应由调用方设置行距和容器宽度，并在窄屏检查长标签换行。

## 主题行为

- 选中态的圆点和边框颜色遵循主题变量的主色调，适配明暗主题。
- 禁用态 Radio 的透明度和对比度调整通过主题色板的 alpha 通道实现，保持无障碍对比度要求。

## 实时示例

Default Radio Example

Option 1Option 2

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { useState } from "react";

export function RadioDefault37A8EEC1Example() {
  const [value, setValue] = useState("one");

  return (
    <RadioGroup label="Default Radio Example" onChange={setValue} value={value}>
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## 禁用单选框

Disabled Radio Example

Option 1Option 2

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function RadioRadioDisabled2226FEE4Example() {
  return (
    <RadioGroup disabled label="Disabled Radio Example" defaultValue="one">
      <div className="flex flex-col items-stretch justify-start gap-6">
        <RadioGroupItem value="one">Option 1</RadioGroupItem>
        <RadioGroupItem value="two">Option 2</RadioGroupItem>
      </div>
    </RadioGroup>
  );
}
```

## 必填单选框

```tsx
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

export function RadioRadioRequired0BCA93F0Example() {
  return (
    <form className="flex flex-col items-start justify-start gap-6">
      <RadioGroup label="Required Radio Example" required defaultValue="">
        <div className="flex flex-col items-stretch justify-start gap-4">
          <RadioGroupItem value="one">Option 1</RadioGroupItem>
          <RadioGroupItem value="two">Option 2</RadioGroupItem>
        </div>
      </RadioGroup>
      <Button size="small">Submit</Button>
    </form>
  );
}
```

## 无头单选框

Option 1Option 2

```tsx
import { useState } from "react";
import { RadioGroup, useRadio } from "@/components/ui/radio";

export function RadioRadioHeadlessF2D8A0DBExample() {
  const [value, setValue] = useState("one");

  const { component } = useRadio({ value: "one", disabled: false });

  const { component: component2 } = useRadio({ value: "two", disabled: false });

  return (
    <RadioGroup aria-label="Options" onChange={setValue} value={value}>
      <div className="flex w-full min-w-56 flex-col items-stretch justify-start gap-6">
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 1</span>
          {component}
        </label>
        <label className="flex w-full items-center justify-between leading-6">
          <span className="text-copy-13 leading-6 text-foreground">Option 2</span>
          {component2}
        </label>
      </div>
    </RadioGroup>
  );
}
```

## 独立单选框

- Option 1

```tsx
import { Radio } from "@/components/ui/radio";

export function RadioRadioStandalone65A01781Example() {
  return (
    <li className="flex w-full items-center gap-2">
      <span className="text-base leading-6 text-foreground">Option 1</span>
      <Radio aria-label="Option 1" defaultChecked value="one" />
    </li>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Radio, RadioGroup, RadioGroupItem, useRadio } from "@/components/ui/radio";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选择值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收单选组的新选择。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 从 2–6 个互斥选项中做单选、且每个选项都必须可见时（部署区域、套餐层级、计费周期）用 Radio。
- 超过 6 个选项改用 Select 或 Combobox，避免列表主导表单。
- 二进制开/关用 Toggle。每选项内容更丰富（图标、说明、badge）用 Choicebox。
- 预选最安全默认值，让字段读起来已配置，而不是必填却为空。
- required 状态放在 RadioGroup 上，而非单个选项上。
- 用 fieldset + legend 包裹相关 radios，让屏幕阅读器在每个选项前播报组名。
