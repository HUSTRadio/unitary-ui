# 多行文本域

> Route: `/components/textarea`

用于较长输入的多行文本字段。

[返回组件](#/components)

# 多行文本域

Textarea

用于较长输入的多行文本字段。

## 何时使用

- 输入可以换行的内容（如提交消息、描述信息、备注），需要用户在编辑器中输入多行自由格式文本时。
- 表单字段需要预留足够的书写空间且不希望单行 Input 被撑破布局时，Textarea 提供了可控的行数和自动扩展能力。

## 何时不应使用

- 不要将 Textarea 用于只需要单个值的输入（如用户名、域名、令牌）——此类场景应使用 Input 单行输入框。
- 不要在缺乏垂直空间的主操作区上方强制展开大尺寸 Textarea——它会挤压下方的关键操作按钮，导致用户需要滚动才能找到提交按钮。

## 示例

### 默认多行输入框

展示默认外观的多行文本输入框，包含基本占位符和边框样式。

### 尺寸变体

展示不同尺寸的 Textarea，匹配不同密度的表单布局需求。

### 错误状态

演示错误状态下的文本域：红色边框和内联验证提示信息。

## 无障碍

- 多行文本域应关联可见的 <label> 元素，并通过 htmlFor/id 建立关联，使屏幕阅读器能够正确朗读字段名称。
- 验证错误信息应通过 aria-describedby 链接到文本域本身，确保屏幕阅读器在聚焦时同步播报错误提示。
- 占位符应展示示例值（如 my-description）而非指令性文案（如 Enter a description），避免误导辅助技术用户。

## 受控行为

- 通过 value 和 onChange 受控管理文本内容，支持编程式赋值和实时输入监听。
- readOnly 属性可将文本域设为只读模式，不可编辑但仍可聚焦和选择文本内容。
- disabled 状态阻止所有用户输入，此时文本域呈现灰度样式且跳过键盘导航 tabindex。

## 响应式行为

- Textarea 设置充足的默认行数并在有垂直空间时增长，但不会让字段本身把主操作按钮推到视口之外。
- 在窄屏设备上 Textarea 宽度自动充满可用空间，行高和内边距保持比例缩放。

## 主题行为

- 文本域的边框、背景和文字颜色跟随主题变量变化，在暗色/亮色模式下各自有优化的配色方案。
- 错误状态的红色边框和警告状态的琥珀色边框在不同主题下均保证足够的对比度以确保可读性。

## 实时示例

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Default"
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>;
```

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea
  aria-label="Disabled"
  disabled
  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  style={{ minHeight: 100 }}
/>;
```

发生了一个错误。

发生了一个错误。

发生了一个错误。

## 错误

There has been an error.

There has been an error.

There has been an error.

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-8">
  <Textarea
    aria-label="With error (small)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (medium)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="With error (large)"
    defaultValue={LOREM_IPSUM}
    error="There has been an error."
    size="large"
    style={{ minHeight: 100 }}
  />
</div>;
```

## 尺寸

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col gap-6">
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="small"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="medium"
    style={{ minHeight: 100 }}
  />
  <Textarea
    aria-label="Textarea"
    defaultValue={LOREM_IPSUM}
    size="large"
    style={{ minHeight: 100 }}
  />
</div>;
```

## 只读

```tsx
import { Textarea } from "@/components/ui/textarea";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

<div className="flex w-full max-w-md flex-col">
  <Textarea aria-label="Read only" defaultValue={LOREM_IPSUM} readOnly style={{ minHeight: 100 }} />
</div>;
```

## 行数

```tsx
import { Textarea } from "@/components/ui/textarea";

<div className="flex w-full max-w-md flex-col">
  <Textarea
    aria-label="Textarea with fixed rows"
    placeholder="Textarea with fixed number of rows"
    rows={5}
  />
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Textarea } from "@/components/ui/textarea";
```

原生属性：`TextareaHTMLAttributes<HTMLTextAreaElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TextareaSize</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">文本域尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 会换行成多行的内容（提交消息、描述、备注）用 <Textarea>；名称或域名这类单个值用 Input。
- 设宽裕的默认 rows，仅在表面有垂直空间时增长；不要让字段把主动作推到折叠线以下。
- 失焦时校验并向 error 传字符串渲染内联消息；校验失败时替换辅助文本。
- 提交时修剪首尾空白，让空换行不通过必填检查。
- 标签是简短的首字母大写名词（Description、Release Notes）；placeholder 展示示例值而非 Enter a description 这类指示。
- 校验消息点名字段与约束、以句号结尾并省略 please（Description is required.、Release notes can't exceed 500 characters.）。
- 辅助文本作为经 aria-describedby 关联的兄弟 <p> 渲染；句首大写、一句、带句号。
