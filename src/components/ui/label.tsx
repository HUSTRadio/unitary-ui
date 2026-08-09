import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Label — 表单控件可访问标签（对应官方 Label，docs/geist-markdown-refs/components/label.md）。
 * 基于 radix-ui Label。默认渲染 <label>，点击可聚焦/激活关联控件。
 * 样式：text-label-14 text-foreground + cursor-pointer。
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("cursor-pointer text-label-14 text-foreground", className)}
      {...props}
    />
  );
}

export { Label };
