/**
 * 组件 demo 的独立源码（Show code 折叠展开显示）— Multi Batch 3。
 *
 * 结构：DEMO_CODE_MULTI_BATCH3[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 本批为「综合区块」映射：整个 demo 函数作为一个区块，blockId 统一为 "Default"。
 *
 * 填充约定：
 * - 每段源码含 import + 本地 demo 函数 JSX 的完整用法（已去除 state / useLanguage /
 *   demoText / 共享常量等页面内依赖，prop 均为本地组件实际实现）。
 * - import 路径用 @/components/ui/<slug>；图标用 lucide-react（本批 4 个 demo 均无图标）。
 * - 本地组件：snippet / status-dot / text-with-copy-button / theme-switcher，
 *   对应官方快照 docs/geist-markdown-refs/components/<slug>.md。
 */

export const DEMO_CODE_MULTI_BATCH3: Record<string, Record<string, string>> = {
  snippet: {
    Default: `import { Snippet } from "@/components/ui/snippet";

<div className="flex w-full max-w-lg flex-col gap-3">
  <Snippet text="npm i geist" />
  <Snippet text="vercel link" />
</div>`,
  },
  "status-dot": {
    Default: `import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-wrap items-center justify-center gap-5">
  <StatusDot state="QUEUED" label />
  <StatusDot state="BUILDING" label />
  <StatusDot state="READY" label />
  <StatusDot state="ERROR" label />
  <StatusDot state="CANCELED" label />
</div>`,
  },
  "text-with-copy-button": {
    Default: `import { TextWithCopyButton } from "@/components/ui/text-with-copy-button";

<div className="flex flex-col gap-3">
  <TextWithCopyButton textToCopy="npm i geist" textLabel="npm i geist" />
  <TextWithCopyButton textToCopy="vercel deploy --prod" textLabel="vercel deploy --prod" />
</div>`,
  },
  "theme-switcher": {
    Default: `import { ThemeSwitcher } from "@/components/ui/theme-switcher";

<div className="flex items-center gap-2">
  <ThemeSwitcher />
  <span className="text-copy-14 text-muted-foreground">Light / System / Dark</span>
</div>`,
  },
};
