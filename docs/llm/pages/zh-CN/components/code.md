# 代码

> Route: `/components/code`

Code 显示可横向滚动的代码块；InlineCode 显示正文中的短代码。

[返回组件](#/components)

# 代码

code

Code 显示可横向滚动的代码块；InlineCode 显示正文中的短代码。

## 何时使用

- 用 Code 展示轻量的块级代码片段，并通过 syntax 挂接语言高亮。
- 在正文中引用变量名、函数名或文件路径时使用同模块导出的 InlineCode。

## 何时不应使用

- 需要文件名头、行号或增删行标记时，请改用功能更完整的 Code Block。
- 当内容不是有效的代码或标记语言时；Code 组件会应用代码着色样式，错误的内容会产生误导性的视觉效果。

## 示例

### 块级与行内代码

在同一示例中展示块级 Code 和正文内的 InlineCode。

### 富文本中的 InlineCode

在列表、链接和引用块等富文本结构中使用 InlineCode，保持正文流不被块级容器打断。

## 无障碍

不适用: Code 输出 <pre><code> 语义，InlineCode 输出 <code>；两者均不包含交互控件，无需额外 ARIA。

## 受控行为

不适用: Code 只显示代码，不管理交互状态，也不提供 value/onChange。

## 响应式行为

不适用: Code 使用 overflow-x-auto 保留预格式化内容并在溢出时横向滚动；InlineCode 则随父级正文排版。

## 主题行为

- 语法高亮颜色遵循设计系统的代码颜色变量，支持浅色和深色主题下的正确显示。

## 实时示例

Install with `npm i @hustradio/unitary-ui` and import the component.

```tsx
console.log("Hello");
```

```tsx
import { Code, InlineCode } from "@/components/ui/code";

export function CodeDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p className="text-copy-14 text-muted-foreground">
        Install with <InlineCode>npm i @hustradio/unitary-ui</InlineCode> and import the component.
      </p>
      <Code syntax="javascript">{`console.log("Hello")`}</Code>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Code, InlineCode } from "@/components/ui/code";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">代码内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
