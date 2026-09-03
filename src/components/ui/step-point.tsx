import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StepPoint — 审批流程步骤点（Penpot `Core / StepPoint` 4 态规格）。
 * 未发生：灰点 + 灰字；进行中：蓝点 + 高亮字；成功：绿点 + 勾；失败：红点 + 叉。
 * 尺寸：16px 圆点，14px 文本，44px 行距（设计稿 step 行 44px 步进）。
 */

export type StepStatus = "idle" | "active" | "done" | "failed";

export interface StepPointProps {
  status: StepStatus;
  children: React.ReactNode;
}

/** @deprecated 仅用于兼容 `StepDot`；新代码应使用 `StepPointProps`。 */
export interface StepDotProps {
  status: StepStatus;
}

const DOT_STYLES: Record<StepStatus, string> = {
  idle: "border-border-strong bg-background",
  active: "border-progress bg-progress text-white",
  done: "border-success bg-success text-white",
  failed: "border-danger bg-danger text-white",
};

const TEXT_STYLES: Record<StepStatus, string> = {
  idle: "text-muted-foreground",
  active: "text-foreground font-medium",
  done: "text-foreground",
  failed: "text-danger",
};

/** @deprecated `StepDot` 是兼容性导出；新代码应使用完整的 `StepPoint`。 */
function StepDot({ status }: StepDotProps) {
  return (
    <span
      data-slot="step-dot"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
        DOT_STYLES[status],
      )}
      aria-hidden
    >
      {status === "done" && <Check className="size-2.5" strokeWidth={3} />}
      {status === "failed" && <X className="size-2.5" strokeWidth={3} />}
      {status === "active" && (
        <span className="block size-1.5 aspect-square shrink-0 rounded-full bg-white" />
      )}
    </span>
  );
}

function StepPoint({ status, children }: StepPointProps) {
  return (
    <li data-slot="step-point" className="flex items-center gap-3 py-[11px]">
      <StepDot status={status} />
      <span className={cn("text-copy-14", TEXT_STYLES[status])}>{children}</span>
    </li>
  );
}

export { StepPoint, StepDot };
