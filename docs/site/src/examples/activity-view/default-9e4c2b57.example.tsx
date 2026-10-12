import * as React from "react";
import { Copy } from "lucide-react";

import { ActivityView } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent } from "@hustradio/unitary-ui";

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
          { id: "copy", icon: <Copy className="size-5" />, title: "Copy", onSelect: () => setLog("Copied link") },
          { id: "messages", icon: swatch("#28c840"), title: "Messages", onSelect: () => setLog("Shared via Messages") },
          { id: "mail", icon: swatch("#0070f3"), title: "Mail", onSelect: () => setLog("Shared via Mail") },
          { id: "notes", icon: swatch("#f5a623"), title: "Notes", onSelect: () => setLog("Shared to Notes") },
          { id: "airdrop", icon: swatch("#54b7ec"), title: "AirDrop", onSelect: () => setLog("Shared via AirDrop") },
          { id: "reminders", icon: swatch("#e02d3c"), title: "Reminders", onSelect: () => setLog("Shared to Reminders") },
          { id: "calendar", icon: swatch("#6266d0"), title: "Calendar", onSelect: () => setLog("Shared to Calendar") },
          { id: "more", icon: swatch("#8f8f8f"), title: "More", onSelect: () => setLog("Opened more targets") },
        ]}
        actions={[
          { id: "print", title: "Print", onSelect: () => setLog("Print") },
          { id: "save", title: "Save to Files", onSelect: () => setLog("Save to Files") },
          { id: "bookmark", title: "Add Bookmark", onSelect: () => setLog("Add Bookmark") },
          { id: "reading", title: "Add to Reading List", onSelect: () => setLog("Add to Reading List") },
          { id: "download", title: "Download", onSelect: () => setLog("Download") },
          { id: "pin", title: "Pin Item", onSelect: () => setLog("Pin Item") },
          { id: "report", title: "Report Issue", onSelect: () => setLog("Report Issue") },
          // 破坏性操作只打开确认浮层（面板随之关闭——活动是一次性动作）
          { id: "block", title: "Block User", destructive: true, onSelect: () => setConfirming(true) },
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
            <Button size="small" typeName="button" type="secondary" onClick={() => setConfirming(false)}>
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
