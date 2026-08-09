import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LoadingDots — 内联加载三点动画。
 * 3 个圆点依次弹跳（延迟 0 / 0.15s / 0.3s），装饰性，包裹 span 带 aria-live="polite"。
 */
function LoadingDots({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="loading-dots"
      aria-live="polite"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.15}s` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export { LoadingDots };
