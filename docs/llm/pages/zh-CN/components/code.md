# 代码

> Route: `/components/code`

使用语法高亮展示代码片段。

[返回组件](#/components)

# 代码

Code

使用语法高亮展示代码片段。

## 何时使用

- 在技术文档正文中引用单个代码标识符——环境变量名、函数名、类名或文件路径。
- 需要在段落或列表中对代码元素进行语法着色以提高可读性，同时保持文本流连贯。

## 何时不应使用

- 当需要展示多行源代码块时；请改用 Code Block，它带有边框、文件名头和可选的行号。
- 当内容不是有效的代码或标记语言时；Code 组件会应用代码着色样式，错误的内容会产生误导性的视觉效果。

## 示例

### 默认内联代码

在段落中渲染语法高亮的单行代码片段。

### 嵌套在富文本中的内联代码

展示 Code 组件如何在复杂的多层文本结构中保持语法着色的正确性，包括在列表、链接和引用块内的表现。

## 无障碍

不适用: Code 是纯展示型元素，不包含交互控件；其语义意义由 surrounding text 承载，无需 ARIA 属性。

## 受控行为

不适用: Code 组件无交互状态概念，不接受 value/onChange 属性；它是一个只读的语法高亮渲染器。

## 响应式行为

不适用: Code 以内联形式存在，不自行控制布局尺寸，其响应行为完全取决于父容器的排版规则。

## 主题行为

- 语法高亮颜色遵循设计系统的代码颜色变量，支持浅色和深色主题下的正确显示。

## 实时示例

Install with `npm i geist` and import the component.

Use `type="error"` for destructive confirmations.

```tsx
export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

```tsx
import { Code, InlineCode } from "@/components/ui/code";

<div className="flex w-full max-w-2xl flex-col gap-3">
  <p className="text-copy-14 text-muted-foreground">
    Install with <InlineCode>npm i geist</InlineCode> and import the component.
  </p>
  <Code syntax="javascript">{`console.log("Hello")`}</Code>
</div>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Code, InlineCode } from "@/components/ui/code";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">代码内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
