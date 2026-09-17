import * as React from "react";
import { Copy } from "lucide-react";

import { ActivityView } from "@/components/ui/activity-view";
import { Button } from "@/components/ui/button";

/**
 * ActivityView —— 底部分享面板：分享目标网格 + 操作列表 + 取消行。
 * 选择任意项后执行回调并关闭面板（活动是一次性动作）。
 */
export function ActivityViewDefault9E4C2B57Example() {
  const [open, setOpen] = React.useState(false);
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
          { id: "more", icon: swatch("#8f8f8f"), title: "More", onSelect: () => setLog("Opened more targets") },
        ]}
        actions={[
          { id: "print", title: "Print", onSelect: () => setLog("Print") },
          { id: "save", title: "Save to Files", onSelect: () => setLog("Save to Files") },
          { id: "block", title: "Block User", destructive: true, onSelect: () => setLog("Block User") },
        ]}
      />
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
