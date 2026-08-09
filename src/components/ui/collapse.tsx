import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Collapse — 折叠面板（Radix Collapsible）。
 * Collapse（根）/ CollapseTrigger（触发器，带 aria-expanded）/ CollapseContent（内容）。
 */
function Collapse({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapse"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function CollapseTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapse-trigger"
      className={cn(
        "flex w-full items-center justify-between gap-3 text-left",
        className,
      )}
      {...props}
    />
  );
}

function CollapseContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapse-content"
      className={cn(
        "overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

export { Collapse, CollapseTrigger, CollapseContent };
