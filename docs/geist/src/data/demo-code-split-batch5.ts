/**
 * Split-batch 5 — feedback 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH5[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/feedback.md 的
 *   「## 区块标题」原文（Default / Inline / Feedback with Select / Feedback with
 *   metadata / Feedback with prefix / Feedback with suffix）。
 * - 本地 FeedbackProps 已实现 label / copy / dryRun / type / showTopics / metadata /
 *   prefix / suffix / defaultValue / onSubmit，与 docs-components-page.tsx 实际渲染一致。
 * - Default / Feedback with Select / Feedback with metadata 三区块为桌面-only：
 *   `hidden justify-center xl:flex` + Note fallback（官方移动端降级结构）。
 * - prefix/suffix 用 lucide Flag 代替官方 IconFlagPriority。
 */

export const DEMO_CODE_SPLIT_BATCH5: Record<string, Record<string, string>> = {
  feedback: {
    Default: `import { Feedback } from "@/components/ui/feedback";
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
</>`,
    Inline: `import { Feedback } from "@/components/ui/feedback";

<Feedback dryRun label="vercel" type="inline" />`,
    "Feedback with Select": `import { Feedback } from "@/components/ui/feedback";
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
</>`,
    "Feedback with metadata": `import { Feedback } from "@/components/ui/feedback";
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
</>`,
    "Feedback with prefix": `import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

<Feedback dryRun label="vercel" prefix={<Flag className="size-4" />} />`,
    "Feedback with suffix": `import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

<Feedback dryRun label="vercel" suffix={<Flag className="size-4" />} />`,
  },
};
