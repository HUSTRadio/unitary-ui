/**
 * Split-batch 9 — description 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH9[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/description.md 的
 *   「## 区块标题」原文（Default / Text right / Ellipsis）。
 * - 官方 3 区块均无 useState，故不保留 export function Component() 包装，
 *   直接 import + JSX（官方 `import type { JSX } from "react"` 随之省略）。
 * - 官方 import @vercel/geistcn/components → @/components/ui/description。
 * - 本地 DescriptionProps 已实现 title / content / tooltip / right / ellipsis，
 *   官方 3 区块所用 prop 全部映射，无省略项；官方 demo 未使用图标，故无 lucide-react。
 */

export const DEMO_CODE_SPLIT_BATCH9: Record<string, Record<string, string>> = {
  description: {
    Default: `import { Description } from "@/components/ui/description";

<Description
  content="Data about this section."
  title="Section Title"
  tooltip="Additional context about what this section refers to."
/>`,
    "Text right": `import { Description } from "@/components/ui/description";

<Description
  content="Data about this section."
  right
  title="Section Title"
  tooltip="Additional context about what this section refers to."
/>`,
    Ellipsis: `import { Description } from "@/components/ui/description";

<Description
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed venenatis libero. Phasellus consectetur turpis ac est pulvinar finibus. Mauris non tellus pretium, vehicula lectus sed, iaculis ex. Integer eu aliquet turpis. Cras sem nulla, commodo ut libero id, suscipit pulvinar lorem."
  ellipsis
  title="Section Title"
  tooltip="Additional context about what this section refers to."
/>`,
  },
};
