import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Spinner — 加载指示器（docs/geist-markdown-refs/components/spinner.md 官方语义）。
 * 导出：Spinner。
 * 用 lucide-react Loader2 图标 + animate-spin。
 * size（官方实测 2026-08）：sm=12 / md=16 / lg=20 / xl=24 / 2xl=32 / 3xl=40 / 4xl=56。
 * ARIA（官方实测）：role="status" + sr-only "Loading..."，可被读屏宣布；
 * 在按钮等已有加载文案的容器内使用时传 aria-hidden 以取消 status 语义。
 * 颜色通过 className（如 text-red-700）透传到图标。
 */

const spinnerSize = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
  "2xl": "size-8",
  "3xl": "size-10",
  "4xl": "size-14",
} as const;

function Spinner({
  className,
  size = "md",
  "aria-hidden": ariaHidden,
  ...props
}: React.ComponentProps<typeof Loader2> & {
  size?: keyof typeof spinnerSize;
}) {
  const hidden = ariaHidden === true || ariaHidden === "true";

  return (
    <span
      data-slot="spinner"
      role={hidden ? undefined : "status"}
      className={cn("inline-flex", className)}
    >
      <Loader2 aria-hidden className={cn("animate-spin", spinnerSize[size])} {...props} />
      {!hidden && <span className="sr-only">Loading...</span>}
    </span>
  );
}

export { Spinner };
