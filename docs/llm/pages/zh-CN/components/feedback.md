# 反馈

> Route: `/components/feedback`

收集表情评分和开放文本反馈。

[返回组件](#/components)

# 反馈

Feedback

收集表情评分和开放文本反馈。

## 何时使用

-   在页面末尾、文档结尾或已完成的工作流之后放置反馈面板，用户在形成观点后再收集意见。
-   需要轻量级的情感反馈（表情评分）加上可选的详细文字评论时，避免引入完整的表单系统。
-   用于对特定流程进行定向反馈收集（如 Imports 反馈、Bug 报告）以获取针对性改进信息。

## 何时不应使用

-   不要在用户刚打开的表面就前置反馈面板——这会干扰用户正在执行的主要任务。
-   不要用 Feedback 替代支持表单、Bug 报告入口或 NPS 采样调查——这些场景有专门的界面和工具。
-   不要把反馈面板设为自动展开——它应当收起直到用户主动点击触发器，避免打断工作流。

## 示例

### 默认反馈面板

展示默认的表情评分和可选文本输入的折叠式反馈面板结构。

### 行内反馈

演示将反馈组件嵌入到行级布局中的用法，适合列表项后的即时反馈。

### 带元数据的反馈

展示在反馈面板中附加上下文元数据的使用方式，帮助团队更好地了解反馈来源。

## 无障碍

-   表情评分按钮组应为每个选项提供明确的 aria-label 以便屏幕阅读器识别不同的情感选项。
-   提交后面板应关闭并将焦点返回到触发器按钮，完成本身即是一种确认反馈。
-   可选的文本输入区域应有正确的 label 关联和 aria-describedby 辅助文本。

## 受控行为

-   反馈面板的展开/收起状态可由父组件通过 open 属性受控管理，实现条件式展开逻辑。
-   提交后自动关闭面板并返回焦点至触发器，调用方可监听提交事件以处理收集到的数据。
-   支持预填充初始评分值以实现个性化或之前已选择的反馈状态恢复。

## 响应式行为

-   反馈面板在移动设备上从底部弹出（Drawer 样式），在桌面端居中显示为浮层面板。
-   表情评分按钮在小屏幕上增大间距以提升触摸目标面积，确保移动端可用性。
-   文本输入区域在全宽容器中自适应高度，在窄屏上不出现水平溢出。

## 主题行为

-   表情评分的颜色映射（绿色满意、黄色中性、红色不满）在暗色/亮色模式下均保持良好的可读性。
-   面板阴影、背景色和边框颜色遵循 Geist 主题系统，支持全局主题变量的覆盖。

## 实时示例

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

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
```

这对你有帮助吗？

```tsx
import { Feedback } from "@/components/ui/feedback";

<Feedback dryRun label="vercel" type="inline" />
```

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

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
```

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

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
```

vercel

vercel

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";

// 胶囊 rating bar：收起为一行 trigger，点开展开评分、点外部收起；选中后胶囊以语义色着色
// （love → success 绿 / okay → gray 中性 / not-great → warning 黄 / hate → error 红）
<>
  <div className="flex flex-wrap items-center justify-center gap-4">
    <Feedback label="vercel" dryRun defaultValue="love" />
    <Feedback label="vercel" dryRun defaultValue="not-great" />
    <Feedback label="vercel" dryRun defaultValue="hate" />
  </div>
</>
```

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

<Feedback dryRun label="vercel" prefix={<Flag className="size-4" />} />
```

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

<Feedback dryRun label="vercel" suffix={<Flag className="size-4" />} />
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Feedback, RatingPill } from "@/components/ui/feedback"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: FeedbackRatingValue) =&gt; void | Promise&lt;void&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收生产环境中的反馈评分。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RatingValue</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">初始评分（非受控）。胶囊评分条按语义色着色：love → success / okay → 灰色 / not-great → warning / hate → error。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   把 Feedback 放在页面、文档或已完成流程的末尾，此时用户已形成观点。不要把它前置到用户刚打开的界面上。
-   面板保持折叠，直到用户点击触发器；自动展开会打断触发反馈的工作。
-   提交关闭面板并把焦点还给触发器。不要用通用确认 toast 替换面板；关闭本身就是确认。
-   label 首字母大写且简短。默认 Feedback 即可；仅当限定到某个流程时覆盖：Feedback on Imports、Report a Bug。label 不要以 ? 结尾。
-   copy 覆盖表情行旁的提示头，句首大写（How did the import go?）。去掉 please 与 we're sorry。
-   不要用 Feedback 替代支持表单、bug 报告入口或 NPS 抽样；这些有专门界面。
