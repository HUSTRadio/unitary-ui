import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingIconProps {
  className?: string;
}

/** Fixed-geometry loading glyph. The stable outer box prevents parent layout and popover anchors from moving while the SVG rotates. */
function LoadingIcon({ className }: LoadingIconProps) {
  return (
    <span
      data-slot="loading-icon"
      aria-hidden
      className={cn("inline-flex size-3.5 shrink-0 items-center justify-center", className)}
    >
      <Loader2 className="!size-full animate-spin" />
    </span>
  );
}

export { LoadingIcon };
export type { LoadingIconProps };
