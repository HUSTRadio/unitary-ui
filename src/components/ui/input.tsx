import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — Geist 官方 Input 规范（docs/geist-markdown-refs/components/input.md 实测）。
 * - 高度 32px（h-8）、圆角 6px（官方 wrapper 实测）、padding 0 12px、400 14px/20px
 * - 边框 hairline（gray-alpha-400）、背景 background-100
 * - disabled：bg gray-100 + fg gray-700
 */

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-8 w-full rounded-[6px] border border-gray-alpha-400 bg-background px-3 text-copy-14",
          "file:border-0 file:bg-transparent file:text-copy-13 file:font-medium file:text-foreground",
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
Input.displayName = "Input";

export { Input };
