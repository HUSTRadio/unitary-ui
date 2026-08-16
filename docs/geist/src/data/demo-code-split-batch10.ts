/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— split batch 10。
 *
 * 覆盖组件：show-more（官方 3 区块：Default / Expanded / No border）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH10[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * blockId 与官方快照 docs/geist-markdown-refs/components/show-more.md
 * 的「## 区块标题」原文一致（Default / Expanded / No border）。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 官方 import @vercel/geistcn/components 映射为 @/components/ui/show-more；
 *   官方 demo 未使用图标，故无 lucide-react（箭头图标由组件内部渲染）。
 * - 含 useState 的区块保留 export function Component() 包装（本组件仅 Default 区块含
 *   useState）；Expanded / No border 区块无状态，省略包装，仅保留 import + JSX。
 * - 官方 prop 本地已全部实现（expanded / onClick / noBorder），无省略项；
 *   onClick 来自 button 原生 props 透传，与官方受控用法一致。
 */

export const DEMO_CODE_SPLIT_BATCH10: Record<string, Record<string, string>> = {
  "show-more": {
    Default: `import { ShowMore } from "@/components/ui/show-more";
import { useState } from "react";

export function Component() {
  const [expanded, setExpanded] = useState(false);

  return <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />;
}`,
    Expanded: `import { ShowMore } from "@/components/ui/show-more";

<ShowMore expanded />`,
    "No border": `import { ShowMore } from "@/components/ui/show-more";

<ShowMore noBorder />`,
  },
};
