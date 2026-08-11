import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";

interface DescriptionProps extends Omit<React.ComponentProps<"dl">, "content"> {
  title: string;
  content: React.ReactNode;
  tooltip?: string;
  right?: boolean;
  ellipsis?: boolean;
}

function Description({
  title,
  content,
  tooltip,
  right,
  ellipsis,
  className,
  ...props
}: DescriptionProps) {
  return (
    <dl
      data-slot="description"
      className={cn(
        "m-0",
        right && "text-right",
        ellipsis && "w-full [&>dt]:overflow-hidden [&>dt]:truncate [&>dd]:truncate",
        className,
      )}
      {...props}
    >
      <dt
        data-slot="description-title"
        className="mb-2 min-h-[14px] text-description-title capitalize whitespace-nowrap text-muted-foreground"
      >
        {title}
        {tooltip && (
          <Tooltip text={tooltip}>
            <span
              data-slot="description-tooltip"
              tabIndex={0}
              aria-label={tooltip}
              className="ml-1 inline-flex items-center align-[-2px] text-muted-foreground"
            >
              <Info className="size-3.5" aria-hidden />
            </span>
          </Tooltip>
        )}
      </dt>
      <dd data-slot="description-content" className="m-0 text-description-content text-foreground">
        {content}
      </dd>
    </dl>
  );
}

export { Description };
