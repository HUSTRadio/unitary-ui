/**
 * Batch 1 (menu) — 组件 demo 区块的独立源码（Show code 折叠展开显示）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH1[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 * 官方 prop 本地未实现的区块，源码诚实展示本地 API，不伪造官方 prop。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 图标用 lucide-react（`import { MoreHorizontal } from "lucide-react"`），不用 @vercel/geistcn-assets。
 * - blockId 用官方快照「## 区块标题」原文（Default / With chevron / Disabled items /
 *   Locked items / Link items / Custom trigger / Prefix and suffix / Menu position / With section）。
 * - 本批区块均无 useState，故省略官方 export function Component() 包装，仅保留 import + JSX。
 * - 映射说明：官方 MenuButton `type="unstyled"` → 本地 `variant="unstyled"`；
 *   官方 `variant="secondary"` / `showChevron` / `svgOnly` / `shape` / `size` 本地均支持。
 */

export const DEMO_CODE_SPLIT_BATCH1: Record<string, Record<string, string>> = {
  menu: {
    Default: `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

<MenuContainer>
  <MenuButton>Actions</MenuButton>
  <Menu width={200}>
    <MenuItem onClick={() => undefined}>One</MenuItem>
    <MenuItem onClick={() => undefined}>Two</MenuItem>
    <MenuItem onClick={() => undefined}>Three</MenuItem>
    <MenuItem href="https://vercel.com">Test for Link</MenuItem>
    <MenuItem onClick={() => undefined} type="error">
      Delete
    </MenuItem>
  </Menu>
</MenuContainer>`,
    "With chevron": `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

<MenuContainer>
  <MenuButton showChevron variant="secondary">
    Actions
  </MenuButton>
  <Menu width={200}>
    <MenuItem onClick={() => undefined}>One</MenuItem>
    <MenuItem onClick={() => undefined}>Two</MenuItem>
    <MenuItem onClick={() => undefined}>Three</MenuItem>
    <MenuItem href="https://vercel.com">Test for Link</MenuItem>
    <MenuItem onClick={() => undefined} type="error">
      Delete
    </MenuItem>
  </Menu>
</MenuContainer>`,
    "Disabled items": `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

<MenuContainer>
  <MenuButton>Actions</MenuButton>
  <Menu width={200}>
    <MenuItem onClick={() => undefined}>One</MenuItem>
    <MenuItem onClick={() => undefined}>Two</MenuItem>
    <MenuItem disabled onClick={() => undefined}>
      Three
    </MenuItem>
    <MenuItem onClick={() => undefined} type="error">
      Delete
    </MenuItem>
  </Menu>
</MenuContainer>`,
    "Locked items": `import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuItem,
  MenuItemLocked,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";

<MenuContainer>
  <MenuButton>Actions</MenuButton>
  <Menu width={200}>
    <MenuItem onClick={() => undefined}>View Details</MenuItem>
    <MenuItem onClick={() => undefined}>Edit</MenuItem>
    <Tooltip className="w-full flex" text="You do not have the permissions to delete.">
      <MenuItemLocked onClick={() => undefined}>Delete</MenuItemLocked>
    </Tooltip>
  </Menu>
</MenuContainer>`,
    "Link items": `import { Menu, MenuButton, MenuContainer, MenuLink } from "@/components/ui/menu";

<MenuContainer>
  <MenuButton>Links</MenuButton>
  <Menu width={200}>
    <MenuLink href="/design/menu#custom-trigger">One</MenuLink>
    <MenuLink href="#">Two</MenuLink>
    <MenuLink href="#">Three</MenuLink>
  </Menu>
</MenuContainer>`,
    "Custom trigger": `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";

<MenuContainer>
  <MenuButton variant="unstyled">
    <Avatar size={30} username="evilrabbit" />
  </MenuButton>
  <Menu width={200}>
    <MenuItem>One</MenuItem>
    <MenuItem>Two</MenuItem>
    <MenuItem>Three</MenuItem>
  </Menu>
</MenuContainer>`,
    "Prefix and suffix": `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { Accessibility, MoreHorizontal } from "lucide-react";

<div className="flex flex-row items-stretch justify-start gap-6 flex-initial">
  <MenuContainer>
    <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
      <MoreHorizontal />
    </MenuButton>
    <Menu>
      <MenuItem prefix={<Accessibility />}>Left</MenuItem>
      <MenuItem prefix={<Accessibility />}>Center</MenuItem>
      <MenuItem prefix={<Accessibility />}>Right</MenuItem>
    </Menu>
  </MenuContainer>
  <MenuContainer>
    <MenuButton aria-label="Menu" shape="square" size="small" svgOnly variant="secondary">
      <MoreHorizontal />
    </MenuButton>
    <Menu>
      <MenuItem suffix={<Accessibility />}>Left</MenuItem>
      <MenuItem suffix={<Accessibility />}>Center</MenuItem>
      <MenuItem suffix={<Accessibility />}>Right</MenuItem>
    </Menu>
  </MenuContainer>
</div>`,
    "Menu position": `import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

<MenuContainer position="left-start">
  <MenuButton>Left Start</MenuButton>
  <Menu width={200}>
    <MenuItem>One</MenuItem>
    <MenuItem>Two</MenuItem>
  </Menu>
</MenuContainer>`,
    "With section": `import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuDivider,
  MenuItem,
  MenuItemLocked,
  MenuSection,
} from "@/components/ui/menu";

<MenuContainer>
  <MenuButton>Actions</MenuButton>
  <Menu width={200}>
    <MenuSection title="Section">
      <MenuItem onClick={() => undefined}>One</MenuItem>
      <MenuItem onClick={() => undefined}>Two</MenuItem>
    </MenuSection>
    <MenuItem onClick={() => undefined}>Three</MenuItem>
    <MenuItemLocked onClick={() => undefined}>Locked</MenuItemLocked>
    <MenuDivider />
    <MenuItem onClick={() => undefined} type="error">
      Delete
    </MenuItem>
  </Menu>
</MenuContainer>`,
  },
};
