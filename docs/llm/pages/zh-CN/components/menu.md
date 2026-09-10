# 菜单

> Route: `/components/menu`

在浮动菜单中显示操作列表。

[返回组件](#/components)

# 菜单

Menu

在浮动菜单中显示操作列表。

## 何时使用

- 需要一个可发现的触发器来打开针对单一资源的行动列表，例如行上的省略号菜单或主实体的下拉菜单。
- 用户对某个资源（如项目、部署、用户）需要进行多种相关操作（重命名、复制、删除等），且这些操作共享同一个上下文。
- 需要按类别分组操作项时使用 MenuSection，将相关的动作组织在一起以提高可发现性。

## 何时不应使用

- 对于右击或长按操作请使用 ContextMenu。对于 ⌘K 后面的全局命令请使用 CommandMenu。对于两个相关的核心操作，应使用拆分按钮而非将次要操作藏在深层菜单中。
- 菜单项数量超过大约 10 个时应使用 MenuSection 进行分组或将次要操作移至设置页面，以避免弹出窗口过长难以浏览。

## 示例

### 默认菜单

最简单的菜单用法：一个触发器点开一组操作项，每一项采用 Title Case 动词+名词格式，如 Rename Project、Duplicate Deployment。

### 带箭头的触发器

在 MenuButton 触发器上显示向下箭头，提示该按钮会打开当前菜单；组件不提供嵌套子菜单原语。

### 禁用项

某些菜单项在当前上下文中不可用时变为灰色且不可点击，帮助用户了解哪些操作在当前状态下被限制。

### 锁定项

使用 MenuItemLocked 为权限受限的操作显示锁形图标和禁用状态，明确解释为何该行为无效以及需要何种权限才能解锁。

## 无障碍

- 使用 Up/Down 方向键在菜单项间移动焦点，Home/End 跳转到首尾项，Enter 或 Space 激活选中项。
- Typeahead 功能跳转到下一个以输入字符开头的菜单项；可见标签排在前面，以便 typeahead 匹配用户所见的文本。
- 关闭菜单后将焦点返回到触发器上，确保键盘用户在行中保持当前位置。

## 受控行为

- 通过 open prop 控制菜单的开闭状态，调用方管理触发条件（点击、悬停之外的其他事件）并在合适时机关闭菜单。
- 点击菜单项、按 Escape 或点击外部区域时自动关闭菜单；也可以通过编程方式手动关闭。

## 响应式行为

- 菜单位置会根据窗口的边界自动翻转（如向上弹出或向下弹出），不会在窄视口中因硬编码侧边而裁剪。
- Radix 会做碰撞位移，但组件不自动设置小屏最大宽度；长内容的宽度与换行由调用方约束。

## 主题行为

- 菜单的背景色、边框和分隔线颜色从主题令牌获取，确保浅色模式和深色模式下的正确对比度。
- 悬停态、聚焦态和禁用态的颜色区分遵循设计系统的色彩规范，包括高对比度模式的特殊处理。

## 实时示例

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

export function MenuDefault21B111CBExample() {
  return (
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
    </MenuContainer>
  );
}
```

## 带下拉箭头

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

export function MenuWithChevron2CC766B6Example() {
  return (
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
    </MenuContainer>
  );
}
```

## 禁用项

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

export function MenuDisabledItems1BA9CD5EExample() {
  return (
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
    </MenuContainer>
  );
}
```

## 锁定项

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem, MenuItemLocked } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";

export function MenuLockedItemsE410D1DAExample() {
  return (
    <MenuContainer>
      <MenuButton>Actions</MenuButton>
      <Menu width={200}>
        <MenuItem onClick={() => undefined}>View Details</MenuItem>
        <MenuItem onClick={() => undefined}>Edit</MenuItem>
        <Tooltip className="w-full flex" text="You do not have the permissions to delete.">
          <MenuItemLocked onClick={() => undefined}>Delete</MenuItemLocked>
        </Tooltip>
      </Menu>
    </MenuContainer>
  );
}
```

## 链接菜单项

```tsx
import { Menu, MenuButton, MenuContainer, MenuLink } from "@/components/ui/menu";

export function MenuLinkItems24C68D22Example() {
  return (
    <MenuContainer>
      <MenuButton>Links</MenuButton>
      <Menu width={200}>
        <MenuLink href="/design/menu#custom-trigger">One</MenuLink>
        <MenuLink href="#">Two</MenuLink>
        <MenuLink href="#">Three</MenuLink>
      </Menu>
    </MenuContainer>
  );
}
```

## 自定义触发器

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";

export function MenuCustomTrigger74C52681Example() {
  return (
    <MenuContainer>
      <MenuButton variant="unstyled">
        <Avatar size={30} username="evilrabbit" />
      </MenuButton>
      <Menu width={200}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## 前缀与后缀

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { Accessibility, MoreHorizontal } from "lucide-react";

export function MenuPrefixAndSuffix60E081F0Example() {
  return (
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
    </div>
  );
}
```

## 菜单位置

```tsx
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";

export function MenuMenuPosition55A3EF38Example() {
  return (
    <MenuContainer position="left-start">
      <MenuButton>Left Start</MenuButton>
      <Menu width={200}>
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
      </Menu>
    </MenuContainer>
  );
}
```

## 带分组小节

```tsx
import {
  Menu,
  MenuButton,
  MenuContainer,
  MenuDivider,
  MenuItem,
  MenuItemLocked,
  MenuSection,
} from "@/components/ui/menu";

export function MenuWithSection5563D2A4Example() {
  return (
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
    </MenuContainer>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  MenuContainer,
  MenuButton,
  Menu,
  MenuItem,
  MenuItemLocked,
  MenuLink,
  MenuDivider,
  MenuSection,
} from "@/components/ui/menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控菜单状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收菜单状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSelect</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">执行条目操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在单个资源上打开动作列表的可发现触发器（行上的点菜单、主实体上的下拉）用 Menu。
- 行上右键或长按用 ContextMenu；⌘K 后的全局命令用 CommandMenu；两个相关主动作用 split button，而不是埋掉次动作。
- Menu 约 10 项封顶。超过则用 MenuSection 分组，或把次动作移到设置页。
- 点击打开而非悬停；悬停打开会与屏幕阅读器和触控板滚动冲突。
- 定位根据窗口边界自动翻转；不要硬编码在窄视口会被裁切的方位。
- 项激活、Escape 与外部点击时关闭；不要在悬停移出时自动关闭。
- 权限受限的动作用 MenuItemLocked，用锁图标与禁用态解释行为何不可操作。
- 项子内容是首字母大写动词 + 名词（Rename Project、Duplicate Deployment）。在明确的单对象上下文之外，裸动词（Rename、Edit）是错的。
- 仅当激活会打开后续对话框时以 … 结尾（Rename…、Transfer to Team…）。
- 破坏性项分组到底部并以分隔线隔开，破坏性文案保持 动词 + 名词（Delete Project，绝不用裸 Delete）。
- 分组标题（MenuSection title）首字母大写、1–2 个词（Workspace、Recent Projects）。
- Up/Down 箭头在项间移动焦点，Home/End 跳到首/末，Enter 或 Space 激活。
- Typeahead 跳到标签以输入字符开头的下一项；保持可见标签在前，让 typeahead 与用户所见匹配。
- 关闭时把焦点还给触发器，让键盘用户保持在行的位置。
