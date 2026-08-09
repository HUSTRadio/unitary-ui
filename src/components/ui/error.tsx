import * as React from "react";
import { AlertCircle, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorSize = "small" | "default" | "large";

interface ErrorProps extends React.ComponentProps<"div"> {
  /** 加粗标签前缀；传 false 显式关闭。 */
  label?: string | false;
  size?: ErrorSize;
  error?: {
    message: string;
    action?: string;
    link?: string;
  };
}

const SIZE_CLASSES: Record<ErrorSize, string> = {
  small: "text-copy-13 leading-5",
  default: "text-copy-14 leading-5",
  large: "text-copy-16 leading-6",
};

const ICON_OFFSET: Record<ErrorSize, string> = {
  small: "mt-0.5",
  default: "mt-0.5",
  large: "mt-1",
};

function Error({ className, label, size = "default", error, children, ...props }: ErrorProps) {
  return (
    <div
      data-slot="error"
      role="alert"
      className={cn("flex items-start text-destructive", SIZE_CLASSES[size], className)}
      {...props}
    >
      <span aria-hidden className={cn("mr-2 flex items-center", ICON_OFFSET[size])}>
        <AlertCircle className="size-4 shrink-0" />
      </span>
      <div className="min-w-0 break-words">
        {label ? <b className="mr-2 font-medium">{label}:</b> : null}
        {error ? (
          <>
            {error.message}
            {error.action && error.link ? (
              <>
                {" "}
                <span className="inline-block">
                  <a
                    href={error.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium underline underline-offset-2 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {error.action}
                    <ArrowUpRight className="size-4 shrink-0" aria-hidden />
                  </a>
                </span>
              </>
            ) : null}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export { Error, type ErrorProps, type ErrorSize };
