# 代码块

> Route: `/components/code-block`

带文件名标题和边框的多行代码块。

[返回组件](#/components)

# 代码块

Code Block

带文件名标题和边框的多行代码块。

## 何时使用

- 展示多行、需要语法着色的源代码，读者可能需要逐行扫描或复制粘贴。
- 当代码示例有明确的粘贴目的地时（如 app/page.tsx、vercel.json），利用文件名头增强上下文清晰度。

## 何时不应使用

- 对于单行内联代码标识符（环境变量名、函数名、文件路径），请使用 InlineCode 组件，它不会产生多余的边框占用。
- 当需要展示可运行的完整应用程序而不是代码片段时；请使用 Snippet 并配以复制按钮。

## 示例

### 默认代码块

基础 Code Block 渲染：带边框、文件名头和多行语法高亮。

### 无文件名的代码块

适用于临时示例代码，省略文件名头以保持简洁。

### 高亮特定行的代码块

突出讨论中的行以引导读者注意力；只有相关行被高亮才有效果。

### 添加和删除行标注的代码块

用绿色和红色分别标注新增和被删除的行，清晰呈现 diff 式的变更。

### 带语言切换器和选项卡的代码块

多语言 Tab 页签 + 动态语言切换，让读者查看同一代码的不同语言版本。

## 无障碍

不适用: Code Block 是代码展示容器，不包含可交互的 UI 控件；行号和语法着色不参与无障碍树播报。

## 受控行为

不适用: Code Block 是纯展示组件，没有 value / onChange 或展开/折叠状态的控制接口；其内容始终静态渲染。

## 响应式行为

- 代码块在小视口上使用水平滚动以避免换行破坏语法结构，同时保持行号的正确对齐。
- 文件名头和内容区域会根据可用宽度自适应间距，在大屏幕上保持紧凑的阅读节奏。

## 主题行为

- 边框颜色、背景色和内边距随设计系统的颜色和令牌变量自动适配浅色与深色主题。
- 语法高亮颜色与主题的代码调色板保持一致，确保不同主题下的高对比度和可读性。

## 实时示例

Table.jsx

```tsx
// Usage:
//   enabled by `--debug-prerender`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockDefault37A8EEC1Example() {
  const code = `// Usage:
  //   enabled by \`--debug-prerender\`
  //   route patterns: [id...] or [...id]
  //   NODE_OPTIONS='--debug-prerender' node
  function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## 不显示文件名

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockNoFilenameC9029DC2Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## 高亮指定行

highlighted.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockHighlightedLines610E38F8Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="highlighted.jsx"
      language="jsx"
      highlightedLinesNumbers={[1, 4]}
    >
      {code}
    </CodeBlock>
  );
}
```

## 新增与删除行标记

next.config.js

```tsx
module.exports = {
-    experimental: {
-      appDir: true,
-    },
+    appDir: true,
  }
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockAddedRemovedLinesED9789E1Example() {
  const code = `module.exports = {
    experimental: {
      appDir: true,
    },
    appDir: true,
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="next.config.js"
      language="jsx"
      addedLinesNumbers={[5]}
      removedLinesNumbers={[2, 3, 4]}
    >
      {code}
    </CodeBlock>
  );
}
```

## 引用行

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockReferencedLines009BBC04Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Count: {props.count}</h1>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx" referencedLinesNumbers={[4]}>
      {code}
    </CodeBlock>
  );
}
```

## 语言切换器

language-switcher.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

export function CodeBlockLanguageSwitcherEFBF544EExample() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      switcher={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

## 带选项卡的语言切换器

language-switcher.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

export function CodeBlockLanguageSwitcherWithTabs22834C2CExample() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      tabs={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

## 隐藏行号

hidden-line-numbers.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockHiddenLineNumbers3831A2F1Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>Good to see you</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="hidden-line-numbers.jsx"
      language="jsx"
      hideLineNumbers
    >
      {code}
    </CodeBlock>
  );
}
```

## 在 v0 中打开

Table.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

[询问向 v0 询问](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20%20%20return%20(%0A%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20)%3B%0A%20%20%7D>)

Table.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

[在此处打开在 v0 中打开](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20%20%20return%20(%0A%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20)%3B%0A%20%20%7D>)

```tsx
import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockOpenInV0CA6FBF0AExample() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <div className="flex flex-col gap-4">
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">
        {code}
      </CodeBlock>
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">
        {code}
      </CodeBlock>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { CodeBlock, CodeBlockHeader, CodeBlockContent } from "@/components/ui/code-block";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">默认内容槽展示的代码。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">language</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">语法高亮的语言标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 对读者会扫读或粘贴的多行、语法高亮源码使用 CodeBlock。单个内联 token（环境变量名、函数名、文件路径）用 InlineCode。
- 可复制的 shell 命令或单行密钥揭示用 Snippet；它自带提示符符号与复制功能。
- 始终传入 language/syntax（tsx、bash、json、diff）。高亮是选择 CodeBlock 而非裸 pre 的首要原因。
- 只高亮讨论中的行；每行都高亮的效果等同没有高亮。
- 片段有粘贴目的地（app/page.tsx、vercel.json）时显示文件名标题；临时示例省略它。
- 片段保持可运行。不要把真实代码改写成伪语法，也不要给 shell 命令加 $ 前缀。
