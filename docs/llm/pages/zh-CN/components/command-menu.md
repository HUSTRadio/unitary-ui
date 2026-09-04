# 命令菜单

> Route: `/components/command-menu`

在模态命令面板中筛选并启动键盘优先的操作。

[返回组件](#/components)

# 命令菜单

Command Menu

在模态命令面板中筛选并启动键盘优先的操作。

## 何时使用

- 需要在应用中提供一个全局键盘快捷键（如 ⌘K / Ctrl+K）触发的命令面板来搜索资源、跳转页面或执行操作。
- 菜单项数量可能超过大约 30 条，需要按类型或最近使用分组为多个页面，以避免单平铺列表过长。

## 何时不应使用

- 如果菜单仅作用于单个可见触发元素上的上下文操作，应改用 Menu 组件；如果是行上右键操作，应改用 ContextMenu。
- 如果需要为页面内某个过滤输入复用相同的快捷键绑定，不要将 ⌘K/Ctrl+K 同时绑给普通输入框——它是全局快捷键。

## 示例

### 基本命令面板

渲染一个可搜索的命令面板；父级通过 open/setOpen 控制显示，并可按应用需要另行绑定全局快捷键。

### 带分隔符的命令面板

在命令面板中使用分隔线区分不同功能组，提升视觉层次和浏览效率。

### 带后缀标签的命令面板

为命令项添加后缀标签显示辅助信息，例如快捷键提示或状态指示。

## 无障碍

- 在面板打开时将所有焦点 trap 锁定在覆盖层内部，按下 Escape 关闭面板并释放焦点回到触发器。
- 每个命令项都应提供清晰的 Title Case 动词短语描述（例如 'Deploy Project'），避免使用歧义词汇。
- 当输入为空时展示最近或默认项目集合，确保无输入状态下菜单仍然可用。

## 受控行为

- CommandMenu 要求父级传入 open 和 setOpen 控制可见性；全局 ⌘K / Ctrl+K 监听也由应用层按需实现。
- 命令项激活后执行调用方提供的动作；组件不把当前命令作为受控 value 暴露。

## 响应式行为

不适用: CommandMenu 为模态覆盖层，在不同屏幕尺寸下保持相似的表现形式，没有显著的响应式布局变化。

## 主题行为

不适用: CommandMenu 遵循系统主题模式（深色/浅色），不针对特定主题状态做自定义布局调整。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { useState } from "react";

export function CommandMenuDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem callback={() => {}}>Figma Import</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Commands">
            <CommandMenuItem callback={() => {}}>Import Extension</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Manage Extensions</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Collaboration">
            <CommandMenuItem callback={() => {}}>Flags Explorer</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## with-divider

```tsx
import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { useState } from "react";

export function CommandMenuWithDivider5A6D5780Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuItem callback={() => {}}>Item 1</CommandMenuItem>
          <CommandMenuItem callback={() => {}}>Item 2</CommandMenuItem>
          <CommandMenuDivider />
          <CommandMenuItem callback={() => {}}>Item 3</CommandMenuItem>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}}>Grouped Item 1</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Grouped Item 2</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## with-suffix

```tsx
import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export function CommandMenuWithSuffixED17650BExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}} suffix={<span>USA</span>}>
              United States of America
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>ESP</span>}>
              Spain
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>FRA</span>}>
              France
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Group 2">
            <CommandMenuItem callback={() => {}} suffix={<span>AUT</span>}>
              Austria
            </CommandMenuItem>
            <CommandMenuItem
              callback={() => {}}
              suffix={<CircleCheck className="size-4 text-gray-700" />}
            >
              Switzerland
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>GER</span>}>
              Germany
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuDivider,
} from "@/components/ui/command-menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控对话框状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">setOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">请求打开或关闭时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">callback</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">执行命令操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 全局、键盘优先、跨应用查找资源并执行动作的命令面板用 CommandMenu。从可见触发器打开、作用于单个资源的菜单用 Menu；行上右键用 ContextMenu。
- 当单个扁平列表超过约 30 项或横跨多种资源类型时，按页分组（Projects、Team Settings）。
- macOS 绑定 ⌘K，其他平台绑定 Ctrl+K。不要把这个绑定复用给页内过滤输入；它是全局快捷键。
- 浮层打开时把焦点困在其中，Escape 关闭，关闭时释放焦点。
- 输入为空时显示最近或默认项目集，让菜单在输入前就有用。
- 项子内容是首字母大写的动词短语（Deploy Project、Invite Team Member）。命令是执行而非浏览；避免 Go to project page 这类导航措辞。
- 组标题首字母大写、1–2 个词（Actions、Recent）。
