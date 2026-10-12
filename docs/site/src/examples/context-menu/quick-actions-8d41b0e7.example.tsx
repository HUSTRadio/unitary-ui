import * as React from "react";
import { Copy } from "lucide-react";

import { Button } from "@hustradio/unitary-ui";
import {
  ContextMenu,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@hustradio/unitary-ui";
import { Modal, ModalContent } from "@hustradio/unitary-ui";

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
            <Button size="small" typeName="button" type="secondary" onClick={() => setConfirming(false)}>
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
