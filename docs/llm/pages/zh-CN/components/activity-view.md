# 活动视图

> Route: `/components/activity-view`

带分享目标网格与操作列表的底部分享面板。

[返回组件](#/components)

# 活动视图

Activity View

带分享目标网格与操作列表的底部分享面板。

## 何时使用

- 需要从当前内容分享到多个目标（app、服务）时。
- 需要把复制、打印、存储等操作与分享目标放在同一个底部面板时。

## 何时不应使用

- 需要多档位可拖拽的底部弹层——直接用 BottomSheet。
- 需要常驻的工具栏操作——用 Toolbar 而非一次性面板。

## 示例

### 默认活动视图

分享按钮唤起底部面板：目标网格、操作列表与取消行。

## 无障碍

- 面板复用 Radix Dialog：焦点进入面板、Esc 与外部点击关闭、关闭后焦点归还触发元素。
- 每个目标与操作都是带可见名称的原生 button；破坏性操作以红色语义区分，并在执行前请用户确认（确认浮层出现在面板之外、可取消——示例的 Block User 流程）。

## 受控行为

- open 与 onOpenChange 完全受控；选中目标或操作后触发回调并自动关闭。
- 标题可自定义，传 null 则不渲染标题行。

## 响应式行为

- 目标区横向滚动，超出面板宽度时保持单行动线；可滚动的边缘显示渐隐提示，滚动到尽头后消失。
- 面板占视口高度 60%，底部留出安全区内边距。

## 主题行为

- 面板背景、图标块底色与文字色跟随主题 Token。
- 破坏性操作使用错误色 token，暗色模式下保持对比度。

## 实时示例

Nothing shared yet.

```tsx
import * as React from "react";
import { Copy } from "lucide-react";

import { ActivityView } from "@/components/ui/activity-view";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";

/**
 * ActivityView —— 底部分享面板：分享目标网格 + 操作列表 + 取消行。
 * 选择任意项后执行回调并关闭面板（活动是一次性动作）。
 *
 * 破坏性操作按 HIG 走二次确认：操作行只负责红色语义，确认浮层出现在面板
 * 之外的独立位置，用户可确认或取消；取消时状态不变（HIG-AUD-037）。
 */
export function ActivityViewDefault9E4C2B57Example() {
  const [open, setOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [log, setLog] = React.useState("Nothing shared yet.");

  const swatch = (color: string) => (
    <span
      aria-hidden="true"
      className="flex size-5 items-center justify-center rounded-[6px] text-[10px] font-medium text-white"
      style={{ background: color }}
    >
      U
    </span>
  );

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Button type="secondary" onClick={() => setOpen(true)}>
        Share
      </Button>
      <ActivityView
        open={open}
        onOpenChange={setOpen}
        targets={[
          {
            id: "copy",
            icon: <Copy className="size-5" />,
            title: "Copy",
            onSelect: () => setLog("Copied link"),
          },
          {
            id: "messages",
            icon: swatch("#28c840"),
            title: "Messages",
            onSelect: () => setLog("Shared via Messages"),
          },
          {
            id: "mail",
            icon: swatch("#0070f3"),
            title: "Mail",
            onSelect: () => setLog("Shared via Mail"),
          },
          {
            id: "notes",
            icon: swatch("#f5a623"),
            title: "Notes",
            onSelect: () => setLog("Shared to Notes"),
          },
          {
            id: "airdrop",
            icon: swatch("#54b7ec"),
            title: "AirDrop",
            onSelect: () => setLog("Shared via AirDrop"),
          },
          {
            id: "reminders",
            icon: swatch("#e02d3c"),
            title: "Reminders",
            onSelect: () => setLog("Shared to Reminders"),
          },
          {
            id: "calendar",
            icon: swatch("#6266d0"),
            title: "Calendar",
            onSelect: () => setLog("Shared to Calendar"),
          },
          {
            id: "more",
            icon: swatch("#8f8f8f"),
            title: "More",
            onSelect: () => setLog("Opened more targets"),
          },
        ]}
        actions={[
          { id: "print", title: "Print", onSelect: () => setLog("Print") },
          { id: "save", title: "Save to Files", onSelect: () => setLog("Save to Files") },
          // 破坏性操作只打开确认浮层（面板随之关闭——活动是一次性动作）
          {
            id: "block",
            title: "Block User",
            destructive: true,
            onSelect: () => setConfirming(true),
          },
        ]}
      />
      <p className="text-copy-13 text-gray-900">{log}</p>

      {/* 破坏性操作的二次确认：浮层位于面板之外的独立位置，需刻意关闭
          （确认或取消），取消时状态不变（HIG-AUD-037）。 */}
      <Modal open={confirming} onOpenChange={setConfirming}>
        <ModalContent bodyClassName="pb-0">
          <header className="mb-5">
            <h3 className="text-heading-20 text-foreground">Block this user?</h3>
            <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
              They will no longer be able to message you. You can unblock them later.
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
                setLog("Block User");
                setConfirming(false);
              }}
            >
              Block User
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
import { ActivityView } from "@/components/ui/activity-view";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收打开状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">targets</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityTarget[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">以横向滚动网格渲染的分享目标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">actions</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly ActivityAction[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染在目标下方的操作行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板标题；传 null 则不渲染标题行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染底部取消行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">sheetProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Partial&lt;BottomSheetProps&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给底层 BottomSheet；可覆盖默认的档位、手势与指示条配置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 一次性分享或操作流使用 ActivityView；选中目标或操作后面板自行关闭。
- 目标名称保持简短——48px 图标下方只显示一行，超出截断。
- 破坏性操作放在操作列表末尾，标签保持 动词 + 名词。
- ActivityView 是固定 0.6 档位的 BottomSheet 封装，带指示条支持下拉关闭；需要多档位拖拽时直接用 BottomSheet（也可用 sheetProps 覆盖）。
