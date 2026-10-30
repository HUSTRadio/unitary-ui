# 字段

> Route: `/components/field`

把标签、控件、说明和错误消息组合成一个字段，适用于任意表单控件。

[返回组件](#/components)

# 字段

field

把标签、控件、说明和错误消息组合成一个字段，适用于任意表单控件。

## 何时使用

- 自定义控件或第三方控件需要与 Input / Select / Textarea 一致的标签与错误排版时。
- 一个字段需要同时显示辅助说明和错误消息，且希望两者的间距、字号统一。
- 希望字段整体参与外层布局（宽度、flex 排列）时，Field 作为容器承担 className。

## 何时不应使用

- Input / Select / Textarea 已内置 label 与 error；再包一层 Field 会出现两个标签。
- 需要校验规则、异步校验或表单状态时使用表单库；Field 不接管控件状态。
- 需要卡片式的分组标题、页脚操作与整体错误态时使用 Fieldset。

## 示例

### 标签、说明与错误

Field 组合标签、说明与错误消息；控件本身保持受控，错误文案由调用方决定。

## 无障碍

不适用: 本轮不含无障碍增强：Field 只提供 label 与 htmlFor 的关联，aria-describedby / aria-invalid 由调用方自行接线，错误消息经 FieldError 的 role="alert" 播报。

## 受控行为

不适用: Field 不持状态也不读控件值；value / onChange 直接由调用方与控件约定。

## 响应式行为

- 根容器使用 w-full min-w-0，宽度跟随外层布局，不会撑破栅格或窄屏容器。
- 说明与错误文案按控件宽度换行；错误消息在 FieldError 内已声明 break-words。
- 没有断点分支：字段在不同视口下的排版差异只来自外层布局，不来自 Field 本身。

## 主题行为

- 标签使用 text-gray-900，说明使用 text-gray-700，错误使用 --error-foreground 语义 token，深浅色主题自动跟随。
- Field 不定义新的颜色或间距 token，因此不会与主题切换产生额外状态。

## 实时示例

Workspace name

Used in URLs and mentions.

```tsx
import { useState } from "react";
import { Field, Input } from "@hustradio/unitary-ui";

export function FieldBasic3F9A1C7EExample() {
  const [value, setValue] = useState("");
  const error = value.includes(" ") ? "Workspace names cannot contain spaces." : "";

  return (
    <div className="w-full max-w-sm">
      <Field
        label="Workspace name"
        htmlFor="field-basic-workspace"
        description="Used in URLs and mentions."
        error={error}
      >
        <Input
          id="field-basic-workspace"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="acme"
        />
      </Field>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Field } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">字段标签；渲染为指向 htmlFor 的 label 元素。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">htmlFor</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">标签指向的控件 id；Field 不会把它写到子元素上。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控件下方的辅助说明，位于错误之前。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">错误消息交由 FieldError 渲染；空值不渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">large</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">说明与错误对齐 large 控件。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控件本身，原样渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- Field 只负责排版与文案；取值、校验和 aria-describedby 仍由控件自身与调用方负责。
- 把 htmlFor 设为控件 id 以关联标签；Field 不会改写子元素。
- 辅助说明保持一句话，可执行的规则写进错误消息。
- 错误统一经 FieldError 渲染：空值不渲染，长文案自动换行不裁切。
