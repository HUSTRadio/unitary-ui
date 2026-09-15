# 代码片段

> Route: `/components/snippet`

显示用户需要复制的可运行 Shell 命令或短代码。

[返回组件](#/components)

# 代码片段

Snippet

显示用户需要复制的可运行 Shell 命令或短代码。

## 何时使用

- 为用户希望一键复制的运行型 shell 命令使用 Snippet，它自带提示符字符和复制辅助功能。
- 内联令牌（环境变量名、路径）应使用 InlineCode，多行源代码应使用 CodeBlock；单行短命令则使用 Snippet。
- 搭配 CopyButton 使用户无需手动选中即可获取命令，提升用户体验。

## 何时不应使用

- 每个 Snippet 只放一条命令——更长的脚本应切换到 CodeBlock，让用户先阅读再复制。
- 不要把 Snippet 用作文档中的伪代码或伪语法示例——它应该呈现真实的、可粘贴执行的命令。
- 不要在一个 Snippet 中组合多条命令——每条命令独立为一个 Snippet，避免复制混乱。

## 示例

### 默认片段

展示默认的 Snippet 外观，包含提示符字符和复制按钮。

### 反色变体

展示 \`dark\` 反色变体：浅色主题下为深底浅字，深色主题下自动切换为浅底深字。

### 全部变体

展示 Snippet 的所有变体和样式配置选项。

## 无障碍

- 复制按钮必须是 icon-only 按钮且带有明确的 aria-label，以便屏幕阅读器朗读操作意图（如“复制部署 URL”）。
- Snippets 的文本内容应在复制成功后通过视觉反馈（勾选图标）确认，持续约 1.5 秒后重置。
- 优先使用 navigator.clipboard.writeText 并提供隐藏的 textarea execCommand 降级方案。

## 受控行为

- 支持受控的已复制状态（copied），开发者可以编程式控制复制反馈的显示和隐藏。
- 回调函数允许在复制动作发生时执行额外的业务逻辑。

## 响应式行为

- Snippet 在窄屏上保持同一内边距与字号，命令文本过长时在文本区域内部横向滚动（sm- 起 min-w 收缩），不做字号降级。
- 复制按钮在全屏幕上保持一致的可见性和点击区域大小。

## 主题行为

- Snippet 的背景色、边框和文字颜色跟随主题变量，在暗色/亮色模式下各有对应的配色方案。
- 反色（\`dark\`）不是固定深色皮肤，而是把整棵子树切到相反 scheme 的 color scheme：浅色主题下为深底 \`#0a0a0a\` + 浅字 \`#f2f2f2\`，深色主题下为浅底 \`#ffffff\` + 深字 \`#1a1a1a\`，两种模式下都保持可读对比度。
- 默认类型（\`type="default"\`）的代码文字与复制按钮用 \`text-inherit\` 跟随容器色链；\`success\` / \`error\` / \`warning\` 语义色不随反色翻转，与官方一致。

## 实时示例

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetDefault21B111CBExample() {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

## 反色变体

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetInverted7A2F99B7Example() {
  return <Snippet dark text="npm init next-app" width="300px" />;
}
```

## 多行代码片段

`$ cd project``$ now`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetMultiLine8E24895DExample() {
  return <Snippet text={["cd project", "now"]} width="100%" />;
}
```

## 无提示符

`npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetNoPromptFD175ECDExample() {
  return <Snippet prompt={false} text="npm init next-app" width="300px" />;
}
```

## 复制回调

`$ npm init next-app`

```tsx
import { useState } from "react";
import { Snippet } from "@/components/ui/snippet";

export function SnippetCallback32E8D276Example() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Snippet
        onCopy={() => setMessage("Copied npm init next-app")}
        text="npm init next-app"
        width="300px"
      />
      <span role="status" className="text-copy-13 text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
```

## 变体

`$ npm init next-app`

`$ npm init next-app`

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetVariants63D2643BExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-3 flex-initial">
      <Snippet text="npm init next-app" type="success" width="300px" />
      <Snippet text="npm init next-app" type="error" width="300px" />
      <Snippet text="npm init next-app" type="warning" width="300px" />
    </div>
  );
}
```

## 受控的已复制状态

`Copy install prompt`

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Snippet } from "@/components/ui/snippet";
import type { JSX } from "react";

const COPY_TEXT = `# About
Template for a full-featured Next.js AI chatbot

# Requirements
This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.`;

export function SnippetControlledCopiedStateB953E7D9Example(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <Snippet
      copied={copied}
      copyText={COPY_TEXT}
      onCopy={handleCopy}
      text="Copy install prompt"
      prompt={false}
      width="300px"
    />
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Snippet } from "@/components/ui/snippet";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">text</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可复制的文本；数组会渲染为多行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">代码片段宽度；数字按像素处理。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dark</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用反色表面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prompt</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示但不复制 shell 提示符。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制成功后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SnippetType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">语义文字颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copied</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的已复制状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copyText</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">覆盖剪贴板内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 用户要复制的可运行 shell 命令用 Snippet。内联 token（环境变量名、路径）用 InlineCode，多行源码用 CodeBlock。
- 把命令作为文本传入。组件自行渲染提示符；让复制的负载与用户所见保持同步。
- 一个 Snippet 一条命令。较长脚本改用 CodeBlock，让用户复制前能阅读。
- Snippet 配 CopyButton 功能，让用户无需手选文本即可取走命令。
