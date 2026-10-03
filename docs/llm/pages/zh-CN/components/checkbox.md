# 复选框

> Route: `/components/checkbox`

勾选多个选项、确认声明或选择表格行。

[返回组件](#/components)

# 复选框

checkbox

勾选多个选项、确认声明或选择表格行。

## 何时使用

- 列表内多选：表格行选择器、多选筛选器、偏好勾选组。
- 用户必须确认某个具体陈述的场景：服务条款、不可逆导出确认。
- 表格行选择复选框没有可见标签时，设置 aria-label="选择 {行名称}"。

## 何时不应使用

- 单个布尔开关（深色模式、密码保护）用 Toggle，开/关语义比孤立的复选框更清晰。
- 不要为互斥选项使用复选框——那是 Radio/Choicebox 的职责。
- 不要用自定义包裹层破坏 label/htmlFor 关联——点击目标本来就延伸到标签。

## 示例

### 默认复选框

基本的可勾选复选框与标签。

### 半选态

半选是视觉状态而非第三种取值：由知道部分选择情况的父组件驱动，子项全选或全不选时立即清除。

### 禁用态

禁用复选框仍需配 Tooltip 说明原因，否则灰化的盒子读起来像 bug。

## 无障碍

- 相关复选框包在带 <legend> 的 <fieldset> 里，屏幕阅读器会在每个选项前播报组名。
- 组标签是 Title Case 名词（通知、必需权限），不带冒号；确认声明是完整句子并以句号结尾。
- 半选态的文案要在组标签旁标注部分数量（已选 3/5），不要留下没有说明的横杠状态。

## 受控行为

- 选中状态由父组件受控；必填确认的校验在提交时触发而非失焦时，避免反复勾选时闪错误。
- 半选态由父组件根据子项状态计算并驱动。

## 响应式行为

- 点击目标已延伸到标签文本，移动端无需额外扩大热区。
- 长标签自动换行，不截断。

## 主题行为

- 勾选框选中色、焦点环与禁用灰度跟随主题变量。
- 暗色模式下禁用态与可用态保持可区分。

## 实时示例

Option 1

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function CheckboxDefault37A8EEC1Example() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox checked={checked} onChange={(): void => setChecked((b) => !b)}>
      Option 1
    </Checkbox>
  );
}
```

## 禁用

DisabledDisabled CheckedDisabled Indeterminate

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-4">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox checked readOnly disabled>
        Disabled Checked
      </Checkbox>
      <Checkbox disabled indeterminate>
        Disabled Indeterminate
      </Checkbox>
    </div>
  );
}
```

## 半选

Indeterminate (partial selection)CheckedUnchecked

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxIndeterminateD5DB1EBAExample() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox indeterminate aria-label="Indeterminate" />
        <span className="text-copy-14 text-foreground">Indeterminate (partial selection)</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox checked readOnly aria-label="Checked" />
        <span className="text-copy-14 text-muted-foreground">Checked</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox aria-label="Unchecked" />
        <span className="text-copy-14 text-muted-foreground">Unchecked</span>
      </label>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控选中状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">无参数变更回调（官方）。自行切换状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultChecked</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控初始值（框架扩展）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indeterminate</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视觉半选态，非第三值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用复选框。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "default" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控件尺寸（框架扩展）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm"</td></tr></tbody></table>

## 最佳实践

- 用于列表内的多项选择，如表格行选择、多选过滤器和勾选式偏好组。
- 用于用户必须确认特定声明的场合（服务条款、不可逆导出）。
- 单个布尔设置（暗色模式、密码保护）用 Toggle；开关机制比孤立复选框更清晰。
- Indeterminate 是视觉状态而非第三值。由知道部分选中状态的父级驱动，并在所有子项全部选中或取消时立刻清除。
- 必填声明的校验在提交时触发而非失焦时，这样勾选/取消不会闪烁报错。
- 禁用的复选框仍需 Tooltip 说明原因；变灰且无解释会被当成 bug。
- fieldset 上方的组标签是首字母大写的名词，如 Notifications 或 Required Permissions。不要带冒号。
- 声明性标签是以句号结尾的完整句子：I agree to the Terms of Service.。
- Indeterminate 文案在组标签旁注明部分数量（3 of 5 selected）。绝不让破折号状态无标签。
- 用 fieldset + legend 包裹相关复选框，让屏幕阅读器在每个选项前播报组名。
- 点击目标已延伸到标签。不要用自定义包装器覆盖 label/htmlFor 关联而破坏点击区域。
- 表格里的行选择复选框没有可见标签。设置 aria-label="Select {row name}" 让屏幕阅读器播报所选行。
