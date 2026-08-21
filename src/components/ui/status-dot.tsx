import * as React from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type StatusDotState = "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED" | "DELETED";

const STATUS_DOT_STYLES: Record<StatusDotState, string> = {
  QUEUED: "bg-[#eaeaea] dark:bg-[#333] animate-pulse",
  BUILDING: "bg-[#f5a623] animate-pulse",
  READY: "bg-[#50e3c2]",
  ERROR: "bg-[#ee0000] dark:bg-[#ff0000]",
  CANCELED: "bg-[#eaeaea] dark:bg-[#333]",
  DELETED: "bg-[#eaeaea] dark:bg-[#333]",
};

const STATUS_LABELS: Record<StatusDotState, string> = {
  QUEUED: "Queued",
  BUILDING: "Building",
  READY: "Ready",
  ERROR: "Error",
  CANCELED: "Canceled",
  DELETED: "Deleted",
};

const STATUS_MESSAGES: Record<StatusDotState, string> = {
  QUEUED: "is queued.",
  BUILDING: "is building.",
  READY: "is ready.",
  ERROR: "had an error.",
  CANCELED: "was canceled.",
  DELETED: "was deleted.",
};

function StatusDot({
  className,
  state = "QUEUED",
  label,
  titlePrefix = "This deployment",
  ...props
}: React.ComponentProps<"span"> & {
  state?: StatusDotState;
  label?: boolean;
  titlePrefix?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      data-slot="status-dot"
      data-state={state}
      aria-label={t(STATUS_LABELS[state])}
      title={`${titlePrefix} ${t(STATUS_MESSAGES[state])}`}
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn("inline-block size-2.5 shrink-0 rounded-full", STATUS_DOT_STYLES[state])}
      />
      {label && (
        <span className="ml-2 text-label-14 leading-[16px]">{t(STATUS_LABELS[state])}</span>
      )}
    </span>
  );
}

export { StatusDot };
