# 带复制按钮的文本

> Route: `/components/text-with-copy-button`

在文本旁显示可将其复制到剪贴板的按钮。

[返回组件](#/components)

# 带复制按钮的文本

Text With Copy Button

在文本旁显示可将其复制到剪贴板的按钮。

## 何时使用

- 展示一段短文本供用户快速复制，如令牌、命令、ID 或配置值等需要按原样使用的字符串。
- 需要在代码片段、终端命令或环境变量旁边提供便捷的复制操作时，作为内联辅助功能使用。

## 何时不应使用

- 不要复制超过一行的长文本块——对于较长的代码块，优先使用 CodeBlock 或 Snippet 组件自带的复制按钮。
- 不要在不需要交互的纯展示场景中添加复制按钮——复制 affordance 应服务于实际需要复制内容的用户。

## 示例

### 默认文本复制

展示默认的文本+复制按钮布局，文本右侧紧邻复制图标。

### 省略号摘要

演示使用 ellipsis 截断较长的配置摘要，并提供明确的复制操作名称。

## 无障碍

- 复制按钮作为仅图标按钮时应设置 aria-label（如 'Copy deployment URL'），让屏幕阅读器准确描述操作目标。
- 复制成功后显示约 1 秒的对勾反馈，使操作结果对视觉用户清晰可辨。
- 组件使用 navigator.clipboard.writeText；写入失败时显示错误 toast 并调用 onError，不会尝试 legacy execCommand 回退。

## 受控行为

不适用: TextWithCopyButton 是展示型组件，复制行为由内部处理；其核心逻辑是读取文本并写入剪贴板，不需要外部状态来控制复制过程。

## 响应式行为

- 只有显式传入 ellipsis 时文本才会截断；默认文本保持单行且不自动启用省略号。
- 复制图标区域为 16px，组件不保证 44px 触控目标；触屏场景应由调用方提供更大的外层命中区域。

## 主题行为

- 文本颜色和复制按钮图标跟随主题变量更新，在暗色/亮色模式下均保持良好的对比度和可读性。
- 复制成功状态的视觉反馈（对勾图标）在不同主题下均有对应的颜色适配。

## 实时示例

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied to clipboard"
  textLabel="Copy"
  textToCopy="lipsum"
/>;
```

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied hashed digest to clipboard"
  textLabel="Copy config digest"
  textToCopy="edgeConfigData.digest"
/>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textToCopy</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">展示并复制的文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textLabel</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见文本标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制成功后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制失败时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
