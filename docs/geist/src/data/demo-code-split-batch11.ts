/**
 * Split-batch 11 — theme-switcher 的官方 demo 区块独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH11[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照 docs/geist-markdown-refs/components/theme-switcher.md 的
 *   「## 区块标题」原文（Default / Small / Disabled）。
 * - 官方 3 个区块均无 useState，故不保留 export function Component() 包装，直接 import + JSX。
 * - 本地 ThemeSwitcher 已实现 small / disabled，官方 prop 全部映射（className 为本地扩展）。
 */

export const DEMO_CODE_SPLIT_BATCH11: Record<string, Record<string, string>> = {
  "theme-switcher": {
    Default: `import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher />`,
    Small: `import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher small />`,
    Disabled: `import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<ThemeSwitcher disabled />`,
  },
};
