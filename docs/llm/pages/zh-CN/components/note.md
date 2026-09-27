# 注释

> Route: `/components/note`

显示需要关注或提供附加信息的文本。

[返回组件](#/components)

# 注释

note

显示需要关注或提供附加信息的文本。

## 何时使用

- 在字段、卡片或它描述的区块旁边提供上下文反馈，例如区域变更警告、速率限制提醒或使用量提示。
- 需要在行内持续展示一条提示信息直到底层状态发生变化，且不涉及破坏性操作或全局横幅级别的内容。
- 需要通过不同语义变体（destructive、warning、success）来表达不同类型的反馈信息时。

## 何时不应使用

- 当消息是页面级或系统级的且需要 CTA 时，应使用 Banner；如果是临时性通知则使用 Toast；如果是破坏性确认则使用 Modal。
- 不要在同一个概念上堆叠三条以上的 Note——这说明页面架构本身需要改进，而不是靠叠加 Note 来解决。

## 示例

### 尺寸变体

Note 提供多种尺寸供选择，以适应不同的布局密度需求——紧凑的尺寸适合密集表格行，标准尺寸适合卡片和段落之间。

### 带操作的注释

在 Note 中加入操作按钮或链接，让用户可以直接执行后续动作，如查看文档、了解更多详情。

### 带标签的注释

为 Note 添加自定义标签以提升语义清晰度，在标签前显示图标和文字说明，帮助用户快速理解注意内容的含义。

### 自定义图标

替换 Note 默认的图标槽位以使用自定义 SVG 图标，满足品牌特定的视觉需求和更丰富的上下文表达。

## 无障碍

- 不同变体（destructive、warning、success）通过颜色和图标传递语义，但颜色本身不足以区分——必须搭配明确的文本说明。
- Note 不是临时通知——它是持久性的，屏幕阅读器会在页面加载时立即播报其内容。
- 禁用态（disabled）会同时设置 aria-disabled 与原生 inert，整块 Note 不可交互并从无障碍树中移除。

## 受控行为

不适用: Note 是一个纯展示型通知组件，没有内部交互状态。它的行为完全由 props（variant、icon、children）驱动，不存在受控/非受控的概念。

## 响应式行为

- Note 的宽度会自适应容器，在窄屏上仍然保持可读且不会溢出。
- 尺寸变体（small/large）可以根据所在区域的密度需求进行选择。

## 主题行为

- Note 的各语义变体颜色（destructive、warning、success、secondary、violet、cyan）均从主题令牌获取，自动适配深浅色模式。
- 禁用状态的 Note 会降低透明度但仍保留足够的对比度以维持可读性。

## 实时示例

A small note.

A medium note.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteSizes74A3978DExample() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note size="small">
        <NoteContent>A small note.</NoteContent>
      </Note>
      <Note>
        <NoteContent>A medium note.</NoteContent>
      </Note>
    </div>
  );
}
```

## 操作

This note details some information.

This note details a large amount information that could potentially wrap into two or more lines.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteAction64CFF131Example() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex w-full flex-col gap-3">
      <Note>
        <NoteContent>This note details some information.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small" onClick={() => setMessage("Upgrade requested")}>
            Upgrade
          </Button>
        </NoteAction>
      </Note>
      <Note>
        <NoteContent>
          This note details a large amount information that could potentially wrap into two or more
          lines.
        </NoteContent>
        <NoteAction>
          <Button typeName="button" size="small" onClick={() => setMessage("Upgrade requested")}>
            Upgrade
          </Button>
        </NoteAction>
      </Note>
      <span role="status" aria-live="polite" className="min-h-5 text-copy-13 text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
```

## 次要

This note details some secondary information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteSecondary62F2CCFFExample() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note variant="secondary">
        <NoteContent>This note details some secondary information.</NoteContent>
      </Note>
    </div>
  );
}
```

## 紫色

This note details some violet information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteViolet2A364288Example() {
  return (
    <Note variant="violet">
      <NoteContent>This note details some violet information.</NoteContent>
    </Note>
  );
}
```

## 青色

This note details some cyan information.

```tsx
import { Note, NoteContent } from "@/components/ui/note";

export function NoteCyanE95BB222Example() {
  return (
    <Note variant="cyan">
      <NoteContent>This note details some cyan information.</NoteContent>
    </Note>
  );
}
```

## 禁用

This note details a warning.

```tsx
import { Button } from "@/components/ui/button";
import { Note, NoteAction, NoteContent } from "@/components/ui/note";

export function NoteDisabled75081B59Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note disabled fill variant="warning">
        <NoteContent>This note details a warning.</NoteContent>
        <NoteAction>
          <Button typeName="button" size="small">
            Upgrade
          </Button>
        </NoteAction>
      </Note>
    </div>
  );
}
```

## 标签

Region Change:Changing this region restarts all functions.

```tsx
import { Note, NoteContent, NoteLabel } from "@/components/ui/note";

export function NoteLabel0E66373FExample() {
  return (
    <Note>
      <NoteContent>
        <NoteLabel>Region Change:</NoteLabel>Changing this region restarts all functions.
      </NoteContent>
    </Note>
  );
}
```

## 自定义图标

A custom icon replaces the variant's default.

Pass a null icon to render no icon at all.

```tsx
import { Note, NoteContent } from "@/components/ui/note";
import { Sparkles } from "lucide-react";

export function NoteCustomIconEE5755A2Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Note icon={<Sparkles className="size-4" aria-hidden />}>
        <NoteContent>A custom icon replaces the variant's default.</NoteContent>
      </Note>
      <Note icon={null}>
        <NoteContent>Pass a null icon to render no icon at all.</NoteContent>
      </Note>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Note, NoteContent, NoteAction, NoteLabel } from "@/components/ui/note";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">NoteVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">语义提示样式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fill</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用柔和填充背景。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "medium"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提示尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">自定义图标；null 会移除图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用提示内的操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 对紧邻所描述字段、卡片或区块的内联上下文反馈用 Note：区域选择器上方的区域变更警告、用量 gauge 旁的限流提示。
- 页面级或系统级、需要 CTA 的消息用 Banner，瞬态确认用 Toast，破坏性确认用 Modal。
- 按含义选变体：必须修复的问题用 destructive、需确认的后果用 warning、通过的检查用 success；省略 variant 用默认信息图标。
- Note 持久存在，直到底层状态改变；不要临时加关闭控件，它会同消息竞争。
- 一个概念一个 Note。一张卡上堆三个 Note 说明页面架构而非 Note 文案有问题。
- 正文是点名影响的主动语态单句：Changing this region restarts all functions.。
