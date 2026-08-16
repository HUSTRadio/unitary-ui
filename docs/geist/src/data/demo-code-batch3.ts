/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— Batch 3。
 *
 * 结构：DEMO_CODE_BATCH3[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { X } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 与 docs-components-page.tsx 里 data-demo-card 的 id 一致。
 * - 本批跳过无本地 data-demo-card 区块的组件（menu / error / feedback / grid / file-tree），
 *   其官方 demo 章节在本地 docs 页没有对应区块，不做映射。
 */

export const DEMO_CODE_BATCH3: Record<string, Record<string, string>> = {
  "dots-menu": {
    default: `import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>`,
    sizes: `import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<div className="flex items-start gap-6">
  <DotsMenu iconSize={10}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
  <DotsMenu iconSize={12}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
  <DotsMenu iconSize={18}>
    <DotsMenuItem>View Build Logs</DotsMenuItem>
    <DotsMenuItem>View Projects</DotsMenuItem>
    <DotsMenuItem>View Analytics</DotsMenuItem>
  </DotsMenu>
</div>`,
    disabled: `import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu disabled>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>`,
    "disabled-menu-item": `import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

<DotsMenu>
  <DotsMenuItem>View Build Logs</DotsMenuItem>
  <DotsMenuItem disabled>View Projects</DotsMenuItem>
  <DotsMenuItem>View Analytics</DotsMenuItem>
</DotsMenu>`,
  },
  drawer: {
    default: `import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Button type="secondary" onClick={() => setOpen(true)}>
  Open
</Button>
<Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
  <div className="flex flex-col items-stretch justify-start gap-2 p-12">
    <p className="text-center text-[18px] font-semibold leading-[24px]">A drawer title</p>
    <p className="text-center text-copy-14">Drawer body</p>
  </div>
</Drawer>`,
    "custom-height": `import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>
  Open
</Button>
<Drawer height={200} show={open} onDismiss={() => setOpen(false)} verticalScroll>
  <div className="flex flex-col items-stretch justify-start gap-2 p-12">
    <p className="text-center text-[18px] font-semibold leading-[24px]">A drawer title</p>
    <p className="text-center text-copy-14">Drawer body</p>
  </div>
</Drawer>`,
  },
  "empty-state": {
    "empty-state-design-framework": `import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

<EmptyState
  description="A message conveying the state of the product."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
/>`,
    "blank-slate": `import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ChartColumn } from "lucide-react";

<EmptyState
  description="A message conveying the state of the product."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
/>`,
    informational: `import { Button } from "@/components/ui/button";
import { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";
import { ArrowRight, ChartColumn } from "lucide-react";

<EmptyState
  description="This should detail the actions you can take on this screen, as well as why it’s valuable."
  icon={<EmptyStateIcon icon={<ChartColumn className="size-8" aria-hidden />} />}
  title="Title"
>
  <Button type="default" typeName="button">
    Primary Action
  </Button>
  <a
    href="/"
    className="inline-flex cursor-pointer items-center gap-0.5 text-label-14 text-muted-foreground no-underline"
  >
    Learn more
    <ArrowRight className="size-4" aria-hidden />
  </a>
</EmptyState>`,
  },
  fieldset: {
    default: `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Account Settings</FieldsetTitle>
    <FieldsetSubtitle>Manage your account preferences and settings</FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>
        Need help?{" "}
        <a href="#" className="cursor-pointer text-link hover:underline">
          View documentation
        </a>
      </span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction>Save Changes</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
    disabled: `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent disabled>
    <FieldsetTitle>Transfer Project</FieldsetTitle>
    <FieldsetSubtitle>Move this project to another team or account</FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter highlight>
    <FieldsetFooterStatus>
      <span>You need additional permissions to transfer projects.</span>
    </FieldsetFooterStatus>
  </FieldsetFooter>
</Fieldset>`,
    "with-long-content": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Privacy Policy</FieldsetTitle>
    <FieldsetSubtitle>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel
      ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu
      consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur.
      Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel
      dictum erat facilisis et.
    </FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Last updated: March 10, 2025</span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction type="secondary">Decline</FieldsetFooterAction>
      <FieldsetFooterAction>Accept</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
    "multiple-fieldsets": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<div className="flex flex-col gap-6">
  <Fieldset>
    <FieldsetContent>
      <FieldsetTitle>Personal Information</FieldsetTitle>
      <FieldsetSubtitle>Update your name and contact details</FieldsetSubtitle>
    </FieldsetContent>
    <FieldsetFooter>
      <FieldsetFooterStatus>
        <span>This information will be publicly visible</span>
      </FieldsetFooterStatus>
      <FieldsetFooterActions>
        <FieldsetFooterAction>Update</FieldsetFooterAction>
      </FieldsetFooterActions>
    </FieldsetFooter>
  </Fieldset>

  <Fieldset>
    <FieldsetContent>
      <FieldsetTitle>Security</FieldsetTitle>
      <FieldsetSubtitle>Manage your password and authentication methods</FieldsetSubtitle>
    </FieldsetContent>
    <FieldsetFooter>
      <FieldsetFooterStatus>
        <span>Last password change: 30 days ago</span>
      </FieldsetFooterStatus>
      <FieldsetFooterActions>
        <FieldsetFooterAction>Change Password</FieldsetFooterAction>
      </FieldsetFooterActions>
    </FieldsetFooter>
  </Fieldset>

  <Fieldset>
    <FieldsetContent disabled>
      <FieldsetTitle>API Access</FieldsetTitle>
      <FieldsetSubtitle>
        Generate and manage API tokens for programmatic access
      </FieldsetSubtitle>
    </FieldsetContent>
    <FieldsetFooter highlight>
      <FieldsetFooterStatus>
        <span>You need a Pro account to access API features.</span>
      </FieldsetFooterStatus>
    </FieldsetFooter>
  </Fieldset>
</div>`,
    "without-footer": `import {
  Fieldset,
  FieldsetContent,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Account Information</FieldsetTitle>
    <FieldsetSubtitle>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
      ultricies, nisl nisl aliquam nisl.
    </FieldsetSubtitle>
  </FieldsetContent>
</Fieldset>`,
    "without-title": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetSubtitle>
      This fieldset contains only a subtitle with no title. It can be used for informational
      sections or supplementary content.
    </FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Information only</span>
    </FieldsetFooterStatus>
  </FieldsetFooter>
</Fieldset>`,
    "with-error-text": `import {
  ErrorText,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>API Configuration</FieldsetTitle>
    <FieldsetSubtitle>Configure your API endpoint and authentication</FieldsetSubtitle>
    <div className="mt-4">
      <ErrorText>
        API key validation failed. Please check your credentials and try again.
      </ErrorText>
    </div>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Last checked: 5 minutes ago</span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction>Verify API Connection</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
    "with-warning-text": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
  WarningText,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent>
    <FieldsetTitle>Database Settings</FieldsetTitle>
    <FieldsetSubtitle>Configure your database connection parameters</FieldsetSubtitle>
    <div className="mt-4">
      <WarningText>
        Changing these settings will require a restart of your application. Make sure to save
        any pending work.
      </WarningText>
    </div>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Current status: Connected</span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction type="secondary">Cancel</FieldsetFooterAction>
      <FieldsetFooterAction>Apply Changes</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
    "with-disabled-wall": `import {
  DisabledWall,
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset>
  <FieldsetContent disabled>
    <FieldsetTitle>Advanced Features</FieldsetTitle>
    <FieldsetSubtitle>Access premium capabilities and tools</FieldsetSubtitle>
    <div className="relative mt-2 rounded-[6px] border border-gray-alpha-400 p-3">
      <p className="text-copy-14">
        This content is behind a disabled wall and not accessible to free users.
      </p>
      <p className="mt-2 text-copy-14">
        It contains advanced configuration options and premium features.
      </p>
      <DisabledWall />
    </div>
  </FieldsetContent>
  <FieldsetFooter highlight>
    <FieldsetFooterStatus>
      <span>Upgrade to a Pro plan to access these features.</span>
    </FieldsetFooterStatus>
  </FieldsetFooter>
</Fieldset>`,
    "error-type": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset type="error">
  <FieldsetContent>
    <FieldsetTitle>Payment Failed</FieldsetTitle>
    <FieldsetSubtitle>
      Your payment method was declined. Please update your billing information to continue using
      the service.
    </FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Payment failed on February 10, 2026</span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction type="secondary">Contact Support</FieldsetFooterAction>
      <FieldsetFooterAction>Update Payment Method</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
    "warning-type": `import {
  Fieldset,
  FieldsetContent,
  FieldsetFooter,
  FieldsetFooterAction,
  FieldsetFooterActions,
  FieldsetFooterStatus,
  FieldsetSubtitle,
  FieldsetTitle,
} from "@/components/ui/fieldset";

<Fieldset type="warning">
  <FieldsetContent>
    <FieldsetTitle>Trial Ending Soon</FieldsetTitle>
    <FieldsetSubtitle>
      Your trial period will end in 3 days. Add a payment method to continue accessing premium
      features without interruption.
    </FieldsetSubtitle>
  </FieldsetContent>
  <FieldsetFooter>
    <FieldsetFooterStatus>
      <span>Trial expires: February 13, 2026</span>
    </FieldsetFooterStatus>
    <FieldsetFooterActions>
      <FieldsetFooterAction type="secondary">Remind Me Later</FieldsetFooterAction>
      <FieldsetFooterAction>Add Payment Method</FieldsetFooterAction>
    </FieldsetFooterActions>
  </FieldsetFooter>
</Fieldset>`,
  },
};
