import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton — 加载占位骨架。
 * 简单 div，animate-pulse + bg-gray-alpha-200 rounded-md。
 * 通过 className 控制尺寸/形状（如 w-16 h-16 rounded-full 做圆形头像骨架）。
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-gray-alpha-200", className)}
      {...props}
    />
  );
}

export { Skeleton };
