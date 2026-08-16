/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— split batch 14。
 *
 * 覆盖组件：text-with-copy-button（官方 2 区块：Default / With Small and Tertiary）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH14[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * blockId 与官方快照 docs/geist-markdown-refs/components/text-with-copy-button.md
 * 的「## 区块标题」原文一致（Default / With Small and Tertiary）。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 官方 import @vercel/geistcn/components 映射为 @/components/ui/text-with-copy-button；
 *   官方 demo 未使用图标，故无 lucide-react。
 * - 两区块均无 useState，故按约定不保留 export function Component() 包装（直接 JSX）。
 * - 官方 prop（textToCopy / textLabel / successMessage / ellipsis）本地已全部实现
 *   （见 src/components/ui/text-with-copy-button.tsx 的 TextWithCopyButtonProps），
 *   逐一保留，无省略项。
 */

export const DEMO_CODE_SPLIT_BATCH14: Record<string, Record<string, string>> = {
  "text-with-copy-button": {
    Default: `import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied to clipboard"
  textLabel="Copy"
  textToCopy="lipsum"
/>`,
    "With Small and Tertiary": `import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<TextWithCopyButton
  ellipsis
  successMessage="Copied hashed digest to clipboard"
  textLabel="Copy config digest"
  textToCopy="edgeConfigData.digest"
/>`,
  },
};
