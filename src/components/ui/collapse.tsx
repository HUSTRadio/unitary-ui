import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Collapse — 折叠面板（Radix Collapsible）。
 * Collapse（根，size=default/small 控制标题 padding py-6/py-3）/ CollapseTrigger（h3 内，含 chevron）
 * / CollapseContent（内容）。
 * bestPractices 要求「closed 时内容保留在 DOM（hidden）」，因此 CollapseContent 默认
 * forceMount：关闭时内容仍在 DOM（invisible + h-0 + opacity-0），
 * 同时从可访问性树与布局中移除。
 */
function Collapse({
  size = "default",
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & { size?: "default" | "small" }) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapse"
      data-size={size}
      className={cn("group w-full text-left", className)}
      {...props}
    />
  );
}

function CollapseTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapse-trigger"
      className={cn("flex w-full items-center justify-between text-left", className)}
      {...props}
    >
      <span className="flex items-center py-6 group-data-[size=small]:py-3">{children}</span>
      <ChevronDown
        aria-hidden
        className="size-4 shrink-0 transition-transform data-[state=open]:rotate-180"
      />
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapseContent({
  className,
  forceMount = true,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapse-content"
      forceMount={forceMount}
      className={cn(
        "overflow-hidden",
        "data-[state=closed]:h-0",
        "data-[state=open]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export { Collapse, CollapseTrigger, CollapseContent };
