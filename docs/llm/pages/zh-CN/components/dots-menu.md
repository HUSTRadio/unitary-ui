# 省略号菜单

> Route: `/components/dots-menu`

由三点图标触发、显示附加操作的溢出菜单。

[返回组件](#/components)

# 省略号菜单

dots-menu

由三点图标触发、显示附加操作的溢出菜单。

## 何时使用

- 行内、卡片或资源项上空间有限，需要展开更多相关操作时使用。
- 与 Context Menu 互补：Dots Menu 面向可见触发器和键盘/鼠标通用操作，右击快捷操作则由 Context Menu 承担。

## 何时不应使用

- 操作数量超过 10 项时应考虑使用 Split Button + Menu 分组或导航至独立的设置页面。
- 单一直达主操作不应使用 Dots Menu，应将最常用的行动放在最显眼的位置。
- 右键上下文操作应由 Context Menu 提供而非仅靠 Dots Menu。

## 示例

### 默认省略号菜单

展示默认大小的三点图标触发下拉菜单的基本用法。

### 不同尺寸

演示多种尺寸的省略号菜单以适配不同的密集度布局。

### 禁用状态

在不可操作状态下将省略号菜单禁用，视觉反馈操作不可用。

### 禁用的菜单项

部分菜单项因权限或条件限制被禁用，其余仍可使用。

## 无障碍

- 三点图标按钮需要明确的 aria-label 以便屏幕阅读器识别菜单功能。
- 菜单打开时通过 Escape 键关闭并返回焦点到触发器。
- 方向键在菜单项目间移动，Enter 或 Space 激活选中项。

## 受控行为

- 菜单打开状态由父组件控制，通过 open 属性管理显示与隐藏。
- 点击菜单项后自动关闭并执行对应动作，将焦点归还触发器。
- 受控模式下可通过编程方式打开或关闭菜单。

## 响应式行为

- 位置策略 auto-flip 根据窗口边界自适应定位，避免在窄屏下内容裁剪。
- 大间距环境下菜单项目间距增大以提升触摸目标面积。

## 主题行为

- 遵循应用主题系统渲染背景、边框和高亮颜色。
- 禁用状态的色调通过 CSS 变量从主题令牌获取，确保亮/暗模式一致。

## 实时示例

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

export function DotsMenuDefault37A8EEC1Example() {
  return (
    <DotsMenu>
      <DotsMenuItem>View Build Logs</DotsMenuItem>
      <DotsMenuItem>View Projects</DotsMenuItem>
      <DotsMenuItem>View Analytics</DotsMenuItem>
    </DotsMenu>
  );
}
```

## 尺寸

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

export function DotsMenuSizes7C69F3FAExample() {
  return (
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
    </div>
  );
}
```

## 禁用

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

export function DotsMenuDisabled17EB3C01Example() {
  return (
    <DotsMenu disabled>
      <DotsMenuItem>View Build Logs</DotsMenuItem>
      <DotsMenuItem>View Projects</DotsMenuItem>
      <DotsMenuItem>View Analytics</DotsMenuItem>
    </DotsMenu>
  );
}
```

## 禁用菜单项

```tsx
import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

export function DotsMenuDisabledMenuItem717ABAD2Example() {
  return (
    <DotsMenu>
      <DotsMenuItem>View Build Logs</DotsMenuItem>
      <DotsMenuItem disabled>View Projects</DotsMenuItem>
      <DotsMenuItem>View Analytics</DotsMenuItem>
    </DotsMenu>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { DotsMenu, DotsMenuItem, DotsMenuSeparator } from "@/components/ui/dots-menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">position</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MenuPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单相对触发器的位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom-end"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconSize</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发器图标的像素尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">18</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁用菜单触发器。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
