import { useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StepPoint, type StepStatus } from "@/components/ui/step-point";
import { Tabs } from "@/components/ui/tabs";

/** 审批流程示例 — StepPoint + Tabs + Badge 组合。 */
interface RequestItem {
  id: string;
  title: string;
  applicant: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const REQUESTS: RequestItem[] = [
  {
    id: "REQ-2026-0081",
    title: "借出 ThinkPad X1 Carbon",
    applicant: "陈晓",
    date: "08-05",
    status: "pending",
  },
  {
    id: "REQ-2026-0080",
    title: "借用示波器 SDS1104X-E",
    applicant: "王哲",
    date: "08-04",
    status: "approved",
  },
  {
    id: "REQ-2026-0079",
    title: "领用 DP4801e 对讲机",
    applicant: "李婷",
    date: "08-03",
    status: "rejected",
  },
  {
    id: "REQ-2026-0078",
    title: "借用天线分析仪 KC901S+",
    applicant: "赵宁",
    date: "08-02",
    status: "approved",
  },
];

const STATUS_META: Record<
  RequestItem["status"],
  { label: string; variant: "amber" | "green" | "red" }
> = {
  pending: { label: "待审批", variant: "amber" },
  approved: { label: "已通过", variant: "green" },
  rejected: { label: "已驳回", variant: "red" },
};

export function WorkflowExample() {
  const [tab, setTab] = useState("pending");
  const [steps, setSteps] = useState<StepStatus[]>(["done", "active", "idle", "idle"]);

  const shown = REQUESTS.filter((r) => tab === "all" || r.status === tab);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-heading-24 text-foreground">审批工作流</h2>
        <p className="text-copy-14 text-muted-foreground">
          StepPoint 步骤进度 + Tabs 状态切换 + Badge 状态标识
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 步骤进度 */}
        <div className="material-base p-5">
          <h3 className="text-label-16 font-medium text-foreground">流程进度</h3>
          <ul className="mt-2">
            <StepPoint status={steps[0]}>提交申请</StepPoint>
            <StepPoint status={steps[1]}>部门审批</StepPoint>
            <StepPoint status={steps[2]}>管理员确认</StepPoint>
            <StepPoint status={steps[3]}>完成出借</StepPoint>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" onClick={() => setSteps(["done", "done", "done", "done"])}>
              模拟全部通过
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSteps(["done", "active", "idle", "idle"])}
            >
              重置
            </Button>
          </div>
        </div>

        {/* 请求列表 */}
        <div className="space-y-2">
          <Tabs
            tabs={[
              { value: "pending", title: "待审批" },
              { value: "approved", title: "已通过" },
              { value: "rejected", title: "已驳回" },
              { value: "all", title: "全部" },
            ]}
            selected={tab}
            setSelected={setTab}
            ariaLabel="审批状态"
          />
          <div className="material-base divide-y divide-border">
            {shown.map((req) => {
              const meta = STATUS_META[req.status];
              return (
                <div key={req.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-copy-14 font-medium text-foreground">{req.title}</p>
                    <p className="text-copy-13 text-muted-foreground">
                      {req.id} · {req.applicant} · {req.date}
                    </p>
                  </div>
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 状态图标示意 */}
      <div className="flex flex-wrap items-center gap-6 text-label-14 text-muted-foreground">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-success" aria-hidden /> 已通过
        </span>
        <span className="flex items-center gap-2">
          <Clock className="size-4 text-warning" aria-hidden /> 待审批
        </span>
        <span className="flex items-center gap-2">
          <XCircle className="size-4 text-danger" aria-hidden /> 已驳回
        </span>
      </div>
    </div>
  );
}
