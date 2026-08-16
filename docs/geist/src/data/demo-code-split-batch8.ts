/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— split batch 8。
 *
 * 覆盖组件：project-banner（官方 4 区块：Default / Success / Warning / Error）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH8[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * blockId 与官方快照 docs/geist-markdown-refs/components/project-banner.md
 * 的「## 区块标题」原文一致（Default / Success / Warning / Error）。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 官方 import @vercel/geistcn/components 映射为 @/components/ui/project-banner
 *   （Warning 区块另含 Tooltip → @/components/ui/tooltip）；
 *   官方图标 @vercel/geistcn-assets/icons 映射为 lucide-react：
 *   IconShieldCheck → ShieldCheck、IconRotateCounterClockwise → RotateCcw、
 *   IconWarning → TriangleAlert。
 * - 官方 4 区块均无 useState，按约定不保留 export function Component() 包装，
 *   源码 = import + 该区块 JSX。
 * - 官方 Success / Warning / Error 区块的单元素「变体 map」脚手架
 *   （ProjectBannerVariants.map）已展平为直接 JSX，与本地 demo
 *   （docs-components-page.tsx 的 ProjectBannerDemo）用法一致。
 * - 官方 prop 本地已全部实现（variant / icon / label /
 *   callToAction{label, href, onClick}），无省略项。
 */

export const DEMO_CODE_SPLIT_BATCH8: Record<string, Record<string, string>> = {
  "project-banner": {
    Default: `import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

<ProjectBanner
  callToAction={{
    label: "Disable",
    href: "/",
  }}
  icon={<ShieldCheck className="shrink-0" />}
  label={<>Attack Challenge Mode is enabled for this project</>}
/>`,
    Success: `import { ProjectBanner } from "@/components/ui/project-banner";
import { ShieldCheck } from "lucide-react";

<ProjectBanner
  callToAction={{
    label: "Disable",
    href: "/",
  }}
  icon={<ShieldCheck className="shrink-0" />}
  label={<>Attack Challenge Mode is enabled for this project</>}
  variant="success"
/>`,
    Warning: `import { ProjectBanner } from "@/components/ui/project-banner";
import { Tooltip } from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";

<ProjectBanner
  callToAction={{
    label: "Undo Rollback",
    onClick: () => {
      alert("Button clicked");
    },
  }}
  icon={<RotateCcw />}
  label={
    <>
      This project was rolled back by{" "}
      <Tooltip
        className="underline decoration-dashed underline-offset-[5px]"
        text="Yesterday for project marketing-website"
      >
        @johnphamous
      </Tooltip>
    </>
  }
  variant="warning"
/>`,
    Error: `import { ProjectBanner } from "@/components/ui/project-banner";
import { TriangleAlert } from "lucide-react";

<ProjectBanner
  callToAction={{
    label: "Add Credit Card",
    href: "/$",
  }}
  icon={<TriangleAlert />}
  label={
    <>
      Payment failed, update credit card information before your account is shut down
    </>
  }
  variant="error"
/>`,
  },
};
