# 桌面侧板

> Route: `/components/side-panel`

A controlled desktop side panel with optional non-modal behavior.

[返回组件](#/components)

# 桌面侧板

side-panel

A controlled desktop side panel with optional non-modal behavior.

## 何时使用

- 桌面详情或操作需要可关闭的侧边浮层时。

## 何时不应使用

- 触屏底部抽屉使用 Drawer；同一内容需跨端切换形态时使用 ResponsiveDrawer。

## 示例

### 右侧详情

受控打开、关闭并归还触发器焦点。

## 无障碍

- 通过 SidePanelTitle 命名对话框；Escape 或关闭按钮关闭后焦点返回原触发器。

## 受控行为

- show 和 onDismiss 由调用方成对管理；noOverlay 时降为非模态，外点仍调用 onDismiss。

## 响应式行为

- 宽度由 --uni-drawer-width 控制；小屏底部行为不是本组件的职责。

## 主题行为

- 面板与遮罩使用共享材质、背景和层级 token。

## 实时示例

```tsx
import { useState } from "react";
import {
  SidePanel,
  SidePanelClose,
  SidePanelDescription,
  SidePanelTitle,
} from "@/components/ui/side-panel";

export default function SidePanelExample() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        type="button"
        className="rounded-md border border-border px-4 py-2"
        onClick={() => setShow(true)}
      >
        Open details
      </button>
      <SidePanel show={show} onDismiss={() => setShow(false)}>
        <div className="flex items-center justify-between gap-4">
          <SidePanelTitle>Project details</SidePanelTitle>
          <SidePanelClose aria-label="Close details">Close</SidePanelClose>
        </div>
        <SidePanelDescription className="mt-3">
          Review project information without leaving the current page.
        </SidePanelDescription>
      </SidePanel>
    </>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import {
  SidePanel,
  SidePanelTitle,
  SidePanelDescription,
  SidePanelClose,
} from "@/components/ui/side-panel";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">show</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDismiss</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">按 Escape、外点或关闭按钮后调用；由调用方更新 show。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板停靠方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">noOverlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">省略遮罩并切为非模态行为。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板内容，包括标题及显式关闭控件。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 桌面详情或操作使用 SidePanel；移动端底部操作使用 Drawer，同一流程跨端共用时使用 ResponsiveDrawer。
- 将 show 与 onDismiss 配套，并提供 SidePanelTitle，为对话框建立无障碍名称。
- 仅在面板后方页面仍需交互时启用 noOverlay；此选项同时关闭模态焦点约束和滚动锁定。
