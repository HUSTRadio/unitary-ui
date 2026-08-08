import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — Geist 官方 Textarea 规范（docs/geist-markdown-refs/components/textarea.md 实测）。
 * - 圆角 6px（官方 wrapper 实测，与 Input 一致）、padding 10px 12px、400 14px/20px、默认高 100px
 * - 边框 hairline（gray-alpha-400）、背景 background-100
 * - disabled：bg gray-100 + fg gray-700
 */

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "flex min-h-[100px] w-full rounded-[6px] border border-gray-alpha-400 bg-background px-3 py-2.5 text-copy-14",
          "placeholder:text-muted-foreground",
          "input-focus-ring",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
