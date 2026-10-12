# 菜单栏

> Route: `/components/menu-bar`

横向应用菜单栏，支持子菜单、勾选项和快捷键提示。

[返回组件](#/components)

# 菜单栏

menu-bar

横向应用菜单栏，支持子菜单、勾选项和快捷键提示。

## 何时使用

- 需要应用级命令集合（File / Edit / View），且已自行绑定按键、要展示对应快捷键提示时。
- 需要多级子菜单或可勾选的视图开关时。

## 何时不应使用

- 页面级导航链接与滚动行为——用 Navbar。
- 单命令的溢出操作——用 DotsMenu 或 Menu。

## 示例

### 默认菜单栏

File / Edit / View 三个顶级菜单，含子菜单、勾选态与禁用项；还可打开模态窗口中的菜单。演示不展示快捷键提示，因为组件不绑定按键。

## 无障碍

- Radix Menubar 提供 role=menubar 与完整键盘模型：左右切顶级菜单、上下进菜单项、Esc 逐级关闭。
- 快捷键文本标为 aria-hidden，仅作视觉提示，不干扰读屏播报命令名。
- 禁用项保持可见并带 aria-disabled，命令仍可被发现。

## 受控行为

- 菜单开合由 Radix 自管；勾选项通过 checked 与 onCheckedChange 受控。
- 组件不注册全局快捷键监听，按键绑定由调用方自行接入。

## 响应式行为

- 顶级菜单横向排列，宽度不足时容器横向滚动，边缘渐隐提示尚有隐藏命令。
- 菜单浮层高于模态窗口与抽屉；子菜单在窄视口会向内移动以避免横向越界，最大高度受限后可滚动。

## 主题行为

- 菜单栏与浮层使用 surface 与描边 token，暗色模式下自动切换。
- 浮层入场缩放在 prefers-reduced-motion 下禁用。

## 实时示例

No command yet.

```tsx
import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTitle } from "@hustradio/unitary-ui";

import {
  MenuBar,
  MenuBarCheckboxItem,
  MenuBarContent,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubContent,
  MenuBarSubTrigger,
  MenuBarTrigger,
} from "@hustradio/unitary-ui";

/**
 * MenuBar —— 水平应用菜单栏：顶级菜单横向排列，菜单项支持分隔线、勾选态与子菜单。
 * 键盘导航（左右切顶级菜单、Esc 逐级关闭）由 Radix 提供。
 *
 * HIG-AUD-047：`shortcut` 只负责展示、不绑定按键，因此本示例不渲染任何快捷键提示——
 * 演示里出现 ⌘N / ⌘O / ⌘Z / ⌘C 这类键帽会让用户以为可按（其中多数还是浏览器保留键，
 * 页面无法可靠拦截）。需要在真实产品里展示快捷键时，请由调用方自行绑定按键后传入。
 */
export function MenuBarDefault1D7F3C05Example() {
  const [showHidden, setShowHidden] = React.useState(false);
  const [log, setLog] = React.useState("No command yet.");
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <MenuBar>
        <MenuBarMenu>
          <MenuBarTrigger>File</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem onSelect={() => setLog("New Window")}>New Window</MenuBarItem>
            <MenuBarItem onSelect={() => setLog("Open…")}>Open…</MenuBarItem>
            <MenuBarSeparator />
            <MenuBarSub>
              <MenuBarSubTrigger>Export</MenuBarSubTrigger>
              <MenuBarSubContent>
                <MenuBarItem onSelect={() => setLog("Export PDF")}>PDF</MenuBarItem>
                <MenuBarItem onSelect={() => setLog("Export PNG")}>PNG</MenuBarItem>
              </MenuBarSubContent>
            </MenuBarSub>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>Edit</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarItem onSelect={() => setLog("Undo")}>Undo</MenuBarItem>
            <MenuBarItem onSelect={() => setLog("Redo")}>Redo</MenuBarItem>
            <MenuBarSeparator />
            <MenuBarItem onSelect={() => setLog("Copy")}>Copy</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
        <MenuBarMenu>
          <MenuBarTrigger>View</MenuBarTrigger>
          <MenuBarContent>
            <MenuBarCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
              Show Hidden Files
            </MenuBarCheckboxItem>
            <MenuBarItem disabled>Enter Full Screen</MenuBarItem>
          </MenuBarContent>
        </MenuBarMenu>
      </MenuBar>
      <p className="text-copy-13 text-gray-900">{log}</p>
      <Button typeName="button" size="small" onClick={() => setModalOpen(true)}>
        Open menu in modal
      </Button>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent showCloseButton>
          <ModalTitle>Document commands</ModalTitle>
          <div className="mt-4 flex flex-col gap-3">
            <MenuBar>
              <MenuBarMenu>
                <MenuBarTrigger>File</MenuBarTrigger>
                <MenuBarContent>
                  <MenuBarItem onSelect={() => setLog("Saved in modal")}>Save</MenuBarItem>
                  <MenuBarSub>
                    <MenuBarSubTrigger>Export</MenuBarSubTrigger>
                    <MenuBarSubContent>
                      <MenuBarItem onSelect={() => setLog("Exported PDF in modal")}>
                        PDF
                      </MenuBarItem>
                    </MenuBarSubContent>
                  </MenuBarSub>
                </MenuBarContent>
              </MenuBarMenu>
            </MenuBar>
            <p className="text-copy-13 text-gray-900">{log}</p>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
} from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shortcut</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">右对齐快捷键提示；仅展示，不绑定按键。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">inset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">缩进 MenuBarItem 以与勾选项对齐。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">MenuBarCheckboxItem 的勾选状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCheckedChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(checked: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收勾选项状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">保持命令可见但不可操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 应用级命令用 MenuBar；页面级导航链接用 Navbar。
- 破坏性命令放在菜单项里并用动词短语命名，绝不作为顶级菜单本身。
- 快捷键文本只做展示——按键绑定由调用方自己完成，避免展示与实际行为脱节。
- 命令不可用时保持 disabled 而不是隐藏，让命令在菜单中仍可被发现。
