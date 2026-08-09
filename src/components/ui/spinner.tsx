import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerSize = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-6",
} as const;

/**
 * Spinner — 加载指示器。
 * 用 lucide-react Loader2 图标 + animate-spin。
 * size: sm(14px) / md(16px) / lg(24px)。
 */
function Spinner({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof Loader2> & {
  size?: keyof typeof spinnerSize;
}) {
  return (
    <Loader2
      data-slot="spinner"
      aria-hidden
      className={cn("animate-spin", spinnerSize[size], className)}
      {...props}
    />
  );
}

export { Spinner };
