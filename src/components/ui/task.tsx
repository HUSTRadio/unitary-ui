"use client";

import * as React from "react";

import { useI18n } from "@/lib/i18n";
import type { TaskStatus } from "@/lib/task";
import { cn } from "@/lib/utils";

import { Button } from "./button";

/**
 * Task — 长任务进度展示（M2-04）。
 *
 * 纯受控：状态、进度、阶段全部由调用方传入，组件不持有状态、不设定时器、不发请求。
 * 取消与重试只调用回调，语义由调用方决定（通常配合 `taskReducer`）。
 * 与 StatusDot 的构建语义（QUEUED/BUILDING/…）无关，两套状态互不映射。
 */
export interface TaskProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** 当前状态（由 `taskReducer` 推导）。 */
  status: TaskStatus;
  /** 0–1；`running` / `partial` 下传入时渲染进度条。 */
  progress?: number;
  /** 当前阶段文案，例如 "Uploading 3 of 12"。 */
  stage?: React.ReactNode;
  /** 任务名称。 */
  title?: React.ReactNode;
  /** 补充说明或失败原因。 */
  description?: React.ReactNode;
  /** 取消：仅 `running` 时渲染。 */
  onCancel?: () => void;
  /** 重试：仅 `failed` / `partial` 时渲染。 */
  onRetry?: () => void;
  cancelLabel?: React.ReactNode;
  retryLabel?: React.ReactNode;
  children?: React.ReactNode;
}

const SHOW_PROGRESS: readonly TaskStatus[] = ["running", "partial"];
const SHOW_RETRY: readonly TaskStatus[] = ["failed", "partial"];

function clampPercent(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(100, Math.max(0, Math.round(progress * 100)));
}

function Task({
  className,
  status,
  progress,
  stage,
  title,
  description,
  onCancel,
  onRetry,
  cancelLabel,
  retryLabel,
  children,
  ...props
}: TaskProps) {
  const { t } = useI18n();
  const percent = progress === undefined ? undefined : clampPercent(progress);
  const showProgress = percent !== undefined && SHOW_PROGRESS.includes(status);
  const showCancel = Boolean(onCancel) && status === "running";
  const showRetry = Boolean(onRetry) && SHOW_RETRY.includes(status);

  return (
    <div
      data-slot="task"
      data-status={status}
      data-progress={showProgress ? percent : undefined}
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      {...props}
    >
      {title ? (
        <div data-slot="task-title" className="text-copy-14 leading-5 text-gray-1000">
          {title}
        </div>
      ) : null}
      {description ? (
        <div data-slot="task-description" className="text-copy-13 leading-5 text-gray-700">
          {description}
        </div>
      ) : null}
      {showProgress ? (
        <div
          data-slot="task-progress"
          className="h-1.5 w-full overflow-hidden rounded-full bg-gray-alpha-300"
        >
          <div
            data-slot="task-progress-bar"
            className="h-full rounded-full bg-primary transition-[width] duration-(--uni-motion-state) ease-snap motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
      {stage ? (
        <div data-slot="task-stage" className="text-copy-13 leading-5 text-gray-700">
          {stage}
        </div>
      ) : null}
      {children}
      {showCancel || showRetry ? (
        <div data-slot="task-actions" className="flex flex-wrap items-center gap-2">
          {showCancel ? (
            <Button type="secondary" size="small" onClick={onCancel}>
              {cancelLabel ?? t("Cancel task")}
            </Button>
          ) : null}
          {showRetry ? (
            <Button type="default" size="small" onClick={onRetry}>
              {retryLabel ?? t("Retry task")}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { Task };
