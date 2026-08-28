# 复制按钮

> Route: `/components/copy-button`

将指定字符串复制到剪贴板，并在完成后提供反馈。

[返回组件](#/components)

# 复制按钮

Copy Button

将指定字符串复制到剪贴板，并在完成后提供反馈。

## 何时使用

-   需要将一个简短字符串原样复制到剪贴板，例如令牌（token）、命令行指令、唯一标识符 ID。
-   需要在复制完成后显示约 1.5 秒的打勾确认反馈，让用户明确感知复制操作已完成。

## 何时不应使用

-   对于较长的代码块或多行文本，应使用完整的 Snippet 组件搭配其自带的复制功能，而不是单独使用 CopyButton。
-   不要在图标按钮上省略 aria-label；屏幕阅读器无法通过纯图标理解按钮的功能意图。

## 示例

### 基本复制按钮

点击后将指定文本复制到剪贴板，并显示成功反馈图标。

## 无障碍

-   为图标-only 按钮设置 aria-label 属性，使屏幕阅读器宣布具体操作含义（如 'Copy deployment URL'），而不仅是图标本身。
-   优先使用 navigator.clipboard.writeText API，并附加隐藏的 textarea execCommand 降级方案，以兼容缺少剪贴板权限的环境。
-   复制成功后保留约 1.5 秒的打勾视觉反馈，之后重置回原始状态以便下一次点击。

## 受控行为

不适用: CopyButton 内部管理复制成功的短暂视觉反馈状态，不暴露外部的受控 value/onChange API。

## 响应式行为

不适用: CopyButton 为小型图标按钮，在所有视口下保持一致的尺寸和行为。

## 主题行为

不适用: CopyButton 的颜色和样式自动跟随 Geist 设计系统主题令牌适配当前配色方案。

## 实时示例

Click to copy “lipsum”

```tsx
import { CopyButton } from "@/components/ui/copy-button";

<div className="flex flex-wrap items-center gap-3">
  <CopyButton textToCopy="lipsum" />
  <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
</div>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { CopyButton } from "@/components/ui/copy-button"
```

原生属性：`ButtonHTMLAttributes<HTMLButtonElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">textToCopy</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">写入剪贴板的文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制成功后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onError</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(error: unknown) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制失败时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   对用户逐字复制的单个短字符串（token、命令、ID）用 CopyButton。较长块配带自身复制功能的完整 Snippet。
-   复制成功后展示约 1.5s 的对勾反馈，让动作看起来已完成；下次点击前重置它。
-   纯图标按钮设置 aria-label，让屏幕阅读器播报动作（Copy deployment URL）而非仅播报图标。
-   优先 navigator.clipboard.writeText，并提供隐藏 textarea 的 execCommand 回退，以便剪贴板权限缺失时仍可复制。
