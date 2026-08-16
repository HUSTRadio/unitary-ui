/**
 * Batch 3 (Section) — 组件 renderExtraSections 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SECTION_BATCH3[组件 slug][Section title] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - key 为 docs-components-page.tsx renderExtraSections 中 <Section title="..."> 的英文 title。
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API，对齐本地 Section children 结构）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - Button 官方 `variant` prop 本地对应为 `type`（视觉变体），HTML type 属性用 `typeName`。
 * - 源码内嵌模板字符串需转义反引号与 ${（如 `\`\${x}\``）。
 */

export const DEMO_CODE_SECTION_BATCH3: Record<string, Record<string, string>> = {
  spinner: {
    Colors: `import { Spinner } from "@/components/ui/spinner";

<div className="flex flex-col gap-4">
  <div className="flex items-center gap-4">
    <span className="w-24 text-copy-14 text-muted-foreground">Default:</span>
    <Spinner />
  </div>
  <div className="flex items-center gap-4">
    <span className="w-24 text-copy-14 text-muted-foreground">Red:</span>
    <Spinner className="text-red-700" />
  </div>
  <div className="flex items-center gap-4">
    <span className="w-24 text-copy-14 text-muted-foreground">Green:</span>
    <Spinner className="text-green-700" />
  </div>
  <div className="flex items-center gap-4">
    <span className="w-24 text-copy-14 text-muted-foreground">Blue:</span>
    <Spinner className="text-blue-700" />
  </div>
</div>`,
  },
  tooltip: {
    "No delay": `import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip delay={false} position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right</span>
    </Tooltip>
  </div>
</div>`,
    "Box align": `import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <span>Bottom/Right</span>
    </Tooltip>
  </div>
</div>
<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="left" text="The Evil Rabbit Jumped over the Fence">
      <span>Left/Right</span>
    </Tooltip>
  </div>
</div>
<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="left" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Center</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip boxAlign="right" position="right" text="The Evil Rabbit Jumped over the Fence">
      <span>Right/Right</span>
    </Tooltip>
  </div>
</div>`,
    "Custom content": `import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="bottom"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="left"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      position="right"
      text={
        <>
          The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
        </>
      }
    >
      <span>Right</span>
    </Tooltip>
  </div>
</div>`,
    "Custom type": `import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
      <span>Top</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" type="error">
      <span>Bottom</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence" type="warning">
      <span>Left</span>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence" type="violet">
      <span>Right</span>
    </Tooltip>
  </div>
</div>`,
    Components: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/keyboard-input";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
      <Button size="small" typeName="button">
        Bottom
      </Button>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
      <Badge size="sm">LEFT</Badge>
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
      <Spinner />
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip
      text={
        <>
          Search
          <Kbd>/</Kbd>
        </>
      }
    >
      <span>Shortcut</span>
    </Tooltip>
  </div>
</div>`,
    Other: `import { Tooltip } from "@/components/ui/tooltip";

<div className="flex w-full flex-row flex-wrap">
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
      No tip indicator
    </Tooltip>
  </div>
  <div className="flex flex-1 flex-col items-center justify-center py-2">
    <Tooltip center={false} text="The Evil Rabbit Jumped over the Fence multiple times.">
      No center text
    </Tooltip>
  </div>
</div>`,
  },
  video: {
    "No Loop": `import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
</div>`,
    "No Controls": `import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
</div>`,
  },
  "split-button": {
    "Menu Alignment": `import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";

<div className="flex flex-wrap items-start gap-8">
  <SplitButton
    buttonProps={{ type: "default" }}
    menuButtonLabel="Select save method"
    menuItems={
      <>
        <SplitButtonMenuItem description="Save changes" title="Save" />
        <SplitButtonMenuItem
          description="Save changes and create a new production deployment"
          title="Save + Redeploy"
        />
      </>
    }
    menuProps={{ width: 264 }}
  >
    Save (bottom-start)
  </SplitButton>
  <SplitButton
    buttonProps={{ type: "secondary" }}
    menuAlignment="bottom-end"
    menuButtonLabel="Select save method"
    menuItems={
      <>
        <SplitButtonMenuItem description="Save changes" title="Save" />
        <SplitButtonMenuItem
          description="Save changes and create a new production deployment"
          title="Save + Redeploy"
        />
      </>
    }
    menuProps={{ width: 264 }}
  >
    Save (bottom-end)
  </SplitButton>
</div>`,
    Icon: `import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { ExternalLink, Rocket } from "lucide-react";

<SplitButton
  buttonProps={{ size: "small", type: "secondary" }}
  menuButtonLabel="Copy page"
  menuItems={[
    <SplitButtonMenuItem
      key="v0"
      description="Open this page in v0"
      menuItemProps={{ className: "w-[200px]" }}
      title="Open in v0"
      icon={<Rocket className="size-4" aria-hidden />}
    />,
    <SplitButtonMenuItem
      key="chatgpt"
      description="Open this page in ChatGPT"
      menuItemProps={{ className: "w-[200px]" }}
      title="Open in ChatGPT"
      icon={<ExternalLink className="size-4" aria-hidden />}
    />,
  ]}
  menuProps={{ width: 240 }}
>
  Copy page
</SplitButton>`,
    "Title with Icon": `import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { CircleArrowUp, Save } from "lucide-react";

<div className="flex w-full flex-col gap-8">
  {(["default", "secondary"] as const).map((variant) => (
    <div key={variant} className="flex flex-row gap-1">
      {(["small", "medium", "large"] as const).map((size) => (
        <SplitButton
          key={\`\${variant}-\${size}\`}
          buttonProps={{ size, type: variant }}
          menuButtonLabel="Select save method"
          menuItems={
            <>
              <SplitButtonMenuItem
                description="Save changes"
                title={
                  <span className="flex items-center gap-2">
                    <Save className="size-4" aria-hidden /> Save
                  </span>
                }
              />
              <SplitButtonMenuItem
                description="Save changes and create a new production deployment"
                title={
                  <span className="flex items-center gap-2">
                    <CircleArrowUp className="size-4" aria-hidden /> Save + Redeploy
                  </span>
                }
              />
            </>
          }
          menuProps={{ width: 264 }}
        >
          Save
        </SplitButton>
      ))}
    </div>
  ))}
</div>`,
  },
};
