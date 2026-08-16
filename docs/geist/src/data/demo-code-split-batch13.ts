/**
 * Split-batch 13 — status-dot 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH13[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/status-dot.md 的
 *   「## 区块标题」原文（Default / Label）。
 * - 官方 2 个区块均无 useState，故不保留 export function Component() 包装，直接 import + JSX。
 * - 本地 StatusDot props 已实现 state / label / titlePrefix，官方 demo 用到的 prop 全部映射。
 */

export const DEMO_CODE_SPLIT_BATCH13: Record<string, Record<string, string>> = {
  "status-dot": {
    Default: `import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot state="QUEUED" />
  <StatusDot state="BUILDING" />
  <StatusDot state="ERROR" />
  <StatusDot state="READY" />
  <StatusDot state="CANCELED" />
</div>`,
    Label: `import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot label state="QUEUED" />
  <StatusDot label state="BUILDING" />
  <StatusDot label state="ERROR" />
  <StatusDot label state="READY" />
  <StatusDot label state="CANCELED" />
</div>`,
  },
};
