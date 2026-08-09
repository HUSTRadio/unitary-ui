import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Description — Geist 键值对描述列表（definition list）。
 * 渲染 <dl>/<dt>/<dd> 语义，使屏幕阅读器把每对 key/value 读作一个定义项。
 * 网格布局：每行两列，key 列 muted、value 列 foreground。
 */

function Description({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="description"
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-2 text-copy-14",
        className,
      )}
      {...props}
    />
  );
}

function DescriptionItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="description-item"
      className={cn("flex min-w-0 items-baseline gap-2", className)}
      {...props}
    />
  );
}

function DescriptionKey({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="description-key"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function DescriptionValue({ className, ...props }: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="description-value"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}

export { Description, DescriptionItem, DescriptionKey, DescriptionValue };
