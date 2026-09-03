# 描述

> Route: `/components/description`

以定义列表展示键值元数据。

[返回组件](#/components)

# 描述

Description

以定义列表展示键值元数据。

## 何时使用

- 需要以定义列表展示元数据：短小的 Title Case 键名配对单一值（例如 'Last Deployed'、'Region'、'Plan'）。
- 需要让 <dl>/<dt>/<dd> 语义结构被屏幕阅读器正确识别，每对 key/value 作为一个定义项朗读。

## 何时不应使用

- 如果是在表单字段下方的行内帮助文字，应使用 input 的 helper-text slot 而非 Description 组件。
- 不要将描述组件包裹在额外的段落标签中，这会破坏定义的列表语义结构。

## 示例

### 默认定义列表

以默认左对齐方式展示一组键/值定义列表，呈现清晰的元数据结构。

### 右对齐文本

将描述值右对齐显示，适用于数值型或对齐有要求的元数据场景。

### 省略号截断

当值过长时使用省略号截断显示，配合 tooltip 展开查看详情以保持紧凑布局。

## 无障碍

- Geist 渲染 <dl>/<dt>/<dd> 原生 HTML 定义列表，屏幕阅读器会将每对键值作为一个定义单元朗读。
- 键名使用 Title Case 名词格式，值使用句子大小写，除非是字面标识符、ID 或时间戳需保持原始格式。
- 不要在键槽位放置交互控件；按钮、菜单和链接应放在值槽位或父级布局中。

## 受控行为

不适用: Description 是纯展示型组件，用于渲染定义的键值对，不存在任何交互式状态或受控行为。

## 响应式行为

不适用: Description 作为定义列表组件在各视口下表现一致，没有显著响应式行为变化。

## 主题行为

不适用: Description 的排版和颜色由 Geist 设计系统的主题令牌自动处理，无需额外主题定制。

## 实时示例

Section Title

Data about this section.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionDefault37A8EEC1Example() {
  return (
    <Description
      content="Data about this section."
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## text-right

Section Title

Data about this section.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionTextRightFE5B1527Example() {
  return (
    <Description
      content="Data about this section."
      right
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## ellipsis

Section Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem.

```tsx
import { Description } from "@/components/ui/description";

export function DescriptionEllipsisB014A021Example() {
  return (
    <Description
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem."
      ellipsis
      title="Section Title"
      tooltip="Additional context about what this section refers to."
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Description } from "@/components/ui/description";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">描述术语。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">content</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">描述值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tooltip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示在术语旁的可选解释。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">right</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">右对齐术语和值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ellipsis</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">截断溢出的术语和值文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 定义列表式元数据用 <Description>：简短短语的首字母大写键配单个值（Last Deployed、Region、Plan）。表单字段下的内联帮助用 input 的 helper-text 插槽。
- Geist 渲染 <dl>/<dt>/<dd>，屏幕阅读器会把每个键值对读作定义。不要在组件外包额外段落破坏列表语义。
- 键是首字母大写名词（Last Deployed、Build Duration）；值用句首大写，除非是应按原样保留的字面标识符、ID 或时间戳。
- 仅当键单独出现有歧义、且一句话定义能消除歧义时才传 tooltip。tooltip 文本句首大写并以句号结尾。
- 不要把交互控件放进键位。按钮、菜单和链接属于值或父级布局，不属于标签。
