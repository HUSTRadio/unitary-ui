import * as React from "react";
import { Copy } from "lucide-react";

import {
  ContextMenu,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

/**
 * Quick Actions —— context-menu 的触屏长按变体：定宽竖排、大图标 + 副标题、背景模糊遮罩。
 * 触屏长按（或桌面右键）卡片即可唤起；底部系统项用 Separator 隔开并标记 destructive。
 */
export function ContextMenuQuickActions8D41B0E7Example() {
  const [log, setLog] = React.useState("Long-press the card to reveal quick actions.");

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
            onSelect={() => setLog("Remove App")}
          />
        </ContextMenuQuickActionsContent>
      </ContextMenu>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
