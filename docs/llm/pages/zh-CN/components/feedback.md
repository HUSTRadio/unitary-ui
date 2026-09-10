# 反馈

> Route: `/components/feedback`

收集表情评分和开放文本反馈。

[返回组件](#/components)

# 反馈

Feedback

收集表情评分和开放文本反馈。

## 何时使用

- 在页面末尾、文档结尾或已完成的工作流之后放置反馈面板，用户在形成观点后再收集意见。
- 需要轻量级的情感反馈（表情评分）加上可选的详细文字评论时，避免引入完整的表单系统。
- 用于对特定流程进行定向反馈收集（如 Imports 反馈、Bug 报告）以获取针对性改进信息。

## 何时不应使用

- 不要在用户刚打开的表面就前置反馈面板——这会干扰用户正在执行的主要任务。
- 不要用 Feedback 替代支持表单、Bug 报告入口或 NPS 采样调查——这些场景有专门的界面和工具。
- 不要自动展开表单——默认变体保持按钮状态，Inline 只常显评分胶囊，直到用户主动操作。

## 示例

### 默认反馈面板

展示 32px 次级按钮打开 340px 锚定 Popover 的默认反馈结构。

### 行内反馈

展示 274×48 评分胶囊在选中表情后于同一容器内扩展为反馈表单。

### 带元数据的反馈

展示在反馈面板中附加上下文元数据的使用方式，帮助团队更好地了解反馈来源。

## 无障碍

- 表情评分按钮组应为每个选项提供明确的 aria-label 以便屏幕阅读器识别不同的情感选项。
- 默认 Popover 提交后关闭并将焦点返回触发器；Inline 收起时不会制造虚假的弹窗焦点陷阱。
- 可选的文本输入区域应有正确的 label 关联和 aria-describedby 辅助文本。

## 受控行为

- 默认 Popover 在 Escape 或外部点击关闭时保留当前草稿，重新打开后可继续编辑。
- Inline 在 Escape、外部点击或焦点离开后收起并清空评分，同时保留文字草稿。
- dryRun 下 Send 不调用 onSubmit，也不关闭界面；正常提交会复位评分、文字和主题。

## 响应式行为

- 默认 Popover 以触发器为锚点，Inline 始终在原位置展开；两者都不会切换成 Modal 或 Drawer。
- 四个表情按钮保持 32px 圆形点击区域和 1px 间距，与官方桌面及窄屏形态一致。
- 默认 340px、Inline 展开 336px，并受视口减 32px 的最大宽度约束，避免窄屏水平溢出。

## 主题行为

- 所有评分统一使用 blue-300 背景和 blue-900 图形强调，不引入官方不存在的四色情绪语义。
- Local RatingPill extension 单独保留四色语义胶囊；它不是官方 Feedback 变体，也不改变 Feedback 的蓝色状态。
- 面板阴影、背景色和边框颜色遵循 Geist 主题系统，支持全局主题变量的覆盖。

## 实时示例

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackDefault21B111CBExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## 行内反馈

这对你有帮助吗？

```tsx
import { Feedback } from "@/components/ui/feedback";

export function FeedbackInline99ED40ACExample() {
  return <Feedback dryRun type="inline" />;
}
```

## 搭配 Select 的反馈

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithSelectBF2A8F56Example() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" showTopics dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## 带元数据的反馈

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithMetadata6449A9ACExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="vercel"
          dryRun
          metadata={{
            userId: "user_12345",
            location: "post-checkout",
            orderId: "order_123456",
          }}
        />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## 本地 RatingPill 扩展

Was this helpful?

Was this helpful?

Was this helpful?

```tsx
import { RatingPill } from "@/components/ui/rating-pill";

/** Local Unitary extension; not one of the six official Geist Feedback demos. */
export function FeedbackRatingBar253F979EExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <RatingPill label="Was this helpful?" defaultValue="love" />
      <RatingPill label="Was this helpful?" defaultValue="not-great" />
      <RatingPill label="Was this helpful?" defaultValue="hate" />
    </div>
  );
}
```

## 带前缀的反馈

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithPrefixEBD13739Example() {
  return <Feedback dryRun label="vercel" prefix={<Flag className="size-4" />} />;
}
```

## 带后缀的反馈

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithSuffixE429255FExample() {
  return <Feedback dryRun label="vercel" suffix={<Flag className="size-4" />} />;
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Feedback } from "@/components/ui/feedback";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">默认次级触发按钮显示的文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"Feedback"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选表单文案；在 Inline 中替换胶囊问题文本。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dryRun</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">演示模式：Send 不调用 onSubmit，也不关闭当前界面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"inline"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用常显评分胶囊，并在同一容器内展开。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showTopics</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示预定义的产品主题选择器。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">metadata</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, string&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给 onSubmit 的上下文。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发器或 Inline 问题文本之前的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发器或 Inline 问题文本之后的内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RatingValue</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始非受控评分；所有评分统一使用蓝色选中态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record&lt;string, string&gt;) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在非 dryRun 提交后接收评分、文本与可选元数据。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 把 Feedback 放在页面、文档或已完成流程的末尾，此时用户已形成观点。不要把它前置到用户刚打开的界面上。
- 面板保持折叠，直到用户点击触发器；自动展开会打断触发反馈的工作。
- 提交关闭面板并把焦点还给触发器。不要用通用确认 toast 替换面板；关闭本身就是确认。
- label 首字母大写且简短。默认 Feedback 即可；仅当限定到某个流程时覆盖：Feedback on Imports、Report a Bug。label 不要以 ? 结尾。
- copy 覆盖表情行旁的提示头，句首大写（How did the import go?）。去掉 please 与 we're sorry。
- 不要用 Feedback 替代支持表单、bug 报告入口或 NPS 抽样；这些有专门界面。
