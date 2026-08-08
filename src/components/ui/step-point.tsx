import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StepPoint — 审批流程步骤点（Penpot `Core / StepPoint` 4 态规格）。
 * 未发生：灰点 + 灰字；进行中：蓝点 + 高亮字；成功：绿点 + 勾；失败：红点 + 叉。
 * 尺寸：16px 圆点，14px 文本，44px 行距（设计稿 step 行 44px 步进）。
 */

export type StepStatus = "idle" | "active" | "done" | "failed";

const DOT_STYLES: Record<StepStatus, string> = {
  idle: "border-border-strong bg-background",
  active: "bg-progress text-white",
  done: "bg-success text-white",
  failed: "bg-danger text-white",
};

const TEXT_STYLES: Record<StepStatus, string> = {
  idle: "text-muted-foreground",
  active: "text-foreground font-medium",
  done: "text-foreground",
  failed: "text-danger",
};

function StepDot({ status }: { status: StepStatus }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
        DOT_STYLES[status],
      )}
      aria-hidden
    >
      {status === "done" && <Check className="size-2.5" strokeWidth={3} />}
      {status === "failed" && <X className="size-2.5" strokeWidth={3} />}
      {status === "active" && <span className="size-1.5 rounded-full bg-white" />}
    </span>
  );
}

function StepPoint({ status, children }: { status: StepStatus; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-[11px]">
      <StepDot status={status} />
      <span className={cn("text-copy-14", TEXT_STYLES[status])}>{children}</span>
    </li>
  );
}

export { StepPoint, StepDot };
