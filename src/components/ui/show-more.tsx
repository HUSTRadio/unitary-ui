import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowMoreProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children: React.ReactNode;
  /** 预览内容。缺省时若 children 为字符串且超过 maxLength，自动截断加省略号 */
  preview?: React.ReactNode;
  /** children 为字符串时的自动截断长度 */
  maxLength?: number;
}

/**
 * ShowMore — 展开 / 折叠内容。
 * 默认展示预览（preview 或自动截断），点击 "Show more" 展开完整内容。
 */
function ShowMore({
  children,
  preview,
  maxLength,
  className,
  ...props
}: ShowMoreProps) {
  const [expanded, setExpanded] = React.useState(false);

  const previewNode = React.useMemo(() => {
    if (preview != null) return preview;
    if (
      typeof children === "string" &&
      maxLength &&
      children.length > maxLength
    ) {
      return `${children.slice(0, maxLength)}…`;
    }
    return children;
  }, [children, preview, maxLength]);

  return (
    <div
      data-slot="show-more"
      className={cn("flex flex-col items-start gap-3", className)}
      {...props}
    >
      <div>{expanded ? children : previewNode}</div>
      <Button
        type="button"
        variant="ghost"
        className="text-label-14 text-link"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </div>
  );
}

export { ShowMore };
