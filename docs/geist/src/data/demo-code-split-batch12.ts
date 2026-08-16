/**
 * Batch 12 (loading-dots) — 组件 demo 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH12[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react，不用 @vercel/geistcn-assets。
 * - blockId 用官方快照「## 区块标题」原文（Default / With text）。
 * - 本批 2 区块均无 useState，故省略官方 export function Component() 包装，仅保留 import + JSX。
 * - 映射说明：官方 LoadingDots `size="sm" | "md" | "lg"` 与 children（With text）本地均实现，无省略。
 */

export const DEMO_CODE_SPLIT_BATCH12: Record<string, Record<string, string>> = {
  "loading-dots": {
    Default: `import { LoadingDots } from "@/components/ui/loading-dots";

<div className="flex flex-col items-start justify-between gap-6 flex-initial">
  <LoadingDots size="sm" />
  <LoadingDots size="md" />
  <LoadingDots size="lg" />
</div>`,
    "With text": `import { LoadingDots } from "@/components/ui/loading-dots";

<LoadingDots size="md">
  <p className="text-copy-14 text-gray-900">Loading</p>
</LoadingDots>`,
  },
};
