/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— Split Batch 2（skeleton）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH2[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - blockId 用官方 docs/geist-markdown-refs/components/skeleton.md 的「## 区块标题」原文。
 * - 官方 @vercel/geistcn/components → @/components/ui/<slug>。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - 需要状态时保留 useState / export function Component() 包装；纯展示区块直接给 JSX 用法。
 * - Button 官方 `variant` prop 本地对应为 `type`（视觉变体），HTML type 属性用 `typeName`。
 */

export const DEMO_CODE_SPLIT_BATCH2: Record<string, Record<string, string>> = {
  skeleton: {
    "Default with set width": `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton width={160} />`,
    "Default with box height": `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={42} width={160} />`,
    "Wrapping children": `import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex flex-col items-start justify-start gap-4 flex-initial">
  <Skeleton>
    <Button typeName="button">Hidden by skeleton</Button>
  </Skeleton>

  <Skeleton show={false}>
    <Button typeName="button">Not hidden by skeleton</Button>
  </Skeleton>
</div>`,
    "Wrapping children with fixed size": `import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex flex-col items-start justify-start gap-4 flex-initial">
  <Skeleton height={100} width="100%">
    {null}
  </Skeleton>

  <Skeleton height={100} width="100%">
    <Button typeName="button">Not hidden by Skeleton</Button>
  </Skeleton>
</div>`,
    Pill: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton pill width={48} />`,
    Rounded: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={48} height={48} rounded width={48} />`,
    Squared: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton boxHeight={48} height={48} squared width={48} />`,
    "No animation": `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton animated={false} height={100} width="100%">
  {null}
</Skeleton>`,
    Button: `import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex flex-col gap-4">
  <div className="flex flex-col gap-2">
    <p className="text-label-14">Without button prop (default):</p>
    <Skeleton height={32} width={120}>
      <Button typeName="button">Loading...</Button>
    </Skeleton>
  </div>
  <div className="flex flex-col gap-2">
    <p className="text-label-14">With button prop (extends animation by 1px):</p>
    <Skeleton button height={32} width={120}>
      <Button typeName="button">Loading...</Button>
    </Skeleton>
  </div>
  <div className="flex flex-col gap-2">
    <p className="text-label-14">Multiple buttons loading:</p>
    <div className="flex gap-3">
      <Skeleton button>
        <Button typeName="button">Save</Button>
      </Skeleton>
      <Skeleton button>
        <Button type="secondary" typeName="button">Cancel</Button>
      </Skeleton>
    </div>
  </div>
</div>`,
  },
};
