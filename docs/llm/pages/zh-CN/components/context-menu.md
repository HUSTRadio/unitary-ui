# 右键菜单

> Route: `/components/context-menu`

通过右键点击或长按显示上下文操作菜单。

[返回组件](#/components)

# 右键菜单

Context Menu

通过右键点击或长按显示上下文操作菜单。

## 何时使用

- 需要对行、文件或画布对象提供右键单击或长按触发的上下文快捷操作菜单。
- 需要为同一操作同时提供右键菜单入口和可见的菜单触发器（按钮/图标），确保鼠标用户和键盘用户都有等效访问路径。

## 何时不应使用

- ContextMenu 绝不能是唯一的操作入口；必须将其镜像到可见的 Menu 触发器或行按钮中，否则键盘用户将无法访问。
- 不要在页面上整个范围抑制原生浏览器菜单，只应在触发元素区域内抑制右键菜单。

## 示例

### 基本右键菜单

在触发区域右键单击时显示标准的上下文操作菜单，包含基本的标题用例选项。

### 禁用菜单项

演示在上下文菜单中禁用某些选项的使用场景，灰色显示不可操作的命令。

### 链接菜单项

菜单中包含链接类型的选项，点击后跳转到目标页面而非执行本地动作。

### 前后缀菜单项

为菜单项添加前缀和后缀，显示图标、状态指示或辅助信息以增强可操作性。

### 快速操作

触屏长按（或桌面右键）卡片弹出定宽竖排的快速操作列表：大图标 + 副标题，背景模糊遮罩，底部破坏性系统项用分隔线隔开，点击后先弹确认浮层（可取消）。

## 无障碍

- 为每个菜单项设置语义化的 aria-label，确保屏幕阅读器能够正确朗读操作内容。
- 桌面端绑定右键点击，移动端绑定长按触发；Windows/Linux 下 Shift+F10 同样可以打开同一菜单。
- 在每个菜单项上使用 Title Case 动词 + 名词格式（例如 'Open in New Tab'、'Copy URL'、'Delete Deployment'）。
- 破坏性系统项用红色语义标记，并在执行前请用户确认：确认浮层出现在菜单之外的独立位置、可取消（示例的 Remove App 流程）——HIG 要求红字与确认成对。

## 受控行为

不适用: ContextMenu 管理自身打开/关闭状态，不暴露外部值控制 API；激活任意项即关闭菜单。

## 响应式行为

不适用: ContextMenu 为弹出覆盖层，在各类视口下保持统一的弹出行为，无显著的响应式差异。

## 主题行为

不适用: ContextMenu 跟随系统主题切换，不进行自定义的主题相关样式调整。

## 实时示例

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDefault37A8EEC1Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem>Item Two</ContextMenuItem>
        <ContextMenuItem>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## 禁用项

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDisabledItems62FB7C5EExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem disabled>Item Two</ContextMenuItem>
        <ContextMenuItem disabled>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## 链接菜单项

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuLinkItems2FF9F194Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          tabIndex={0}
          aria-label="Context menu target"
          className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem href="/">Item one</ContextMenuItem>
        <ContextMenuItem href="/">Item Two</ContextMenuItem>
        <ContextMenuItem href="/">Item Three</ContextMenuItem>
        <ContextMenuItem href="/">Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## 前缀与后缀

Right click here

Right click here

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Triangle } from "lucide-react";

export function ContextMenuPrefixAndSuffix99076368Example() {
  const icon = <Triangle className="size-4" aria-hidden />;

  return (
    <div className="flex flex-col items-stretch justify-start gap-6 md:flex-row">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            tabIndex={0}
            aria-label="Context menu target"
            className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" prefix={icon}>
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            tabIndex={0}
            aria-label="Context menu target"
            className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground"
          >
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" suffix={icon}>
            Item one
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Two
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Three
          </ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>
            Item Four
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
```

## 快速操作

Long-press the card to reveal quick actions.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Modal, ModalContent } from "@/components/ui/modal";

/**
 * Quick Actions —— context-menu 的触屏长按变体：定宽竖排、大图标 + 副标题、背景模糊遮罩。
 * 触屏长按（或桌面右键）卡片即可唤起；底部系统项用 Separator 隔开并标记 destructive。
 *
 * 破坏性项按 HIG（pull-down-buttons）走「红字 + 二次确认」成对：菜单只负责红色语义，
 * 确认浮层出现在菜单**之外**的独立位置，用户可确认或取消；取消时状态不变（HIG-AUD-037）。
 */
export function ContextMenuQuickActions8D41B0E7Example() {
  const [log, setLog] = React.useState("Long-press the card to reveal quick actions.");
  const [confirming, setConfirming] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            className="flex size-20 flex-col items-center justify-center gap-1.5 rounded-[18px] bg-gray-100 text-label-13 text-gray-1000 outline-none"
          >
            <span aria-hidden="true" className="size-8 rounded-[10px] bg-gray-alpha-400" />
            Notes
          </button>
        </ContextMenuTrigger>
        <ContextMenuQuickActionsContent>
          <ContextMenuQuickActionsItem
            icon={<Copy className="size-5" />}
            title="New note"
            subtitle="Create a blank note"
            onSelect={() => setLog("New note")}
          />
          <ContextMenuQuickActionsItem
            title="Scan document"
            subtitle="Use the camera"
            onSelect={() => setLog("Scan document")}
          />
          <ContextMenuSeparator />
          <ContextMenuQuickActionsItem
            title="Remove App"
            destructive
            onSelect={() => setConfirming(true)}
          />
        </ContextMenuQuickActionsContent>
      </ContextMenu>
      <p className="text-copy-13 text-gray-900">{log}</p>

      {/* 破坏性操作的二次确认：浮层位于菜单之外的独立位置，需要刻意关闭
          （确认或取消），避免误触直接执行（HIG-AUD-037）。 */}
      <Modal open={confirming} onOpenChange={setConfirming}>
        <ModalContent bodyClassName="pb-0">
          <header className="mb-5">
            <h3 className="text-heading-20 text-foreground">Remove App?</h3>
            <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
              This removes Notes from the home screen. You can add it back from the App Library.
            </div>
          </header>
          <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
            <Button
              size="small"
              typeName="button"
              type="secondary"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              typeName="button"
              type="error"
              onClick={() => {
                setLog("Remove App");
                setConfirming(false);
              }}
            >
              Remove App
            </Button>
          </footer>
        </ModalContent>
      </Modal>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
} from "@/components/ui/context-menu";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控菜单状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收菜单状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">inset</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">缩进 ContextMenuItem。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">作为 data-value 暴露的可选菜单项值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将 ContextMenuItem 渲染为链接。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单项前置内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单项后置内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Quick Actions 列表宽度（像素）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">224</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">backdropBlur</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Quick Actions 列表是否渲染背景模糊遮罩。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Quick Actions 项的行首图标（20px 档）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Quick Actions 项的主标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">subtitle</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Quick Actions 项的次要说明行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">destructive</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将系统项（如“移除 App”）标红。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 对行、文件或画布对象右键或长按触发的专家级快捷操作使用 ContextMenu。
- ContextMenu 绝不能是动作的唯一入口。把每一项镜像到可见的 Menu 触发器或行按钮中，保证纯鼠标与纯键盘用户的能力对等。
- 桌面绑定右键、触屏绑定长按。只在触发器区域抑制浏览器原生菜单，不要整页抑制。
- 激活、Escape 与外部点击时关闭；悬停移出不关闭。
- 项规则与 Menu 相同：首字母大写动词 + 名词（Open in New Tab、Copy URL、Delete Deployment）。裸动词是错的。
- 破坏性项分组到底部并加分隔线，破坏性标签保持 动词 + 名词。
- 键盘菜单键（Windows/Linux 上为 Shift+F10）在无需右键的情况下打开同一菜单。
- Quick Actions 遮罩是库内仅有的两处模糊遮罩之一。模糊用于表达前景层级——主屏、AI 建议或临时前台——且必须来自共享的遮罩模糊 token（--uni-overlay-backdrop-blur），而不是逐组件自选的模糊档位。在别处新增模糊遮罩属于设计决策，不是局部样式选择。
