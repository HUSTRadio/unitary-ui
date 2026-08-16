/**
 * Split-batch 5 — feedback 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH5[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/feedback.md 的
 *   「## 区块标题」原文（Default / Inline / Feedback with Select / Feedback with
 *   metadata / Feedback with prefix / Feedback with suffix）。
 * - 官方 6 个区块均无 useState，故不保留 export function Component() 包装，直接 import + JSX。
 * - 本地 FeedbackProps 仅实现 defaultValue / onSubmit（+ form 原生 props）；官方
 *   label / dryRun / type / showTopics / metadata / prefix / suffix 本地未实现，
 *   一律省略（传入会触发 TS 报错）。IconFlagPriority（prefix/suffix 用）随之无需引入。
 * - Default / Feedback with Select / Feedback with metadata 区块的
 *   Note + NoteContent 移动端降级结构本地已实现（@/components/ui/note），原样保留。
 */

export const DEMO_CODE_SPLIT_BATCH5: Record<string, Record<string, string>> = {
  feedback: {
    Default: `import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

<>
  <div className="hidden justify-center xl:flex">
    <Feedback />
  </div>
  <div className="flex justify-center xl:hidden">
    <Note>
      <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
    </Note>
  </div>
</>`,
    Inline: `import { Feedback } from "@/components/ui/feedback";

<Feedback />`,
    "Feedback with Select": `import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

<>
  <div className="hidden justify-center xl:flex">
    <Feedback />
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
    <Feedback />
  </div>
  <div className="flex justify-center xl:hidden">
    <Note>
      <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
    </Note>
  </div>
</>`,
    "Feedback with prefix": `import { Feedback } from "@/components/ui/feedback";

<Feedback />`,
    "Feedback with suffix": `import { Feedback } from "@/components/ui/feedback";

<Feedback />`,
  },
};
