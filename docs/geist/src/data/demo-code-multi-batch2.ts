/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— Multi Batch 2。
 *
 * 结构：DEMO_CODE_MULTI_BATCH2[组件 slug]["Default"] = 该组件整个 demo 函数的综合 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 整个 demo 函数的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react，不用 @vercel/geistcn-assets。
 * - 官方 @vercel/geistcn/components → @/components/ui/<slug>。
 * - demo 函数里的 state / useLanguage / demoText / 共享常量引用已去除：
 *   demoText(language, "X") → "X"，useState 变量替换为合理默认值或简化。
 */

export const DEMO_CODE_MULTI_BATCH2: Record<string, Record<string, string>> = {
  menu: {
    Default: `import { Menu, MenuButton, MenuContainer, MenuDivider, MenuItem } from "@/components/ui/menu";
import { Copy, Edit, Trash2 } from "lucide-react";

<MenuContainer>
  <MenuButton variant="secondary">Actions</MenuButton>
  <Menu width={200}>
    <MenuItem prefix={<Edit aria-hidden />}>Edit Project</MenuItem>
    <MenuItem prefix={<Copy aria-hidden />}>Duplicate Project</MenuItem>
    <MenuDivider />
    <MenuItem type="error" prefix={<Trash2 aria-hidden />}>
      Delete Project
    </MenuItem>
  </Menu>
</MenuContainer>`,
  },
  feedback: {
    Default: `import { Feedback } from "@/components/ui/feedback";

<div className="w-full max-w-md">
  <Feedback onSubmit={(rating, text) => console.log("Feedback submitted:", rating, text)} />
</div>`,
  },
  "project-banner": {
    Default: `import { ProjectBanner } from "@/components/ui/project-banner";
import { Tooltip } from "@/components/ui/tooltip";
import { RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

<div className="w-full space-y-6">
  <ProjectBanner
    icon={<ShieldCheck />}
    label="Attack Challenge Mode is enabled for this project"
    callToAction={{ label: "Disable", href: "#" }}
  />
  <ProjectBanner
    variant="success"
    icon={<ShieldCheck />}
    label="Attack Challenge Mode is enabled for this project"
    callToAction={{ label: "Disable", href: "#" }}
  />
  <ProjectBanner
    variant="warning"
    icon={<RotateCcw />}
    label={
      <>
        This project was rolled back by{" "}
        <Tooltip text="Yesterday for project marketing-website">@johnphamous</Tooltip>
      </>
    }
    callToAction={{ label: "Undo Rollback", onClick: () => {} }}
  />
  <ProjectBanner
    variant="error"
    icon={<TriangleAlert />}
    label="Payment failed, update credit card information before your account is shut down"
    callToAction={{ label: "Add Credit Card", href: "#" }}
  />
</div>`,
  },
  "show-more": {
    Default: `import { ShowMore } from "@/components/ui/show-more";

<div className="flex w-full max-w-lg flex-col items-start gap-3">
  <p id="show-more-content" className="text-copy-14 text-foreground">
    Geist Style Framework provides reusable tokens, primitives, and component patterns for
    building consistent React interfaces…
  </p>
  <ShowMore aria-controls="show-more-content" />
</div>`,
  },
  skeleton: {
    Default: `import { Skeleton } from "@/components/ui/skeleton";

<div className="flex w-full max-w-xl flex-col gap-6">
  {/* 卡片骨架 */}
  <div className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-gray-alpha-400 p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton className="mt-2 h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
  {/* 文本骨架 */}
  <div className="flex w-full max-w-sm flex-col gap-2">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-3 w-2/3" />
  </div>
  {/* 圆形骨架 */}
  <div className="flex items-center gap-4">
    <Skeleton className="size-12 rounded-full" />
    <Skeleton className="size-16 rounded-full" />
    <Skeleton className="size-20 rounded-full" />
  </div>
</div>`,
  },
};
